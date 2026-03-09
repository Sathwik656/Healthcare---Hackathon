import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, User, ArrowRight, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import AIAssistant from '../../components/AIAssistant/AIAssistant';

const PatientDashboard = () => {
  const { t } = useTranslation();

  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Sarah Jenkins', specialty: 'Dermatologist', date: '2023-10-25', time: '10:00 AM' },
    { id: 2, doctor: 'Dr. Michael Chen', specialty: 'Cardiologist', date: '2023-10-28', time: '02:30 PM' },
  ];

  const recommendedDoctors = [
    { id: 1, name: 'Dr. Emily White', specialty: 'General Physician', rating: 4.8 },
    { id: 2, name: 'Dr. Robert Brown', specialty: 'Pediatrician', rating: 4.9 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">{t('dashboard')}</h1>
        <Link 
          to="/patient/book" 
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center"
        >
          <Calendar className="w-4 h-4 mr-2" />
          {t('book_appointment')}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                Upcoming Appointments
              </h2>
              <Link to="/patient/appointments" className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">
                      {apt.doctor.charAt(4)}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-semibold text-slate-900">{apt.doctor}</h3>
                      <p className="text-xs text-slate-500">{apt.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-slate-700 font-medium">
                      <Calendar className="w-4 h-4 mr-1.5 text-slate-400" />
                      {apt.date}
                    </div>
                    <div className="flex items-center text-sm text-slate-500 mt-1">
                      <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
                      {apt.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Doctors */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
                Recommended Doctors
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
              {recommendedDoctors.map((doc) => (
                <div key={doc.id} className="border border-slate-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                      {doc.name.charAt(4)}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-semibold text-slate-900">{doc.name}</h3>
                      <p className="text-xs text-slate-500">{doc.specialty}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center">
                      ★ {doc.rating}
                    </span>
                    <Link to="/patient/book" className="text-xs font-medium text-green-600 hover:text-green-700">
                      Book →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AIAssistant />

          {/* Notifications Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-green-600" />
                Recent Notifications
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="p-4 hover:bg-slate-50 transition-colors">
                <p className="text-sm text-slate-800 font-medium">Appointment Confirmed</p>
                <p className="text-xs text-slate-500 mt-1">Your appointment with Dr. Sarah Jenkins is confirmed for Oct 25.</p>
                <span className="text-xs text-slate-400 mt-2 block">2 hours ago</span>
              </div>
              <div className="p-4 hover:bg-slate-50 transition-colors">
                <p className="text-sm text-slate-800 font-medium">Profile Updated</p>
                <p className="text-xs text-slate-500 mt-1">Your profile information was successfully updated.</p>
                <span className="text-xs text-slate-400 mt-2 block">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
