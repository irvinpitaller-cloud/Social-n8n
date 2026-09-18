import React, { useState, useEffect } from 'react';
import { Workflow, Sparkles, CheckCircle2, AlertCircle, Settings as SettingsIcon } from 'lucide-react';
import { testN8nConnection } from '../services/n8nClient';

export function Navbar() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    const url = localStorage.getItem('n8n_webhook_url') || '';
    const key = localStorage.getItem('n8n_api_key') || '';
    const res = await testN8nConnection(url, key);
    setIsConnected(res.success);
    setIsChecking(false);
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <header className="h-16 border-b border-stone-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
          <Workflow className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-semibold text-stone-900 tracking-tight">Social n8n Composer</h1>
          <p className="text-xs text-stone-500">Autonomous Multi-Platform Social Orchestration</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div 
          onClick={checkConnection}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all border ${
            isChecking 
              ? 'bg-amber-50 text-amber-700 border-amber-200' 
              : isConnected 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
          }`}
          title="Click to re-test n8n webhook connection"
        >
          {isChecking ? (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          ) : isConnected ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          )}
          <span>{isChecking ? 'Verificando n8n...' : isConnected ? 'n8n Webhook Conectado' : 'n8n Simulado / Desconectado'}</span>
        </div>

        <div className="flex items-center space-x-2 pl-4 border-l border-stone-200">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs flex items-center justify-center">
            AI
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-medium text-stone-800">Agencia Pro</p>
            <p className="text-[10px] text-stone-500">n8n Engine v1.4</p>
          </div>
        </div>
      </div>
    </header>
  );
}
