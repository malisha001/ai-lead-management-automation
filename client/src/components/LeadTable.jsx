import { ChevronUp, ChevronDown, Eye, Trash2 } from 'lucide-react';
import PriorityBadge from './ui/PriorityBadge';
import StatusBadge   from './ui/StatusBadge';
import { formatShortDate, truncate } from '../utils/formatters';

const SortIcon = ({ field, sortBy, order }) => {
  if (sortBy !== field) return <ChevronUp className="w-3.5 h-3.5 opacity-20" />;
  return order === 'asc'
    ? <ChevronUp className="w-3.5 h-3.5 text-brand-400" />
    : <ChevronDown className="w-3.5 h-3.5 text-brand-400" />;
};

const Th = ({ label, field, sortBy, order, onSort }) => (
  <th
    onClick={() => onSort(field)}
    className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-200 select-none"
  >
    <span className="flex items-center gap-1">
      {label}
      <SortIcon field={field} sortBy={sortBy} order={order} />
    </span>
  </th>
);

const LeadTable = ({ leads, sortBy, order, onSort, onView, onDelete }) => {
  if (!leads?.length) return null;

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/5">
            <tr>
              <Th label="Name"        field="name"      sortBy={sortBy} order={order} onSort={onSort} />
              <Th label="Service"     field="serviceType" sortBy={sortBy} order={order} onSort={onSort} />
              <Th label="Priority"    field="priority"  sortBy={sortBy} order={order} onSort={onSort} />
              <Th label="Status"      field="status"    sortBy={sortBy} order={order} onSort={onSort} />
              <Th label="AI Summary"  field="aiSummary" sortBy={sortBy} order={order} onSort={onSort} />
              <Th label="Date"        field="createdAt" sortBy={sortBy} order={order} onSort={onSort} />
              <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-white/3 transition-colors group">
                <td className="px-4 py-3.5">
                  <div>
                    <p className="font-medium text-slate-200 text-sm">{lead.name}</p>
                    <p className="text-slate-500 text-xs">{lead.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-slate-300 text-sm">{lead.serviceType || '—'}</span>
                </td>
                <td className="px-4 py-3.5">
                  <PriorityBadge priority={lead.priority} />
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3.5 max-w-xs">
                  <p className="text-slate-400 text-sm">
                    {lead.aiSummary ? truncate(lead.aiSummary, 60) : (
                      <span className="text-slate-600 italic">No AI summary</span>
                    )}
                  </p>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-slate-500 text-xs">{formatShortDate(lead.createdAt)}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(lead)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(lead._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
