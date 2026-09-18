import React, { useState } from 'react';
import { Settings as SettingsIcon, CheckCircle2, Shield, Bell, Globe } from 'lucide-react';

export function Settings() {
  const [saved, setSaved] = useState(false);
  const [agencyName, setAgencyName] = useState('Agencia de Marketing Pro');
  const [defaultTone, setDefaultTone] = useState('professional');
  const [autoApprove, setAutoApprove] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Configuración del Sistema</h1>
        <p className="text-sm text-stone-600 mt-1">
          Personaliza los parámetros de la plataforma social y preferencias de automatización.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-medium">Configuración guardada correctamente.</p>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6">
        <h2 className="text-base font-bold text-stone-900 flex items-center space-x-2">
          <SettingsIcon className="w-5 h-5 text-indigo-600" />
          <span>Preferencias Generales</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Nombre de la Agencia / Perfil</label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Tono Predeterminado para IA</label>
            <select
              value={defaultTone}
              onChange={(e) => setDefaultTone(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="professional">Profesional y Corporativo</option>
              <option value="casual">Casual y Cercano</option>
              <option value="sales">Comercial / Venta Directa</option>
            </select>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              id="auto-approve"
              checked={autoApprove}
              onChange={(e) => setAutoApprove(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-stone-300 focus:ring-indigo-500"
            />
            <label htmlFor="auto-approve" className="text-xs font-medium text-stone-800 cursor-pointer">
              Auto-aprobar publicaciones generadas por IA antes de enviar a n8n
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-all shadow-sm shadow-indigo-200 cursor-pointer"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
