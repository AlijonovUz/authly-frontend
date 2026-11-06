import { useEffect, useRef, useState } from 'react'
import {
  createDeveloperApplication,
  createDeveloperWebhook,
  deleteDeveloperApplication,
  deleteDeveloperWebhook,
  getDeveloperApplication,
  getDeveloperApplications,
  resetDeveloperApplicationSecret,
  resetDeveloperWebhookSecret,
  updateDeveloperApplication,
  updateDeveloperWebhook,
} from '../../api/developer.js'
import { getApiErrorMessage } from '../../api/client.js'
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  CheckIcon,
  CodeIcon,
  CopyIcon,
  EditIcon,
  EyeIcon,
  EyeOffIcon,
  GlobeIcon,
  KeyIcon,
  PlusIcon,
  RefreshCwIcon,
  TrashIcon,
  WebhookIcon,
  XIcon,
} from '../../components/icons.jsx'
import Toast from '../../components/Toast.jsx'
import { useI18n } from '../../i18n/context.js'
import IntegrationGuideCard from './IntegrationGuideCard.jsx'
import './DeveloperConsole.css'

// Sana formati: DD.MM.YYYY (masalan: 13.11.2026)
function formatDate(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}.${month}.${year}`
  } catch {
    return iso
  }
}

export default function DeveloperConsole({ onBackToProfile }) {
  const { t } = useI18n()

  const [apps, setApps] = useState([])
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const [view, setView] = useState('list') // 'list' | 'detail'
  const [selectedApp, setSelectedApp] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  // Modals state
  const [modal, setModal] = useState(null)
  // Toast state
  const [toast, setToast] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // So'rovlarni nazorat qilish: bir vaqtda 2 ta so'rov ketmasligi va takrorlanmasligi uchun
  const fetchingRef = useRef(false)
  const initialLoadedRef = useRef(false)

  // Sahifalangan yuklash funksiyasi
  const fetchPage = async (pageToLoad, isInitial = false) => {
    if (fetchingRef.current) return
    fetchingRef.current = true

    if (isInitial) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const res = await getDeveloperApplications({ page: pageToLoad })
      const list = Array.isArray(res) ? res : res?.results || []
      const hasNext = Boolean(res?.next)

      setHasNextPage(hasNext)
      setPage(pageToLoad)

      if (isInitial) {
        setApps(list)
      } else {
        // ID bo'yicha duplicate bo'lishining oldini olamiz
        setApps((prev) => {
          const existingIds = new Set(prev.map((a) => a.id))
          const uniqueNew = list.filter((a) => !existingIds.has(a.id))
          return [...prev, ...uniqueNew]
        })
      }
    } catch (err) {
      setToast({
        type: 'error',
        title: t('common.errorTitle'),
        message: getApiErrorMessage(err, t('common.errorText')),
      })
    } finally {
      fetchingRef.current = false
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Mount bo'lganda faqat 1 marta so'rov yuborish
  useEffect(() => {
    if (initialLoadedRef.current) return
    initialLoadedRef.current = true
    fetchPage(1, true)
  }, [])

  // Jadvalda scroll bo'lganda keyingi sahifani chaqirish (Infinite Scroll Pagination)
  const handleTableScroll = (e) => {
    const el = e.currentTarget
    if (!el || !hasNextPage || loadingMore || loading || fetchingRef.current) return

    // Pastki chegaraga 40px qolganda keyingi sahifani yuklaymiz
    const scrollBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    if (scrollBottom <= 40) {
      fetchPage(page + 1, false)
    }
  }

  // Open detail view
  const openDetail = async (appId) => {
    setView('detail')
    setDetailLoading(true)
    setShowSecret(false)
    try {
      const data = await getDeveloperApplication(appId)
      setSelectedApp(data)
    } catch (err) {
      setToast({
        type: 'error',
        title: t('common.errorTitle'),
        message: getApiErrorMessage(err, t('common.errorText')),
      })
      setView('list')
    } finally {
      setDetailLoading(false)
    }
  }

  // Copy helper
  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
      setToast({
        type: 'success',
        title: t('dev.copied'),
        message: `${label}: ${text.slice(0, 18)}...`,
        duration: 3000,
      })
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setToast({
        type: 'success',
        title: t('dev.copied'),
        message: `${label}: ${text.slice(0, 18)}...`,
        duration: 3000,
      })
    }
  }

  // Download client credentials JSON (Google Cloud style)
  const handleDownloadJson = (app) => {
    if (!app) return
    const config = {
      web: {
        client_id: app.client_id,
        client_secret: app.client_secret || '<secret_hidden>',
        project_name: app.name,
        auth_uri: `${window.location.origin}/#/`,
        token_uri: `${window.location.origin}/api/v1/sso/authorize/`,
        redirect_uris: app.redirect_uris ? app.redirect_uris.split(/\s+/).filter(Boolean) : [],
      },
    }
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `authly_client_${app.client_id.slice(0, 8)}.json`
    a.click()
    URL.revokeObjectURL(url)

    setToast({
      type: 'success',
      title: 'JSON yuklab olindi',
      message: `authly_client_${app.client_id.slice(0, 8)}.json`,
      duration: 3000,
    })
  }

  // Create App
  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const name = form.appName.value.trim()
    const redirect_uris = form.redirectUris.value.trim()

    if (!name || !redirect_uris) return

    setSubmitting(true)
    try {
      const created = await createDeveloperApplication({ name, redirect_uris })
      setModal({ type: 'createdSuccess', app: created })
      await fetchPage(1, true)
    } catch (err) {
      setToast({
        type: 'error',
        title: t('common.errorTitle'),
        message: getApiErrorMessage(err, t('common.errorText')),
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Edit App
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const name = form.appName.value.trim()
    const redirect_uris = form.redirectUris.value.trim()

    if (!modal?.app?.id) return

    setSubmitting(true)
    try {
      const updated = await updateDeveloperApplication(modal.app.id, { name, redirect_uris })
      setToast({
        type: 'success',
        title: t('dev.saveChanges'),
        message: t('saved.text'),
      })
      setModal(null)
      await fetchPage(1, true)
      if (selectedApp && selectedApp.id === modal.app.id) {
        setSelectedApp(updated)
      }
    } catch (err) {
      setToast({
        type: 'error',
        title: t('common.errorTitle'),
        message: getApiErrorMessage(err, t('common.errorText')),
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Delete App
  const handleDeleteApp = async (appId) => {
    setSubmitting(true)
    try {
      await deleteDeveloperApplication(appId)
      setToast({
        type: 'success',
        title: t('dev.delete'),
        message: t('saved.text'),
      })
      setModal(null)
      await fetchPage(1, true)
      if (selectedApp?.id === appId) {
        setView('list')
        setSelectedApp(null)
      }
    } catch (err) {
      setToast({
        type: 'error',
        title: t('common.errorTitle'),
        message: getApiErrorMessage(err, t('common.errorText')),
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Reset Secret
  const handleResetSecret = async (appId) => {
    setSubmitting(true)
    try {
      const res = await resetDeveloperApplicationSecret(appId)
      const newSecret = res?.client_secret
      if (selectedApp?.id === appId) {
        setSelectedApp((prev) => ({ ...prev, client_secret: newSecret }))
      }
      setModal(null)
      setToast({
        type: 'success',
        title: t('dev.resetSecret'),
        message: t('saved.text'),
      })
      setShowSecret(true)
    } catch (err) {
      setToast({
        type: 'error',
        title: t('common.errorTitle'),
        message: getApiErrorMessage(err, t('common.errorText')),
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Webhook: Create
  const handleCreateWebhook = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const url = form.webhookUrl.value.trim()
    const appId = modal?.appId

    if (!url || !appId) return

    setSubmitting(true)
    try {
      const wh = await createDeveloperWebhook({ application: appId, url })
      if (selectedApp?.id === appId) {
        setSelectedApp((prev) => ({ ...prev, webhook_info: wh }))
      }
      setToast({
        type: 'success',
        title: t('dev.addWebhook'),
        message: t('saved.text'),
      })
      setModal(null)
      await fetchPage(1, true)
    } catch (err) {
      setToast({
        type: 'error',
        title: t('common.errorTitle'),
        message: getApiErrorMessage(err, t('common.errorText')),
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Webhook: Toggle active
  const handleToggleWebhook = async (webhook) => {
    if (!webhook?.id) return
    try {
      const updated = await updateDeveloperWebhook(webhook.id, {
        is_active: !webhook.is_active,
      })
      setSelectedApp((prev) => ({ ...prev, webhook_info: updated }))
      setToast({
        type: 'success',
        title: t('dev.webhookStatus'),
        message: updated.is_active ? t('dev.active') : t('dev.inactive'),
        duration: 3000,
      })
      await fetchPage(1, true)
    } catch (err) {
      setToast({
        type: 'error',
        title: t('common.errorTitle'),
        message: getApiErrorMessage(err, t('common.errorText')),
      })
    }
  }

  // Webhook: Delete
  const handleDeleteWebhook = async (webhookId) => {
    setSubmitting(true)
    try {
      await deleteDeveloperWebhook(webhookId)
      setSelectedApp((prev) => ({ ...prev, webhook_info: null }))
      setToast({
        type: 'success',
        title: t('dev.deleteWebhook'),
        message: t('saved.text'),
      })
      setModal(null)
      await fetchPage(1, true)
    } catch (err) {
      setToast({
        type: 'error',
        title: t('common.errorTitle'),
        message: getApiErrorMessage(err, t('common.errorText')),
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Webhook: Reset Secret
  const handleResetWebhookSecret = async (webhookId) => {
    setSubmitting(true)
    try {
      const res = await resetDeveloperWebhookSecret(webhookId)
      const newSecret = res?.secret
      setSelectedApp((prev) => ({
        ...prev,
        webhook_info: { ...prev.webhook_info, secret: newSecret },
      }))
      setToast({
        type: 'success',
        title: t('dev.resetWebhookSecret'),
        message: t('saved.text'),
      })
      setModal(null)
    } catch (err) {
      setToast({
        type: 'error',
        title: t('common.errorTitle'),
        message: getApiErrorMessage(err, t('common.errorText')),
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dev-console">
      {/* Toast Notification (Z-index 2000 - har doim modal ustida chiqadi) */}
      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          type={toast.type}
          duration={toast.duration ?? 4500}
          onClose={() => setToast(null)}
        />
      )}

      {/* Tabs navigation (Sticky Top) */}
      <nav className="profile-tabs" aria-label="Sections">
        <button
          type="button"
          className="profile-tab"
          onClick={() => {
            if (onBackToProfile) onBackToProfile()
            else window.location.hash = '#/profile'
          }}
        >
          {t('tabs.profile')}
        </button>
        <button type="button" className="profile-tab is-active">
          <CodeIcon width="16" height="16" />
          {t('tabs.developer')}
        </button>
      </nav>

      {/* VIEW: Applications List (Google Cloud Console Credentials Style with Scroll Pagination) */}
      {view === 'list' && (
        <>
          <header className="dev-header">
            <div className="dev-header__top">
              <div className="dev-header__titles">
                <h2 className="dev-header__title">{t('dev.title')}</h2>
                <p className="dev-header__subtitle">{t('dev.desc')}</p>
              </div>
              <button
                type="button"
                className="dev-btn-primary"
                onClick={() => setModal({ type: 'create' })}
              >
                <PlusIcon width="14" height="14" />
                {t('dev.createApp')}
              </button>
            </div>
          </header>

          <div className="dev-table-card">
            {loading ? (
              <div className="dev-empty-card">
                <p className="dev-empty-desc">{t('dev.loading')}</p>
              </div>
            ) : apps.length === 0 ? (
              <div className="dev-empty-card">
                <div className="dev-empty-icon">
                  <KeyIcon width="28" height="28" strokeWidth={1.5} />
                </div>
                <h3 className="dev-empty-title">{t('dev.emptyTitle')}</h3>
                <p className="dev-empty-desc">{t('dev.emptyText')}</p>
                <button
                  type="button"
                  className="dev-btn-primary"
                  style={{ marginTop: '8px' }}
                  onClick={() => setModal({ type: 'create' })}
                >
                  <PlusIcon width="14" height="14" />
                  {t('dev.createApp')}
                </button>
              </div>
            ) : (
              <div className="dev-table-wrapper" onScroll={handleTableScroll}>
                <table className="dev-table">
                  <thead>
                    <tr>
                      <th>{t('dev.tableColName')}</th>
                      <th>{t('dev.tableColClientId')}</th>
                      <th>{t('dev.tableColWebhook')}</th>
                      <th>{t('dev.tableColCreated')}</th>
                      <th style={{ textAlign: 'right' }}>{t('dev.tableColActions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apps.map((app) => (
                      <tr key={app.id}>
                        <td>
                          <div className="dev-app-name-cell">
                            <span className="dev-app-icon">
                              <KeyIcon width="16" height="16" />
                            </span>
                            <button
                              type="button"
                              className="dev-app-title-link"
                              onClick={() => openDetail(app.id)}
                            >
                              {app.name}
                            </button>
                          </div>
                        </td>
                        <td>
                          <div className="dev-code-chip">
                            <span>{app.client_id}</span>
                            <button
                              type="button"
                              className="dev-copy-btn"
                              title={t('dev.copy')}
                              onClick={() => handleCopy(app.client_id, t('dev.clientId'))}
                            >
                              <CopyIcon width="14" height="14" />
                            </button>
                          </div>
                        </td>
                        <td>
                          {app.webhook_info ? (
                            <span
                              className={`dev-badge ${
                                app.webhook_info.is_active
                                  ? 'dev-badge--active'
                                  : 'dev-badge--inactive'
                              }`}
                            >
                              {app.webhook_info.is_active ? t('dev.active') : t('dev.inactive')}
                            </span>
                          ) : (
                            <span className="dev-badge dev-badge--none">
                              {t('dev.noWebhook')}
                            </span>
                          )}
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>{formatDate(app.created)}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="dev-actions-cell" style={{ justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="dev-icon-action"
                              title={t('dev.details')}
                              onClick={() => openDetail(app.id)}
                            >
                              <EyeIcon width="16" height="16" />
                            </button>
                            <button
                              type="button"
                              className="dev-icon-action"
                              title={t('dev.edit')}
                              onClick={() => setModal({ type: 'edit', app })}
                            >
                              <EditIcon width="16" height="16" />
                            </button>
                            <button
                              type="button"
                              className="dev-icon-action dev-icon-action--danger"
                              title={t('dev.delete')}
                              onClick={() => setModal({ type: 'delete', app })}
                            >
                              <TrashIcon width="16" height="16" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Keyingi sahifa yuklanayotgan bo'lsa indikator */}
                {loadingMore && (
                  <div className="dev-table-more-loading">
                    <span>{t('dev.loading')}</span>
                  </div>
                    )}
              </div>
            )}
          </div>
        </>
      )}

      {/* VIEW: Application Detail (Sticky Action Bar + Internal Scrollable Cards) */}
      {view === 'detail' && (
        <div className="dev-detail">
          {/* Tepa amallar qismi joyida qotib turadi */}
          <div className="dev-detail__sticky-header">
            <button
              type="button"
              className="dev-back-btn"
              onClick={() => {
                setView('list')
                setSelectedApp(null)
              }}
            >
              <ArrowLeftIcon width="16" height="16" />
              {t('dev.backToList')}
            </button>
            {selectedApp && (
              <div className="dev-detail__top-actions">
                <button
                  type="button"
                  className="dev-btn-secondary"
                  onClick={() => handleDownloadJson(selectedApp)}
                >
                  <CodeIcon width="14" height="14" />
                  JSON
                </button>
                <button
                  type="button"
                  className="dev-btn-secondary"
                  onClick={() => setModal({ type: 'edit', app: selectedApp })}
                >
                  <EditIcon width="14" height="14" />
                  {t('dev.edit')}
                </button>
                <button
                  type="button"
                  className="dev-btn-danger"
                  onClick={() => setModal({ type: 'delete', app: selectedApp })}
                >
                  <TrashIcon width="14" height="14" />
                  {t('dev.delete')}
                </button>
              </div>
            )}
          </div>

          {detailLoading || !selectedApp ? (
            <div className="dev-card" style={{ textAlign: 'center', padding: '40px' }}>
              <p className="dev-empty-desc">{t('dev.loading')}</p>
            </div>
          ) : (
            /* Faqat shu qism ichki scroll bo'ladi */
            <div className="dev-detail__scrollable-area">
              {/* Credentials Card */}
              <div className="dev-card">
                <div className="dev-card__header">
                  <div className="dev-card__header-titles">
                    <h3 className="dev-card__title">
                      <KeyIcon width="17" height="17" />
                      {selectedApp.name} — {t('dev.credentials')}
                    </h3>
                  </div>
                  <span className="dev-hint" style={{ whiteSpace: 'nowrap' }}>
                    {t('dev.tableColCreated')}: {formatDate(selectedApp.created)}
                  </span>
                </div>

                <div className="dev-field-grid">
                  {/* Client ID */}
                  <div className="dev-field-row">
                    <label className="dev-field-label">{t('dev.clientId')}</label>
                    <div className="dev-credential-inline">
                      <div className="dev-credential-display">
                        <span className="dev-credential-code">{selectedApp.client_id}</span>
                      </div>
                      <div className="dev-credential-actions">
                        <button
                          type="button"
                          className="dev-btn-secondary dev-btn-sm"
                          onClick={() => handleCopy(selectedApp.client_id, t('dev.clientId'))}
                        >
                          <CopyIcon width="13" height="13" />
                          {t('dev.copy')}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Client Secret */}
                  <div className="dev-field-row">
                    <label className="dev-field-label">{t('dev.clientSecret')}</label>
                    <div className="dev-credential-card">
                      <div className="dev-credential-display">
                        <span className="dev-credential-code">
                          {selectedApp.client_secret
                            ? showSecret
                              ? selectedApp.client_secret
                              : '••••••••••••••••••••••••••••••••••••••••'
                            : '••••••••••••••••••••••••••••••••••••••••'}
                        </span>
                      </div>
                      <div className="dev-credential-actions">
                        {selectedApp.client_secret && (
                          <button
                            type="button"
                            className="dev-btn-ghost dev-btn-sm"
                            onClick={() => setShowSecret((v) => !v)}
                            title={showSecret ? 'Hide' : 'Show'}
                          >
                            {showSecret ? (
                              <EyeOffIcon width="15" height="15" />
                            ) : (
                              <EyeIcon width="15" height="15" />
                            )}
                          </button>
                        )}
                        {selectedApp.client_secret && (
                          <button
                            type="button"
                            className="dev-btn-secondary dev-btn-sm"
                            onClick={() =>
                              handleCopy(selectedApp.client_secret, t('dev.clientSecret'))
                            }
                          >
                            <CopyIcon width="13" height="13" />
                            {t('dev.copy')}
                          </button>
                        )}
                        <button
                          type="button"
                          className="dev-btn-danger dev-btn-sm"
                          onClick={() => setModal({ type: 'resetSecret', app: selectedApp })}
                        >
                          <RefreshCwIcon width="13" height="13" />
                          {t('dev.resetSecret')}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Redirect URIs */}
                  <div className="dev-field-row">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <label className="dev-field-label">{t('dev.redirectUris')}</label>
                      <button
                        type="button"
                        className="dev-btn-ghost"
                        onClick={() => setModal({ type: 'edit', app: selectedApp })}
                      >
                        <EditIcon width="13" height="13" />
                        {t('dev.edit')}
                      </button>
                    </div>
                    <div className="dev-uri-list">
                      {selectedApp.redirect_uris ? (
                        selectedApp.redirect_uris
                          .split(/\s+/)
                          .filter(Boolean)
                          .map((uri, idx) => (
                            <div key={idx} className="dev-uri-tag">
                              <GlobeIcon
                                width="14"
                                height="14"
                                style={{ color: 'var(--text-muted)' }}
                              />
                              <span>{uri}</span>
                            </div>
                          ))
                      ) : (
                        <p className="dev-hint">—</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Webhooks Card */}
              <div className="dev-card">
                <div className="dev-card__header">
                  <div className="dev-card__header-titles">
                    <h3 className="dev-card__title">
                      <WebhookIcon width="17" height="17" />
                      {t('dev.webhooks')}
                    </h3>
                    <p className="dev-hint" style={{ marginTop: '2px' }}>
                      {t('dev.webhookDesc')}
                    </p>
                  </div>
                  {!selectedApp.webhook_info && (
                    <button
                      type="button"
                      className="dev-btn-primary dev-btn-sm"
                      onClick={() =>
                        setModal({ type: 'createWebhook', appId: selectedApp.id })
                      }
                    >
                      <PlusIcon width="13" height="13" />
                      {t('dev.addWebhook')}
                    </button>
                  )}
                </div>

                {selectedApp.webhook_info ? (
                  <div className="dev-field-grid">
                    {/* URL & Status */}
                    <div className="dev-field-row">
                      <label className="dev-field-label">{t('dev.webhookUrl')}</label>
                      <div className="dev-credential-inline">
                        <div className="dev-credential-display">
                          <span className="dev-credential-code">
                            {selectedApp.webhook_info.url}
                          </span>
                        </div>
                        <div className="dev-credential-actions">
                          <label
                            className="dev-switch"
                            title={
                              selectedApp.webhook_info.is_active
                                ? t('dev.active')
                                : t('dev.inactive')
                            }
                          >
                            <input
                              type="checkbox"
                              checked={Boolean(selectedApp.webhook_info.is_active)}
                              onChange={() => handleToggleWebhook(selectedApp.webhook_info)}
                            />
                            <span className="dev-switch__slider" />
                          </label>
                          <span
                            className={`dev-badge ${
                              selectedApp.webhook_info.is_active
                                ? 'dev-badge--active'
                                : 'dev-badge--inactive'
                            }`}
                          >
                            {selectedApp.webhook_info.is_active
                              ? t('dev.active')
                              : t('dev.inactive')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* HMAC Secret */}
                    <div className="dev-field-row">
                      <label className="dev-field-label">{t('dev.webhookSecret')}</label>
                      <div className="dev-credential-card">
                        <div className="dev-credential-display">
                          <span className="dev-credential-code">
                            {selectedApp.webhook_info.secret || '••••••••••••••••••••'}
                          </span>
                        </div>
                        <div className="dev-credential-actions">
                          {selectedApp.webhook_info.secret && (
                            <button
                              type="button"
                              className="dev-btn-secondary dev-btn-sm"
                              onClick={() =>
                                handleCopy(
                                  selectedApp.webhook_info.secret,
                                  t('dev.webhookSecret'),
                                )
                              }
                            >
                              <CopyIcon width="13" height="13" />
                              {t('dev.copy')}
                            </button>
                          )}
                          <button
                            type="button"
                            className="dev-btn-secondary dev-btn-sm"
                            onClick={() =>
                              setModal({
                                type: 'resetWebhookSecret',
                                webhookId: selectedApp.webhook_info.id,
                              })
                            }
                          >
                            <RefreshCwIcon width="13" height="13" />
                            {t('dev.resetWebhookSecret')}
                          </button>
                          <button
                            type="button"
                            className="dev-btn-danger dev-btn-sm"
                            onClick={() =>
                              setModal({
                                type: 'deleteWebhook',
                                webhookId: selectedApp.webhook_info.id,
                              })
                            }
                          >
                            <TrashIcon width="13" height="13" />
                            {t('dev.deleteWebhook')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '20px',
                      background: 'var(--bg-subtle)',
                      borderRadius: '8px',
                      textAlign: 'center',
                    }}
                  >
                    <p className="dev-hint">{t('dev.noWebhook')}</p>
                  </div>
                )}
              </div>

              {/* Integratsiya Qo'llanmasi (Frontend va Backend, Tayyor Kodlar va .docx Yuklab Olish) */}
              <IntegrationGuideCard
                app={selectedApp}
                onCopy={handleCopy}
                onToast={setToast}
              />
            </div>
          )}
        </div>
      )}

      {/* MODAL: Create Application */}
      {modal?.type === 'create' && (
        <div className="dev-modal-overlay" onClick={() => !submitting && setModal(null)}>
          <div className="dev-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dev-modal__header">
              <h3 className="dev-modal__title">{t('dev.createAppTitle')}</h3>
              <button
                type="button"
                className="dev-modal__close"
                onClick={() => setModal(null)}
                disabled={submitting}
              >
                <XIcon width="18" height="18" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="dev-modal__body">
                <div className="dev-input-group">
                  <label htmlFor="appName" className="dev-label">
                    {t('dev.appName')} *
                  </label>
                  <input
                    id="appName"
                    name="appName"
                    type="text"
                    required
                    className="dev-input"
                    placeholder={t('dev.appNamePlaceholder')}
                    autoFocus
                  />
                </div>
                <div className="dev-input-group">
                  <label htmlFor="redirectUris" className="dev-label">
                    {t('dev.redirectUris')} *
                  </label>
                  <textarea
                    id="redirectUris"
                    name="redirectUris"
                    required
                    rows={3}
                    className="dev-textarea"
                    placeholder="https://myapp.uz/oauth/callback http://localhost:3000/callback"
                  />
                  <p className="dev-hint">{t('dev.redirectUrisHint')}</p>
                </div>
              </div>
              <div className="dev-modal__footer">
                <button
                  type="button"
                  className="dev-btn-secondary"
                  onClick={() => setModal(null)}
                  disabled={submitting}
                >
                  {t('dev.cancel')}
                </button>
                <button type="submit" className="dev-btn-primary" disabled={submitting}>
                  {submitting ? '...' : t('dev.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: OAuth Client Created */}
      {modal?.type === 'createdSuccess' && modal.app && (
        <div className="dev-modal-overlay" onClick={() => setModal(null)}>
          <div className="dev-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dev-modal__header">
              <h3 className="dev-modal__title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckIcon width="20" height="20" style={{ color: 'var(--green-10)' }} />
                {t('dev.clientCreatedTitle')}
              </h3>
              <button type="button" className="dev-modal__close" onClick={() => setModal(null)}>
                <XIcon width="18" height="18" />
              </button>
            </div>
            <div className="dev-modal__body">
              <p className="dev-hint">{t('dev.clientCreatedDesc')}</p>

              <div className="dev-field-grid">
                {/* Client ID */}
                <div className="dev-field-row">
                  <label className="dev-field-label">{t('dev.clientId')}</label>
                  <div className="dev-credential-inline">
                    <div className="dev-credential-display">
                      <span className="dev-credential-code">{modal.app.client_id}</span>
                    </div>
                    <div className="dev-credential-actions">
                      <button
                        type="button"
                        className="dev-btn-secondary dev-btn-sm"
                        onClick={() => handleCopy(modal.app.client_id, t('dev.clientId'))}
                      >
                        <CopyIcon width="13" height="13" />
                        {t('dev.copy')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Client Secret */}
                <div className="dev-field-row">
                  <label className="dev-field-label">{t('dev.clientSecret')}</label>
                  <div className="dev-credential-card">
                    <div className="dev-credential-display">
                      <span className="dev-credential-code">{modal.app.client_secret}</span>
                    </div>
                    <div className="dev-credential-actions">
                      <button
                        type="button"
                        className="dev-btn-secondary dev-btn-sm"
                        onClick={() => handleCopy(modal.app.client_secret, t('dev.clientSecret'))}
                      >
                        <CopyIcon width="13" height="13" />
                        {t('dev.copy')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dev-modal__footer">
              <button
                type="button"
                className="dev-btn-secondary"
                onClick={() => handleDownloadJson(modal.app)}
              >
                <CodeIcon width="14" height="14" />
                JSON
              </button>
              <button
                type="button"
                className="dev-btn-primary"
                onClick={() => {
                  setModal(null)
                  openDetail(modal.app.id)
                }}
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Application */}
      {modal?.type === 'edit' && modal.app && (
        <div className="dev-modal-overlay" onClick={() => !submitting && setModal(null)}>
          <div className="dev-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dev-modal__header">
              <h3 className="dev-modal__title">{t('dev.editAppTitle')}</h3>
              <button
                type="button"
                className="dev-modal__close"
                onClick={() => setModal(null)}
                disabled={submitting}
              >
                <XIcon width="18" height="18" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="dev-modal__body">
                <div className="dev-input-group">
                  <label htmlFor="editAppName" className="dev-label">
                    {t('dev.appName')}
                  </label>
                  <input
                    id="editAppName"
                    name="appName"
                    type="text"
                    required
                    defaultValue={modal.app.name}
                    className="dev-input"
                  />
                </div>
                <div className="dev-input-group">
                  <label htmlFor="editRedirectUris" className="dev-label">
                    {t('dev.redirectUris')}
                  </label>
                  <textarea
                    id="editRedirectUris"
                    name="redirectUris"
                    required
                    rows={4}
                    defaultValue={modal.app.redirect_uris}
                    className="dev-textarea"
                  />
                  <p className="dev-hint">{t('dev.redirectUrisHint')}</p>
                </div>
              </div>
              <div className="dev-modal__footer">
                <button
                  type="button"
                  className="dev-btn-secondary"
                  onClick={() => setModal(null)}
                  disabled={submitting}
                >
                  {t('dev.cancel')}
                </button>
                <button type="submit" className="dev-btn-primary" disabled={submitting}>
                  {submitting ? '...' : t('dev.saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Delete App Confirm */}
      {modal?.type === 'delete' && modal.app && (
        <div className="dev-modal-overlay" onClick={() => !submitting && setModal(null)}>
          <div className="dev-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dev-modal__header">
              <h3 className="dev-modal__title">{t('dev.delete')}</h3>
              <button
                type="button"
                className="dev-modal__close"
                onClick={() => setModal(null)}
                disabled={submitting}
              >
                <XIcon width="18" height="18" />
              </button>
            </div>
            <div className="dev-modal__body">
              <div className="dev-alert-box dev-alert-box--warning">
                <AlertTriangleIcon width="18" height="18" style={{ flexShrink: 0 }} />
                <span>
                  <strong>{modal.app.name}</strong>: {t('dev.deleteConfirm')}
                </span>
              </div>
            </div>
            <div className="dev-modal__footer">
              <button
                type="button"
                className="dev-btn-secondary"
                onClick={() => setModal(null)}
                disabled={submitting}
              >
                {t('dev.cancel')}
              </button>
              <button
                type="button"
                className="dev-btn-danger"
                disabled={submitting}
                onClick={() => handleDeleteApp(modal.app.id)}
              >
                {submitting ? '...' : t('dev.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Reset Secret Confirm */}
      {modal?.type === 'resetSecret' && modal.app && (
        <div className="dev-modal-overlay" onClick={() => !submitting && setModal(null)}>
          <div className="dev-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dev-modal__header">
              <h3 className="dev-modal__title">{t('dev.resetSecret')}</h3>
              <button
                type="button"
                className="dev-modal__close"
                onClick={() => setModal(null)}
                disabled={submitting}
              >
                <XIcon width="18" height="18" />
              </button>
            </div>
            <div className="dev-modal__body">
              <div className="dev-alert-box dev-alert-box--warning">
                <AlertTriangleIcon width="18" height="18" style={{ flexShrink: 0 }} />
                <span>{t('dev.resetSecretConfirm')}</span>
              </div>
            </div>
            <div className="dev-modal__footer">
              <button
                type="button"
                className="dev-btn-secondary"
                onClick={() => setModal(null)}
                disabled={submitting}
              >
                {t('dev.cancel')}
              </button>
              <button
                type="button"
                className="dev-btn-danger"
                disabled={submitting}
                onClick={() => handleResetSecret(modal.app.id)}
              >
                {submitting ? '...' : t('dev.resetSecret')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create Webhook */}
      {modal?.type === 'createWebhook' && (
        <div className="dev-modal-overlay" onClick={() => !submitting && setModal(null)}>
          <div className="dev-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dev-modal__header">
              <h3 className="dev-modal__title">{t('dev.addWebhook')}</h3>
              <button
                type="button"
                className="dev-modal__close"
                onClick={() => setModal(null)}
                disabled={submitting}
              >
                <XIcon width="18" height="18" />
              </button>
            </div>
            <form onSubmit={handleCreateWebhook}>
              <div className="dev-modal__body">
                <div className="dev-input-group">
                  <label htmlFor="webhookUrl" className="dev-label">
                    {t('dev.webhookUrl')} *
                  </label>
                  <input
                    id="webhookUrl"
                    name="webhookUrl"
                    type="url"
                    required
                    className="dev-input"
                    placeholder="https://myapp.uz/webhooks/authly/"
                    autoFocus
                  />
                  <p className="dev-hint">
                    Authly login/logout yoki akkaunt oʻzgarishi paytida shu URL manziliga JSON payload bilan POST soʻrov yuboradi.
                  </p>
                </div>
              </div>
              <div className="dev-modal__footer">
                <button
                  type="button"
                  className="dev-btn-secondary"
                  onClick={() => setModal(null)}
                  disabled={submitting}
                >
                  {t('dev.cancel')}
                </button>
                <button type="submit" className="dev-btn-primary" disabled={submitting}>
                  {submitting ? '...' : t('dev.addWebhook')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Delete Webhook Confirm */}
      {modal?.type === 'deleteWebhook' && (
        <div className="dev-modal-overlay" onClick={() => !submitting && setModal(null)}>
          <div className="dev-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dev-modal__header">
              <h3 className="dev-modal__title">{t('dev.deleteWebhook')}</h3>
              <button
                type="button"
                className="dev-modal__close"
                onClick={() => setModal(null)}
                disabled={submitting}
              >
                <XIcon width="18" height="18" />
              </button>
            </div>
            <div className="dev-modal__body">
              <p className="dev-hint">{t('dev.deleteWebhookConfirm')}</p>
            </div>
            <div className="dev-modal__footer">
              <button
                type="button"
                className="dev-btn-secondary"
                onClick={() => setModal(null)}
                disabled={submitting}
              >
                {t('dev.cancel')}
              </button>
              <button
                type="button"
                className="dev-btn-danger"
                disabled={submitting}
                onClick={() => handleDeleteWebhook(modal.webhookId)}
              >
                {submitting ? '...' : t('dev.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Reset Webhook Secret Confirm */}
      {modal?.type === 'resetWebhookSecret' && (
        <div className="dev-modal-overlay" onClick={() => !submitting && setModal(null)}>
          <div className="dev-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dev-modal__header">
              <h3 className="dev-modal__title">{t('dev.resetWebhookSecret')}</h3>
              <button
                type="button"
                className="dev-modal__close"
                onClick={() => setModal(null)}
                disabled={submitting}
              >
                <XIcon width="18" height="18" />
              </button>
            </div>
            <div className="dev-modal__body">
              <p className="dev-hint">
                HMAC secret yangilanganda, oldingi secret orqali tekshiriladigan imzo (signature) yangisiga oʻzgaradi.
              </p>
            </div>
            <div className="dev-modal__footer">
              <button
                type="button"
                className="dev-btn-secondary"
                onClick={() => setModal(null)}
                disabled={submitting}
              >
                {t('dev.cancel')}
              </button>
              <button
                type="button"
                className="dev-btn-danger"
                disabled={submitting}
                onClick={() => handleResetWebhookSecret(modal.webhookId)}
              >
                {submitting ? '...' : t('dev.resetWebhookSecret')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
