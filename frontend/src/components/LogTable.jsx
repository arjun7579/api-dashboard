import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { format } from 'date-fns';

function LogTable({ logs }) {
    if (!logs || logs.length === 0) {
        return <p className="text-center p-4 text-slate-500">No recent check data available.</p>;
    }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Latency</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log._id}>
              <td className="px-4 py-4 whitespace-nowrap">
                {log.wasSuccessful ? 
                    <span className="flex items-center gap-2 text-green-600"><FaCheckCircle/> Up</span> : 
                    <span className="flex items-center gap-2 text-red-600"><FaTimesCircle/> Down</span>
                }
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.statusCode}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.latency} ms</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(log.createdAt), 'Pp')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LogTable;