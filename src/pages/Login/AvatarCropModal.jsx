import { useEffect, useRef, useState } from 'react'
import { RefreshCwIcon, XIcon } from '../../components/icons.jsx'
import { useI18n } from '../../i18n/context.js'
import './AvatarCropModal.css'

export default function AvatarCropModal({ file, onCrop, onCancel }) {
  const { t } = useI18n()
  const [imgSrc] = useState(() => (file ? URL.createObjectURL(file) : null))
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 })
  const [zoom, setZoom] = useState(1)
  const [baseZoom, setBaseZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [processing, setProcessing] = useState(false)

  const imgRef = useRef(null)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const panStartRef = useRef({ x: 0, y: 0 })
  const touchDistRef = useRef(null)

  // Oyna o'lchamiga mos responsive crop doira diametri (230px - 260px)
  const [cropSize, setCropSize] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth <= 380 ? 230 : 260,
  )

  useEffect(() => {
    const handleResize = () => {
      setCropSize(window.innerWidth <= 380 ? 230 : 260)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    return () => {
      if (imgSrc) URL.revokeObjectURL(imgSrc)
    }
  }, [imgSrc])

  // Rasm to'liq yuklangach o'lchamlarini olish va dastlabki moslash
  const handleImageLoad = (e) => {
    const nw = e.currentTarget.naturalWidth || 500
    const nh = e.currentTarget.naturalHeight || 500
    setNaturalSize({ width: nw, height: nh })

    // Aylana to'liq to'ldirilishi uchun minimal scale
    const scale = Math.max(cropSize / nw, cropSize / nh)
    setBaseZoom(scale)
    setZoom(scale)
    setPan({ x: 0, y: 0 })
    setRotation(0)
  }

  // 90 gradusga burish
  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360)
  }

  // Pointer (sichqoncha va barmoq) orqali surish
  const handlePointerDown = (e) => {
    e.preventDefault()
    isDraggingRef.current = true
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    panStartRef.current = { ...pan }
    if (e.currentTarget.setPointerCapture) {
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    })
  }

  const handlePointerUp = (e) => {
    isDraggingRef.current = false
    if (e.currentTarget.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        // ignore
      }
    }
  }

  // Sichqoncha g'ildiragi orqali zoom
  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY * -0.0015
    setZoom((curr) => {
      const min = baseZoom * 0.8
      const max = baseZoom * 4
      return Math.min(Math.max(curr + delta * baseZoom, min), max)
    })
  }

  // Touch pinch to zoom (telefonda 2 barmoq bilan masshtab)
  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      )
      if (touchDistRef.current != null) {
        const factor = dist / touchDistRef.current
        setZoom((curr) => {
          const min = baseZoom * 0.8
          const max = baseZoom * 4
          return Math.min(Math.max(curr * factor, min), max)
        })
      }
      touchDistRef.current = dist
    }
  }

  const handleTouchEnd = () => {
    touchDistRef.current = null
  }

  // Range slider foizini hisoblash
  const minSlider = baseZoom
  const maxSlider = baseZoom * 3.5
  const sliderValue = Math.min(Math.max(zoom, minSlider), maxSlider)

  const handleSliderChange = (e) => {
    setZoom(parseFloat(e.target.value))
  }

  // Rasmni 512x512 ga qirqib olish va qaytarish
  const handleApply = () => {
    if (!imgRef.current) return
    setProcessing(true)

    try {
      const canvas = document.createElement('canvas')
      const outSize = 512
      canvas.width = outSize
      canvas.height = outSize
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        setProcessing(false)
        return
      }

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      const ratio = outSize / cropSize

      ctx.translate(outSize / 2, outSize / 2)
      ctx.translate(pan.x * ratio, pan.y * ratio)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.scale(zoom * ratio, zoom * ratio)

      ctx.drawImage(
        imgRef.current,
        -naturalSize.width / 2,
        -naturalSize.height / 2,
        naturalSize.width,
        naturalSize.height,
      )

      canvas.toBlob(
        (blob) => {
          setProcessing(false)
          if (!blob) return
          const croppedFile = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
          const croppedUrl = URL.createObjectURL(blob)
          onCrop(croppedFile, croppedUrl)
        },
        'image/jpeg',
        0.92,
      )
    } catch {
      setProcessing(false)
      onCancel()
    }
  }

  return (
    <div className="crop-modal-overlay" onClick={onCancel}>
      <div className="crop-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="crop-modal__header">
          <div>
            <h3 className="crop-modal__title">{t('profile.cropTitle')}</h3>
            <p className="crop-modal__hint">{t('profile.cropHint')}</p>
          </div>
          <button
            type="button"
            className="crop-modal__close"
            onClick={onCancel}
            title={t('common.close')}
          >
            <XIcon width="18" height="18" />
          </button>
        </div>

        {/* Viewport & Image area */}
        <div
          className="crop-viewport"
          style={{ width: `${cropSize + 32}px`, height: `${cropSize + 32}px` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {imgSrc && (
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Crop preview"
              className="crop-image"
              onLoad={handleImageLoad}
              style={{
                transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
              }}
              draggable={false}
            />
          )}

          {/* Dumaloq qirqish teshigi va maskasi */}
          <div
            className="crop-circle-mask"
            style={{ width: `${cropSize}px`, height: `${cropSize}px` }}
          />
        </div>

        {/* Controls: Zoom slider & Rotate */}
        <div className="crop-controls">
          <div className="crop-zoom-row">
            <span className="crop-zoom-icon">−</span>
            <input
              type="range"
              min={minSlider}
              max={maxSlider}
              step={(maxSlider - minSlider) / 100}
              value={sliderValue}
              onChange={handleSliderChange}
              className="crop-zoom-slider"
              aria-label="Zoom"
            />
            <span className="crop-zoom-icon">+</span>
          </div>

          <button
            type="button"
            className="crop-rotate-btn"
            onClick={handleRotate}
            title={t('profile.rotate')}
          >
            <RefreshCwIcon width="15" height="15" />
            <span>{t('profile.rotate')}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="crop-modal__footer">
          <button
            type="button"
            className="btn-crop-cancel"
            onClick={onCancel}
            disabled={processing}
          >
            {t('profile.cropCancel')}
          </button>
          <button
            type="button"
            className="btn-crop-apply"
            onClick={handleApply}
            disabled={processing}
          >
            {processing ? '...' : t('profile.cropApply')}
          </button>
        </div>
      </div>
    </div>
  )
}
