export function createSrcSet(imageSrc) {
  const viewport = ['400w', '700w', '1000w'];
  const widthParams = [{ w: '384' }, { w: '576' }, { w: '732' }];
  const payloadString = (arr) => Object.entries(arr).map(e => e.join('=')).join('&');
  const result = widthParams.reduce((prev, width, i) => `${prev}/_next/image?${payloadString({ url: imageSrc, ...width, q: '75' })} ${viewport[i]},`, '',);
  return result
}