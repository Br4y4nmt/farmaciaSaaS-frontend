export function getImageUrl(path?: string | null) {
  if (!path) return null

  if (path.startsWith('http')) {
    return path
  }

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const baseUrl = apiUrl.replace(/\/api\/?$/, '')

  return `${baseUrl}${path}`
}