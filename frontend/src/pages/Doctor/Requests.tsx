import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, Calendar, Clock, User } from 'lucide-react';

const DoctorRequests = () => {
  const { t } = useTranslation();

  const [requests, setRequests] = useState([
    { id: 1, patient: 'Alice Williams', date: '2023-11-01', time: '09:00 AM', reason: 'Annual Checkup' },
    { id: 2, patient: 'David Miller', date: '2023-11-02', time: '10:30 AM', reason: 'Fever and Cough' },
    { id: 3, patient: 'Sarah Davis', date: '2023-11-02', time: '02:00 PM', reason: 'Follow-up' },
  ]);

  const handleAccept = (id: number) => {
    setRequests(requests.filter(req => req.id !== id));
    // Mock API call to accept
  };

  const handleDecline = (id: number) => {
    setRequests(requests.filter(req => req.id !== id));
    // Mock API call to decline
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('pending_requests')}</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-amber-600" />
            Appointment Requests
          </h2>
        </div>
        
        <div className="divide-y divide-slate-200">
          {requests.map((req) => (
            <div key={req.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg flex-shrink-0">
                    {req.patient.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-slate-900">{req.patient}</h3>
                    <p className="text-sm text-slate-500 mt-1 flex items-center">
                      <User className="w-4 h-4 mr-1.5 text-slate-400" />
                      Reason: {req.reason}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-3">
                  <div className="flex items-center gap-4 text-sm font-medium text-slate-700 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5 text-green-500" />
                      {req.date}
                    </div>
                    <div className="w-px h-4 bg-slate-300"></div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1.5 text-green-500" />
                      {req.time}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <button
                      onClick={() => handleAccept(req.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecline(req.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm hover:text-red-600 hover:border-red-300"
                    >
                      <XCircle className="w-4 h-4 mr-1.5" />
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {requests.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">All caught up!</h3>
              <p className="mt-1 text-sm text-slate-500">
                You have no pending appointment requests.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorRequests;
