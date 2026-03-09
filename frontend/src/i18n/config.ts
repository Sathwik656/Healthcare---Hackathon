import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome",
      "dashboard": "Dashboard",
      "doctors": "Doctors",
      "my_appointments": "My Appointments",
      "profile": "Profile",
      "logout": "Logout",
      "book_appointment": "Book Appointment",
      "pending_requests": "Pending Requests",
      "manage_doctors": "Manage Doctors",
      "ai_assistant": "AI Assistant",
      "symptoms_placeholder": "E.g., I have skin allergy...",
      "find_doctor": "Find Doctor",
      "notifications": "Notifications"
    }
  },
  hi: {
    translation: {
      "welcome": "स्वागत है",
      "dashboard": "डैशबोर्ड",
      "doctors": "डॉक्टर",
      "my_appointments": "मेरी नियुक्तियां",
      "profile": "प्रोफ़ाइल",
      "logout": "लॉग आउट",
      "book_appointment": "अपॉइंटमेंट बुक करें",
      "pending_requests": "लंबित अनुरोध",
      "manage_doctors": "डॉक्टरों का प्रबंधन करें",
      "ai_assistant": "एआई सहायक",
      "symptoms_placeholder": "उदा., मुझे त्वचा की एलर्जी है...",
      "find_doctor": "डॉक्टर खोजें",
      "notifications": "सूचनाएं"
    }
  },
  kn: {
    translation: {
      "welcome": "ಸ್ವಾಗತ",
      "dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      "doctors": "ವೈದ್ಯರು",
      "my_appointments": "ನನ್ನ ನೇಮಕಾತಿಗಳು",
      "profile": "ಪ್ರೊಫೈಲ್",
      "logout": "ಲಾಗ್ ಔಟ್",
      "book_appointment": "ನೇಮಕಾತಿ ಕಾಯ್ದಿರಿಸಿ",
      "pending_requests": "ಬಾಕಿ ಇರುವ ವಿನಂತಿಗಳು",
      "manage_doctors": "ವೈದ್ಯರನ್ನು ನಿರ್ವಹಿಸಿ",
      "ai_assistant": "ಎಐ ಸಹಾಯಕ",
      "symptoms_placeholder": "ಉದಾ., ನನಗೆ ಚರ್ಮದ ಅಲರ್ಜಿ ಇದೆ...",
      "find_doctor": "ವೈದ್ಯರನ್ನು ಹುಡುಕಿ",
      "notifications": "ಅಧಿಸೂಚನೆಗಳು"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
