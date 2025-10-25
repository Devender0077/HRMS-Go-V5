// ----------------------------------------------------------------------

export function remToPx(value) {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value) {
  return `${value / 16}rem`;
}

export function responsiveFontSizes({ sm, md, lg }) {
  return {
    '@media (min-width:600px)': {
      fontSize: pxToRem(sm),
    },
    '@media (min-width:900px)': {
      fontSize: pxToRem(md),
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg),
    },
  };
}

// ----------------------------------------------------------------------

const FONT_PRIMARY = 'Public Sans, sans-serif'; // Google Font
// const FONT_SECONDARY = 'CircularStd, sans-serif'; // Local Font

// Font size multipliers
const FONT_SIZE_MULTIPLIERS = {
  small: 0.875,  // 87.5%
  medium: 1,     // 100% (default)
  large: 1.125,  // 112.5%
};

export function getTypography(fontFamily = 'Public Sans', fontSize = 'medium') {
  const multiplier = FONT_SIZE_MULTIPLIERS[fontSize] || 1;
  const scale = (value) => Math.round(value * multiplier);
  
  return {
    fontFamily: `${fontFamily}, sans-serif`,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: {
      fontWeight: 800,
      lineHeight: 80 / 64,
      fontSize: pxToRem(scale(40)),
      ...responsiveFontSizes({ sm: scale(52), md: scale(58), lg: scale(64) }),
    },
    h2: {
      fontWeight: 800,
      lineHeight: 64 / 48,
      fontSize: pxToRem(scale(32)),
      ...responsiveFontSizes({ sm: scale(40), md: scale(44), lg: scale(48) }),
    },
    h3: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: pxToRem(scale(24)),
      ...responsiveFontSizes({ sm: scale(26), md: scale(30), lg: scale(32) }),
    },
    h4: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: pxToRem(scale(20)),
      ...responsiveFontSizes({ sm: scale(20), md: scale(24), lg: scale(24) }),
    },
    h5: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: pxToRem(scale(18)),
      ...responsiveFontSizes({ sm: scale(19), md: scale(20), lg: scale(20) }),
    },
    h6: {
      fontWeight: 700,
      lineHeight: 28 / 18,
      fontSize: pxToRem(scale(17)),
      ...responsiveFontSizes({ sm: scale(18), md: scale(18), lg: scale(18) }),
    },
    subtitle1: {
      fontWeight: 600,
      lineHeight: 1.5,
      fontSize: pxToRem(scale(16)),
    },
    subtitle2: {
      fontWeight: 600,
      lineHeight: 22 / 14,
      fontSize: pxToRem(scale(14)),
    },
    body1: {
      lineHeight: 1.5,
      fontSize: pxToRem(scale(16)),
    },
    body2: {
      lineHeight: 22 / 14,
      fontSize: pxToRem(scale(14)),
    },
    caption: {
      lineHeight: 1.5,
      fontSize: pxToRem(scale(12)),
    },
    overline: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: pxToRem(scale(12)),
      textTransform: 'uppercase',
    },
    button: {
      fontWeight: 700,
      lineHeight: 24 / 14,
      fontSize: pxToRem(scale(14)),
      textTransform: 'capitalize',
    },
  };
}

// Default export for backward compatibility
const typography = getTypography();

export default typography;
