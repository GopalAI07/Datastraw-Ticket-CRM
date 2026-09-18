import React from 'react';
import { Eye, RotateCw, Calendar, Ticket } from 'lucide-react';

export default function TicketTable({
  tickets,
  loading,
  onViewTicket,
  onRefresh,
  onResetFilters,
  searchQuery,
  activeStatus
}) {
  const formatDate = (isoString) => {
    if (!isoString) return '--';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Truncate subject to exactly 5 words max
  const formatSubject = (text) => {
    if (!text) return '--';
    const words = text.trim().split(/\s+/);
    if (words.length <= 5) return text;
    return words.slice(0, 5).join(' ') + '...';
  };

  const getStatusClass = (status) => {
    if (status === 'Open') return 'badge-status-Open';
    if (status === 'In Progress') return 'badge-status-InProgress';
    if (status === 'Closed') return 'badge-status-Closed';
    return 'badge-status-Open';
  };

  const getPriorityClass = (priority) => {
    if (priority === 'Urgent') return 'badge-priority-Urgent';
    if (priority === 'High') return 'badge-priority-High';
    if (priority === 'Medium') return 'badge-priority-Medium';
    if (priority === 'Low') return 'badge-priority-Low';
    return 'badge-priority-Medium';
  };

  return (
    <section className="bg-theme-card border border-theme-border rounded-xl sm:rounded-2xl shadow-card-dark overflow-hidden">
      {/* Table Header */}
      <div className="p-3 sm:px-6 border-b border-theme-border flex items-center justify-between bg-theme-dark/60">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <h2 className="text-sm sm:text-base font-bold text-white">Support Tickets</h2>
          <span className="px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-bold text-rose-300 bg-rose-950/80 rounded-full border border-rose-800/80">
            {tickets.length}
          </span>
        </div>
        <button
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-theme-border flex items-center justify-center text-theme-textMuted hover:text-white hover:border-rose-700 hover:bg-rose-950/40 transition cursor-pointer"
          onClick={onRefresh}
          title="Refresh Tickets"
        >
          <RotateCw size={13} />
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3 bg-theme-card">
          <div className="w-8 h-8 border-3 border-theme-border border-t-rose-500 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-theme-textMuted">Loading tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        /* Empty State Matching User Reference Screenshot */
        <div className="py-20 px-4 text-center flex flex-col items-center justify-center gap-3 bg-theme-card">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-950 via-theme-dark to-amber-950 border border-theme-border flex items-center justify-center text-rose-400 mb-1 shadow-card-dark">
            <Calendar size={28} />
          </div>
          <h3 className="text-lg font-bold text-white">No tickets found</h3>
          <p className="text-xs text-theme-textMuted max-w-sm">
            {searchQuery || activeStatus
              ? `No tickets match status "${activeStatus || 'ALL'}" or query "${searchQuery}".`
              : 'No support tickets created yet. Click "Create Ticket" to get started.'}
          </p>
          {(searchQuery || activeStatus) && (
            <button
              className="mt-2 px-4 py-2 text-xs font-semibold rounded-xl bg-theme-dark border border-theme-border text-theme-textSubtle hover:text-white hover:border-rose-700 transition cursor-pointer"
              onClick={onResetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="w-full overflow-x-auto bg-theme-card">
          <table className="w-full text-left text-sm border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-theme-dark text-theme-textMuted text-xs font-bold uppercase tracking-wider border-b border-theme-border">
                <th className="py-3.5 px-5 w-28">Ticket ID</th>
                <th className="py-3.5 px-5 min-w-[160px]">Customer</th>
                <th className="py-3.5 px-5 min-w-[200px]">Subject</th>
                <th className="py-3.5 px-5 w-32">Status</th>
                <th className="py-3.5 px-5 w-28">Priority</th>
                <th className="py-3.5 px-5 w-36 whitespace-nowrap">Created Date</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border">
              {tickets.map((t) => (
                <tr
                  key={t.ticket_id}
                  className="hover:bg-theme-cardHover transition cursor-default"
                >
                  {/* Ticket ID */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    <span className="font-mono text-xs font-bold text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-md border border-rose-800/80">
                      {t.ticket_id}
                    </span>
                  </td>

                  {/* Customer Info */}
                  <td className="py-4 px-5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{t.customer_name}</span>
                      <span className="text-xs text-theme-textMuted">{t.customer_email}</span>
                    </div>
                  </td>

                  {/* 5-word Truncated Subject */}
                  <td className="py-4 px-5 font-medium text-theme-textSubtle" title={t.subject}>
                    <span className="block leading-snug">
                      {formatSubject(t.subject)}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    <span className={getStatusClass(t.status)}>{t.status}</span>
                  </td>

                  {/* Priority Badge */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    <span className={getPriorityClass(t.priority)}>{t.priority || 'Medium'}</span>
                  </td>

                  {/* Created Date */}
                  <td className="py-4 px-5 text-xs text-theme-textMuted whitespace-nowrap font-medium">
                    {formatDate(t.created_at)}
                  </td>

                  {/* Action Button */}
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <button
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-200 bg-theme-dark border border-theme-border rounded-lg hover:bg-rose-950/80 hover:text-white hover:border-rose-700 transition cursor-pointer"
                      onClick={() => onViewTicket(t.ticket_id)}
                      title="View complete details and update ticket"
                    >
                      <Eye size={13} />
                      <span>View &amp; Update</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
