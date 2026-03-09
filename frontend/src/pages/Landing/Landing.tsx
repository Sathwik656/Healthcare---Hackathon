import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Calendar, Shield, Clock, ArrowRight, Heart, Users, MapPin, Mail, Phone } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-600 mr-2" />
              <span className="text-2xl font-bold text-slate-900 tracking-tight">HealthCare</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-green-600 font-medium transition-colors">Features</a>
              <a href="#about" className="text-slate-600 hover:text-green-600 font-medium transition-colors">About</a>
              <a href="#contact" className="text-slate-600 hover:text-green-600 font-medium transition-colors">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-slate-600 hover:text-green-600 font-medium px-3 py-2 transition-colors"
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-600 text-sm font-medium">
                <span className="flex h-2 w-2 rounded-full bg-green-600 mr-2"></span>
                Modern Healthcare Platform
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Your Health, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Simplified.
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Book appointments with top doctors, manage your medical history, and get AI-powered health recommendations—all in one secure platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  to="/register" 
                  className="inline-flex justify-center items-center px-8 py-4 text-base font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
                <div>
                  <div className="text-3xl font-bold text-slate-900">500+</div>
                  <div className="text-sm text-slate-500 mt-1">Verified Doctors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">10k+</div>
                  <div className="text-sm text-slate-500 mt-1">Happy Patients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">4.9/5</div>
                  <div className="text-sm text-slate-500 mt-1">Average Rating</div>
                </div>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              {/* Decorative elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-[3rem] transform rotate-3 opacity-50"></div>
              <div className="absolute -inset-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-[3rem] transform -rotate-2 opacity-50"></div>
              
              <div className="relative bg-white rounded-3xl shadow-xl border border-slate-100 p-8 overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-50 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-emerald-50 rounded-full blur-2xl"></div>
                
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Activity className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Quick Booking</h3>
                        <p className="text-sm text-slate-500">Find the right doctor</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { icon: Calendar, title: 'Easy Scheduling', desc: 'Book slots instantly' },
                      { icon: Shield, title: 'Secure Records', desc: 'Your data is protected' },
                      { icon: Clock, title: '24/7 Support', desc: 'Always here to help' }
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                          <feature.icon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{feature.title}</h4>
                          <p className="text-sm text-slate-500 mt-0.5">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center text-white">
                <Activity className="h-6 w-6 text-green-500 mr-2" />
                <span className="text-xl font-bold tracking-tight">HealthCare</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Making healthcare accessible, simple, and secure for everyone. Book your next appointment with ease.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-400 transition-colors">Home</a></li>
                <li><a href="#features" className="hover:text-green-400 transition-colors">Features</a></li>
                <li><a href="#about" className="hover:text-green-400 transition-colors">About Us</a></li>
                <li><a href="#contact" className="hover:text-green-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-400 transition-colors">Find a Doctor</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Book Appointment</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Video Consultation</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Health Records</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-green-500" />
                  123 Health Ave, Medical City
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-green-500" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-green-500" />
                  support@healthcare.com
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} HealthCare Platform. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
