import { useEffect } from 'react'
import { AlertCircleIcon, XIcon } from './icons.jsx'
import { useI18n } from '../i18n/context.js'
import './Toast.css'

// duration: ms — shu vaqtdan so'ng o'zi yopiladi (0 — yopilmaydi)
function Toast({ title, message, onClose, duration = 5000 }) {
  const { t } = useI18n()

  useEffect(() => {
    if (!duration) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className="toast" role="alert">
      <AlertCircleIcon className="toast__icon" />
      <div className="toast__body">
        <p className="toast__title">{title}</p>
        {message && <p className="toast__text">{message}</p>}
      </div>
      <button type="button" className="toast__close" aria-label={t('common.close')} onClick={onClose}>
        <XIcon />
      </button>
    </div>
  )
}

export default Toast
