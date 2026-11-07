import { useCallback, useEffect, useRef, useState } from 'react'
import { RefreshCwIcon, XIcon } from '../../components/icons.jsx'
import { useI18n } from '../../i18n/context.js'
import './AvatarCropModal.css'

export default function AvatarCropModal({ file, onCrop, onCancel }) {
  const { t } = useI18n()
  const [imgSrc] = useState(() => (file ? URL.createObjectURL(file) : null))
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
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

  // Aylanishni hisobga olgan holda rasmning samarali o'lchamlari
  const isRotated = rotation % 180 !== 0
  const effWidth = isRotated ? naturalSize.height : naturalSize.width
  const effHeight = isRotated ? naturalSize.width : naturalSize.height

  // Doirani to'liq qoplash uchun zarur bo'lgan qat'iy minimal masshtab
  const minZoom =
    effWidth > 0 && effHeight > 0
      ? Math.max(cropSize / effWidth, cropSize / effHeight)
      : 1
  const maxZoom = minZoom * 3.5

  // Pan chegaralarini hisoblash (rasm chetlari doiradan ichkariga kirib ketmasligi uchun)
  const clampPan = useCallback(
    (p, currentZoom = zoom, currentRot = rotation) => {
      const rot = currentRot % 180 !== 0
      const w = (rot ? naturalSize.height : naturalSize.width) * currentZoom
      const h = (rot ? naturalSize.width : naturalSize.height) * currentZoom
      if (!w || !h) return p
      const maxX = Math.max(0, (w - cropSize) / 2)
      const maxY = Math.max(0, (h - cropSize) / 2)
      return {
        x: Math.min(Math.max(p.x, -maxX), maxX),
        y: Math.min(Math.max(p.y, -maxY), maxY),
      }
    },
    [zoom, rotation, naturalSize.width, naturalSize.height, cropSize],
  )

  // Rasm yuklangach dastlabki markazlashtirish
  const handleImageLoad = (e) => {
    const nw = e.currentTarget.naturalWidth || 500
    const nh = e.currentTarget.naturalHeight || 500
    setNaturalSize({ width: nw, height: nh })

    const initialMin = Math.max(cropSize / nw, cropSize / nh)
    setZoom(initialMin)
    setPan({ x: 0, y: 0 })
    setRotation(0)
  }

  // 90 gradusga burish (burilganda minZoom qayta hisoblanadi va pan chegaralanadi)
  const handleRotate = () => {
    const nextRot = (rotation + 90) % 360
    setRotation(nextRot)

    const rot = nextRot % 180 !== 0
    const w = rot ? naturalSize.height : naturalSize.width
    const h = rot ? naturalSize.width : naturalSize.height
    const nextMin = w > 0 && h > 0 ? Math.max(cropSize / w, cropSize / h) : 1

    const nextZoom = Math.max(zoom, nextMin)
    setZoom(nextZoom)
    setPan((p) => clampPan(p, nextZoom, nextRot))
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
    const rawPan = {
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    }
    setPan(clampPan(rawPan))
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

  // Slider orqali masshtabni o'zgartirish
  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value)
    const nextZoom = Math.min(Math.max(val, minZoom), maxZoom)
    setZoom(nextZoom)
    setPan((p) => clampPan(p, nextZoom))
  }

  // Qadamli masshtab (+ va - tugmalari)
  const handleStepZoom = (step) => {
    setZoom((curr) => {
      const nextZoom = Math.min(Math.max(curr + step * minZoom, minZoom), maxZoom)
      setPan((p) => clampPan(p, nextZoom))
      return nextZoom
    })
  }

  // Sichqoncha g'ildiragi orqali zoom
  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY * -0.0015
    setZoom((curr) => {
      const nextZoom = Math.min(Math.max(curr + delta * minZoom, minZoom), maxZoom)
      setPan((p) => clampPan(p, nextZoom))
      return nextZoom
    })
  }

  // Touch pinch to zoom (telefonda 2 barmoq bilan masshtab)
  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      isDraggingRef.current = false
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      )
      if (touchDistRef.current != null) {
        const factor = dist / touchDistRef.current
        setZoom((curr) => {
          const nextZoom = Math.min(Math.max(curr * factor, minZoom), maxZoom)
          setPan((p) => clampPan(p, nextZoom))
          return nextZoom
        })
      }
      touchDistRef.current = dist
    }
  }

  const handleTouchEnd = () => {
    touchDistRef.current = null
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

  const activeSliderVal = Math.min(Math.max(zoom, minZoom), maxZoom)

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

        {/* 1-variant: Slayder va Burish bitta qatorda birlashtirilgan */}
        <div className="crop-controls">
          <div className="crop-zoom-bar">
            <button
              type="button"
              className="crop-zoom-step-btn"
              onClick={() => handleStepZoom(-0.25)}
              disabled={zoom <= minZoom + 0.001}
              aria-label="Zoom out"
            >
              −
            </button>
            <input
              type="range"
              min={minZoom}
              max={maxZoom}
              step={(maxZoom - minZoom) / 100}
              value={activeSliderVal}
              onChange={handleSliderChange}
              className="crop-zoom-slider"
              aria-label="Zoom"
            />
            <button
              type="button"
              className="crop-zoom-step-btn"
              onClick={() => handleStepZoom(0.25)}
              disabled={zoom >= maxZoom - 0.001}
              aria-label="Zoom in"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="crop-rotate-btn"
            onClick={handleRotate}
            title={t('profile.rotate')}
            aria-label={t('profile.rotate')}
          >
            <RefreshCwIcon width="15" height="15" />
            <span className="crop-rotate-label">90°</span>
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
