import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Star, MapPin, Briefcase, Stethoscope, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/src/services/api';

interface Doctor {
  user_id: string;
  name: string;
  specialty_name: string;
  health_center_name: string;
  health_center_address: string;
  experience_years: number;
  bio: string | null;
  avg_rating: number | null;
  review_count: string;
  status: string;
}

const Doctors = () => {
  const { t } = useTranslation();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  // ── Fetch ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/doctors');
        const all: Doctor[] = res.data.data.doctors || [];
        setDoctors(all.filter(d => d.status === 'active'));
      } catch {
        setError('Failed to load doctors. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // ── Derived ─────────────────────────────────────────────────────────────
  const specialties = Array.from(new Set(doctors.map(d => d.specialty_name).filter(Boolean)));

  const filtered = doctors.filter(doc => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      doc.name.toLowerCase().includes(q) ||
      (doc.specialty_name || '').toLowerCase().includes(q) ||
      (doc.health_center_name || '').toLowerCase().includes(q);
    const matchesSpecialty = selectedSpecialty ? doc.specialty_name === selectedSpecialty : true;
    return matchesSearch && matchesSpecialty;
  });

  const initials = (name: string) =>
    name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-slate-900">{t('doctors')}</h1>

      {/* Search + Filter */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder={t('find_doctor') || 'Search by name, specialty, clinic...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-50 text-sm placeholder-slate-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>
          <div className="md:w-64 relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-slate-400 pointer-events-none" />
            <select
              value={selectedSpecialty}
              onChange={e => setSelectedSpecialty(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none"
            >
              <option value="">All Specialties</option>
              {specialties.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading doctors...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(doc => (
              <div key={doc.user_id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="p-6 flex-1 flex flex-col">

                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg border-2 border-white shadow-sm flex-shrink-0">
                        {initials(doc.name)}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 leading-tight">{doc.name}</h3>
                        <p className="text-sm font-medium text-green-600 mt-0.5 flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5" />
                          {doc.specialty_name || '—'}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-bold flex-shrink-0 ${
                      doc.avg_rating
                        ? 'bg-yellow-50 border-yellow-100 text-yellow-700'
                        : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}>
                      <Star className={`w-3.5 h-3.5 ${doc.avg_rating ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-slate-300'}`} />
                      {doc.avg_rating ? Number(doc.avg_rating).toFixed(1) : 'New'}
                      {doc.avg_rating && (
                        <span className="font-normal text-yellow-600 text-[10px]">({doc.review_count})</span>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {doc.bio && (
                    <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">{doc.bio}</p>
                  )}

                  {/* Details */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">{doc.health_center_name}</span>
                        {doc.health_center_address && (
                          <span className="text-slate-400 text-xs ml-1">· {doc.health_center_address}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      {doc.experience_years > 0
                        ? `${doc.experience_years} year${doc.experience_years !== 1 ? 's' : ''} experience`
                        : <span className="text-slate-400">Experience not listed</span>}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link
                      to={`/patient/book?doctor=${doc.user_id}`}
                      className="w-full flex justify-center items-center px-4 py-2.5 text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm"
                    >
                      {t('book_appointment')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-14 bg-white rounded-2xl border border-slate-200">
              <Stethoscope className="mx-auto w-10 h-10 text-slate-300 mb-3" />
              <p className="text-slate-600 font-medium text-sm">No doctors found</p>
              <p className="text-slate-400 text-xs mt-1">Try adjusting your search or filter.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Doctors;