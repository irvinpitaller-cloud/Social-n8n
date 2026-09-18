import React from 'react';
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { day: 'Lun', reach: 12000, engagement: 2400 },
  { day: 'Mar', reach: 19000, engagement: 3800 },
  { day: 'Mié', reach: 15000, engagement: 3100 },
  { day: 'Jue', reach: 22000, engagement: 4600 },
  { day: 'Vie', reach: 28000, engagement: 5900 },
  { day: 'Sáb', reach: 35000, engagement: 7200 },
  { day: 'Dom', reach: 31000, engagement: 6400 },
];

export function Analytics() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Analytics y Rendimiento</h1>
        <p className="text-sm text-stone-600 mt-1">
          Métricas de alcance y engagement recopiladas a través de tus automatizaciones n8n.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Alcance Total</span>
            <Eye className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold text-stone-900">162,000</p>
          <p className="text-xs text-emerald-600 font-medium">+24.5% vs semana anterior</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Tasa de Engagement</span>
            <TrendingUp className="w-5 h-5 text-violet-600" />
          </div>
          <p className="text-3xl font-bold text-stone-900">6.8%</p>
          <p className="text-xs text-emerald-600 font-medium">+1.2% vs semana anterior</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Nuevos Seguidores</span>
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-stone-900">+1,420</p>
          <p className="text-xs text-emerald-600 font-medium">+18.4% vs semana anterior</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-stone-900">Evolución de Alcance e Interacciones</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#a8a29e" fontSize={12} />
              <YAxis stroke="#a8a29e" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="reach" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorReach)" name="Alcance" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
