import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'No leads yet', description = 'Leads will appear here once customers submit the contact form.', action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4">
      <Inbox className="w-8 h-8 text-brand-400" />
    </div>
    <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm max-w-sm">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
