import { Users, Inbox, Flame, CheckCircle } from 'lucide-react';

const ICONS = { Users, Inbox, Flame, CheckCircle };

const StatsCard = ({ title, value, subtitle, icon, color }) => {
  const Icon = ICONS[icon] || Users;

  const colorMap = {
    blue:   { bg: 'from-blue-500/20 to-blue-600/5',   icon: 'bg-blue-500/20 text-blue-400',   border: 'border-blue-500/20'   },
    indigo: { bg: 'from-indigo-500/20 to-indigo-600/5', icon: 'bg-indigo-500/20 text-indigo-400', border: 'border-indigo-500/20' },
    red:    { bg: 'from-red-500/20 to-red-600/5',     icon: 'bg-red-500/20 text-red-400',     border: 'border-red-500/20'     },
    green:  { bg: 'from-green-500/20 to-green-600/5', icon: 'bg-green-500/20 text-green-400', border: 'border-green-500/20'   },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className={`glass-card p-5 bg-gradient-to-br ${c.bg} border ${c.border} hover:border-white/20 transition-all duration-200 group`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-100">{value ?? '—'}</p>
          {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.icon} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
