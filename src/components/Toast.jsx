import { useEffect } from 'react'
import { AlertCircleIcon, CheckCircleIcon, XIcon } from './icons.jsx'
import { useI18n } from '../i18n/context.js'
import './Toast.css'

// duration: ms — shu vaqtdan so'ng o'zi yopiladi (0 — yopilmaydi)
// type: 'error' | 'success'
function Toast({ title, message, onClose, duration = 5000, type = 'error' }) {
  const { t } = useI18n()

  useEffect(() => {
    if (!duration) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const isSuccess = type === 'success'

  return (
    <div className={`toast toast--${type}`} role="alert">
      {isSuccess ? (
        <CheckCircleIcon className="toast__icon toast__icon--success" />
      ) : (
        <AlertCircleIcon className="toast__icon toast__icon--error" />
      )}
      <div className="toast__body">
        {title && <p className="toast__title">{title}</p>}
        {message && message !== title && <p className="toast__text">{message}</p>}
      </div>
      <button type="button" className="toast__close" aria-label={t('common.close')} onClick={onClose}>
        <XIcon />
      </button>
    </div>
  )
}

export default Toast
