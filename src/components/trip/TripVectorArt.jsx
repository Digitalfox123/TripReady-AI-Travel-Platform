// ============================================================================
// TRIPREADY — HIGH-QUALITY VECTOR SVG ART ASSETS
// Tilted, editorial SVG vector illustrations for cards and arrival steppers
// ============================================================================

import React from 'react';

// ── 1. Trip Essentials Vector Art ──────────────────────────────────────────

export function VisaPassportVector({ className = "w-24 h-24" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tilted Passport Booklet */}
      <g transform="rotate(12 50 50)">
        {/* Shadow */}
        <rect x="23" y="15" width="54" height="72" rx="6" fill="currentColor" fillOpacity="0.08" />
        {/* Cover */}
        <rect x="20" y="12" width="54" height="72" rx="6" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeWidth="2" />
        {/* Spine line */}
        <line x1="28" y1="12" x2="28" y2="84" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="2 2" />
        {/* Golden Crest / Globe */}
        <circle cx="48" cy="38" r="12" stroke="currentColor" strokeWidth="1.8" strokeOpacity="0.6" />
        <ellipse cx="48" cy="38" rx="6" ry="12" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
        <line x1="36" y1="38" x2="60" y2="38" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
        {/* PASSPORT text bar */}
        <rect x="36" y="20" width="24" height="3" rx="1.5" fill="currentColor" fillOpacity="0.7" />
        {/* Official Stamp badge */}
        <circle cx="56" cy="64" r="9" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" strokeOpacity="0.6" />
        <path d="M52 64L55 67L61 61" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" />
        {/* Barcode Lines */}
        <line x1="32" y1="74" x2="48" y2="74" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
        <line x1="32" y1="78" x2="44" y2="78" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
      </g>
    </svg>
  );
}

export function SafetyShieldVector({ className = "w-24 h-24" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-8 50 50)">
        {/* Shield Outer */}
        <path
          d="M50 14L24 24V46C24 64 35 80 50 86C65 80 76 64 76 46V24L50 14Z"
          fill="currentColor"
          fillOpacity="0.14"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        {/* Shield Inner Inset */}
        <path
          d="M50 21L29 29.5V46C29 60.5 38 73.5 50 78.5C62 73.5 71 60.5 71 46V29.5L50 21Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeOpacity="0.3"
        />
        {/* Medical Cross / Pulse */}
        <rect x="46" y="36" width="8" height="24" rx="2" fill="currentColor" fillOpacity="0.7" />
        <rect x="38" y="44" width="24" height="8" rx="2" fill="currentColor" fillOpacity="0.7" />
        {/* Vital Heartbeat line */}
        <path
          d="M34 57H42L45 52L49 62L53 54L56 57H66"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.5"
        />
      </g>
    </svg>
  );
}

export function MoneyCardsVector({ className = "w-24 h-24" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(10 50 50)">
        {/* Secondary Back Card */}
        <rect x="18" y="24" width="60" height="38" rx="5" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" transform="rotate(-12 48 43)" />
        {/* Primary Front Card */}
        <rect x="22" y="32" width="62" height="40" rx="5" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2.2" />
        {/* Magnetic Chip */}
        <rect x="30" y="42" width="12" height="9" rx="2" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="1" />
        <line x1="36" y1="42" x2="36" y2="51" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
        {/* Contactless waves */}
        <path d="M50 43C52 45 52 48 50 50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
        <path d="M53 40C56 43 56 50 53 53" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
        {/* Embossed Card Numbers */}
        <circle cx="33" cy="62" r="1.5" fill="currentColor" fillOpacity="0.8" />
        <circle cx="38" cy="62" r="1.5" fill="currentColor" fillOpacity="0.8" />
        <circle cx="43" cy="62" r="1.5" fill="currentColor" fillOpacity="0.8" />
        <circle cx="48" cy="62" r="1.5" fill="currentColor" fillOpacity="0.8" />
        {/* Gold Coin */}
        <circle cx="68" cy="30" r="13" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="2" />
        <text x="64" y="35" fontSize="13" fontWeight="bold" fill="currentColor" fillOpacity="0.8" fontFamily="sans-serif">$</text>
      </g>
    </svg>
  );
}

