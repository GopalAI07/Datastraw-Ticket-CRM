import React from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2.5 z-50 pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-l-4 border-rose-500 bg-theme-dark text-white shadow-red-glow';
        let Icon = Info;
        let iconColor = 'text-rose-400';

        if (toast.type === 'success') {
          borderClass = 'border-l-4 border-emerald-500 bg-theme-dark text-white';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'error') {
          borderClass = 'border-l-4 border-red-600 bg-theme-dark text-white shadow-red-glow';
          Icon = AlertTriangle;
          iconColor = 'text-red-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 text-xs px-4 py-3.5 rounded-xl border border-theme-border shadow-2xl max-w-sm animate-slide-right transition ${borderClass}`}
          >
            <Icon size={16} className={`shrink-0 ${iconColor}`} />
            <span className="font-semibold">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
