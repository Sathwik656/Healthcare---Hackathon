import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Calendar, CheckCircle, Clock } from 'lucide-react';

const DoctorDashboard = () => {
  const { t } = useTranslation();

  const stats = [
    { name: 'Pending Requests', value: '5', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Today\'s Appointments', value: '8', icon: Calendar, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Completed Today', value: '3', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Total Patients', value: '142', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  const todaysSchedule = [
    { id: 1, patient: 'John Doe', time: '09:00 AM', type: 'General Checkup', status: 'completed' },
    { id: 2, patient: 'Jane Smith', time: '10:30 AM', type: 'Follow-up', status: 'completed' },
    { id: 3, patient: 'Robert Johnson', time: '01:00 PM', type: 'Consultation', status: 'upcoming' },
    { id: 4, patient: 'Emily Davis', time: '03:30 PM', type: 'General Checkup', status: 'upcoming' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('dashboard')}</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="bg-white overflow-hidden rounded-2xl shadow-sm border border-slate-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${item.bg}`}>
                      <Icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-slate-500 truncate">{item.name}</dt>
                      <dd>
                        <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-600" />
            Today's Schedule
          </h2>
        </div>
        <div className="divide-y divide-slate-200">
          {todaysSchedule.map((apt) => (
            <div key={apt.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">
                  {apt.patient.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-semibold text-slate-900">{apt.patient}</h3>
                  <p className="text-xs text-slate-500">{apt.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="flex items-center text-sm font-medium text-slate-900">
                    <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
                    {apt.time}
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                  apt.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800'
                }`}>
                  {apt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
