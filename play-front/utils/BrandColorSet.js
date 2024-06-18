
export default function BrandColorSet(brand) {
  if (brand !== null && brand !== undefined) {
    brand = brand.toLowerCase();
    const RootStyle = (prop, color) => {
      const root = document.querySelector(`:root`);
      root.style.setProperty(prop, color);
    }
    RootStyle('--play-color-1', `var(--${brand}-color-1)`);
    RootStyle('--play-color-2', `var(--${brand}-color-2)`);
    RootStyle('--play-color-3', `var(--${brand}-color-3)`);
    RootStyle('--play-color-4', `var(--${brand}-color-4)`);
    RootStyle('--play-gradient-1', `var(--${brand}-gradient-1)`);
  }
} 