import React, { useState } from 'react';

const LOGO_DEV_PUBLISHABLE_KEY = import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY || 'pk_bYH-YceiR-KgJx79TnahZg';

const DOMAIN_MAP = {
  'uber': 'uber.com',
  'lyft': 'lyft.com',
  'careem': 'careem.com',
  'grab': 'grab.com',
  'gojek': 'gojek.com',
  'gocar': 'gojek.com',
  'ola': 'olacabs.com',
  'bolt': 'bolt.eu',
  'ratp': 'ratp.fr',
  'bonjour': 'ratp.fr',
  'db navigator': 'bahn.de',
  'db ': 'bahn.de',
  'sbb': 'sbb.ch',
  'kakao': 'kakaomobility.com',
  'go app': 'kakaomobility.com',
  'citymapper': 'citymapper.com',
  'google maps': 'google.com',
  'maps': 'google.com',
  'trainline': 'thetrainline.com',
  'ticket': 'thetrainline.com',
  'indrive': 'indrive.com',
  'bykea': 'bykea.com',
  'metrobus': 'metro.net'
};

function getDomain(name) {
  const norm = name ? name.toLowerCase() : '';
  for (const [key, domain] of Object.entries(DOMAIN_MAP)) {
    if (norm.includes(key)) return domain;
  }
  const clean = norm.replace(/[^a-z0-9]/g, '');
  return clean ? `${clean}.com` : '';
}

