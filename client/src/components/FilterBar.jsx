import { Search, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = [
  'Website Development', 'Mobile App Development', 'SEO/Marketing',
  'E-Commerce', 'CRM/Software', 'Support', 'Partnership', 'General Inquiry',
];
const PRIORITIES = ['High', 'Medium', 'Low'];
const STATUSES   = ['new', 'contacted', 'qualified', 'closed'];

const FilterBar = ({ filters, onChange, onClear }) => {
  const hasFilters = filters.search || filters.category || filters.priority || filters.status;

  return (
    <div className="glass-card p-4 space-y-3">
      {/* Search row */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search name, email, or company…"
          value={filters.search || ''}
          onChange={(e) => onChange('search', e.target.value)}
          className="input-field pl-9 text-sm"
        />
      </div>

      {/* Filter dropdowns row */}
      <div className="flex flex-wrap gap-2 items-center">
        <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" />

        <select
          value={filters.category || ''}
          onChange={(e) => onChange('category', e.target.value)}
          className="input-field !py-1.5 text-sm flex-1 min-w-[160px]"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={filters.priority || ''}
          onChange={(e) => onChange('priority', e.target.value)}
          className="input-field !py-1.5 text-sm flex-1 min-w-[120px]"
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <select
          value={filters.status || ''}
          onChange={(e) => onChange('status', e.target.value)}
          className="input-field !py-1.5 text-sm flex-1 min-w-[120px]"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>

        {hasFilters && (
          <button onClick={onClear} className="btn-ghost text-sm flex items-center gap-1 shrink-0">
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
