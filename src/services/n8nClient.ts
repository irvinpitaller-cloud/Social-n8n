import { PostPayload, n8nResponse } from '../types';

export const DEFAULT_N8N_SETTINGS = {
  webhookUrl: localStorage.getItem('n8n_webhook_url') || (import.meta as any).env.VITE_N8N_BASE_URL || '',
  apiKey: localStorage.getItem('n8n_api_key') || (import.meta as any).env.VITE_N8N_API_KEY || '',
  activeWorkflow: 'social-multi-publisher-v1',
  autoApproveAI: false,
};

export async function sendPostToN8n(payload: PostPayload): Promise<n8nResponse> {
  try {
    const webhookUrl = localStorage.getItem('n8n_webhook_url') || DEFAULT_N8N_SETTINGS.webhookUrl;
    const apiKey = localStorage.getItem('n8n_api_key') || DEFAULT_N8N_SETTINGS.apiKey;

    const response = await fetch('/api/n8n/trigger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        webhookUrl,
        apiKey,
        payload: {
          ...payload,
          timestamp: new Date().toISOString(),
          source: 'Social n8n Composer v1.0',
        },
      }),
    });

    const data = await response.json();
    return {
      success: data.success,
      postId: data.postId || data.data?.postId,
      simulated: data.simulated,
      error: data.error,
      data: data.data,
    };
  } catch (error: any) {
    console.error('Error sending post to n8n:', error);
    return {
      success: false,
      error: error.message || 'Network error communicating with n8n backend',
    };
  }
}

export async function publishPost(payload: PostPayload): Promise<any> {
  const baseUrl = localStorage.getItem('n8n_webhook_url') || (import.meta as any).env.VITE_N8N_BASE_URL;
  if (!baseUrl) throw new Error('VITE_N8N_BASE_URL no está configurada');

  const response = await fetch('/api/n8n/trigger', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      webhookUrl: baseUrl,
      payload,
    }),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => '');
    throw new Error(`Error n8n: ${response.status} ${err}`);
  }

  return response.json();
}

export async function testN8nConnection(webhookUrl: string, apiKey: string): Promise<n8nResponse> {
  try {
    const response = await fetch('/api/n8n/trigger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        webhookUrl,
        apiKey,
        payload: {
          action: 'ping_connection',
          timestamp: new Date().toISOString(),
        },
      }),
    });

    const data = await response.json();
    return {
      success: data.success,
      simulated: data.simulated,
      error: data.error,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to connect to n8n webhook',
    };
  }
}
