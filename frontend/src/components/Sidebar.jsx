import React from 'react';
import { Layers, LayoutDashboard, Ticket, Sparkles, MessageSquare, Headphones } from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange }) {
  return (
    <aside className="w-64 bg-theme-dark border-r border-theme-border flex flex-col justify-between p-4 min-h-screen shrink-0 hidden md:flex">
      {/* Top Section: Logo & Nav */}
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-red-600 to-amber-700 text-white flex items-center justify-center shadow-red-glow">
            <Headphones size={22} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-base tracking-tight text-white">
                Datastraw
              </span>
              <span className="text-xs font-bold text-rose-500 bg-rose-950/80 px-1.5 py-0.2 rounded border border-rose-800/80">
                CRM
              </span>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-theme-textMuted">
              Support Desk Hub
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <div>
          <div className="flex items-center gap-1.5 px-3 mb-3 text-[11px] font-bold uppercase tracking-wider text-theme-textMuted">
            <Sparkles size={12} className="text-rose-500" />
            <span>Navigation</span>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-rose-900/60 to-amber-900/40 text-white border-l-4 border-rose-500 shadow-sm'
                  : 'text-theme-textSubtle hover:text-white hover:bg-theme-card'
                }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={17} className={activeTab === 'dashboard' ? 'text-rose-400' : 'text-theme-textMuted'} />
                <span>Dashboard</span>
              </div>
            </button>

            <button
              onClick={() => onTabChange('tickets')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'tickets'
                  ? 'bg-gradient-to-r from-rose-700 via-red-700 to-amber-800 text-white shadow-red-glow border-l-4 border-white'
                  : 'text-theme-textSubtle hover:text-white hover:bg-theme-card'
                }`}
            >
              <div className="flex items-center gap-3">
                <Ticket size={17} className="text-white" />
                <span>Tickets</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom Assistant Widget (Matching Reference Image) */}
      <div className="bg-gradient-to-br from-rose-950/80 via-theme-card to-amber-950/70 border border-theme-borderLight rounded-2xl p-4 shadow-card-dark space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
          <Sparkles size={14} className="text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>SUPPORT ACTIVE</span>
        </div>
        <p className="text-[11px] text-theme-textMuted leading-relaxed">
          Logging and resolving customer tickets.
        </p>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 pt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live &amp; Ready</span>
        </div>
      </div>
    </aside>
  );
}
