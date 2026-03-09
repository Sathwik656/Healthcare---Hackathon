import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, MoreVertical, CheckCircle, XCircle, X, User, Stethoscope, Copy } from 'lucide-react';

const ManageDoctors = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('');
  const [generatedCredentials, setGeneratedCredentials] = useState<{email: string, password: string} | null>(null);

  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. Sarah Jenkins', specialty: 'Dermatologist', status: 'active', email: 'sarah.j@example.com' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Cardiologist', status: 'active', email: 'michael.c@example.com' },
    { id: 3, name: 'Dr. Emily White', specialty: 'General Physician', status: 'suspended', email: 'emily.w@example.com' },
    { id: 4, name: 'Dr. Robert Brown', specialty: 'Pediatrician', status: 'active', email: 'robert.b@example.com' },
  ]);

  const handleToggleStatus = (id: number) => {
    setDoctors(doctors.map(doc => 
      doc.id === id ? { ...doc, status: doc.status === 'active' ? 'suspended' : 'active' } : doc
    ));
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const generateEmail = (name: string) => {
    const cleanName = name.replace(/^Dr\.\s*/i, '').trim();
    const parts = cleanName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].toLowerCase()}.${parts[parts.length - 1].toLowerCase()}@hospital.com`;
    }
    return `${cleanName.toLowerCase()}@hospital.com`;
  };

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate credentials
    const email = generateEmail(newDocName);
    const password = generatePassword();
    
    const newDoctor = {
      id: doctors.length + 1,
      name: newDocName.startsWith('Dr.') ? newDocName : `Dr. ${newDocName}`,
      specialty: newDocSpecialty,
      status: 'active',
      email: email
    };

    setDoctors([...doctors, newDoctor]);
    setGeneratedCredentials({ email, password });
  };

  const resetAddForm = () => {
    setIsAddModalOpen(false);
    setNewDocName('');
    setNewDocSpecialty('');
    setGeneratedCredentials(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, show a toast notification here
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">{t('manage_doctors')}</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Doctor
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Doctor Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Specialty
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                        {doc.name.charAt(4)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{doc.name}</div>
                        <div className="text-sm text-slate-500">{doc.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{doc.specialty}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      doc.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleToggleStatus(doc.id)}
                      className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white transition-colors ${
                        doc.status === 'active' 
                          ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500' 
                          : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                      }`}
                    >
                      {doc.status === 'active' ? (
                        <><XCircle className="w-3.5 h-3.5 mr-1" /> Suspend</>
                      ) : (
                        <><CheckCircle className="w-3.5 h-3.5 mr-1" /> Activate</>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-sm">No doctors found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Doctor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">
                {generatedCredentials ? 'Doctor Added Successfully' : 'Add New Doctor'}
              </h3>
              <button 
                onClick={resetAddForm}
                className="text-slate-400 hover:text-slate-500 transition-colors p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {!generatedCredentials ? (
              <form onSubmit={handleAddDoctor} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Doctor Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                      placeholder="e.g. Sarah Jenkins"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Stethoscope className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={newDocSpecialty}
                      onChange={(e) => setNewDocSpecialty(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                      placeholder="e.g. Cardiologist"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={resetAddForm}
                    className="flex-1 px-4 py-2.5 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Create Profile
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-green-800">Profile Created</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Please share these auto-generated credentials securely with the new doctor. They will be required for their first login.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <span className="text-sm font-medium text-slate-900">{generatedCredentials.email}</span>
                      <button 
                        onClick={() => copyToClipboard(generatedCredentials.email)}
                        className="text-slate-400 hover:text-green-600 transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Temporary Password</label>
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <span className="text-sm font-mono font-medium text-slate-900">{generatedCredentials.password}</span>
                      <button 
                        onClick={() => copyToClipboard(generatedCredentials.password)}
                        className="text-slate-400 hover:text-green-600 transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={resetAddForm}
                  className="w-full px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
