import React, { useState } from 'react';
import { 
  Send, Sparkles, Calendar, Image as ImageIcon, Smile, 
  AlertCircle, CheckCircle2, RefreshCw, Hash, Globe, ChevronDown, Trash2
} from 'lucide-react';
import { SocialPlatformId, SocialPlatformConfig, PostPayload } from '../types';
import { sendPostToN8n } from '../services/n8nClient';

const PLATFORMS: SocialPlatformConfig[] = [
  { id: 'twitter', name: 'X / Twitter', iconName: 'Twitter', maxChars: 280, color: 'text-sky-500', bgColor: 'bg-sky-550', borderColor: 'border-sky-200' },
  { id: 'instagram', name: 'Instagram', iconName: 'Instagram', maxChars: 2200, color: 'text-pink-600', bgColor: 'bg-pink-600', borderColor: 'border-pink-200' },
  { id: 'facebook', name: 'Facebook', iconName: 'Facebook', maxChars: 63200, color: 'text-indigo-600', bgColor: 'bg-indigo-600', borderColor: 'border-indigo-200' },
];

export function Composer() {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatformId[]>(['twitter', 'instagram']);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [tone, setTone] = useState('professional');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatformId>('twitter');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Toggle platform selection
  const togglePlatform = (id: SocialPlatformId) => {
    if (selectedPlatforms.includes(id)) {
      if (selectedPlatforms.length === 1) return; // Keep at least one
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== id));
    } else {
      setSelectedPlatforms([...selectedPlatforms, id]);
    }
  };

  // Character calculations & validations
  const charCount = content.length;
  
  const getPlatformStatus = (platformId: SocialPlatformId) => {
    const config = PLATFORMS.find(p => p.id === platformId);
    if (!config) return { remaining: 0, isOver: false, percent: 0 };
    const remaining = config.maxChars - charCount;
    const isOver = remaining < 0;
    const percent = Math.min(100, (charCount / config.maxChars) * 100);
    return { remaining, isOver, percent, maxChars: config.maxChars };
  };

  const hasExceededLimit = selectedPlatforms.some(p => getPlatformStatus(p).isOver);

  // AI Generation via Gemini backend
  const handleAiGenerate = async () => {
    if (!content.trim() && !tone) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: content || 'Escribe una publicación atractiva sobre el lanzamiento de nuestro nuevo producto SaaS impulsado por n8n.',
          tone,
          platforms: selectedPlatforms,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        // Pick the first variant or combine
        const variant = data.data.variants?.[0]?.content || '';
        const hashtags = data.data.hashtags?.join(' ') || '';
        setContent(`${variant}\n\n${hashtags}`);
        setToastMessage({ type: 'success', text: 'Contenido generado con éxito mediante IA (Gemini).' });
      } else {
        setToastMessage({ type: 'error', text: data.error || 'Error al generar contenido con IA' });
      }
    } catch (err: any) {
      setToastMessage({ type: 'error', text: err.message || 'Error de conexión con la IA' });
    } finally {
      setIsAiGenerating(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Submit to n8n webhook
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || selectedPlatforms.length === 0 || hasExceededLimit) return;

    setIsSubmitting(true);
    setToastMessage(null);

    const payload: PostPayload = {
      content,
      platforms: selectedPlatforms,
      scheduledAt: isScheduled ? scheduledDate : null,
      mediaUrls: mediaUrl ? [mediaUrl] : [],
      tone,
    };

    const response = await sendPostToN8n(payload);

    setIsSubmitting(false);
    if (response.success) {
      setToastMessage({ 
        type: 'success', 
        text: response.simulated 
          ? '¡Publicación enviada al flujo n8n (Simulada correctamente)!' 
          : `¡Publicación programada/enviada con éxito! ID: ${response.postId}` 
      });
      // Optional: reset form if published now
      if (!isScheduled) {
        setContent('');
        setMediaUrl('');
      }
    } else {
      setToastMessage({ 
        type: 'error', 
        text: response.error || 'Error al enviar la publicación a n8n.' 
      });
    }

    setTimeout(() => setToastMessage(null), 6000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Composer Multicanal</h1>
          <p className="text-sm text-stone-600 mt-1">
            Redacta y programa publicaciones sincronizadas a través de flujos automatizados de n8n.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleAiGenerate}
            disabled={isAiGenerating}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium text-sm transition-all border border-indigo-200 shadow-xs cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${isAiGenerating ? 'animate-spin' : ''}`} />
            <span>{isAiGenerating ? 'Optimizando con IA...' : 'Asistente IA (Gemini)'}</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 border shadow-sm ${
          toastMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          <p className="text-sm font-medium">{toastMessage.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Composer Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6">
            
            {/* Platform Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
                Redes Sociales Destino ({selectedPlatforms.length} seleccionadas)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PLATFORMS.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id);
                  const status = getPlatformStatus(platform.id);
                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => togglePlatform(platform.id)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20 shadow-xs' 
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className={`text-xs font-bold ${platform.color}`}>{platform.name}</span>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                          isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-stone-300 bg-white'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                      </div>
                      <span className={`text-[11px] ${status.isOver ? 'text-rose-600 font-bold' : 'text-stone-500'}`}>
                        {status.remaining} rest.
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="post-content" className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Contenido de la Publicación
                </label>
                <div className="flex items-center space-x-2">
                  <select 
                    value={tone} 
                    onChange={(e) => setTone(e.target.value)}
                    className="text-xs border border-stone-200 rounded-lg px-2 py-1 bg-stone-50 text-stone-700 font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="professional">Tono Profesional</option>
                    <option value="casual">Tono Casual / Cercano</option>
                    <option value="sales">Tono Comercial / Venta</option>
                    <option value="humor">Tono Ingenioso / Humor</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <textarea
                  id="post-content"
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="¿Qué deseas automatizar y publicar hoy en tus redes sociales? Escribe tu mensaje aquí..."
                  className={`w-full p-4 rounded-xl border text-stone-900 placeholder:text-stone-400 text-sm focus:outline-hidden focus:ring-2 transition-all resize-y ${
                    hasExceededLimit 
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20' 
                      : 'border-stone-200 focus:border-indigo-500 focus:ring-indigo-500/20 bg-white'
                  }`}
                />

                <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowMediaInput(!showMediaInput)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                    title="Adjuntar imagen o vídeo"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Character Limit Counters per Selected Network */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center space-x-3">
                  {selectedPlatforms.map(pid => {
                    const status = getPlatformStatus(pid);
                    const pConfig = PLATFORMS.find(p => p.id === pid);
                    return (
                      <div key={pid} className="flex items-center space-x-1.5 text-xs">
                        <span className="font-medium text-stone-600">{pConfig?.name}:</span>
                        <span className={`font-semibold ${status.isOver ? 'text-rose-600' : status.remaining < 20 ? 'text-amber-600' : 'text-stone-700'}`}>
                          {charCount}/{status.maxChars}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {hasExceededLimit && (
                  <p className="text-xs text-rose-600 font-semibold flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Límite excedido en una o más redes</span>
                  </p>
                )}
              </div>
            </div>

            {/* Media URL Input if toggled */}
            {showMediaInput && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-700">URL del Recurso Multimedia (Imagen/Video)</label>
                  <button 
                    type="button" 
                    onClick={() => { setMediaUrl(''); setShowMediaInput(false); }}
                    className="text-stone-400 hover:text-stone-600 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Scheduling Options */}
            <div className="pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="schedule-toggle"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-stone-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="schedule-toggle" className="text-sm font-medium text-stone-800 cursor-pointer">
                    Programar para más adelante
                  </label>
                </div>
                {isScheduled && (
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="text-xs border border-stone-200 rounded-lg px-3 py-1.5 bg-stone-50 text-stone-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                )}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div className="text-xs text-stone-500">
                Sincronizado con n8n Webhook Engine
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !content.trim() || hasExceededLimit}
                className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white shadow-md transition-all ${
                  isSubmitting || !content.trim() || hasExceededLimit
                    ? 'bg-stone-400 cursor-not-allowed shadow-none'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Enviando a n8n...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{isScheduled ? 'Programar Publicación' : 'Publicar Ahora'}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Live Multi-Platform Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Vista Previa en Vivo</h2>
              <div className="flex space-x-1 bg-stone-100 p-1 rounded-lg">
                {selectedPlatforms.map(pid => {
                  const pConfig = PLATFORMS.find(p => p.id === pid);
                  return (
                    <button
                      key={pid}
                      type="button"
                      onClick={() => setPreviewPlatform(pid)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                        previewPlatform === pid ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      {pConfig?.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview Card Container */}
            <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  SP
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Social n8n Agency</p>
                  <p className="text-[10px] text-stone-500">@social_n8n · Ahora mismo</p>
                </div>
              </div>

              <div className="text-sm text-stone-800 whitespace-pre-wrap leading-relaxed min-h-[80px]">
                {content || <span className="text-stone-400 italic">La vista previa aparecerá aquí a medida que escribas...</span>}
              </div>

              {mediaUrl && (
                <div className="rounded-lg overflow-hidden border border-stone-200 bg-stone-100 max-h-48 flex items-center justify-center">
                  <img src={mediaUrl} alt="Media preview" className="w-full h-full object-cover" onError={(e)=>{(e.target as HTMLElement).style.display = 'none';}} />
                </div>
              )}

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                <span>Plataforma: <strong className="text-stone-700 capitalize">{previewPlatform}</strong></span>
                <span className="font-mono text-[11px] text-indigo-600">n8n Hook Ready</span>
              </div>
            </div>

            {/* Automation Summary Card */}
            <div className="mt-6 p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 space-y-2">
              <p className="font-bold flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>¿Cómo actúa n8n detrás de escena?</span>
              </p>
              <p className="text-indigo-800 leading-relaxed">
                Al hacer clic en publicar, enviamos el payload JSON con tu contenido y plataformas seleccionadas al webhook de n8n para orquestar la distribución automática.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
