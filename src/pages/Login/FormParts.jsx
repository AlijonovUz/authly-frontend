import {
  AlertCircleIcon,
  AlertTriangleIcon,
  MailIcon,
  SendIcon,
} from '../../components/icons.jsx'
import { useI18n } from '../../i18n/context.js'

// error: string — qizil ramka + matn; true — faqat qizil ramka
// warning: string — to'q sariq ogohlantirish (masalan, Caps Lock)
export function Field({ id, label, icon: Icon, error, warning, trailing, ...inputProps }) {
  const messageId = error || warning ? `${id}-message` : undefined

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className={error ? 'field__control has-error' : 'field__control'}>
        <Icon className="field__icon" />
        <input
          id={id}
          className="field__input"
          aria-invalid={Boolean(error)}
          aria-describedby={messageId}
          {...inputProps}
        />
        {trailing}
      </div>
      {typeof error === 'string' ? (
        <p className="field__message is-error" id={messageId}>
          <AlertCircleIcon width="16" height="16" />
          {error}
        </p>
      ) : warning ? (
        <p className="field__message is-warning" id={messageId}>
          <AlertTriangleIcon />
          {warning}
        </p>
      ) : null}
    </div>
  )
}

// variant: 'soft' — pushti fon, qora sarlavha; 'danger' — qizil matn, ramkali
export function FormAlert({ variant = 'soft', title, message, extra }) {
  return (
    <div className={`alert alert--${variant}`} role="alert">
      <AlertCircleIcon className="alert__icon" />
      <div>
        <p className="alert__title">{title}</p>
        <p className="alert__text">{message}</p>
        {extra && <p className="alert__extra">{extra}</p>}
      </div>
    </div>
  )
}

export function AltLoginButtons() {
  const { t } = useI18n()
  return (
    <div className="form__alt">
      <button type="button" className="btn-pill btn-telegram">
        <SendIcon />
        <span className="label-full">{t('login.telegramFull')}</span>
        <span className="label-short">{t('login.telegramShort')}</span>
      </button>
      <button type="button" className="btn-pill btn-outline">
        <MailIcon />
        <span className="label-full">{t('login.emailFull')}</span>
        <span className="label-short">{t('login.emailShort')}</span>
      </button>
    </div>
  )
}
