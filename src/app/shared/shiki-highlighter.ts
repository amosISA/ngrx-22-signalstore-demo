import typescript from '@shikijs/langs/typescript';
import darkPlus from '@shikijs/themes/dark-plus';
import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

export interface HighlightedCode {
  readonly background: string;
  readonly foreground: string;
  readonly lines: readonly (readonly { readonly color: string; readonly content: string }[])[];
}

const themeName = 'dark-plus';
const highlighter = createHighlighterCore({
  engine: createJavaScriptRegexEngine(),
  langs: [typescript],
  themes: [darkPlus],
});

export async function highlightCode(code: string): Promise<HighlightedCode> {
  const instance = await highlighter;
  const result = instance.codeToTokens(code, {
    lang: 'typescript',
    theme: themeName,
  });
  const background = result.bg ?? '#1e1e1e';
  const foreground = result.fg ?? '#d4d4d4';

  return {
    background,
    foreground,
    lines: result.tokens.map((line) =>
      line.map((token) => ({
        color: token.color ?? foreground,
        content: token.content,
      })),
    ),
  };
}
