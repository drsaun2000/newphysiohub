// Design Tokens from Figma Design System
// This file contains all the colors, typography, and design specifications

export const colors = {
  // Primary Colors
  primary: {
    50: '#7724FD',  // Primary color
    40: '#AA8CFE',  // 40% opacity
    30: '#C7B3FE',  // 30% opacity  
    20: '#E3D9FF',  // 20% opacity
    10: '#F1ECFF',  // 10% opacity
  },
  
  // Secondary Colors (Teal/Cyan)
  secondary: {
    50: '#4CD8C8',  // Secondary color
    40: '#8CE8DC',  // 40% opacity
    30: '#A9EEE5',  // 30% opacity
    20: '#C6F3ED',  // 20% opacity
    10: '#E2F9F6',  // 10% opacity
  },
  
  // Tertiary Colors (Pink)
  tertiary: {
    50: '#F3A2D8',  // Tertiary color
    40: '#F7C4E7',  // 40% opacity
    30: '#F9D2ED',  // 30% opacity
    20: '#FCE1F3',  // 20% opacity
    10: '#FEF0F9',  // 10% opacity
  },
  
  // Semantic Colors
  semantic: {
    info: '#4547FB',      // Blue - Info
    danger: '#FF0000',    // Red - Danger/Error
    success: '#1ED2AF',   // Green - Success
    warning: '#FF7F04',   // Orange - Warning
  },
  
  // Neutral Colors
  neutral: {
    10: '#F8FAFC',   // Lightest gray
    20: '#F1F5F9',   // Very light gray
    30: '#E2E8F0',   // Light gray
    40: '#CBD5E1',   // Medium light gray
    50: '#94A3B8',   // Medium gray
    60: '#64748B',   // Medium dark gray
    70: '#475569',   // Dark gray
    80: '#334155',   // Very dark gray
    90: '#1E293B',   // Darkest gray
  }
};

export const typography = {
  // Headlines
  headline1: {
    fontFamily: 'Neue Montreal',
    fontSize: '60px',
    lineHeight: '1.5',
    fontWeight: '64', // This seems to be a custom weight
  },
  
  headline2: {
    fontFamily: 'Neue Montreal', 
    fontSize: '72px',
    lineHeight: '1.5',
    fontWeight: '56', // Custom weight
  },
  
  headline3: {
    fontFamily: 'Neue Montreal',
    fontSize: '48px', 
    lineHeight: '1.5',
    fontWeight: '40', // Custom weight
  },
  
  headline4: {
    fontFamily: 'Neue Montreal',
    fontSize: '40px',
    lineHeight: '1.5', 
    fontWeight: '56', // Custom weight
  },
  
  headline5: {
    fontFamily: 'Neue Montreal',
    fontSize: '28px',
    lineHeight: '1.5',
    fontWeight: '36', // Custom weight
  },
  
  headline6: {
    fontFamily: 'Neue Montreal',
    fontSize: '24px',
    lineHeight: '1.5',
    fontWeight: '32', // Custom weight
  },
  
  // Body Text
  bodyXLarge: {
    fontFamily: 'Neue Montreal Medium',
    fontSize: '20px',
    lineHeight: '1.5',
    fontWeight: '32', // Custom weight
  },
  
  bodyLarge: {
    medium: {
      fontFamily: 'Neue Montreal Medium',
      fontSize: '18px', 
      lineHeight: '1.5',
      fontWeight: '28', // Custom weight
    },
    regular: {
      fontFamily: 'Neue Montreal Regular',
      fontSize: '18px',
      lineHeight: '1.5', 
      fontWeight: '28', // Custom weight
    }
  },
  
  bodyMedium: {
    medium: {
      fontFamily: 'Neue Montreal Medium',
      fontSize: '16px',
      lineHeight: '1.5',
      fontWeight: '26', // Custom weight
    },
    regular: {
      fontFamily: 'Neue Montreal Regular', 
      fontSize: '16px',
      lineHeight: '1.5',
      fontWeight: '26', // Custom weight
    }
  },
  
  bodySmall: {
    medium: {
      fontFamily: 'Neue Montreal Medium',
      fontSize: '14px',
      lineHeight: '1.5',
      fontWeight: '20', // Custom weight
    },
    regular: {
      fontFamily: 'Neue Montreal Regular',
      fontSize: '14px', 
      lineHeight: '1.5',
      fontWeight: '20', // Custom weight
    }
  }
};

// Helper function to get color values
export const getColor = (category, shade) => {
  return colors[category]?.[shade] || colors.neutral[50];
};

// Helper function to get typography styles
export const getTypography = (style, variant = null) => {
  if (variant && typography[style]?.[variant]) {
    return typography[style][variant];
  }
  return typography[style] || typography.bodyMedium.regular;
}; 