export function Connectivity5GVector({ className = "w-24 h-24" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-10 50 50)">
        {/* Smartphone Body */}
        <rect x="28" y="16" width="44" height="70" rx="8" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeWidth="2.2" />
        {/* Screen Bezel */}
        <rect x="32" y="24" width="36" height="52" rx="3" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
        {/* Speaker Notch */}
        <rect x="44" y="20" width="12" height="2" rx="1" fill="currentColor" fillOpacity="0.5" />
        {/* SIM Chip Icon on screen */}
        <rect x="42" y="38" width="16" height="22" rx="2" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" />
        <line x1="47" y1="44" x2="53" y2="44" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="47" y1="49" x2="53" y2="49" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="47" y1="54" x2="53" y2="54" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
        {/* 5G Wireless Radiating Beams */}
        <path d="M68 28C74 34 74 44 68 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
        <path d="M73 23C82 32 82 49 73 57" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
      </g>
    </svg>
  );
}

export function TransitMetroVector({ className = "w-24 h-24" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(8 50 50)">
        {/* Aerodynamic Train Cab */}
        <path
          d="M24 64V36C24 24 35 18 50 18C65 18 76 24 76 36V64C76 68 72 72 66 72H34C28 72 24 68 24 64Z"
          fill="currentColor"
          fillOpacity="0.16"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        {/* Windshield */}
        <path
          d="M29 32C29 27 36 24 50 24C64 24 71 27 71 32V42H29V32Z"
          fill="currentColor"
          fillOpacity="0.3"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        {/* Dual Headlights */}
        <circle cx="36" cy="56" r="4" fill="currentColor" fillOpacity="0.7" />
        <circle cx="64" cy="56" r="4" fill="currentColor" fillOpacity="0.7" />
        {/* Grill / Bumper */}
        <line x1="44" y1="64" x2="56" y2="64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.8" />
        {/* Tracks / Rails */}
        <line x1="16" y1="84" x2="84" y2="84" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
        <line x1="28" y1="80" x2="22" y2="88" stroke="currentColor" strokeWidth="1.8" strokeOpacity="0.4" />
        <line x1="50" y1="80" x2="47" y2="88" stroke="currentColor" strokeWidth="1.8" strokeOpacity="0.4" />
        <line x1="72" y1="80" x2="74" y2="88" stroke="currentColor" strokeWidth="1.8" strokeOpacity="0.4" />
      </g>
    </svg>
  );
}

export function CultureTeaVector({ className = "w-24 h-24" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-6 50 50)">
        {/* Tea Bowl / Ceramic Cup */}
        <path
          d="M26 44C26 66 38 74 50 74C62 74 74 66 74 44H26Z"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        {/* Saucer / Pedestal */}
        <path d="M38 74H62V78H38V74Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
        <path d="M20 80C34 83 66 83 80 80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
        {/* Rising Fragrance Steam */}
        <path
          d="M42 36C40 28 46 22 42 14"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
        <path
          d="M50 34C48 26 54 20 50 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.7"
        />
        <path
          d="M58 36C56 28 62 22 58 14"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
      </g>
    </svg>
  );
}

export function EmergencySirenVector({ className = "w-24 h-24" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(8 50 50)">
        {/* Siren Base */}
        <rect x="28" y="62" width="44" height="14" rx="3" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2" />
        {/* Beacon Dome */}
        <path
          d="M32 62C32 40 40 30 50 30C60 30 68 40 68 62H32Z"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        {/* Internal Strobe Core */}
        <rect x="46" y="44" width="8" height="14" rx="2" fill="currentColor" fillOpacity="0.7" />
        {/* Emergency Beacon Rays */}
        <line x1="50" y1="18" x2="50" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.8" />
        <line x1="28" y1="26" x2="34" y2="31" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.7" />
        <line x1="72" y1="26" x2="66" y2="31" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.7" />
        <line x1="18" y1="46" x2="24" y2="48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
        <line x1="82" y1="46" x2="76" y2="48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
      </g>
    </svg>
  );
}

// ── 2. First Hour Stepper Vector Art ───────────────────────────────────────

