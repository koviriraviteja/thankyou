import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme, ColorSchemeName } from 'react-native';
import { colors as lightColors, darkColors, ColorTokens } from '../theme/colors';

interface ThemeContextType {
  theme: ColorSchemeName;
  colors: ColorTokens;
  isDark: boolean;
  setTheme: (theme: ColorSchemeName) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: lightColors,
  isDark: false,
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ColorSchemeName>('light');


  const isDark = theme === 'dark';
  const activeColors = isDark ? (darkColors as unknown as ColorTokens) : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, colors: activeColors, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
