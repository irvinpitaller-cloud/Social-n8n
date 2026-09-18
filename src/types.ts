export type SocialPlatformId = 'twitter' | 'instagram' | 'facebook';

export interface SocialPlatformConfig {
  id: SocialPlatformId;
  name: string;
  iconName: string;
  maxChars: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface PostPayload {
  content: string;
  platforms: SocialPlatformId[];
  scheduledAt?: string | null;
  mediaUrls?: string[];
  tone?: string;
  hashtags?: string[];
}

export interface n8nResponse {
  success: boolean;
  postId?: string;
  simulated?: boolean;
  error?: string;
  data?: any;
}

export interface ScheduledPost {
  id: string;
  content: string;
  platforms: SocialPlatformId[];
  status: 'published' | 'scheduled' | 'failed' | 'draft';
  scheduledAt: string;
  createdAt: string;
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface n8nSettings {
  webhookUrl: string;
  apiKey: string;
  activeWorkflow: string;
  autoApproveAI: boolean;
}
