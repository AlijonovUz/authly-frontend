const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function UserIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </svg>
  )
}

export function PhoneIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

export function AlertCircleIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="7" x2="12" y2="13" />
      <line x1="12" y1="16.5" x2="12.01" y2="16.5" />
    </svg>
  )
}

export function AlertTriangleIcon(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

export function LockIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} {...props}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

export function EyeIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function EyeOffIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-6.5 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  )
}

export function SendIcon(props) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7z" />
    </svg>
  )
}

export function MailIcon(props) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  )
}

export function ChevronDownIcon(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke} strokeWidth={2.5} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function XIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export function PlusIcon(props) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" {...stroke} strokeWidth={3} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function ArrowUpRightIcon(props) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" {...stroke} strokeWidth={3} {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

export function ArrowRightIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function LogOutIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  )
}

export function SearchIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

export function CheckIcon(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} strokeWidth={2.5} {...props}>
      <path d="M5 12.5 10 17.5 19 7" />
    </svg>
  )
}

export function CalendarIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} {...props}>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01" />
    </svg>
  )
}

export function GoogleIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" {...props}>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}

export function FlagUz(props) {
  return (
    <svg width="24" height="16" viewBox="0 0 24 16" {...props}>
      <clipPath id="flag-uz-clip">
        <rect width="24" height="16" rx="2" />
      </clipPath>
      <g clipPath="url(#flag-uz-clip)">
        <rect width="24" height="16" fill="#fff" />
        <rect width="24" height="5.2" fill="#3b8fe0" />
        <rect y="5.2" width="24" height="0.6" fill="#ce1126" />
        <rect y="10.2" width="24" height="0.6" fill="#ce1126" />
        <rect y="10.8" width="24" height="5.2" fill="#43a047" />
        <circle cx="3.4" cy="2.6" r="1.6" fill="#fff" />
        <circle cx="4" cy="2.6" r="1.4" fill="#3b8fe0" />
      </g>
    </svg>
  )
}

export function FlagRu(props) {
  return (
    <svg width="24" height="16" viewBox="0 0 24 16" {...props}>
      <clipPath id="flag-ru-clip">
        <rect width="24" height="16" rx="2" />
      </clipPath>
      <g clipPath="url(#flag-ru-clip)">
        <rect width="24" height="16" fill="#fff" />
        <rect y="5.33" width="24" height="5.34" fill="#0039a6" />
        <rect y="10.67" width="24" height="5.33" fill="#d52b1e" />
      </g>
      <rect x="0.25" y="0.25" width="23.5" height="15.5" rx="2" fill="none" stroke="#eef1f7" strokeWidth="0.5" />
    </svg>
  )
}

export function FlagEn(props) {
  return (
    <svg width="24" height="16" viewBox="0 0 24 16" {...props}>
      <clipPath id="flag-en-clip">
        <rect width="24" height="16" rx="2" />
      </clipPath>
      <g clipPath="url(#flag-en-clip)">
        <rect width="24" height="16" fill="#012169" />
        <path d="M0 0 24 16M24 0 0 16" stroke="#fff" strokeWidth="3" />
        <path d="M0 0 24 16M24 0 0 16" stroke="#c8102e" strokeWidth="1" />
        <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="5" />
        <path d="M12 0v16M0 8h24" stroke="#c8102e" strokeWidth="3" />
      </g>
    </svg>
  )
}
