const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.expo') {
        getFiles(path.join(dir, file), fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const allFiles = [
  ...getFiles(path.join(__dirname, 'src')),
  ...getFiles(path.join(__dirname, 'app'))
];

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('import { colors } from') || content.includes('import { colors, ')) {
    // Skip theme files
    if (file.includes('theme/colors.ts') || file.includes('theme/index.ts') || file.includes('ThemeContext.tsx')) {
      continue;
    }

    console.log('Processing:', file);

    // 1. Replace import
    const importRegex = /import\s+\{\s*colors\s*\}\s+from\s+['"]([^'"]+)theme\/colors['"];?/;
    const match = content.match(importRegex);
    if (match) {
      const relativePrefix = match[1];
      content = content.replace(importRegex, `import { useTheme } from '${relativePrefix}context/ThemeContext';`);
    } else {
        // Try fallback for aliases or different format
        content = content.replace(/import\s+\{\s*colors\s*\}\s+from\s+['"][^'"]+['"];?/, `import { useTheme } from '../src/context/ThemeContext';`);
    }

    // 2. Transform StyleSheet.create
    if (content.includes('const styles = StyleSheet.create({')) {
        content = content.replace(/const styles = StyleSheet\.create\(\{/g, 'const getStyles = (colors: any) => StyleSheet.create({');
    }

    // 3. Inject useTheme into the component body
    // This is tricky, we look for `export default function` or `export function` or `const X = () => {`
    const componentRegex = /(export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{|export\s+function\s+\w+\s*\([^)]*\)\s*\{|const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{|const\s+\w+\s*=\s*forwardRef<[^>]+>\(\([^)]*\)\s*=>\s*\{)/g;
    
    let injected = false;
    content = content.replace(componentRegex, (match) => {
        if (!injected) {
            injected = true;
            const hasStyles = content.includes('getStyles(colors)'); // avoid double
            const styleLine = content.includes('getStyles =') ? '\n  const styles = getStyles(colors);' : '';
            return `${match}\n  const { colors } = useTheme();${styleLine}`;
        }
        return match;
    });

    fs.writeFileSync(file, content, 'utf8');
  }
}
console.log('Done!');
