/**
 * Tiny safe markdown renderer for comment bodies.
 *
 * Supports a deliberate subset:
 *   **bold**, *italic*, [text](url), bare https?: URLs,
 *   - bullet lists, line breaks, @Francis / @Yuwen / @Manna mentions.
 *
 * Strategy: HTML-escape the entire input first, then apply replacements
 * that produce known-safe HTML. Every <a href> is filtered to http/https
 * to avoid `javascript:` / `data:` smuggling.
 */

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;');

const safeHref = (raw: string): string | null => {
  // After HTML-escape, & became &amp; — undo for URL parsing.
  const url = raw.replace(/&amp;/g, '&');
  if (!/^https?:\/\//i.test(url)) return null;
  // Re-escape quotes/<> for HTML attribute safety.
  return url.replace(/"/g, '%22').replace(/</g, '%3C').replace(/>/g, '%3E');
};

const linkClass = 'text-wedding-gold underline hover:opacity-80 break-all';
const mentionClass = 'bg-wedding-gold/15 text-wedding-gold font-bold px-1 rounded';

export const renderCommentBody = (raw: string): string => {
  let html = escapeHtml(raw);

  // Bold: **text**
  html = html.replace(/\*\*([^\*\n]+)\*\*/g, '<strong>$1</strong>');

  // Italic: *text* (single-asterisk; no greedy)
  html = html.replace(/(^|[^\*])\*([^\*\n]+)\*(?!\*)/g, '$1<em>$2</em>');

  // [text](url) links — http/https only
  html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, url) => {
    const href = safeHref(url);
    return href
      ? `<a href="${href}" target="_blank" rel="noopener noreferrer" class="${linkClass}">${text}</a>`
      : text;
  });

  // Bare URL auto-link (skip if already inside an href)
  html = html.replace(/(^|[\s(])((?:https?:\/\/)[^\s<>"]+)/g, (_match, lead, url) => {
    const href = safeHref(url);
    return href
      ? `${lead}<a href="${href}" target="_blank" rel="noopener noreferrer" class="${linkClass}">${url}</a>`
      : `${lead}${url}`;
  });

  // @mentions
  html = html.replace(/@(Francis|Yuwen|Manna)\b/g, `<span class="${mentionClass}">@$1</span>`);

  // Simple bullet list: lines starting with "- " in a row
  html = html.replace(/(^|\n)((?:- .+(?:\n|$))+)/g, (_m, lead, block) => {
    const items = block.trim().split('\n').map((line: string) =>
      `<li>${line.replace(/^- /, '')}</li>`
    ).join('');
    return `${lead}<ul class="list-disc pl-5 my-1">${items}</ul>`;
  });

  // Line breaks (preserve double newlines as paragraph spacing)
  html = html.replace(/\n\n+/g, '<br/><br/>').replace(/\n/g, '<br/>');

  return html;
};
