import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaServer, FaChartLine, FaExclamationTriangle, FaCheckCircle, FaClock } from 'react-icons/fa';
import { getEndpoints } from '../services/endpointService';
import { getLogsForEndpoint } from '../services/logService';
import { checkAnomaly } from '../services/anomalyService';
import Spinner from '../components/Spinner';
import StatCard from '../components/StatCard';
import LatencyChart from '../components/LatencyChart';
import LogTable from '../components/LogTable';
import { formatDistanceToNow } from 'date-fns';

function Dashboard() {
  const [endpoints, setEndpoints] = useState([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [logs, setLogs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState(null);
  const [anomaly, setAnomaly] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  // Fetch all endpoints on component mount
  useEffect(() => {
    const fetchEndpoints = async () => {
      try {
        const data = await getEndpoints();
        setEndpoints(data);
        if (data.length > 0) {
          // Auto-select the first endpoint
          handleEndpointSelect(data[0]);
        }
      } catch (error) {
        toast.error('Failed to fetch API endpoints.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEndpoints();
  }, []);

  // Fetch data for the selected endpoint
  const handleEndpointSelect = async (endpoint) => {
    if (!endpoint) return;
    setIsDataLoading(true);
    setSelectedEndpoint(endpoint);

    try {
      // Fetch logs, stats, and anomaly data concurrently
      const [logData, anomalyData] = await Promise.all([
        getLogsForEndpoint(endpoint._id),
        checkAnomaly(endpoint._id),
      ]);

      setLogs(logData.logs);
      setChartData(logData.chartData);
      setStats(logData.stats);
      setAnomaly(anomalyData);
      
      if (logData.logs.length > 0) {
        setLastChecked(new Date(logData.logs[0].createdAt));
      } else {
        setLastChecked(null);
      }

    } catch (error) {
      toast.error(`Failed to fetch data for ${endpoint.name}`);
      setLogs([]);
      setChartData([]);
      setStats(null);
      setAnomaly(null);
    } finally {
      setIsDataLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  const latestLog = logs && logs.length > 0 ? logs[0] : null;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar with Endpoint List */}
      <aside className="lg:w-1/4 bg-white p-4 rounded-lg shadow-md h-full">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaServer /> Monitored APIs
        </h2>
        <ul className="space-y-2">
          {endpoints.length > 0 ? (
            endpoints.map((ep) => (
              <li key={ep._id}>
                <button
                  onClick={() => handleEndpointSelect(ep)}
                  className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${
                    selectedEndpoint?._id === ep._id
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  <span className="font-semibold">{ep.name}</span>
                  <p className="text-xs truncate">{ep.url}</p>
                </button>
              </li>
            ))
          ) : (
            <p className="text-slate-500">No APIs configured yet.</p>
          )}
        </ul>
      </aside>

      {/* Main Content Area */}
      <div className="lg:w-3/4">
        {isDataLoading && <Spinner />}
        {!isDataLoading && selectedEndpoint ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{selectedEndpoint.name}</h1>
                {lastChecked && <p className="text-sm text-slate-500">Last checked: {formatDistanceToNow(lastChecked, { addSuffix: true })}</p>}
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Status"
                value={latestLog?.wasSuccessful ? 'Up' : 'Down'}
                icon={latestLog?.wasSuccessful ? <FaCheckCircle className="text-green-500" /> : <FaExclamationTriangle className="text-red-500" />}
                color={latestLog?.wasSuccessful ? 'text-green-500' : 'text-red-500'}
              />
              <StatCard
                title="Uptime (24h)"
                value={`${stats?.uptime || '100'}%`}
                icon={<FaChartLine />}
              />
              <StatCard
                title="Avg. Latency"
                value={`${stats?.avgLatency || 0} ms`}
                icon={<FaClock />}
              />
               <StatCard
                title="P95 Latency"
                value={`${anomaly?.latestLatency || 0} ms`}
                icon={anomaly?.isAnomaly ? <FaExclamationTriangle className="text-yellow-500" /> : <FaClock />}
                tooltip={anomaly?.isAnomaly ? `Anomaly detected! Latency is above the threshold of ${anomaly.threshold}ms.` : 'Latency is within normal range.'}
              />
            </div>
            
            {/* Latency Chart */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Latency (ms) over last 24 hours</h3>
                <LatencyChart data={chartData} />
            </div>

            {/* Logs Table */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Recent Checks</h3>
                <LogTable logs={logs} />
            </div>

          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-slate-600">
              {endpoints.length > 0 ? 'Select an API to view its data' : 'Welcome to API-Pulse!'}
            </h2>
            <p className="text-slate-500 mt-2">
              {endpoints.length > 0
                ? 'Choose one from the list on the left.'
                : 'Go to Settings to add your first API endpoint to monitor.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;