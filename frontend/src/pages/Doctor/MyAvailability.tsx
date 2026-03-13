import React, { useEffect, useState } from 'react';
import { Clock, Save, CheckCircle, Loader2, AlertCircle, Plus, Trash2, Eye } from 'lucide-react';
import api from '@/src/services/api';

// ── Types ─────────────────────────────────────────────────────────────────────
interface DaySlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration: number;
  enabled: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const DAYS = [
  { label: 'Sunday',    short: 'Sun', dow: 0 },
  { label: 'Monday',    short: 'Mon', dow: 1 },
  { label: 'Tuesday',   short: 'Tue', dow: 2 },
  { label: 'Wednesday', short: 'Wed', dow: 3 },
  { label: 'Thursday',  short: 'Thu', dow: 4 },
  { label: 'Friday',    short: 'Fri', dow: 5 },
  { label: 'Saturday',  short: 'Sat', dow: 6 },
];

const DURATIONS = [15, 20, 30, 45, 60];

const DEFAULT_SLOT: Omit<DaySlot, 'day_of_week'> = {
  start_time: '09:00',
  end_time: '17:00',
  slot_duration: 30,
  enabled: false,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const generatePreview = (start: string, end: string, duration: number): string[] => {
  const slots: string[] = [];
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let current = sh * 60 + sm;
  const endMins = eh * 60 + em;
  while (current + duration <= endMins) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    slots.push(`${(h % 12) || 12}:${String(m).padStart(2, '0')} ${ampm}`);
    current += duration;
  }
  return slots;
};

