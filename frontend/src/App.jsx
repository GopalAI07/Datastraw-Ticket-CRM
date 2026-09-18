import React, { useState, useEffect } from 'react';
import { Plus, Download, Sparkles } from 'lucide-react';
import StatsBar from './components/StatsBar';
import SearchToolbar from './components/SearchToolbar';
import TicketTable from './components/TicketTable';
import CreateTicketModel from './components/CreateTicketModel';
import TicketDetailModel from './components/TicketDetailModel';
import Toast from './components/Toast';
import { getApiUrl } from './config';

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, closed: 0 });
  const [loading, setLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Model state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [detailTicketId, setDetailTicketId] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets();
    }, 250);
    return () => clearTimeout(timer);
  }, [activeStatus, searchQuery]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeStatus) params.append('status', activeStatus);
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(getApiUrl(`/api/tickets?${params.toString()}`));
      if (!res.ok) throw new Error('Failed to fetch tickets');
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error(err);
      addToast('Error loading tickets from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(getApiUrl('/api/stats'));
      if (!res.ok) return;
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSuccess = (newTicketId) => {
    addToast(`Ticket ${newTicketId} created successfully!`, 'success');
    fetchTickets();
    fetchStats();
  };

  const handleUpdateSuccess = (ticketId) => {
    addToast(`Ticket ${ticketId} updated successfully!`, 'success');
    fetchTickets();
    fetchStats();
  };

  const handleExportCsv = () => {
    if (tickets.length === 0) {
      addToast('No tickets to export', 'error');
      return;
    }

    const headers = ['Ticket ID', 'Customer Name', 'Customer Email', 'Subject', 'Status', 'Priority', 'Created Date'];
    const rows = [headers.join(',')];

    tickets.forEach((t) => {
      const row = [
        `"${t.ticket_id}"`,
        `"${(t.customer_name || '').replace(/"/g, '""')}"`,
        `"${(t.customer_email || '').replace(/"/g, '""')}"`,
        `"${(t.subject || '').replace(/"/g, '""')}"`,
        `"${t.status}"`,
        `"${t.priority || 'Medium'}"`,
        `"${t.created_at}"`
      ];
      rows.push(row.join(','));
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `support_tickets_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    addToast('Tickets exported to CSV!', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-theme-darkest text-slate-100 font-sans">
      {/* Top Header Bar */}
      <header className="bg-theme-dark border-b border-theme-border px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-red-glow">
            D
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-extrabold text-white tracking-tight leading-none">Datastraw</h1>
            <p className="text-[9px] sm:text-[10px] text-theme-textMuted font-medium">Customer Support CRM</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-theme-textSubtle bg-theme-card border border-theme-border rounded-lg sm:rounded-xl hover:text-white hover:border-rose-700 transition cursor-pointer"
            onClick={handleExportCsv}
            title="Export CSV"
          >
            <Download size={12} className="text-rose-400" />
            <span>Export CSV</span>
          </button>

          <button
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-700 hover:from-rose-500 hover:to-amber-600 rounded-lg sm:rounded-xl shadow-red-glow transition cursor-pointer whitespace-nowrap"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus size={13} />
            <span>New Ticket</span>
          </button>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 p-3 sm:p-5 md:p-7 max-w-7xl w-full mx-auto space-y-4 sm:space-y-6">

        {/* Page Title & Pill Header */}
        <div className="space-y-1 sm:space-y-1.5">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-rose-950/80 via-amber-950/70 to-zinc-900 border border-theme-borderLight px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-300 shadow-sm">
            <Sparkles size={11} className="text-yellow-400" />
            <span>Ticket Management Desk</span>
            <div className="flex items-center gap-1 ml-1 border-l border-theme-border pl-1.5 sm:pl-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" title="Open - Yellow"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" title="In Progress - Blue"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Closed - Green"></span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tickets
          </h2>
          <p className="text-[11px] sm:text-xs text-theme-textMuted">
            Manage, search, and track customer support tickets in real-time
          </p>
        </div>

        {/* Metric Stats Cards */}
        <StatsBar
          stats={stats}
          activeStatus={activeStatus}
          onSelectStatus={(s) => setActiveStatus(s)}
        />

        {/* Search Bar */}
        <SearchToolbar
          searchQuery={searchQuery}
          onSearchChange={(val) => setSearchQuery(val)}
          onClearSearch={() => setSearchQuery('')}
        />

        {/* Ticket Table */}
        <TicketTable
          tickets={tickets}
          loading={loading}
          onViewTicket={(id) => setDetailTicketId(id)}
          onRefresh={() => {
            fetchTickets();
            fetchStats();
            addToast('Refreshed ticket dataset', 'info');
          }}
          onResetFilters={() => {
            setActiveStatus('');
            setSearchQuery('');
          }}
          searchQuery={searchQuery}
          activeStatus={activeStatus}
        />
      </main>

      {/* Footer */}
      <footer className="bg-theme-dark border-t border-theme-border py-4 px-6 text-center text-xs text-theme-textMuted mt-auto">
        <p>Datastraw Customer Support CRM </p>
      </footer>

      {/* Models */}
      <CreateTicketModel
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <TicketDetailModel
        ticketId={detailTicketId}
        isOpen={!!detailTicketId}
        onClose={() => setDetailTicketId(null)}
        onUpdateSuccess={handleUpdateSuccess}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} />
    </div>
  );
}

