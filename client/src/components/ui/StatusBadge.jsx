const STATUS_MAP = {
  new:       { bg: 'bg-blue-500/15',   text: 'text-blue-400',   border: 'border-blue-500/30',   label: 'New'       },
  contacted: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30', label: 'Contacted' },
  qualified: { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30', label: 'Qualified' },
  closed:    { bg: 'bg-slate-500/15',  text: 'text-slate-400',  border: 'border-slate-500/30',  label: 'Closed'    },
};

const StatusBadge = ({ status, size = 'sm' }) => {
  const colors = STATUS_MAP[status] || STATUS_MAP.new;
  const sizeClass = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full border font-semibold ${sizeClass} ${colors.bg} ${colors.text} ${colors.border}`}>
      {colors.label}
    </span>
  );
};

export default StatusBadge;
