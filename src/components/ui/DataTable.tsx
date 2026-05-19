import type { ReactNode } from 'react'

export type DataTableColumn<T> = {
  key: keyof T | string
  header: string
  render?: (row: T, index: number) => ReactNode
  className?: string
}

type DataTableProps<T> = {
  title: string
  columns: DataTableColumn<T>[]
  data: T[]
  isLoading?: boolean
  error?: string | null
  loadingMessage?: string
  emptyMessage?: string
  toolbarContent?: ReactNode
}

export function DataTable<T>({
  title,
  columns,
  data,
  isLoading = false,
  error = null,
  loadingMessage = 'Cargando datos...',
  emptyMessage = 'No hay registros disponibles',
  toolbarContent,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-100">
      <div className="bg-slate-900 px-6 py-4">
        <h2 className="text-xl font-medium text-white">{title}</h2>
      </div>

      {toolbarContent && (
        <div className="bg-white px-6 py-4">
          {toolbarContent}
        </div>
      )}

      <table className="w-full bg-white">
        <thead className="border-b border-slate-100">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-6 py-3 text-left text-sm font-normal text-slate-900 ${
                  column.className ?? ''
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-10 text-center text-sm text-slate-500"
              >
                {loadingMessage}
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-10 text-center text-sm text-red-500"
              >
                {error}
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-10 text-center text-sm text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`px-6 py-4 text-sm text-slate-700 ${
                      column.className ?? ''
                    }`}
                  >
                    {column.render
                      ? column.render(row, rowIndex)
                      : String(row[column.key as keyof T] ?? '-')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}