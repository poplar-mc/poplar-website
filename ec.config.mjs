import { defineEcConfig } from '@astrojs/starlight/expressive-code';
import poplarGrammar from './src/code/poplar.tmLanguage.json' with { type: 'json' };
import mcfunctionGrammar from './src/code/mcfunction.tmLanguage.json' with { type: 'json' };
import poplarTheme from './src/code/poplar-theme.json' with { type: 'json' };

export default defineEcConfig({
  themes: [poplarTheme],
  useStarlightDarkModeSwitch: false,
  useStarlightUiThemeColors: false,
  shiki: { langs: [poplarGrammar, mcfunctionGrammar] },
  styleOverrides: {
    borderRadius: 'var(--radius-lg)',
    borderWidth: '0',
    codeBackground: 'var(--code-bg)',
    codeFontFamily: 'var(--font-mono)',
    codeFontSize: '14px',
    codeLineHeight: '22px',
    uiFontFamily: 'var(--font-mono)',
    uiFontSize: '12px',
    frames: {
      editorBackground: 'var(--code-bg)',
      editorTabBarBackground: 'var(--code-bar)',
      editorActiveTabBackground: 'var(--code-bar)',
      editorActiveTabForeground: 'var(--code-fg)',
      editorActiveTabIndicatorTopColor: 'transparent',
      editorActiveTabIndicatorBottomColor: 'transparent',
      editorTabBarBorderBottomColor: 'transparent',
      terminalBackground: 'var(--code-bg)',
      terminalTitlebarBackground: 'var(--code-bar)',
      terminalTitlebarForeground: 'var(--code-fg)',
      terminalTitlebarBorderBottomColor: 'transparent',
      frameBoxShadowCssValue: 'var(--pp-shadow-lift)',
    },
  },
});
