import React from 'react';
import { LayoutDashboard, CheckCircle2, Clock, Send, BarChart2, ArrowUpRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const stats = [
    { label: 'Publicaciones Realizadas', value: '1,482', change: '+12.4%', icon: Send, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Programadas en n8n', value: '38', change: 'Activas', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Alcance Total (30d)', value: '245.8K', change: '+18.2%', icon: BarChart2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'workflows n8n', value: '4 / 4', change: '100% OK', icon: Zap, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  const recentPosts = [
    { id: '1', content: 'Lanzamiento oficial de nuestro nuevo motor de automatización n8n para agencias de marketing.', platforms: ['twitter', 'linkedin'], status: 'published', time: 'Hace 2 horas' },
    { id: '2', content: '5 consejos clave para escalar tu marca personal en LinkedIn sin quemar tu presupuesto.', platforms: ['linkedin'], status: 'scheduled', time: 'Programado para mañana 09:00' },
    { id: '3', content: 'Nuevo Reel sobre flujos de trabajo avanzados en n8n y Supabase.', platforms: ['instagram'], status: 'published', time: 'Ayer' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Dashboard General</h1>
          <p className="text-sm text-stone-600 mt-1">
            Resumen de actividad social y estado de los webhooks de n8n.
          </p>
        </div>
        <div>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-sm shadow-indigo-200"
          >
            <span>Crear Nueva Publicación</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{stat.label}</span>
                <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-stone-900 tracking-tight">{stat.value}</h3>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <h2 className="font-bold text-stone-900 text-base">Actividad Reciente en n8n</h2>
          <span className="text-xs text-stone-500">Últimas 24 horas</span>
        </div>
        <div className="divide-y divide-stone-100">
          {recentPosts.map((post) => (
            <div key={post.id} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-stone-50/50 transition-colors">
              <div className="space-y-1 max-w-2xl">
                <p className="text-sm font-medium text-stone-900 line-clamp-2">{post.content}</p>
                <div className="flex items-center space-x-3 text-xs text-stone-500">
                  <span>Plataformas: <strong className="text-stone-700 capitalize">{post.platforms.join(', ')}</strong></span>
                  <span>•</span>
                  <span>{post.time}</span>
                </div>
              </div>
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  post.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {post.status === 'published' ? 'Publicado' : 'Programado'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
