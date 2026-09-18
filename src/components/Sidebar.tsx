import React from 'react';
import { NavLink } from 'react-router-dom';
import { PenSquare, LayoutDashboard, Workflow, BarChart3, Settings } from 'lucide-react';

export function Sidebar() {
  const navItems = [
    { to: '/', label: 'Composer', icon: PenSquare },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/workflows', label: 'n8n Workflows', icon: Workflow },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 flex-1">
        <p className="px-3 text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-3">
          Navegación Principal
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/50'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-stone-800 text-xs text-stone-500">
        <div className="bg-stone-800/60 p-3 rounded-lg border border-stone-700/50">
          <p className="font-medium text-stone-300 mb-1">Estado de n8n</p>
          <p className="text-[11px] text-stone-400">Automatizaciones activas para Twitter, LinkedIn e Instagram.</p>
        </div>
      </div>
    </aside>
  );
}
