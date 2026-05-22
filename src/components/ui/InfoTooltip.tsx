import { InfoIcon } from '../icons'

type InfoTooltipProps = {
  text: string
  size?: number
}

export function InfoTooltip({
  text,
  size = 16,
}: InfoTooltipProps) {
  return (
    <span className="group relative inline-flex items-center">
      <InfoIcon
        size={size}
        className="cursor-help text-slate-500 transition-colors group-hover:text-slate-700"
      />

      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-max max-w-[280px] -translate-x-1/2 rounded bg-slate-900 px-3 py-2 text-center text-xs font-medium leading-relaxed text-white shadow-lg group-hover:block">
        {text}

        <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-slate-900" />
      </span>
    </span>
  )
}