export function BaggageSuitcaseVector({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-8 50 50)">
        {/* Extendable Telescopic Handle */}
        <path d="M42 22V10H58V22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.6" />
        {/* Suitcase Main Shell */}
        <rect x="26" y="22" width="48" height="60" rx="7" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeWidth="2.2" />
        {/* Reinforced Ribbed Grooves */}
        <line x1="38" y1="32" x2="38" y2="72" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
        <line x1="50" y1="32" x2="50" y2="72" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
        <line x1="62" y1="32" x2="62" y2="72" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
        {/* Wheels */}
        <circle cx="34" cy="84" r="3.5" fill="currentColor" fillOpacity="0.7" stroke="currentColor" strokeWidth="1" />
        <circle cx="66" cy="84" r="3.5" fill="currentColor" fillOpacity="0.7" stroke="currentColor" strokeWidth="1" />
        {/* Baggage Tag */}
        <path d="M60 22L72 32L68 36L56 26" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

export function CustomsBorderVector({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(10 50 50)">
        {/* Open Passport Page */}
        <rect x="20" y="22" width="60" height="52" rx="4" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
        <line x1="50" y1="22" x2="50" y2="74" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
        {/* Photo ID Box */}
        <rect x="26" y="30" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
        <circle cx="34" cy="38" r="4" fill="currentColor" fillOpacity="0.5" />
        {/* Official Entry Stamp */}
        <ellipse cx="62" cy="46" rx="11" ry="8" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3 1" strokeOpacity="0.7" />
        <path d="M58 46L61 49L67 43" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" />
        {/* Machine Readable Zone */}
        <line x1="26" y1="62" x2="74" y2="62" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
        <line x1="26" y1="66" x2="68" y2="66" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
      </g>
    </svg>
  );
}

export function SimESimVector({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-6 50 50)">
        {/* Microchip eSIM card */}
        <path
          d="M32 20H60L72 32V78C72 80 70 82 68 82H32C30 82 28 80 28 78V24C28 22 30 20 32 20Z"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        {/* Gold Core Contact Points */}
        <rect x="36" y="38" width="28" height="30" rx="3" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" />
        <line x1="50" y1="38" x2="50" y2="68" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
        <line x1="36" y1="53" x2="64" y2="53" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
        {/* Glowing Wireless Signal Waves */}
        <path d="M42 28C47 24 53 24 58 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
        <path d="M37 24C45 18 55 18 63 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
      </g>
    </svg>
  );
}

export function BankAtmVector({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(8 50 50)">
        {/* ATM Machine Outer Frame */}
        <rect x="28" y="16" width="44" height="68" rx="6" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeWidth="2.2" />
        {/* Screen */}
        <rect x="34" y="24" width="32" height="20" rx="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.2" />
        <line x1="38" y1="34" x2="50" y2="34" stroke="currentColor" strokeWidth="2" strokeOpacity="0.7" />
        {/* Card Slot */}
        <line x1="54" y1="50" x2="66" y2="50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.7" />
        {/* Cash Dispenser Slot & Banknote */}
        <rect x="34" y="58" width="32" height="4" rx="2" fill="currentColor" fillOpacity="0.4" />
        {/* Dispensed Cash Note */}
        <rect x="38" y="60" width="24" height="14" rx="2" fill="currentColor" fillOpacity="0.35" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="50" cy="67" r="3" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
      </g>
    </svg>
  );
}

export function ExpressTrainVector({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-6 50 50)">
        {/* High Speed Train Profile */}
        <path
          d="M18 64H82L76 40C72 32 60 26 44 26H18V64Z"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        {/* Aerodynamic Cockpit Glass */}
        <path d="M56 32L72 40H48V32H56Z" fill="currentColor" fillOpacity="0.35" />
        {/* Passenger Windows */}
        <rect x="24" y="34" width="8" height="10" rx="1.5" fill="currentColor" fillOpacity="0.4" />
        <rect x="36" y="34" width="8" height="10" rx="1.5" fill="currentColor" fillOpacity="0.4" />
        {/* Speed Streamlines */}
        <line x1="12" y1="50" x2="16" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
        <line x1="8" y1="56" x2="15" y2="56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
        {/* Track Line */}
        <line x1="14" y1="72" x2="86" y2="72" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.5" />
      </g>
    </svg>
  );
}

export function HotelBellVector({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(6 50 50)">
        {/* Bell Base */}
        <rect x="22" y="66" width="56" height="8" rx="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
        {/* Bell Dome */}
        <path
          d="M28 66C28 42 38 32 50 32C62 32 72 42 72 66H28Z"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        {/* Top Knob Button */}
        <rect x="48" y="24" width="4" height="8" rx="1" fill="currentColor" fillOpacity="0.7" />
        <circle cx="50" cy="22" r="4.5" fill="currentColor" fillOpacity="0.6" stroke="currentColor" strokeWidth="1.2" />
        {/* Key Card Overlay */}
        <rect x="62" y="44" width="22" height="32" rx="3" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" transform="rotate(16 73 60)" />
        <circle cx="73" cy="68" r="2.5" fill="currentColor" fillOpacity="0.8" />
      </g>
    </svg>
  );
}
