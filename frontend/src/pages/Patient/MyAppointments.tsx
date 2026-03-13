import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, XCircle, Edit2,
  CheckCircle2, X, Loader2, AlertCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '@/src/services/api';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Appointment {
  appointment_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  reason: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  doctor_name: string;
  specialty_name: string;
  health_center_name: string;
}

interface Slot {
  time: string;
  available: boolean;
  duration_minutes: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().split('T')[0];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });

const formatTime = (t: string) => {
  const [h, m] = t.replace(/\..*/, '').split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${(h % 12) || 12}:${String(m).padStart(2, '0')} ${ampm}`;
};

const isUpcoming = (status: string) => ['pending', 'confirmed'].includes(status);

const MONTH_NAMES = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];
const DAY_NAMES = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const statusStyle: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  completed: 'bg-slate-100 text-slate-600 border-slate-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

// ── Component ─────────────────────────────────────────────────────────────────
const MyAppointments = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Reschedule modal
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState<Slot | null>(null);
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState('');

  // Calendar state for reschedule modal
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  // Cancel confirm
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // ── Fetch appointments ──────────────────────────────────────────────────
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/appointments/patient');
      setAppointments(res.data.data.appointments || []);
    } catch {
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  // ── Fetch slots for reschedule ──────────────────────────────────────────
  const fetchSlots = useCallback(async (date: string) => {
    if (!selected) return;
    setLoadingSlots(true);
    setSlots([]);
    setNewSlot(null);
    try {
      const res = await api.get(`/doctors/${selected.doctor_id}/slots?date=${date}`);
      setSlots(res.data.data.slots || []);
    } catch { setSlots([]); }
    finally { setLoadingSlots(false); }
  }, [selected]);

  const handleDateClick = (dateStr: string) => {
    if (dateStr < todayStr()) return;
    setNewDate(dateStr);
    fetchSlots(dateStr);
  };

  // ── Calendar helpers ────────────────────────────────────────────────────
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDow = new Date(calYear, calMonth, 1).getDay();
  const prevMonthDays = new Date(calYear, calMonth, 0).getDate();

  const goPrev = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const goNext = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  // ── Open reschedule modal ───────────────────────────────────────────────
  const openReschedule = (apt: Appointment) => {
    setSelected(apt);
    const existingDate = apt.appointment_date.split('T')[0];
    setNewDate(existingDate);
    setNewSlot(null);
    setSlots([]);
    setRescheduleError('');
    const d = new Date(apt.appointment_date);
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth());
    setIsRescheduleOpen(true);
    fetchSlots(existingDate);
  };

  // ── Submit reschedule ───────────────────────────────────────────────────
  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !newDate || !newSlot) return;
    setRescheduling(true);
    setRescheduleError('');
    try {
      await api.patch(`/appointments/${selected.appointment_id}`, {
        date: newDate,
        time: newSlot.time,
      });
      setIsRescheduleOpen(false);
      fetchAppointments();
    } catch (err: any) {
      setRescheduleError(err.response?.data?.message || 'Failed to reschedule.');
    } finally {
      setRescheduling(false);
    }
  };

  // ── Cancel appointment ──────────────────────────────────────────────────
  const handleCancel = async () => {
    if (!cancelId) return;
    setCancelling(true);
    try {
      await api.put(`/appointments/${cancelId}/cancel`);
      setCancelId(null);
      fetchAppointments();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel.');
    } finally {
      setCancelling(false);
    }
  };

  // ── Filter ──────────────────────────────────────────────────────────────
  const filtered = appointments.filter(a =>
    activeTab === 'upcoming' ? isUpcoming(a.status) : !isUpcoming(a.status)
  );

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">{t('my_appointments')}</h1>
        <button
          onClick={() => navigate('/patient/book')}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors"
        >
          + Book New
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex">
            {(['upcoming', 'past'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`w-1/2 py-4 text-sm font-medium border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}>
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12 gap-3 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading appointments...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4" />{error}
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {filtered.map(apt => (
                <div key={apt.appointment_id}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    {/* Doctor info */}
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0">
                        {apt.doctor_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{apt.doctor_name}</h3>
                        <p className="text-sm text-slate-500">{apt.specialty_name}</p>
                        <div className="mt-1.5 flex items-center text-xs text-slate-500 gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {apt.health_center_name}
                        </div>
                      </div>
                    </div>

                    {/* Date/time + status */}
                    <div className="flex flex-col md:items-end gap-2">
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-green-500" />
                          {formatDate(apt.appointment_date)}
                        </span>
                        <span className="w-px h-4 bg-slate-300 block" />
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-green-500" />
                          {formatTime(apt.appointment_time)}
                          <span className="text-slate-400 font-normal text-xs">· {apt.duration_minutes}m</span>
                        </span>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${statusStyle[apt.status] || statusStyle.cancelled}`}>
                        {apt.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                        {apt.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                        {apt.status}
                      </span>
                    </div>
                  </div>

                  {/* Reason */}
                  {apt.reason && (
                    <p className="mt-3 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                      <span className="font-medium text-slate-600">Note: </span>{apt.reason}
                    </p>
                  )}

                  {/* Actions for upcoming */}
                  {isUpcoming(apt.status) && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-3">
                      <button onClick={() => openReschedule(apt)}
                        className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                        <Edit2 className="w-4 h-4 mr-2 text-slate-400" />
                        Reschedule
                      </button>
                      <button onClick={() => setCancelId(apt.appointment_id)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors">
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="text-center py-14">
                  <Calendar className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                  <p className="text-sm font-medium text-slate-700">No {activeTab} appointments</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {activeTab === 'upcoming' ? 'Book one to get started.' : 'Your past appointments will appear here.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Reschedule Modal ───────────────────────────────────────────────── */}
      {isRescheduleOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
              <h3 className="text-base font-semibold text-slate-900">Reschedule Appointment</h3>
              <button onClick={() => setIsRescheduleOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReschedule} className="p-6 space-y-5 overflow-y-auto">

              {/* Doctor recap */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">{selected.doctor_name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{selected.specialty_name} · {selected.health_center_name}</p>
              </div>

              {/* Calendar */}
              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">Select New Date</p>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                    <button type="button" onClick={goPrev} className="p-1 rounded-lg hover:bg-slate-200 transition-colors">
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <span className="text-sm font-semibold text-slate-800">
                      {MONTH_NAMES[calMonth]} {calYear}
                    </span>
                    <button type="button" onClick={goNext} className="p-1 rounded-lg hover:bg-slate-200 transition-colors">
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
                    {DAY_NAMES.map(d => (
                      <div key={d} className="text-center text-xs font-medium text-slate-400 py-2">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 p-2 gap-1">
                    {Array.from({ length: firstDow }).map((_, i) => (
                      <div key={`p${i}`} className="h-8 flex items-center justify-center text-xs text-slate-300">
                        {prevMonthDays - firstDow + 1 + i}
                      </div>
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const isPast = dateStr < todayStr();
                      const isSelected = dateStr === newDate;
                      const isToday = dateStr === todayStr();
                      return (
                        <button key={day} type="button" disabled={isPast}
                          onClick={() => handleDateClick(dateStr)}
                          className={`h-8 w-full rounded-lg text-xs font-medium transition-all ${
                            isSelected ? 'bg-green-600 text-white'
                            : isToday ? 'border border-green-400 text-green-700 hover:bg-green-50'
                            : isPast ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-700 hover:bg-green-50'
                          }`}>
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Slots */}
              {newDate && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Available Slots
                    <span className="text-slate-400 font-normal ml-1 text-xs">
                      {new Date(newDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </span>
                  </p>
                  {loadingSlots ? (
                    <div className="flex items-center gap-2 text-slate-400 text-sm py-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="text-sm text-slate-400 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> No slots available for this date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {slots.map((slot, idx) => (
                        <button key={idx} type="button" disabled={!slot.available}
                          onClick={() => setNewSlot(slot)}
                          className={`py-2.5 px-2 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-0.5 ${
                            !slot.available
                              ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                              : newSlot?.time === slot.time
                              ? 'bg-green-600 border-green-600 text-white shadow-sm'
                              : 'border-slate-200 text-slate-700 hover:border-green-400 hover:bg-green-50'
                          }`}>
                          <span className="font-semibold">{formatTime(slot.time)}</span>
                          <span className={`text-[10px] ${newSlot?.time === slot.time ? 'text-green-200' : 'text-slate-400'}`}>
                            {slot.duration_minutes}m
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {rescheduleError && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{rescheduleError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsRescheduleOpen(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={!newDate || !newSlot || rescheduling}
                  className="flex-1 py-2.5 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {rescheduling ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : 'Confirm Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Cancel Confirm Dialog ──────────────────────────────────────────── */}
      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">Cancel Appointment?</h3>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setCancelId(null)}
                className="flex-1 py-2.5 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                Keep It
              </button>
              <button onClick={handleCancel} disabled={cancelling}
                className="flex-1 py-2.5 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                {cancelling ? <><Loader2 className="w-4 h-4 animate-spin" />Cancelling...</> : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyAppointments;