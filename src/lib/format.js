export function money(n) {
  const num = Number(n) || 0
  return '₹' + (Math.round(num * 100) / 100).toLocaleString('en-IN')
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}
