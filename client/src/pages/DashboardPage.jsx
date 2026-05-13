import { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { getLeads, getStats, deleteLead } from '../api/leadsApi';
import Navbar          from '../components/Navbar';
import StatsBar        from '../components/StatsBar';
import FilterBar       from '../components/FilterBar';
import LeadTable       from '../components/LeadTable';
import LeadCard        from '../components/LeadCard';
import LeadDetailModal from '../components/LeadDetailModal';
import LoadingSpinner  from '../components/ui/LoadingSpinner';
import EmptyState      from '../components/ui/EmptyState';
import ErrorState      from '../components/ui/ErrorState';

const LIMIT = 20;

const DashboardPage = () => {
  const [leads, setLeads]         = useState([]);
  const [stats, setStats]         = useState(null);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError]         = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [sortBy, setSortBy]       = useState('createdAt');
  const [order, setOrder]         = useState('desc');
  const [filters, setFilters]     = useState({ search: '', category: '', priority: '', status: '' });

  // ── Fetch leads ──────────────────────────────────────────────────────────────
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: LIMIT, sortBy, order, ...filters };
      // Remove empty filter params
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await getLeads(params);
      setLeads(res.data.data.leads);
      setTotal(res.data.data.pagination.total);
    } catch {
      setError('Failed to load leads. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, order, filters]);

  // ── Fetch stats ──────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await getStats();
      setStats(res.data.data);
    } catch {
      // Non-fatal — don't show error for stats
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSort = (field) => {
    if (sortBy === field) setOrder(order === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setOrder('desc'); }
    setPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', category: '', priority: '', status: '' });
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead? This cannot be undone.')) return;
    try {
      await deleteLead(id);
      setLeads((prev) => prev.filter((l) => l._id !== id));
      setTotal((prev) => prev - 1);
      fetchStats();
    } catch {
      alert('Failed to delete lead.');
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setLeads((prev) => prev.map((l) => l._id === id ? { ...l, status: newStatus } : l));
    fetchStats();
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Lead Dashboard</h1>
            <p className="text-slate-500 text-sm mt-0.5">{total} total lead{total !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => { fetchLeads(); fetchStats(); }} className="btn-ghost text-sm flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats cards */}
        {statsLoading ? (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card h-28 animate-pulse bg-white/3" />
            ))}
          </div>
        ) : (
          <StatsBar stats={stats} />
        )}

        {/* Filters */}
        <FilterBar filters={filters} onChange={handleFilterChange} onClear={handleClearFilters} />

        {/* Table / Cards / States */}
        {loading ? (
          <LoadingSpinner label="Loading leads…" />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchLeads} />
        ) : leads.length === 0 ? (
          <EmptyState
            title={Object.values(filters).some(Boolean) ? 'No leads match your filters' : 'No leads yet'}
            description={Object.values(filters).some(Boolean)
              ? 'Try adjusting or clearing your filters.'
              : 'Leads will appear here once customers submit the contact form.'}
            action={Object.values(filters).some(Boolean)
              ? <button onClick={handleClearFilters} className="btn-ghost text-sm">Clear Filters</button>
              : null}
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <LeadTable
                leads={leads}
                sortBy={sortBy}
                order={order}
                onSort={handleSort}
                onView={setSelectedLead}
                onDelete={handleDelete}
              />
            </div>

            {/* Mobile card list */}
            <div className="md:hidden space-y-3">
              {leads.map((lead) => (
                <LeadCard key={lead._id} lead={lead} onView={setSelectedLead} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="btn-ghost text-sm disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-slate-400 text-sm">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="btn-ghost text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Lead detail modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default DashboardPage;
