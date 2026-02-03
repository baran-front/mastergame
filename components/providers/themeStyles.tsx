import { brand } from "@/brand";

function parseTheme(theme: unknown) {
  if (typeof theme === "string") {
    try {
      return JSON.parse(theme);
    } catch {
      return null;
    }
  }
  return theme;
}

export function ThemeStyles() {
  const theme = parseTheme(brand.theme);

  if (!theme) return null;

  const lightColors = theme.light || {};
  const darkColors = theme.dark || {};

  // Generate CSS variables for light theme
  const lightVars = Object.entries(lightColors)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");

  // Generate CSS variables for dark theme
  const darkVars = Object.entries(darkColors)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");

  // Server-side style injection - calculated before DOM render
  // This runs on the server and is included in the initial HTML
  const css = `
:root {
${lightVars}
}

.dark {
${darkVars}
}
  `.trim();

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: css,
      }}
    />
  );
}