const fmt12 = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${(h % 12) || 12}:${String(m).padStart(2, '0')} ${ampm}`;
};

// ── Component ─────────────────────────────────────────────────────────────────
const SetAvailability = () => {
  const [schedule, setSchedule] = useState<DaySlot[]>(
    DAYS.map(d => ({ day_of_week: d.dow, ...DEFAULT_SLOT }))
  );

  const [loading, setLoading]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const [saved, setSaved]         = useState(false);
  const [previewDay, setPreviewDay] = useState<number | null>(null);

  // ── Fetch existing availability ─────────────────────────────────────────
  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const res = await api.get('/doctors/availability');
        const existing = res.data.data?.availability || [];
        if (existing.length > 0) {
          setSchedule(prev =>
            prev.map(day => {
              const found = existing.find((e: any) => e.day_of_week === day.day_of_week);
              return found
                ? { ...day, start_time: found.start_time.slice(0, 5), end_time: found.end_time.slice(0, 5), slot_duration: found.slot_duration, enabled: true }
                : day;
            })
          );
        }
      } catch { /* first time setup, no existing data */ }
      finally { setLoading(false); }
    };
    fetchAvailability();
  }, []);

  // ── Update a day's field ────────────────────────────────────────────────
  const updateDay = (dow: number, field: keyof DaySlot, value: any) => {
    setSchedule(prev =>
      prev.map(d => d.day_of_week === dow ? { ...d, [field]: value } : d)
    );
    setSaved(false);
  };

  // ── Toggle day enabled ──────────────────────────────────────────────────
  const toggleDay = (dow: number) => {
    setSchedule(prev =>
      prev.map(d => d.day_of_week === dow ? { ...d, enabled: !d.enabled } : d)
    );
    setSaved(false);
  };

  // ── Copy time from another day ──────────────────────────────────────────
  const copyFromDay = (sourceDow: number, targetDow: number) => {
    const source = schedule.find(d => d.day_of_week === sourceDow);
    if (!source) return;
    setSchedule(prev =>
      prev.map(d =>
        d.day_of_week === targetDow
          ? { ...d, start_time: source.start_time, end_time: source.end_time, slot_duration: source.slot_duration }
          : d
      )
    );
  };

  // ── Bulk actions ────────────────────────────────────────────────────────
  const enableWeekdays = () => {
    setSchedule(prev =>
      prev.map(d => d.day_of_week >= 1 && d.day_of_week <= 5 ? { ...d, enabled: true } : d)
    );
  };

  const clearAll = () => {
    setSchedule(DAYS.map(d => ({ day_of_week: d.dow, ...DEFAULT_SLOT })));
    setSaved(false);
  };

  // ── Save ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setError('');
    setSaving(true);

    // Validate enabled days
    for (const day of schedule.filter(d => d.enabled)) {
      if (day.start_time >= day.end_time) {
        setError(`${DAYS[day.day_of_week].label}: end time must be after start time.`);
        setSaving(false);
        return;
      }
      const preview = generatePreview(day.start_time, day.end_time, day.slot_duration);
      if (preview.length === 0) {
        setError(`${DAYS[day.day_of_week].label}: no slots fit in that time range with ${day.slot_duration}min duration.`);
        setSaving(false);
        return;
      }
    }

    const payload = {
      slots: schedule
        .filter(d => d.enabled)
        .map(d => ({
          day_of_week: d.day_of_week,
          start_time: d.start_time,
          end_time: d.end_time,
          slot_duration: d.slot_duration,
        })),
    };

    try {
      await api.post('/doctors/availability', payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save availability.');
    } finally {
      setSaving(false);
    }
  };

  // ── Preview slots for a day ─────────────────────────────────────────────
  const activeDay = previewDay !== null ? schedule.find(d => d.day_of_week === previewDay) : null;
  const previewSlots = activeDay
    ? generatePreview(activeDay.start_time, activeDay.end_time, activeDay.slot_duration)
    : [];

  const enabledCount = schedule.filter(d => d.enabled).length;

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Set Availability</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure which days and hours patients can book appointments with you.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={enableWeekdays}
            className="px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            Weekdays only
          </button>
          <button onClick={clearAll}
            className="px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            Clear all
          </button>
          <button
            onClick={handleSave}
            disabled={saving || enabledCount === 0}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm gap-2"
          >
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
              : saved
              ? <><CheckCircle className="w-4 h-4" />Saved!</>
              : <><Save className="w-4 h-4" />Save Schedule</>}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      {/* Summary bar */}
      {enabledCount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="w-4 h-4 flex-shrink-0 text-green-500" />
          <span>
            You're available on <strong>{enabledCount} day{enabledCount !== 1 ? 's' : ''}</strong> per week —{' '}
            {schedule.filter(d => d.enabled).map(d => DAYS[d.day_of_week].short).join(', ')}
          </span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading your schedule...</span>
        </div>
      ) : (

        <div className="grid grid-cols-1 gap-3">
          {DAYS.map(({ label, short, dow }) => {
            const day = schedule.find(d => d.day_of_week === dow)!;
            const slots = day.enabled ? generatePreview(day.start_time, day.end_time, day.slot_duration) : [];
            const isWeekend = dow === 0 || dow === 6;

            return (
              <div key={dow}
                className={`bg-white rounded-2xl border transition-all ${
                  day.enabled
                    ? 'border-green-200 shadow-sm'
                    : 'border-slate-200 opacity-75'
                }`}>
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                    {/* Day toggle */}
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <button
                        onClick={() => toggleDay(dow)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                          day.enabled ? 'bg-green-500' : 'bg-slate-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          day.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                      <div>
                        <p className={`text-sm font-semibold ${day.enabled ? 'text-slate-900' : 'text-slate-400'}`}>
                          {label}
                        </p>
                        {isWeekend && (
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Weekend</p>
                        )}
                      </div>
                    </div>

                    {/* Time + duration controls */}
                    {day.enabled ? (
                      <div className="flex flex-wrap items-center gap-3 flex-1">

                        {/* Start time */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">From</label>
                          <div className="relative">
                            <Clock className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                            <input
                              type="time"
                              value={day.start_time}
                              onChange={e => updateDay(dow, 'start_time', e.target.value)}
                              className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-green-500 focus:border-green-500 transition-colors"
                            />
                          </div>
                        </div>

                        {/* End time */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">To</label>
                          <div className="relative">
                            <Clock className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                            <input
                              type="time"
                              value={day.end_time}
                              onChange={e => updateDay(dow, 'end_time', e.target.value)}
                              className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-green-500 focus:border-green-500 transition-colors"
                            />
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Slot</label>
                          <select
                            value={day.slot_duration}
                            onChange={e => updateDay(dow, 'slot_duration', Number(e.target.value))}
                            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none bg-white"
                          >
                            {DURATIONS.map(d => (
                              <option key={d} value={d}>{d} min</option>
                            ))}
                          </select>
                        </div>

                        {/* Slot count + preview */}
                        <div className="flex items-end gap-2 pb-0.5">
                          {slots.length > 0 ? (
                            <span className="text-xs text-green-700 bg-green-100 border border-green-200 px-2.5 py-1 rounded-full font-medium">
                              {slots.length} slot{slots.length !== 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span className="text-xs text-red-500 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                              No slots fit
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setPreviewDay(previewDay === dow ? null : dow)}
                            className="text-xs text-slate-500 hover:text-green-600 flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {previewDay === dow ? 'Hide' : 'Preview'}
                          </button>
                        </div>

                        {/* Copy from previous enabled day */}
                        {schedule.some(d => d.enabled && d.day_of_week !== dow) && (
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Copy from</label>
                            <select
                              defaultValue=""
                              onChange={e => { if (e.target.value) copyFromDay(Number(e.target.value), dow); e.target.value = ''; }}
                              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none bg-slate-50"
                            >
                              <option value="" disabled>Copy from...</option>
                              {schedule.filter(d => d.enabled && d.day_of_week !== dow).map(d => (
                                <option key={d.day_of_week} value={d.day_of_week}>
                                  {DAYS[d.day_of_week].label}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic flex-1">Not available</p>
                    )}
                  </div>

                  {/* Slot preview */}
                  {previewDay === dow && day.enabled && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                        Preview — {slots.length} slots from {fmt12(day.start_time)} to {fmt12(day.end_time)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {slots.map(slot => (
                          <span key={slot}
                            className="px-3 py-1.5 rounded-xl border border-green-200 bg-green-50 text-green-700 text-xs font-medium">
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Save footer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-700">
            {enabledCount === 0
              ? 'No days selected — toggle days above to set your hours.'
              : `${enabledCount} working day${enabledCount !== 1 ? 's' : ''} configured.`}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Changes take effect immediately after saving.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || enabledCount === 0}
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm gap-2 flex-shrink-0"
        >
          {saving
            ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
            : saved
            ? <><CheckCircle className="w-4 h-4" />Saved!</>
            : <><Save className="w-4 h-4" />Save Schedule</>}
        </button>
      </div>

    </div>
  );
};

export default SetAvailability;