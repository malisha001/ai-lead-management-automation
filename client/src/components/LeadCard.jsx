import { Eye } from 'lucide-react';
import PriorityBadge from './ui/PriorityBadge';
import StatusBadge   from './ui/StatusBadge';
import { formatShortDate, truncate } from '../utils/formatters';

const LeadCard = ({ lead, onView }) => (
  <div className="glass-card p-4 hover:border-white/20 transition-all duration-200 space-y-3 animate-fade-in">
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="font-semibold text-slate-200 truncate">{lead.name}</p>
        <p className="text-slate-500 text-sm truncate">{lead.email}</p>
      </div>
      <button
        onClick={() => onView(lead)}
        className="p-2 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 transition-colors shrink-0"
      >
        <Eye className="w-4 h-4" />
      </button>
    </div>

    <div className="flex flex-wrap gap-2">
      <PriorityBadge priority={lead.priority} />
      <StatusBadge   status={lead.status} />
    </div>

    {lead.aiSummary && (
      <p className="text-slate-400 text-sm leading-relaxed">{truncate(lead.aiSummary, 100)}</p>
    )}

    <div className="flex items-center justify-between pt-1 border-t border-white/5">
      <span className="text-slate-600 text-xs">{lead.serviceType}</span>
      <span className="text-slate-600 text-xs">{formatShortDate(lead.createdAt)}</span>
    </div>
  </div>
);

export default LeadCard;
