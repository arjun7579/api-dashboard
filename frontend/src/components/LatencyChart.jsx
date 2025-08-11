import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

function LatencyChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center p-10 text-slate-500">No data available for this period.</div>;
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis 
            dataKey="time" 
            stroke="#888888"
            tickFormatter={(timeStr) => format(new Date(timeStr), 'HH:mm')}
            />
        <YAxis stroke="#888888" />
        <Tooltip
            labelFormatter={(label) => format(new Date(label), 'MMM d, p')}
            formatter={(value) => [`${value} ms`, 'Latency']}
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #ccc' }}
        />
        <Legend />
        <Line type="monotone" dataKey="latency" stroke="#8884d8" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LatencyChart;