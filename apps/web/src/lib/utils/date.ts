import { format, formatDistanceToNow } from 'date-fns'

export function formatDate(date: Date | string | number): string {
  return format(new Date(date), 'MMMM d, yyyy')
}

export function formatRelativeDate(date: Date | string | number): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}
