/**
 * Định dạng số thành tiền tệ VND
 */
export const formatCurrency = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num || 0)
}

/**
 * Định dạng chuỗi ngày tháng sang định dạng Việt Nam (DD/MM/YYYY)
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}
