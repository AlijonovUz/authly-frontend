import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AlertCircleIcon, CalendarIcon, ChevronDownIcon } from '../../components/icons.jsx'
import { useI18n } from '../../i18n/context.js'

const MONTHS = {
  uz: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
  ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
}
// Hafta dushanbadan boshlanadi
const WEEKDAYS = {
  uz: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
  ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
}

const MIN_YEAR = 1900
// Kalendar balandligi va ekran chetigacha qoladigan bo'shliq — qaysi tomonga ochilishini hisoblash uchun
const POPOVER_HEIGHT = 380
const VIEWPORT_GAP = 12

const pad = (n) => String(n).padStart(2, '0')
const format = (y, m, d) => `${pad(d)}.${pad(m + 1)}.${y}`

// "KK.OO.YYYY" → { y, m (0–11), d } yoki null
function parse(value) {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value ?? '')
  if (!match) return null
  const [d, m, y] = [Number(match[1]), Number(match[2]) - 1, Number(match[3])]
  const date = new Date(y, m, d)
  return date.getMonth() === m && date.getDate() === d ? { y, m, d } : null
}

// Kiritilgan qiymatni "KK.OO.YYYY" ko'rinishiga keltiradi
function maskDate(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('.')
}

// Tanlangan qatorni ro'yxat o'rtasiga keltiradi (sahifani o'zi aylantirmasdan)
function centerSelected(list) {
  const item = list?.querySelector('.is-selected')
  if (item) list.scrollTop = item.offsetTop - list.clientHeight / 2 + item.offsetHeight / 2
}

