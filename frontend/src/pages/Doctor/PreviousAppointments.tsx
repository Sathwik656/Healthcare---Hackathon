import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, Clock, Search, Filter, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import api from '@/src/services/api';

interface Appointment {
  appointment_id: string;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  reason: string | null;
  status: 'completed' | 'cancelled' | 'declined';
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

const formatTime = (t: string) => {
  const [h, m] = t.replace(/\..*/, '').split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${(h % 12) || 12}:${String(m).padStart(2, '0')} ${ampm}`;
};

const initials = (name: string) =>
  name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

const withinRange = (iso: string, range: string) => {
  if (!range) return true;
  const date = new Date(iso);
  const now = new Date();
  const days = { last_30_days: 30, last_3_months: 90, last_6_months: 180, this_year: 365 }[range];
  if (!days) return true;
  return (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24) <= days;
};

const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  completed: {
    label: 'Completed',
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: <CheckCircle className="w-3 h-3 mr-1" />,
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-700 border-red-200',
    icon: <XCircle className="w-3 h-3 mr-1" />,
  },
  declined: {
    label: 'Declined',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: <XCircle className="w-3 h-3 mr-1" />,
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
const PreviousAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('');

  // ── Fetch ───────────────────────────────────────────────────────────────
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/appointments/doctor');
      const all: Appointment[] = res.data.data.appointments || [];
      // Keep only past/terminal statuses
      setAppointments(all.filter(a =>
        ['completed', 'cancelled', 'declined'].includes(a.status)
      ));
    } catch {
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  // ── Filter ──────────────────────────────────────────────────────────────
  const filtered = appointments.filter(apt => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      apt.patient_name.toLowerCase().includes(q) ||
      (apt.reason || '').toLowerCase().includes(q);
    const matchesRange = withinRange(apt.appointment_date, timeRange);
    return matchesSearch && matchesRange;
  });

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Previous Appointments</h1>

      {/* Search + Filter */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by patient name or reason..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-50 text-sm placeholder-slate-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>
          <div className="md:w-56 relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-slate-400 pointer-events-none" />
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none"
            >
              <option value="">All Time</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_3_months">Last 3 Months</option>
              <option value="last_6_months">Last 6 Months</option>
              <option value="this_year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        {loading && (
          <div className="flex items-center justify-center py-14 gap-3 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading appointments...</span>
          </div>
        )}

        {error && (
          <div className="m-6 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {['Patient', 'Date & Time', 'Duration', 'Reason', 'Status'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filtered.map(apt => {
                  const sc = statusConfig[apt.status] || statusConfig.cancelled;
                  return (
                    <tr key={apt.appointment_id} className="hover:bg-slate-50 transition-colors">

                      {/* Patient */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs flex-shrink-0">
                            {initials(apt.patient_name)}
                          </div>
                          <span className="text-sm font-medium text-slate-900">{apt.patient_name}</span>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center text-sm text-slate-800 gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {formatDate(apt.appointment_date)}
                          </span>
                          <span className="flex items-center text-xs text-slate-500 gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {formatTime(apt.appointment_time)}
                          </span>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {apt.duration_minutes} min
                        </span>
                      </td>

                      {/* Reason */}
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm text-slate-600 truncate" title={apt.reason || ''}>
                          {apt.reason || <span className="text-slate-400 italic">No reason provided</span>}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${sc.className}`}>
                          {sc.icon}{sc.label}
                        </span>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-14">
                <Calendar className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-700">No appointments found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your search or time filter.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviousAppointments;