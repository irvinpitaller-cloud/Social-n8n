import React, { useState } from 'react';
import { Workflow, CheckCircle2, AlertCircle, RefreshCw, Send, Key, Link as LinkIcon, Shield } from 'lucide-react';
import { testN8nConnection } from '../services/n8nClient';

export function Workflows() {
  const [webhookUrl, setWebhookUrl] = useState(localStorage.getItem('n8n_webhook_url') || (import.meta as any).env.VITE_N8N_BASE_URL || '');
  const [apiKey, setApiKey] = useState(localStorage.getItem('n8n_api_key') || (import.meta as any).env.VITE_N8N_API_KEY || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('n8n_webhook_url', webhookUrl);
    localStorage.setItem('n8n_api_key', apiKey);
    setTestResult({ success: true, message: 'Configuración guardada en localStorage correctamente.' });
    setTimeout(() => setTestResult(null), 4000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testN8nConnection(webhookUrl, apiKey);
    setTesting(false);
    setTestResult({
      success: res.success,
      message: res.success ? '¡Conexión exitosa con el webhook de n8n!' : (res.error || 'Fallo al conectar con el webhook'),
    });
  };

  const workflowsList = [
    { name: 'Multi-Publisher Core', status: 'Activo', trigger: 'Webhook POST /social-publish', executions: '1,420' },
    { name: 'Instagram Media Sync', status: 'Activo', trigger: 'Schedule (Diario)', executions: '310' },
    { name: 'AI Caption Optimizer', status: 'Activo', trigger: 'Webhook /ai-refine', executions: '890' },
    { name: 'Analytics Data Aggregator', status: 'En espera', trigger: 'Webhook /analytics', executions: '56' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">n8n Workflows & Webhooks</h1>
        <p className="text-sm text-stone-600 mt-1">
          Gestiona las conexiones y endpoints de tus flujos automatizados de n8n.
        </p>
      </div>

      {testResult && (
        <div className={`p-4 rounded-xl flex items-center space-x-3 border shadow-sm ${
          testResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {testResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          <p className="text-sm font-medium">{testResult.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Form */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6">
            <h2 className="text-base font-bold text-stone-900 flex items-center space-x-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              <span>Credenciales y Webhook n8n</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Webhook URL de n8n</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                    <LinkIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://tu-instancia.n8n.cloud/webhook/..."
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-stone-200 rounded-xl bg-stone-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">API Key de n8n (Opcional)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="n8n_api_key_..."
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-stone-200 rounded-xl bg-stone-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={handleTest}
                disabled={testing}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors cursor-pointer"
              >
                {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{testing ? 'Probando...' : 'Probar Conexión'}</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-all shadow-sm shadow-indigo-200 cursor-pointer"
              >
                Guardar Configuración
              </button>
            </div>
          </form>
        </div>

        {/* Workflows Status List */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
            <h2 className="text-base font-bold text-stone-900 flex items-center space-x-2">
              <Workflow className="w-5 h-5 text-violet-600" />
              <span>Flujos Conectados</span>
            </h2>

            <div className="space-y-3">
              {workflowsList.map((wf, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-stone-900">{wf.name}</p>
                    <p className="text-xs text-stone-500">Trigger: {wf.trigger} • Execs: {wf.executions}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    wf.status === 'Activo' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {wf.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
