import { useState } from 'react';
import { X, Mail, Phone, Building2, Tag, Sparkles, MessageSquare, Clock } from 'lucide-react';
import PriorityBadge from './ui/PriorityBadge';
import StatusBadge   from './ui/StatusBadge';
import { formatDate } from '../utils/formatters';
import { updateLeadStatus } from '../api/leadsApi';

const STATUSES = ['new', 'contacted', 'qualified', 'closed'];

const Field = ({ icon: Icon, label, children }) => (
  <div className="flex gap-3">
    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-slate-400" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <div className="text-sm text-slate-200">{children}</div>
    </div>
  </div>
);

const LeadDetailModal = ({ lead, onClose, onStatusChange }) => {
  const [status, setStatus]   = useState(lead.status);
  const [saving, setSaving]   = useState(false);

  if (!lead) return null;

  const handleStatusChange = async (newStatus) => {
    if (newStatus === status) return;
    setSaving(true);
    try {
      await updateLeadStatus(lead._id, newStatus);
      setStatus(newStatus);
      if (onStatusChange) onStatusChange(lead._id, newStatus);
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 glass z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">{lead.name}</h2>
            <p className="text-slate-500 text-sm">{lead.email}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <PriorityBadge priority={lead.priority} size="lg" />
            <StatusBadge   status={status}          size="lg" />
            {lead.aiEnriched
              ? <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/15 text-brand-400 border border-brand-500/30 text-sm font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> AI Processed
                </span>
              : <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-500/15 text-slate-400 border border-slate-500/30 text-sm">
                  Manual Review Needed
                </span>
            }
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Info</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field icon={Mail} label="Email">
                <a href={`mailto:${lead.email}`} className="text-brand-400 hover:underline">{lead.email}</a>
              </Field>
              {lead.phone && (
                <Field icon={Phone} label="Phone">
                  <a href={`tel:${lead.phone}`} className="text-brand-400 hover:underline">{lead.phone}</a>
                </Field>
              )}
              {lead.company && (
                <Field icon={Building2} label="Company">{lead.company}</Field>
              )}
              <Field icon={Tag} label="Service Type">{lead.serviceType}</Field>
              <Field icon={Clock} label="Submitted">{formatDate(lead.createdAt)}</Field>
            </div>
          </div>

          {/* AI Summary */}
          {lead.aiSummary && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" /> AI Analysis
              </h3>
              <div className="bg-brand-500/5 border border-brand-500/20 rounded-xl p-4">
                <p className="text-slate-300 text-sm leading-relaxed">{lead.aiSummary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs text-slate-500">Category:</span>
                  <span className="text-xs text-brand-400 font-medium">{lead.category}</span>
                </div>
              </div>
            </div>
          )}

          {/* Original Message */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Original Message
            </h3>
            <div className="bg-white/3 border border-white/5 rounded-xl p-4 max-h-48 overflow-y-auto">
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{lead.message}</p>
            </div>
          </div>

          {/* Status Update */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={saving}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                    status === s
                      ? 'bg-brand-600 text-white border-brand-500 shadow-lg shadow-brand-500/20'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {/* Status history */}
            {lead.statusHistory?.length > 0 && (
              <div className="space-y-1.5 mt-2">
                {[...lead.statusHistory].reverse().slice(0, 5).map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    <StatusBadge status={h.status} />
                    <span>{formatDate(h.changedAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;
