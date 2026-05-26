import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { InfoIcon } from '../icons'

type InfoTooltipProps = {
  text: string
  size?: number
  children?: React.ReactNode
}

export function InfoTooltip({ text, size = 16, children }: InfoTooltipProps) {
  const anchorRef = useRef<HTMLSpanElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState({ left: 0, top: 0 })

  useEffect(() => {
    if (!visible) return

    function update() {
      const el = anchorRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      setCoords({ left: rect.left + rect.width / 2, top: rect.top })
    }

    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [visible])

  const tooltip = (
    <div
      style={{
        position: 'fixed',
        left: coords.left,
        top: coords.top - 8,
        transform: 'translateX(-50%) translateY(-100%)',
        zIndex: 10000,
      }}
      className="pointer-events-none w-max max-w-[280px] rounded bg-slate-900 px-3 py-2 text-center text-xs font-medium leading-relaxed text-white shadow-lg"
    >
      {text}

      <span
        style={{ left: '50%' }}
        className="absolute top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-slate-900"
      />
    </div>
  )

  return (
    <span
      ref={anchorRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children ?? (
        <InfoIcon size={size} className="cursor-help text-slate-500 transition-colors hover:text-slate-700" />
      )}

      {visible && typeof document !== 'undefined' ? createPortal(tooltip, document.body) : null}
    </span>
  )
}