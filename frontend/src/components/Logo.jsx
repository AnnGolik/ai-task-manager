import React from 'react';

function Logo({ size = 32 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      style={{ display: 'block', animation: 'logoPulse 0.6s ease-out' }}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx="14" fill="url(#logoGrad)" />

      <path
        d="M18 33 L28 43 L46 20"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <circle cx="49" cy="15" r="6" fill="#fbbf24" />
      <path
        d="M49 11 L49 19 M45 15 L53 15"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Logo;