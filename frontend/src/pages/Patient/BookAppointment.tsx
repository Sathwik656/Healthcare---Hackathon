import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, User, CheckCircle } from 'lucide-react';

interface TimeSlot {
  startTime: string;
  endTime: string;
  duration: number;
}

const BookAppointment = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const doctorId = searchParams.get('doctor');

  const [selectedDoctor, setSelectedDoctor] = useState(doctorId || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Mock data
  const doctors = [
    { id: '1', name: 'Dr. Sarah Jenkins', specialty: 'Dermatologist' },
    { id: '2', name: 'Dr. Michael Chen', specialty: 'Cardiologist' },
    { id: '3', name: 'Dr. Emily White', specialty: 'General Physician' },
  ];

  const timeSlots: TimeSlot[] = [
    { startTime: '09:00 AM', endTime: '09:30 AM', duration: 30 },
    { startTime: '09:30 AM', endTime: '10:00 AM', duration: 30 },
    { startTime: '10:00 AM', endTime: '10:30 AM', duration: 30 },
    { startTime: '10:30 AM', endTime: '11:00 AM', duration: 30 },
    { startTime: '11:00 AM', endTime: '11:30 AM', duration: 30 },
    { startTime: '11:30 AM', endTime: '12:00 PM', duration: 30 },
    { startTime: '02:00 PM', endTime: '02:30 PM', duration: 30 },
    { startTime: '02:30 PM', endTime: '03:00 PM', duration: 30 },
    { startTime: '03:00 PM', endTime: '03:30 PM', duration: 30 },
    { startTime: '03:30 PM', endTime: '04:00 PM', duration: 30 },
    { startTime: '04:00 PM', endTime: '04:30 PM', duration: 30 },
    { startTime: '04:30 PM', endTime: '05:00 PM', duration: 30 },
  ];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedTime) return;
    
    // Mock API call
    setTimeout(() => {
      setIsConfirmed(true);
    }, 1000);
  };

  if (isConfirmed) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Appointment Confirmed!</h2>
          <p className="text-slate-600 mb-8">
            Your appointment has been successfully booked. You will receive a confirmation email shortly.
          </p>
          <div className="bg-slate-50 rounded-xl p-6 text-left mb-8 border border-slate-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Doctor</p>
                <p className="font-medium text-slate-900">{doctors.find(d => d.id === selectedDoctor)?.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Specialty</p>
                <p className="font-medium text-slate-900">{doctors.find(d => d.id === selectedDoctor)?.specialty}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Date</p>
                <p className="font-medium text-slate-900">{selectedDate}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Time</p>
                <p className="font-medium text-slate-900">{selectedTime?.startTime} - {selectedTime?.endTime}</p>
                <p className="text-xs text-slate-500 mt-0.5">({selectedTime?.duration} mins)</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/patient/appointments')}
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm"
          >
            View My Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('book_appointment')}</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleBooking} className="p-8 space-y-8">
          {/* Doctor Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center border-b border-slate-100 pb-2">
              <User className="w-5 h-5 mr-2 text-green-600" />
              1. Select Doctor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    selectedDoctor === doc.id
                      ? 'border-green-500 ring-2 ring-green-200 bg-green-50'
                      : 'border-slate-200 hover:border-green-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                      selectedDoctor === doc.id ? 'bg-green-200 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {doc.name.charAt(4)}
                    </div>
                    <div className="ml-3">
                      <p className={`font-medium ${selectedDoctor === doc.id ? 'text-green-900' : 'text-slate-900'}`}>
                        {doc.name}
                      </p>
                      <p className={`text-sm ${selectedDoctor === doc.id ? 'text-green-700' : 'text-slate-500'}`}>
                        {doc.specialty}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center border-b border-slate-100 pb-2">
              <CalendarIcon className="w-5 h-5 mr-2 text-green-600" />
              2. Select Date
            </h2>
            <div>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="block w-full max-w-md pl-3 pr-10 py-3 text-base border-slate-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-xl border bg-slate-50"
              />
            </div>
          </div>

          {/* Time Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center border-b border-slate-100 pb-2">
              <Clock className="w-5 h-5 mr-2 text-green-600" />
              3. Select Time Slot
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={`py-3 px-3 text-sm font-medium rounded-xl border transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedTime?.startTime === slot.startTime
                      ? 'bg-green-600 border-green-600 text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-green-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="block font-semibold">{slot.startTime}</span>
                  <span className={`text-xs ${selectedTime?.startTime === slot.startTime ? 'text-green-100' : 'text-slate-500'}`}>
                    to {slot.endTime}
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider ${selectedTime?.startTime === slot.startTime ? 'text-green-200' : 'text-slate-400'}`}>
                    {slot.duration} mins
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button
              type="submit"
              disabled={!selectedDoctor || !selectedDate || !selectedTime}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