export default function TransportAppLogo({ name, className = "w-5 h-5 shrink-0" }) {
  const [useFallback, setUseFallback] = useState(false);
  const domain = getDomain(name);

  if (domain && !useFallback) {
    const logoUrl = `https://img.logo.dev/${domain}?token=${LOGO_DEV_PUBLISHABLE_KEY}`;
    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className={`${className} object-contain rounded-md`}
        onError={() => setUseFallback(true)}
      />
    );
  }

  const normName = name ? name.toLowerCase() : '';

  // 1. Uber
  if (normName.includes('uber')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="black" />
        <circle cx="50" cy="50" r="28" fill="black" stroke="white" strokeWidth="8" />
        <rect x="46" y="22" width="8" height="56" fill="white" />
      </svg>
    );
  }

  // 2. Lyft
  if (normName.includes('lyft')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#FF00BF" />
        <path d="M22 68C22 50 36 38 50 38C64 38 78 50 78 68" stroke="white" strokeWidth="10" strokeLinecap="round" />
        <circle cx="35" cy="50" r="8" fill="white" />
        <circle cx="65" cy="50" r="8" fill="white" />
      </svg>
    );
  }

  // 3. Careem
  if (normName.includes('careem')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#3ECB53" />
        <circle cx="50" cy="45" r="22" stroke="white" strokeWidth="7" fill="none" strokeDasharray="50 20" strokeLinecap="round" transform="rotate(45 50 45)" />
        <circle cx="38" cy="40" r="5" fill="white" />
        <circle cx="62" cy="40" r="5" fill="white" />
        <path d="M45 68C48 70 52 70 55 68" stroke="white" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );
  }

  // 4. Grab
  if (normName.includes('grab')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#00B14F" />
        <path d="M25 45C35 30 65 30 75 45" stroke="white" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M25 60C35 45 65 45 75 60" stroke="white" strokeWidth="8" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // 5. Gojek
  if (normName.includes('gojek') || normName.includes('gocar')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#00AA13" />
        <circle cx="50" cy="50" r="24" stroke="white" strokeWidth="8" fill="none" />
        <circle cx="50" cy="50" r="8" fill="white" />
      </svg>
    );
  }

  // 6. Ola
  if (normName.includes('ola')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#D2EC1D" />
        <circle cx="50" cy="50" r="24" stroke="black" strokeWidth="8" fill="none" />
        <circle cx="50" cy="50" r="8" fill="black" />
      </svg>
    );
  }

  // 7. Bolt
  if (normName.includes('bolt')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#34D399" />
        <path d="M55 20L30 55H50L45 80L70 45H50L55 20Z" fill="white" />
      </svg>
    );
  }

  // 8. Bonjour RATP
  if (normName.includes('ratp') || normName.includes('bonjour')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#005A9C" />
        <circle cx="50" cy="50" r="28" stroke="#00A2E2" strokeWidth="6" fill="none" />
        <path d="M38 42C38 35 44 32 50 32C56 32 62 35 62 42V58H38V42Z" fill="none" stroke="white" strokeWidth="6" />
        <path d="M44 64C48 66 52 66 56 64" stroke="white" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );
  }

  // 9. DB Navigator
  if (normName.includes('db navigator') || normName.includes('db ')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#EC0016" />
        <rect x="20" y="25" width="60" height="50" rx="4" stroke="white" strokeWidth="8" fill="none" />
        <path d="M35 37H48C52 37 54 39 54 42C54 44 52 46 48 46H35V37ZM35 50H48C52 50 54 52 54 55C54 58 52 60 48 60H35V50Z" fill="white" />
        <path d="M58 37H68C72 37 73 39 73 42C73 45 71 47 68 47H58V37ZM62 50H68C72 50 73 52 73 55C73 58 71 60 68 60H62V50Z" fill="white" />
      </svg>
    );
  }

  // 10. SBB Mobile
  if (normName.includes('sbb')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#EB0000" />
        <path d="M22 50H78" stroke="white" strokeWidth="8" strokeLinecap="round" />
        <path d="M60 30L78 50L60 70" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLineJoin="round" fill="none" />
        <path d="M40 70L22 50L40 30" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLineJoin="round" fill="none" />
      </svg>
    );
  }

  // 11. Kakao T
  if (normName.includes('kakao') || normName.includes('go app')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#FFE812" />
        <path d="M30 30H70V42H56V70H44V42H30V30Z" fill="black" />
      </svg>
    );
  }

  // 12. Citymapper
  if (normName.includes('citymapper')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#00B57A" />
        <path d="M35 50H65M65 50L53 38M65 50L53 62" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLineJoin="round" fill="none" />
        <circle cx="28" cy="28" r="4" fill="white" />
        <circle cx="72" cy="72" r="4" fill="white" />
        <circle cx="72" cy="28" r="4" fill="white" />
      </svg>
    );
  }

  // 13. Google Maps
  if (normName.includes('google maps') || normName.includes('maps')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="white" />
        <path d="M50 15C33 15 20 28 20 45C20 60 50 85 50 85C50 85 80 60 80 45C80 28 67 15 50 15Z" fill="#EA4335" />
        <circle cx="50" cy="42" r="12" fill="white" />
        <path d="M42 42C42 45.3 43.7 48.2 46.2 49.8L37 65H44L50 54L56 65H63L53.8 49.8C56.3 48.2 58 45.3 58 42C58 37.6 54.4 34 50 34C45.6 34 42 37.6 42 42Z" fill="#34A853" />
      </svg>
    );
  }

  // 14. Trainline
  if (normName.includes('trainline') || normName.includes('ticket')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#003366" />
        <rect x="25" y="30" width="50" height="35" rx="8" stroke="white" strokeWidth="6" fill="none" />
        <circle cx="37" cy="54" r="4" fill="white" />
        <circle cx="63" cy="54" r="4" fill="white" />
        <rect x="33" y="65" width="6" height="10" fill="white" />
        <rect x="61" y="65" width="6" height="10" fill="white" />
      </svg>
    );
  }

  // Default: Generic transit/taxi app logo (nice orange compass/car combo)
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#475569" />
      <circle cx="50" cy="50" r="22" stroke="white" strokeWidth="6" fill="none" />
      <path d="M50 28L56 44L72 50L56 56L50 72L44 56L28 50L44 44L50 28Z" fill="white" />
    </svg>
  );
}
