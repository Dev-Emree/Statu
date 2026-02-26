'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Monitor, Heartbeat, Incident } from '../types';
import { Activity, Server } from 'lucide-react';

const API_URL = 'http://localhost:3000';

export default function Dashboard() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch monitors
  const fetchMonitors = async () => {
    try {
      const res = await axios.get(`${API_URL}/monitors`);
      setMonitors(res.data);
    } catch (error) {
      console.error('Failed to fetch monitors', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors(); // Initial fetch

    const socket = io(API_URL);

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socket.on('heartbeat', (heartbeat: Heartbeat) => {
      // Update the monitor list with new status
      setMonitors((prev) =>
        prev.map((m) =>
          m.id === heartbeat.monitorId
            ? { ...m, status: heartbeat.status, lastCheck: heartbeat.timestamp }
            : m
        )
      );
    });

    socket.on('incident', (incident: Incident) => {
       fetchMonitors(); // Refresh to get latest status if incident changes
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleCreateMonitor = async () => {
      const name = prompt("Monitor Name:");
      if(!name) return;
      const url = prompt("Monitor URL (http://... or host:port):");
      if(!url) return;
      const type = url.startsWith("http") ? "HTTP" : "TCP";
      const interval = 10;

      try {
          await axios.post(`${API_URL}/monitors`, {
              name,
              url,
              type,
              interval
          });
          // Optimistically add or re-fetch
          fetchMonitors();
      } catch(e) {
          alert("Failed to create monitor");
      }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
             <Activity className="text-blue-600 w-8 h-8" />
             <h1 className="text-3xl font-bold text-gray-900">Statu Dashboard</h1>
          </div>
          <button
            onClick={handleCreateMonitor}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + Add Monitor
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64 text-gray-500">Loading...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {monitors.map((monitor) => (
              <div
                key={monitor.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${monitor.status === 'UP' ? 'bg-green-100' : 'bg-red-100'}`}>
                      <Server className={`w-6 h-6 ${monitor.status === 'UP' ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{monitor.name}</h3>
                      <p className="text-sm text-gray-500 truncate max-w-[150px]" title={monitor.url}>{monitor.url}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    monitor.status === 'UP' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {monitor.status}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between text-sm text-gray-500">
                    <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600">{monitor.type}</span>
                    <span>Interval: {monitor.interval}s</span>
                </div>
                <div className="mt-2 text-xs text-gray-400 text-right">
                    Last Check: {monitor.lastCheck ? new Date(monitor.lastCheck).toLocaleTimeString() : 'Never'}
                </div>
              </div>
            ))}
            {monitors.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                    No monitors found. Create one to get started!
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
