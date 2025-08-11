import React from 'react';

function StatCard({ title, value, icon, color = 'text-slate-800', tooltip }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center" title={tooltip}>
      <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full mr-4 text-2xl">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}

export default StatCard;