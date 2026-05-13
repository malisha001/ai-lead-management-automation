/**
 * Format an ISO date string into a readable format.
 * e.g. "May 13, 2026 at 2:30 PM"
 */
export const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
};

/**
 * Format an ISO date to short date only.
 * e.g. "May 13, 2026"
 */
export const formatShortDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

/**
 * Truncate text to a given max length, adding ellipsis.
 */
export const truncate = (text, max = 80) => {
  if (!text) return '—';
  return text.length > max ? text.slice(0, max) + '…' : text;
};

/**
 * Capitalise first letter.
 */
export const capitalise = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