// Tug'ilgan sana uchun kalendar: kelajakdagi kunlar tanlanmaydi
function Calendar({ value, label, up, onSelect }) {
  const { t, lang } = useI18n()
  const months = MONTHS[lang] ?? MONTHS.uz
  const weekdays = WEEKDAYS[lang] ?? WEEKDAYS.uz

  // Kalendar ochiq turgan qisqa vaqt uchun "bugun" bir marta olinadi
  const [today] = useState(() => new Date())
  const maxY = today.getFullYear()
  const maxM = today.getMonth()
  const selected = parse(value)

  const [view, setView] = useState(() => (selected ? { y: selected.y, m: selected.m } : { y: maxY, m: maxM }))
  const [picker, setPicker] = useState(false)
  const monthsRef = useRef(null)
  const yearsRef = useRef(null)

  useEffect(() => {
    if (!picker) return
    centerSelected(monthsRef.current)
    centerSelected(yearsRef.current)
  }, [picker])

  const atMin = view.y <= MIN_YEAR && view.m === 0
  const atMax = view.y > maxY || (view.y === maxY && view.m >= maxM)

  const shift = (delta) =>
    setView(({ y, m }) => {
      const n = m + delta
      return { y: y + Math.floor(n / 12), m: ((n % 12) + 12) % 12 }
    })

  // Oy jadvali: birinchi kungacha bo'sh kataklar, so'ng kunlar
  const firstWeekday = (new Date(view.y, view.m, 1).getDay() + 6) % 7
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const isFuture = (d) => new Date(view.y, view.m, d) > today
  const isSelected = (d) => selected?.y === view.y && selected?.m === view.m && selected?.d === d
  const isToday = (d) => view.y === maxY && view.m === maxM && today.getDate() === d

  const years = Array.from({ length: maxY - MIN_YEAR + 1 }, (_, i) => maxY - i)

  const dayClass = (d) =>
    ['calendar__day', isSelected(d) && 'is-selected', isToday(d) && 'is-today']
      .filter(Boolean)
      .join(' ')

  return (
    <div
      className={up ? 'calendar calendar--up' : 'calendar'}
      role="dialog"
      aria-label={label}
    >
      <div className="calendar__header">
        <button
          type="button"
          className="calendar__nav"
          onClick={() => shift(-1)}
          disabled={atMin}
          aria-label={t('calendar.prev')}
        >
          <ChevronDownIcon width="16" height="16" className="calendar__nav-prev" />
        </button>

        <button
          type="button"
          className="calendar__title"
          onClick={() => setPicker((p) => !p)}
          aria-expanded={picker}
        >
          {months[view.m]} {view.y}
          <ChevronDownIcon width="14" height="14" className={picker ? 'is-open' : undefined} />
        </button>

        <button
          type="button"
          className="calendar__nav"
          onClick={() => shift(1)}
          disabled={atMax}
          aria-label={t('calendar.next')}
        >
          <ChevronDownIcon width="16" height="16" className="calendar__nav-next" />
        </button>
      </div>

      {/* Oy/yil tanlovi kunlar jadvali o'rnida chiqadi — kalendar o'lchami o'zgarmaydi */}
      {picker ? (
        <div className="calendar__picker">
          <div className="calendar__list" ref={monthsRef}>
            {months.map((name, i) => (
              <button
                key={name}
                type="button"
                className={i === view.m ? 'calendar__option is-selected' : 'calendar__option'}
                disabled={view.y === maxY && i > maxM}
                onClick={() => {
                  setView((v) => ({ ...v, m: i }))
                  setPicker(false)
                }}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="calendar__list calendar__list--years" ref={yearsRef}>
            {years.map((y) => (
              <button
                key={y}
                type="button"
                className={y === view.y ? 'calendar__option is-selected' : 'calendar__option'}
                onClick={() => {
                  // Joriy yilda kelajak oyi tanlanib qolmasin
                  setView((v) => ({ y, m: y === maxY ? Math.min(v.m, maxM) : v.m }))
                  setPicker(false)
                }}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="calendar__weekdays" aria-hidden="true">
            {weekdays.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>

          <div className="calendar__grid">
            {cells.map((d, i) => (
              <div key={i} className="calendar__cell">
                {d && (
                  <button
                    type="button"
                    className={dayClass(d)}
                    disabled={isFuture(d)}
                    aria-pressed={isSelected(d)}
                    aria-label={format(view.y, view.m, d)}
                    onClick={() => onSelect(format(view.y, view.m, d))}
                  >
                    {d}
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="calendar__footer">
        <button type="button" className="calendar__clear" onClick={() => onSelect('')}>
          {t('calendar.clear')}
        </button>
        <button
          type="button"
          className="calendar__today"
          onClick={() => onSelect(format(maxY, maxM, today.getDate()))}
        >
          {t('calendar.today')}
        </button>
      </div>
    </div>
  )
}

// Sana maydoni: qo'lda "KK.OO.YYYY" yoziladi yoki kalendar belgisi bosilib tanlanadi.
// value/onChange — "KK.OO.YYYY" satri
function DateField({ id, label, placeholder, value, onChange, error }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [up, setUp] = useState(false)
  const rootRef = useRef(null)
  const controlRef = useRef(null)
  const messageId = typeof error === 'string' ? `${id}-message` : undefined

  // Pastda joy yetmasa kalendar yuqoriga ochiladi
  useLayoutEffect(() => {
    if (!open) return
    const measure = () => {
      const rect = controlRef.current?.getBoundingClientRect()
      if (!rect) return
      const below = window.innerHeight - rect.bottom - VIEWPORT_GAP
      setUp(below < POPOVER_HEIGHT && rect.top - VIEWPORT_GAP > below)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [open])

  // Tashqariga bosilsa yoki Esc bosilsa yopiladi
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const controlClass = ['field__control', error && 'has-error', open && 'is-open']
    .filter(Boolean)
    .join(' ')

  return (
    <div className="field" ref={rootRef}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="date-field">
        <div className={controlClass} ref={controlRef}>
          <button
            type="button"
            className="field__icon-button"
            aria-label={t('calendar.open')}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <CalendarIcon strokeWidth={1.5} className="field__icon" />
          </button>
          <input
            id={id}
            className="field__input"
            inputMode="numeric"
            autoComplete="bday"
            maxLength={10}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(maskDate(e.target.value))}
            aria-invalid={Boolean(error)}
            aria-describedby={messageId}
          />
        </div>

        {open && (
          <Calendar
            value={value}
            label={label}
            up={up}
            onSelect={(next) => {
              onChange(next)
              setOpen(false)
            }}
          />
        )}
      </div>
      {messageId && (
        <p className="field__message is-error" id={messageId}>
          <AlertCircleIcon width="16" height="16" />
          {error}
        </p>
      )}
    </div>
  )
}

export default DateField
