import { useEffect, useId, useRef, useState } from 'react'
import { CheckIcon, ChevronDownIcon, SearchIcon } from '../../components/icons.jsx'
import { useI18n } from '../../i18n/context.js'

// Qidiruvda apostrof turlari (ʻ ' ‘ ’ `) va katta-kichik harf farqi hisobga olinmaydi:
// "boka", "bo'ka" va "Boʻka" — bir xil
const normalize = (text) => text.toLocaleLowerCase('uz').replace(/[ʻʼ'‘’`]/g, '')

// Qidiruvli tanlash maydoni (viloyat, tuman).
// options: [{ id, name }], onChange(id). align: 'start' | 'end' — ro'yxat qaysi chetga tekislanadi
function SearchSelect({
  id,
  label,
  placeholder,
  searchPlaceholder,
  options,
  value,
  onChange,
  error,
  disabled,
  align = 'start',
}) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const listRef = useRef(null)
  const listId = useId()

  const selected = options.find((o) => o.id === value)
  const filtered = query ? options.filter((o) => normalize(o.name).includes(normalize(query))) : options

  const openMenu = () => {
    if (disabled) return
    setQuery('')
    setActive(Math.max(0, options.findIndex((o) => o.id === value)))
    setOpen(true)
  }

  const close = (focusTrigger = true) => {
    setOpen(false)
    if (focusTrigger) triggerRef.current?.focus()
  }

  const choose = (option) => {
    onChange(option.id)
    close()
  }

  // Tashqariga bosilsa yopiladi
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  // Klaviatura bilan tanlangan qator ko'rinib tursin
  useEffect(() => {
    if (!open) return
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const handleSearchKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[active]) choose(filtered[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'Tab') {
      close(false)
    }
  }

  const handleTriggerKeyDown = (e) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault()
      openMenu()
    }
  }

  const controlClass = [
    'field__control',
    'field__control--select',
    error && 'has-error',
    open && 'is-open',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="field search-select" ref={rootRef}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className={controlClass}>
        <button
          id={id}
          ref={triggerRef}
          type="button"
          className={selected ? 'field__select' : 'field__select is-placeholder'}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={Boolean(error)}
          onClick={() => (open ? close() : openMenu())}
          onKeyDown={handleTriggerKeyDown}
        >
          <span className="field__select-text">{selected?.name ?? placeholder}</span>
        </button>
        <ChevronDownIcon className={open ? 'field__chevron is-open' : 'field__chevron'} />
      </div>

      {open && (
        <div className={`search-select__menu search-select__menu--${align}`}>
          <div className="search-select__search">
            <SearchIcon className="search-select__search-icon" />
            <input
              // Ro'yxat ochilganda darhol qidirish mumkin
              autoFocus
              type="text"
              className="search-select__input"
              placeholder={searchPlaceholder}
              value={query}
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={filtered[active] ? `${listId}-${active}` : undefined}
              onChange={(e) => {
                setQuery(e.target.value)
                setActive(0)
              }}
              onKeyDown={handleSearchKeyDown}
            />
          </div>

          <ul className="search-select__list" role="listbox" id={listId} ref={listRef} aria-label={label}>
            {filtered.map((option, i) => {
              const isSelected = option.id === value
              const className = [
                'search-select__option',
                isSelected && 'is-selected',
                i === active && 'is-active',
              ]
                .filter(Boolean)
                .join(' ')
              return (
                <li
                  key={option.id}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  className={className}
                  onPointerMove={() => setActive(i)}
                  onClick={() => choose(option)}
                >
                  <span>{option.name}</span>
                  {isSelected && <CheckIcon className="search-select__check" width="18" height="18" />}
                </li>
              )
            })}
            {filtered.length === 0 && <li className="search-select__empty">{t('common.notFound')}</li>}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SearchSelect
