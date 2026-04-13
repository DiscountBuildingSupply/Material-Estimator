export const ceilTo = (n, decimals = 0) => {
  const factor = Math.pow(10, decimals)
  return Math.ceil(n * factor) / factor
}

export const roundTo = (n, decimals = 2) => {
  const factor = Math.pow(10, decimals)
  return Math.round(n * factor) / factor
}

export const toNum = (val, fallback = 0) => {
  const n = parseFloat(val)
  return isNaN(n) || n < 0 ? fallback : n
}
