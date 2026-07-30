import { useAuth } from '../context/AuthContext';
import { translations } from './translations';

export function useTranslation() {
  const { preferences } = useAuth();
  const lang = preferences?.language || 'English';
  
  const t = (key, fallback = '') => {
    const dict = translations[lang] || translations['English'];
    return dict[key] || fallback || key;
  };
  
  return { t, lang, preferences };
}
