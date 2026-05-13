import StatsCard from './StatsCard';

const StatsBar = ({ stats }) => {
  const cards = [
    {
      title:    'Total Leads',
      value:    stats?.totalLeads ?? 0,
      subtitle: `${stats?.newThisWeek ?? 0} this week`,
      icon:     'Users',
      color:    'blue',
    },
    {
      title:    'New Leads',
      value:    stats?.newLeads ?? 0,
      subtitle: 'Awaiting follow-up',
      icon:     'Inbox',
      color:    'indigo',
    },
    {
      title:    'High Priority',
      value:    stats?.highPriority ?? 0,
      subtitle: 'Needs immediate action',
      icon:     'Flame',
      color:    'red',
    },
    {
      title:    'Converted',
      value:    stats?.converted ?? 0,
      subtitle: `${stats?.conversionRate ?? '0.0'}% conversion rate`,
      icon:     'CheckCircle',
      color:    'green',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatsCard key={card.title} {...card} />
      ))}
    </div>
  );
};

export default StatsBar;
