import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, Send, Sparkles } from 'lucide-react';

const AIAssistant = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [suggestion, setSuggestion] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    // Mock AI response
    setTimeout(() => {
      setSuggestion({
        specialty: 'Dermatologist',
        doctor: 'Dr. Sarah Jenkins',
        slot: 'Today, 4:00 PM',
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex items-center">
        <Bot className="w-6 h-6 text-white mr-2" />
        <h3 className="text-lg font-semibold text-white">{t('ai_assistant')}</h3>
      </div>
      
      <div className="p-5">
        <p className="text-sm text-slate-600 mb-4">
          Describe your symptoms and our AI will recommend the right specialist.
        </p>
        
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('symptoms_placeholder')}
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 p-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {loading && (
          <div className="mt-6 flex justify-center">
            <div className="animate-pulse flex items-center text-green-600">
              <Sparkles className="w-5 h-5 mr-2 animate-spin" />
              <span className="text-sm font-medium">Analyzing symptoms...</span>
            </div>
          </div>
        )}

        {suggestion && !loading && (
          <div className="mt-6 bg-green-50 rounded-xl p-4 border border-green-100 animate-in fade-in slide-in-from-bottom-2">
            <h4 className="text-sm font-semibold text-green-900 mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-1.5 text-green-600" />
              Recommendation
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Specialty:</span>
                <span className="font-medium text-slate-900">{suggestion.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Recommended Doctor:</span>
                <span className="font-medium text-slate-900">{suggestion.doctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Available Slot:</span>
                <span className="font-medium text-slate-900">{suggestion.slot}</span>
              </div>
            </div>
            <button className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Book Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
