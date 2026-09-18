import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Clock, Check, Loader2 } from 'lucide-react';
import { getApiUrl } from '../config';

export default function TicketDetailModel({ ticketId, isOpen, onClose, onUpdateSuccess }) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusVal, setStatusVal] = useState('Open');
  const [noteVal, setNoteVal] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (isOpen && ticketId) {
      loadTicket();
    } else {
      setTicket(null);
      setNoteVal('');
    }
  }, [isOpen, ticketId]);

  const loadTicket = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl(`/api/tickets/${ticketId}`));
      if (!res.ok) throw new Error('Ticket not found');
      const data = await res.json();
      setTicket(data);
      setStatusVal(data.status);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!ticketId) return;

    setUpdating(true);
    try {
      const res = await fetch(getApiUrl(`/api/tickets/${ticketId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusVal,
          notes: noteVal
        })
      });

      if (!res.ok) throw new Error('Failed to update ticket');

      setNoteVal('');
      await loadTicket();
      onUpdateSuccess(ticketId);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen) return null;

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

  const getPriorityClass = (priority) => {
    if (priority === 'Urgent') return 'badge-priority-Urgent';
    if (priority === 'High') return 'badge-priority-High';
    if (priority === 'Medium') return 'badge-priority-Medium';
    if (priority === 'Low') return 'badge-priority-Low';
    return 'badge-priority-Medium';
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-theme-card rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-theme-border overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Model Header */}
        <div className="p-5 border-b border-theme-border flex items-center justify-between bg-theme-dark">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-lg border border-rose-800/80">
              {ticket?.ticket_id || ticketId}
            </span>
            <div>
              <h3 className="text-base font-bold text-white">{ticket?.subject || 'Loading...'}</h3>
              <p className="text-xs text-theme-textMuted font-medium">
                Created on {formatDate(ticket?.created_at)}
              </p>
            </div>
          </div>
          <button
            className="text-theme-textMuted hover:text-white p-1.5 rounded-lg hover:bg-theme-border transition cursor-pointer"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {loading || !ticket ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3 bg-theme-card">
            <div className="w-8 h-8 border-3 border-theme-border border-t-rose-500 rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-theme-textMuted">Loading ticket details...</p>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6 bg-theme-card">
            {/* Left Column: Details & Notes (2 Cols) */}
            <div className="md:col-span-2 space-y-4">
              {/* Customer Info Card */}
              <div className="bg-theme-dark border border-theme-border rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3">
                  Customer Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-theme-textMuted block mb-0.5 font-medium">Customer Name</span>
                    <span className="font-semibold text-white text-sm">{ticket.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-theme-textMuted block mb-0.5 font-medium">Email Address</span>
                    <span className="font-semibold text-white text-sm break-all">{ticket.customer_email}</span>
                  </div>
                  <div>
                    <span className="text-theme-textMuted block mb-0.5 font-medium">Current Status</span>
                    <span className={`badge-status-${(ticket.status || 'Open').replace(/\s+/g, '')}`}>
                      {ticket.status || 'Open'}
                    </span>
                  </div>
                  <div>
                    <span className="text-theme-textMuted block mb-0.5 font-medium">Priority Level</span>
                    <span className={getPriorityClass(ticket.priority)}>
                      {ticket.priority || 'Medium'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Card */}
              <div className="bg-theme-dark border border-theme-border rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
                  Issue Description
                </h4>
                <p className="text-sm text-theme-textSubtle whitespace-pre-wrap leading-relaxed">
                  {ticket.description}
                </p>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-rose-400" /> Internal Notes &amp; Activity
                  </h4>
                  <span className="text-[11px] font-bold bg-theme-dark text-rose-300 px-2 py-0.5 rounded border border-theme-border">
                    {ticket.notes?.length || 0} {ticket.notes?.length === 1 ? 'Note' : 'Notes'}
                  </span>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {!ticket.notes || ticket.notes.length === 0 ? (
                    <div className="p-4 text-center text-xs text-theme-textMuted border border-dashed border-theme-border rounded-xl bg-theme-dark font-medium">
                      No internal activity notes added yet. Add a note below to collaborate.
                    </div>
                  ) : (
                    ticket.notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 bg-theme-dark border-l-4 border-rose-600 border border-theme-border rounded-r-xl"
                      >
                        <div className="flex items-center gap-1.5 text-[11px] text-theme-textMuted mb-1 font-medium">
                          <Clock size={11} className="text-amber-500" />
                          <span>{formatDate(note.created_at)}</span>
                        </div>
                        <p className="text-xs text-theme-textSubtle whitespace-pre-wrap leading-normal font-medium">
                          {note.note_text}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Update Actions */}
            <div className="md:col-span-1">
              <div className="bg-theme-dark border border-theme-border rounded-xl p-4 h-full flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-4">
                    Update Status &amp; Notes
                  </h4>

                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-theme-textSubtle mb-1 uppercase tracking-wider">
                        Status
                      </label>
                      <select
                        className="w-full px-3 py-2 text-sm bg-theme-card border border-theme-border rounded-xl outline-none text-white focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 transition cursor-pointer"
                        value={statusVal}
                        onChange={(e) => setStatusVal(e.target.value)}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-theme-textSubtle mb-1 uppercase tracking-wider">
                        Add Internal Note
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Add internal remarks, diagnosis, or resolution..."
                        value={noteVal}
                        onChange={(e) => setNoteVal(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-theme-card border border-theme-border rounded-xl outline-none text-white focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 transition placeholder:text-theme-textMuted"
                      />
                      <span className="text-[11px] text-theme-textMuted mt-1 block">
                        Internal notes are shared among support team members.
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-700 hover:from-rose-500 hover:to-amber-600 rounded-xl shadow-red-glow active:scale-95 transition disabled:opacity-50 cursor-pointer"
                      disabled={updating}
                    >
                      {updating ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Check size={13} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-theme-dark border-t border-theme-border flex items-center justify-end">
          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold text-theme-textSubtle bg-theme-card border border-theme-border rounded-xl hover:text-white hover:border-rose-800 transition cursor-pointer"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
