import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme, ColorSchemeName } from 'react-native';
import { colors as lightColors, darkColors, ColorTokens } from '../theme/colors';

interface ThemeContextType {
  theme: ColorSchemeName;
  colors: ColorTokens;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: lightColors,
  isDark: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ColorSchemeName>(systemColorScheme);

  useEffect(() => {
    setTheme(systemColorScheme);
  }, [systemColorScheme]);

  const isDark = theme === 'dark';
  const activeColors = isDark ? (darkColors as unknown as ColorTokens) : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, colors: activeColors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
