import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, XCircle, Edit2, CheckCircle2, X } from 'lucide-react';

const MyAppointments = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const [appointments, setAppointments] = useState([
    { id: 1, doctor: 'Dr. Sarah Jenkins', specialty: 'Dermatologist', date: '2023-10-25', time: '10:00 AM', status: 'upcoming', location: 'City Center Clinic' },
    { id: 2, doctor: 'Dr. Michael Chen', specialty: 'Cardiologist', date: '2023-10-28', time: '02:30 PM', status: 'upcoming', location: 'Heart Care Hospital' },
    { id: 3, doctor: 'Dr. Emily White', specialty: 'General Physician', date: '2023-09-15', time: '11:00 AM', status: 'completed', location: 'Family Health Center' },
    { id: 4, doctor: 'Dr. Robert Brown', specialty: 'Pediatrician', date: '2023-08-20', time: '09:15 AM', status: 'cancelled', location: 'Kids Care Clinic' },
  ]);

  const filteredAppointments = appointments.filter(apt => 
    activeTab === 'upcoming' ? apt.status === 'upcoming' : apt.status !== 'upcoming'
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const openEditModal = (apt: any) => {
    setSelectedAppointment(apt);
    setNewDate(apt.date);
    setNewTime(apt.time);
    setIsEditModalOpen(true);
  };

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAppointment) {
      try {
        // Simulate a PUT/PATCH request to update the record
        // await fetch(`/api/appointments/${selectedAppointment.id}`, {
        //   method: 'PATCH',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ date: newDate, time: newTime })
        // });
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        setAppointments(appointments.map(apt => 
          apt.id === selectedAppointment.id 
            ? { ...apt, date: newDate, time: newTime } 
            : apt
        ));
        setIsEditModalOpen(false);
        setSelectedAppointment(null);
      } catch (error) {
        console.error('Failed to reschedule appointment:', error);
      }
    }
  };

  const handleCancel = (id: number) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: 'cancelled' } : apt
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">{t('my_appointments')}</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'upcoming'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'past'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Past
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {filteredAppointments.map((apt) => (
              <div key={apt.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg flex-shrink-0">
                      {apt.doctor.charAt(4)}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-slate-900">{apt.doctor}</h3>
                      <p className="text-sm text-slate-500">{apt.specialty}</p>
                      <div className="mt-2 flex items-center text-sm text-slate-600">
                        <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                        {apt.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-2">
                    <div className="flex items-center gap-4 text-sm font-medium text-slate-700 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5 text-green-500" />
                        {apt.date}
                      </div>
                      <div className="w-px h-4 bg-slate-300"></div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1.5 text-green-500" />
                        {apt.time}
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusColor(apt.status)}`}>
                      {apt.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {apt.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                      {apt.status}
                    </span>
                  </div>
                </div>

                {activeTab === 'upcoming' && (
                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button 
                      onClick={() => openEditModal(apt)}
                      className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      <Edit2 className="w-4 h-4 mr-2 text-slate-400" />
                      Reschedule
                    </button>
                    <button 
                      onClick={() => handleCancel(apt.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}

            {filteredAppointments.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-2 text-sm font-medium text-slate-900">No appointments</h3>
                <p className="mt-1 text-sm text-slate-500">
                  You don't have any {activeTab} appointments.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {isEditModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Reschedule Appointment</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-500 transition-colors p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleReschedule} className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                <p className="text-sm font-medium text-slate-900">{selectedAppointment.doctor}</p>
                <p className="text-xs text-slate-500 mt-1">{selectedAppointment.specialty}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Confirm Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
