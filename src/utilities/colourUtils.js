//== convert hex to luminance
export function hexToLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const linearise = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))

  const R = linearise(r)
  const G = linearise(g)
  const B = linearise(b)

  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

//== calculate the contrast ratio
export function contrastRatio(hex1, hex2) {
  const L1 = hexToLuminance(hex1)
  const L2 = hexToLuminance(hex2)

  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)

  return (lighter + 0.05) / (darker + 0.05)
}

//== return wcag result set
export function wcagResult(ratio) {
  return {
    ratio: ratio.toFixed(2),
    results: [
      { id: 'AA_normal', label: 'AA Normal', pass: ratio >= 4.5 },
      { id: 'AA_large', label: 'AA Large', pass: ratio >= 3 },
      { id: 'AAA_normal', label: 'AAA Normal', pass: ratio >= 7 },
      { id: 'AAA_large', label: 'AAA Large', pass: ratio >= 4.5 }
    ]
  }
}

//== expand shorthand hex values e.g. #fff to #ffffff
export function expandHex(hex) {
  if (hex.length === 4) {
    return '#' + [...hex.slice(1)].map((c) => c + c).join('')
  }

  return hex
}
