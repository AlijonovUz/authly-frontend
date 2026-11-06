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

export function ArrowLeftIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
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

export function CheckCircleIcon(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
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

export function TelegramIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.673c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.414z" />
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

export function CopyIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke} {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

export function KeyIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="m21 2-2 2m-1.5 1.5L14 9a6.5 6.5 0 1 0 4 4l3.5-3.5V6l-4-4Z" />
      <circle cx="7.5" cy="15.5" r="1.5" />
    </svg>
  )
}

export function CodeIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke} {...props}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

export function TrashIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke} {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )
}

export function EditIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

export function RefreshCwIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke} {...props}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  )
}

export function GlobeIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke} {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

export function WebhookIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c0-2.21 1.79-4 4-4h1" />
      <path d="M6 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="m14 7 3-3 3 3" />
      <path d="m14 17 3 3 3-3" />
      <path d="M17 4v16" />
    </svg>
  )
}

export function InfoIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke} {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

export function DownloadIcon(props) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

export function FileTextIcon(props) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

export function ServerIcon(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke} {...props}>
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  )
}

export function ShieldAlertIcon(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}
