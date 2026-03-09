import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon, Clock, User, CheckCircle,
  Search, ChevronLeft, ChevronRight, Building2,
  Stethoscope, Star, Loader2, AlertCircle, FileText
} from 'lucide-react';
import api from '@/src/services/api';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Doctor {
  user_id: string;
  name: string;
  specialty_name: string;
  health_center_name: string;
  health_center_address: string;
  experience_years: number;
  avg_rating: number | null;
  review_count: string;
  status: string;
}

interface Slot {
  time: string;
  available: boolean;
  duration_minutes: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().split('T')[0];

const formatDisplayDate = (dateStr: string) =>
  new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

const formatTime = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${((h % 12) || 12)}:${String(m).padStart(2, '0')} ${ampm}`;
};

const addMinutes = (time: string, mins: number) => {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

const MONTH_NAMES = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];
const DAY_NAMES = ['Su','Mo','Tu','We','Th','Fr','Sa'];

// ── Main Component ────────────────────────────────────────────────────────────
const BookAppointment = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ── Step state ──────────────────────────────────────────────────────────
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // ── Step 1: Doctors ─────────────────────────────────────────────────────
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // ── Step 2: Date & Slots ────────────────────────────────────────────────
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [notes, setNotes] = useState('');

  // ── Step 3: Confirm ─────────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [appointmentRef, setAppointmentRef] = useState('');

  // ── Fetch doctors ───────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoadingDoctors(true);
      try {
        const res = await api.get('/doctors');
        const all: Doctor[] = res.data.data.doctors || [];
        setDoctors(all.filter(d => d.status === 'active'));

        // Pre-select if ?doctor= param present
        const paramId = searchParams.get('doctor');
        if (paramId) {
          const found = all.find(d => d.user_id === paramId);
          if (found) { setSelectedDoctor(found); setStep(2); }
        }
      } catch { /* silent */ }
      finally { setLoadingDoctors(false); }
    };
    load();
  }, []);

  // ── Fetch slots ─────────────────────────────────────────────────────────
  const fetchSlots = useCallback(async (date: string) => {
    if (!selectedDoctor) return;
    setLoadingSlots(true);
    setSlots([]);
    setSelectedSlot(null);
    try {
      const res = await api.get(`/doctors/${selectedDoctor.user_id}/slots?date=${date}`);
      setSlots(res.data.data.slots || []);
    } catch { setSlots([]); }
    finally { setLoadingSlots(false); }
  }, [selectedDoctor]);

  const handleDateClick = (dateStr: string) => {
    if (dateStr < todayStr()) return;
    setSelectedDate(dateStr);
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

  // ── Submit appointment ──────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await api.post('/appointments', {
        doctor_id: selectedDoctor.user_id,
        appointment_date: selectedDate,
        appointment_time: selectedSlot.time,
        notes: notes || undefined,
      });
      setAppointmentRef(res.data.data?.appointment_id || '');
      setConfirmed(true);
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Filtered doctors ────────────────────────────────────────────────────
  const filteredDoctors = doctors.filter(d =>
    d.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    (d.specialty_name || '').toLowerCase().includes(doctorSearch.toLowerCase()) ||
    (d.health_center_name || '').toLowerCase().includes(doctorSearch.toLowerCase())
  );

  // ── Success screen ──────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Appointment Confirmed!</h2>
          <p className="text-slate-500 mb-8 text-sm">
            You'll receive a confirmation shortly. Please arrive 10 minutes early.
          </p>

          <div className="bg-slate-50 rounded-xl p-6 text-left mb-8 border border-slate-100 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Doctor</p>
                <p className="font-semibold text-slate-900 text-sm">{selectedDoctor?.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Specialty</p>
                <p className="font-semibold text-slate-900 text-sm">{selectedDoctor?.specialty_name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Date</p>
                <p className="font-semibold text-slate-900 text-sm">{formatDisplayDate(selectedDate)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Time</p>
                <p className="font-semibold text-slate-900 text-sm">
                  {formatTime(selectedSlot!.time)} — {formatTime(addMinutes(selectedSlot!.time, selectedSlot!.duration_minutes))}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{selectedSlot?.duration_minutes} mins</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Location</p>
                <p className="font-semibold text-slate-900 text-sm">{selectedDoctor?.health_center_name}</p>
                <p className="text-xs text-slate-400">{selectedDoctor?.health_center_address}</p>
              </div>
              {appointmentRef && (
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Reference</p>
                  <p className="font-mono text-xs text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded">{appointmentRef}</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate('/patient/appointments')}
            className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm"
          >
            View My Appointments
          </button>
        </div>
      </div>
    );
  }

  // ── Step indicators ─────────────────────────────────────────────────────
  const steps = [
    { n: 1, label: 'Choose Doctor' },
    { n: 2, label: 'Pick Date & Time' },
    { n: 3, label: 'Confirm' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <h1 className="text-2xl font-bold text-slate-900">{t('book_appointment')}</h1>

      {/* Step Progress */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <React.Fragment key={s.n}>
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step > s.n ? 'bg-green-600 text-white'
                : step === s.n ? 'bg-green-600 text-white ring-4 ring-green-100'
                : 'bg-slate-100 text-slate-400'
              }`}>
                {step > s.n ? <CheckCircle className="w-4 h-4" /> : s.n}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step === s.n ? 'text-slate-900' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px transition-all ${step > s.n ? 'bg-green-400' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── STEP 1: Doctor Selection ── */}
      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-green-600" />
              <h2 className="text-base font-semibold text-slate-800">Select a Doctor</h2>
            </div>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, specialty, clinic..."
                value={doctorSearch}
                onChange={e => setDoctorSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          <div className="p-6">
            {loadingDoctors ? (
              <div className="flex items-center justify-center py-12 gap-3 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading doctors...</span>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">No doctors found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredDoctors.map(doc => (
                  <div
                    key={doc.user_id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      selectedDoctor?.user_id === doc.user_id
                        ? 'border-green-500 ring-2 ring-green-100 bg-green-50'
                        : 'border-slate-200 hover:border-green-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-11 w-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        selectedDoctor?.user_id === doc.user_id ? 'bg-green-200 text-green-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {doc.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 text-sm truncate">{doc.name}</p>
                        <p className="text-xs text-green-700 font-medium flex items-center gap-1 mt-0.5">
                          <Stethoscope className="w-3 h-3" />{doc.specialty_name}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                          <Building2 className="w-3 h-3 flex-shrink-0" />{doc.health_center_name}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          {doc.avg_rating && (
                            <span className="text-xs flex items-center gap-1 text-amber-600 font-medium">
                              <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                              {Number(doc.avg_rating).toFixed(1)}
                              <span className="text-slate-400 font-normal">({doc.review_count})</span>
                            </span>
                          )}
                          {doc.experience_years > 0 && (
                            <span className="text-xs text-slate-400">{doc.experience_years} yrs exp.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-6 pb-6">
            <button
              disabled={!selectedDoctor}
              onClick={() => setStep(2)}
              className="w-full py-3 text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Date & Time ── */}
      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

          {/* Selected doctor recap */}
          <div className="p-4 bg-green-50 border-b border-green-100 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-green-200 flex items-center justify-center text-green-800 text-xs font-bold flex-shrink-0">
              {selectedDoctor?.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">{selectedDoctor?.name}</p>
              <p className="text-xs text-green-700">{selectedDoctor?.specialty_name} · {selectedDoctor?.health_center_name}</p>
            </div>
            <button onClick={() => { setStep(1); setSelectedDate(''); setSlots([]); setSelectedSlot(null); }}
              className="text-xs text-slate-500 hover:text-green-700 font-medium transition-colors">
              Change
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Calendar */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-green-600" />
                <h2 className="text-base font-semibold text-slate-800">Pick a Date</h2>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-w-sm">
                {/* Month nav */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <button onClick={goPrev} className="p-1 rounded-lg hover:bg-slate-200 transition-colors">
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                  </button>
                  <span className="text-sm font-semibold text-slate-800">
                    {MONTH_NAMES[calMonth]} {calYear}
                  </span>
                  <button onClick={goNext} className="p-1 rounded-lg hover:bg-slate-200 transition-colors">
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
                  {DAY_NAMES.map(d => (
                    <div key={d} className="text-center text-xs font-medium text-slate-400 py-2">{d}</div>
                  ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 p-2 gap-1">
                  {/* Prev month filler */}
                  {Array.from({ length: firstDow }).map((_, i) => (
                    <div key={`prev-${i}`} className="h-9 flex items-center justify-center text-xs text-slate-300">
                      {prevMonthDays - firstDow + 1 + i}
                    </div>
                  ))}
                  {/* Current month days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isPast = dateStr < todayStr();
                    const isSelected = dateStr === selectedDate;
                    const isToday = dateStr === todayStr();
                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={isPast}
                        onClick={() => handleDateClick(dateStr)}
                        className={`h-9 w-full rounded-lg text-xs font-medium transition-all ${
                          isSelected ? 'bg-green-600 text-white shadow-sm'
                          : isToday ? 'border border-green-400 text-green-700 hover:bg-green-50'
                          : isPast ? 'text-slate-300 cursor-not-allowed'
                          : 'text-slate-700 hover:bg-green-50 hover:text-green-700'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  {formatDisplayDate(selectedDate)}
                </p>
              )}
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-green-600" />
                  <h2 className="text-base font-semibold text-slate-800">Available Time Slots</h2>
                </div>

                {loadingSlots ? (
                  <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading slots...
                  </div>
                ) : slots.length === 0 ? (
                  <div className="flex items-center gap-2 text-slate-400 text-sm py-4 bg-slate-50 rounded-xl px-4">
                    <AlertCircle className="w-4 h-4" /> No available slots for this date.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {slots.map((slot, idx) => {
                      const endTime = addMinutes(slot.time, slot.duration_minutes);
                      const isSelected = selectedSlot?.time === slot.time;
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-3 px-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-0.5 ${
                            !slot.available
                              ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-green-600 border-green-600 text-white shadow-md'
                              : 'border-slate-200 text-slate-700 hover:border-green-400 hover:bg-green-50'
                          }`}
                        >
                          <span className="font-semibold">{formatTime(slot.time)}</span>
                          <span className={`text-xs ${isSelected ? 'text-green-100' : 'text-slate-400'}`}>
                            → {formatTime(endTime)}
                          </span>
                          <span className={`text-[10px] uppercase tracking-wide ${isSelected ? 'text-green-200' : 'text-slate-400'}`}>
                            {slot.duration_minutes} min
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {selectedSlot && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <label className="text-sm font-medium text-slate-700">Notes <span className="text-slate-400 font-normal">(optional)</span></label>
                </div>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Describe your symptoms or reason for visit..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                />
              </div>
            )}
          </div>

          {/* Footer buttons */}
          <div className="px-6 pb-6 flex gap-3">
            <button onClick={() => setStep(1)}
              className="flex-1 py-3 text-sm font-medium rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
              ← Back
            </button>
            <button
              disabled={!selectedDate || !selectedSlot}
              onClick={() => setStep(3)}
              className="flex-1 py-3 text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Review →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Review & Confirm ── */}
      {step === 3 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-base font-semibold text-slate-800">Review & Confirm</h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100">
              {[
                { label: 'Doctor', value: selectedDoctor?.name },
                { label: 'Specialty', value: selectedDoctor?.specialty_name },
                { label: 'Location', value: `${selectedDoctor?.health_center_name} · ${selectedDoctor?.health_center_address}` },
                { label: 'Date', value: formatDisplayDate(selectedDate) },
                {
                  label: 'Time',
                  value: selectedSlot
                    ? `${formatTime(selectedSlot.time)} – ${formatTime(addMinutes(selectedSlot.time, selectedSlot.duration_minutes))} (${selectedSlot.duration_minutes} min)`
                    : ''
                },
                ...(notes ? [{ label: 'Notes', value: notes }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-4 px-4 py-3">
                  <span className="text-xs text-slate-400 uppercase tracking-wider w-20 flex-shrink-0 pt-0.5">{label}</span>
                  <span className="text-sm text-slate-800 font-medium">{value}</span>
                </div>
              ))}
            </div>

            {submitError && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {submitError}
              </div>
            )}
          </div>

          <div className="px-6 pb-6 flex gap-3">
            <button onClick={() => { setStep(2); setSubmitError(''); }}
              className="flex-1 py-3 text-sm font-medium rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
              ← Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="flex-1 py-3 text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : 'Confirm Appointment'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookAppointment;