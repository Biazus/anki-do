export function isFlip3dSupported(): boolean {
  if (typeof navigator === 'undefined') {
    return true
  }

  const ua = navigator.userAgent
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isSafari = /Safari/.test(ua) && !/Chrom(e|ium)|CriOS|FxiOS|EdgiOS/.test(ua)

  return !(isIOS || isSafari)
}
