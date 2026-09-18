import React, { useState } from 'react';
import { X, Ticket, Send, Loader2 } from 'lucide-react';

export default function CreateTicketModel({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    priority: 'Medium',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.customer_name.trim()) {
      errs.customer_name = 'Customer name is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.customer_email.trim() || !emailRegex.test(formData.customer_email.trim())) {
      errs.customer_email = 'Please provide a valid email address.';
    }
    if (!formData.subject.trim()) {
      errs.subject = 'Issue subject is required.';
    }
    if (!formData.description.trim()) {
      errs.description = 'Detailed description is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.error || 'Failed to create ticket');
      }

      onSuccess(data.ticket_id);
      setFormData({
        customer_name: '',
        customer_email: '',
        subject: '',
        priority: 'Medium',
        description: ''
      });
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-theme-card rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl border border-theme-border overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Model Header */}
        <div className="p-5 border-b border-theme-border flex items-center justify-between bg-theme-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-700 text-white flex items-center justify-center shadow-red-glow">
              <Ticket size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Support Ticket</h3>
              <p className="text-xs text-theme-textMuted">Log a new customer issue or support query</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col flex-1 overflow-hidden bg-theme-card">
          <div className="p-6 overflow-y-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-theme-textSubtle mb-1.5 uppercase tracking-wider">
                  Customer Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-theme-dark border border-theme-border rounded-xl outline-none text-white focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 transition placeholder:text-theme-textMuted"
                />
                {errors.customer_name && (
                  <span className="text-xs text-rose-400 mt-1 block font-medium">{errors.customer_name}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-theme-textSubtle mb-1.5 uppercase tracking-wider">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. john@example.com"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-theme-dark border border-theme-border rounded-xl outline-none text-white focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 transition placeholder:text-theme-textMuted"
                />
                {errors.customer_email && (
                  <span className="text-xs text-rose-400 mt-1 block font-medium">{errors.customer_email}</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-textSubtle mb-1.5 uppercase tracking-wider">
                Issue Subject <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Payment gateway timeout or login error"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-theme-dark border border-theme-border rounded-xl outline-none text-white focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 transition placeholder:text-theme-textMuted"
              />
              {errors.subject && (
                <span className="text-xs text-rose-400 mt-1 block font-medium">{errors.subject}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-textSubtle mb-1.5 uppercase tracking-wider">Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-theme-dark border border-theme-border rounded-xl outline-none text-white focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 transition cursor-pointer"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Urgent">Urgent Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-textSubtle mb-1.5 uppercase tracking-wider">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Provide complete steps, error messages, and customer context..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-theme-dark border border-theme-border rounded-xl outline-none text-white focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 transition placeholder:text-theme-textMuted"
              />
              {errors.description && (
                <span className="text-xs text-rose-400 mt-1 block font-medium">{errors.description}</span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:px-6 bg-theme-dark border-t border-theme-border flex items-center justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 text-xs font-semibold text-theme-textSubtle bg-theme-card border border-theme-border rounded-xl hover:text-white hover:border-rose-800 transition cursor-pointer"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-700 hover:from-rose-500 hover:to-amber-600 rounded-xl shadow-red-glow transition disabled:opacity-50 cursor-pointer"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Submit Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
