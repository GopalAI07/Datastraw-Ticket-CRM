import React from 'react';
import { Ticket, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function StatsBar({ stats, activeStatus, onSelectStatus }) {
  const cards = [
    {
      id: '',
      label: 'Total Tickets',
      shortLabel: 'Total',
      value: stats.total || 0,
      icon: Ticket,
      iconBg: 'bg-blue-950/80 text-blue-400 border border-blue-800/70',
      activeRing: 'border-blue-500 ring-2 ring-blue-500/30 bg-theme-cardHover',
      badgeClass: 'text-blue-300 bg-blue-950/80 border-blue-800/80',
      badgeText: 'All'
    },
    {
      id: 'Open',
      label: 'Open Issues',
      shortLabel: 'Open',
      value: stats.open || 0,
      icon: AlertCircle,
      iconBg: 'bg-yellow-950/80 text-yellow-400 border border-yellow-800/70',
      activeRing: 'border-yellow-400 ring-2 ring-yellow-400/30 bg-theme-cardHover',
      badgeClass: 'text-yellow-300 bg-yellow-950/80 border-yellow-800/80',
      badgeText: 'Pending'
    },
    {
      id: 'In Progress',
      label: 'In Progress',
      shortLabel: 'Progress',
      value: stats.inProgress || 0,
      icon: Loader2,
      iconBg: 'bg-sky-950/80 text-sky-400 border border-sky-800/70',
      activeRing: 'border-sky-500 ring-2 ring-sky-500/30 bg-theme-cardHover',
      badgeClass: 'text-sky-300 bg-sky-950/80 border-sky-800/80',
      badgeText: 'Active'
    },
    {
      id: 'Closed',
      label: 'Resolved & Closed',
      shortLabel: 'Closed',
      value: stats.closed || 0,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/70',
      activeRing: 'border-emerald-500 ring-2 ring-emerald-500/30 bg-theme-cardHover',
      badgeClass: 'text-emerald-300 bg-emerald-950/80 border-emerald-800/80',
      badgeText: 'Resolved'
    }
  ];

  return (
    <section className="grid grid-cols-4 gap-2 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeStatus === card.id;

        return (
          <div
            key={card.label}
            onClick={() => onSelectStatus(card.id)}
            className={`bg-theme-card border rounded-xl sm:rounded-2xl p-2 sm:p-4 md:p-5 shadow-card-dark cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:bg-theme-cardHover ${
              isActive ? `${card.activeRing} border-2` : 'border-theme-border hover:border-theme-borderLight'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-3.5 min-w-0">
                <div
                  className={`w-7 h-7 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${card.id === 'In Progress' && isActive ? 'animate-spin' : ''}`} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-theme-textMuted truncate">
                    <span className="hidden sm:inline">{card.label}</span>
                    <span className="sm:hidden">{card.shortLabel}</span>
                  </span>
                  <span className="font-heading text-base sm:text-2xl font-extrabold text-white leading-tight">
                    {card.value}
                  </span>
                </div>
              </div>

              {/* Right side badge (Hidden on mobile for clean one-line fit) */}
              <span className={`hidden md:inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${card.badgeClass}`}>
                {card.badgeText}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}


