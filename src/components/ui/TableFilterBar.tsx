import type { ChangeEvent } from 'react'

export type TableFilterOption = {
  value: string
  label: string
}

type TableFilterBarProps = {
  filterLabel?: string
  options?: TableFilterOption[]
  selectedFilter?: string
  onFilterChange?: (value: string) => void
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  selectMinWidth?: number
  searchMinWidth?: number
  searchMaxWidth?: number
}

export function TableFilterBar({
  filterLabel = 'Filtrar por:',
  options = [{ value: 'nombre', label: 'Nombre' }],
  selectedFilter,
  onFilterChange,
  searchPlaceholder = 'Buscar',
  searchValue,
  onSearchChange,
  selectMinWidth = 260,
  searchMinWidth = 260,
  searchMaxWidth = 520,
}: TableFilterBarProps) {
  function handleFilterChange(event: ChangeEvent<HTMLSelectElement>) {
    onFilterChange?.(event.target.value)
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    onSearchChange?.(event.target.value)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-slate-500">{filterLabel}</span>

      <div className="relative">
        <select
          className="h-8 rounded border border-slate-200 bg-white px-3 pr-7 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          style={{ minWidth: `${selectMinWidth}px`, color: '#94a3b8' }}
          value={selectedFilter ?? options[0]?.value}
          onChange={handleFilterChange}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div
        className="relative flex-1"
        style={{ minWidth: `${searchMinWidth}px`, maxWidth: `${searchMaxWidth}px` }}
      >
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="h-8 w-full rounded border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          value={searchValue ?? ''}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  )
}
