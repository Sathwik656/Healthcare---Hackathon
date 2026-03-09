import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Star, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Doctors = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const doctors = [
    { id: 1, name: 'Dr. Sarah Jenkins', specialty: 'Dermatologist', rating: 4.8, location: 'City Center Clinic', availability: 'Mon, Wed, Fri' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Cardiologist', rating: 4.9, location: 'Heart Care Hospital', availability: 'Tue, Thu' },
    { id: 3, name: 'Dr. Emily White', specialty: 'General Physician', rating: 4.7, location: 'Family Health Center', availability: 'Mon-Fri' },
    { id: 4, name: 'Dr. Robert Brown', specialty: 'Pediatrician', rating: 4.9, location: 'Kids Care Clinic', availability: 'Mon, Wed, Sat' },
    { id: 5, name: 'Dr. Lisa Wong', specialty: 'Dermatologist', rating: 4.6, location: 'Skin & Beauty Clinic', availability: 'Tue, Thu, Sat' },
    { id: 6, name: 'Dr. James Smith', specialty: 'Orthopedist', rating: 4.8, location: 'Bone & Joint Center', availability: 'Mon, Wed, Fri' },
  ];

  const specialties = Array.from(new Set(doctors.map(d => d.specialty)));

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty ? doc.specialty === selectedSpecialty : true;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">{t('doctors')}</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder={t('find_doctor')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-slate-50 placeholder-slate-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
            />
          </div>

          {/* Filter */}
          <div className="md:w-64 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-slate-400" />
            </div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors appearance-none"
            >
              <option value="">All Specialties</option>
              {specialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Doctor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl border-2 border-white shadow-sm">
                    {doc.name.charAt(4)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-slate-900">{doc.name}</h3>
                    <p className="text-sm font-medium text-green-600">{doc.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="ml-1 text-sm font-bold text-yellow-700">{doc.rating}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                  {doc.location}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Clock className="w-4 h-4 mr-2 text-slate-400" />
                  {doc.availability}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <Link
                  to={`/patient/book?doctor=${doc.id}`}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm"
                >
                  {t('book_appointment')}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-lg">No doctors found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Doctors;
