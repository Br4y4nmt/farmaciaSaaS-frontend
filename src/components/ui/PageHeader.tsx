import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  icon?: ReactNode
  buttonText?: string
  onButtonClick?: () => void
  actions?: ReactNode
}

export function PageHeader({
  title,
  icon,
  buttonText,
  onButtonClick,
  actions,
}: PageHeaderProps) {
  return (
    <div className="w-full bg-white px-8 shadow-slate-100">
      <div className="flex min-h-[55px] items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-slate-400">
              {icon}
            </div>
          )}

          <h1 className="text-sm font-normal text-slate-400">
            {title}
          </h1>
        </div>

        {(actions || buttonText) && (
          <div className="flex items-center gap-2">
            {actions}

            {buttonText && (
              <button
                onClick={onButtonClick}
                className="flex items-center gap-2 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1.5 text-[12px] font-normal text-white transition hover:bg-slate-800"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>

                {buttonText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}