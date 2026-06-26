import { marked } from 'marked';

function escHtml(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderBlock(block) {
  const d = block.data || {};
  switch (block.type) {
    case 'header':
      return `<h${d.level}>${d.text}</h${d.level}>`;
    case 'paragraph':
      return d.text ? `<p>${d.text}</p>` : '';
    case 'image': {
      const cls = ['article-img', d.stretched ? 'img-stretched' : '', d.withBackground ? 'img-background' : '', d.withBorder ? 'img-border' : ''].filter(Boolean).join(' ');
      return `<figure class="${cls}"><img src="${escHtml(d.file?.url || '')}" alt="${escHtml(d.caption || '')}">${d.caption ? `<figcaption>${d.caption}</figcaption>` : ''}</figure>`;
    }
    case 'list': {
      const tag = d.style === 'ordered' ? 'ol' : 'ul';
      const items = (d.items || []).map(i => `<li>${typeof i === 'string' ? i : (i.content || '')}</li>`).join('');
      return `<${tag}>${items}</${tag}>`;
    }
    case 'quote':
      return `<blockquote>${d.text}${d.caption ? `<cite>— ${d.caption}</cite>` : ''}</blockquote>`;
    case 'delimiter':
      return '<hr>';
    case 'code':
      return `<pre><code>${escHtml(d.code || '')}</code></pre>`;
    case 'embed':
      return `<div class="embed-wrap"><iframe src="${escHtml(d.embed || '')}" allowfullscreen></iframe></div>`;
    case 'table': {
      const rows = (d.content || []).map((row, i) => {
        const tag = i === 0 && d.withHeadings ? 'th' : 'td';
        return `<tr>${row.map(c => `<${tag}>${c}</${tag}>`).join('')}</tr>`;
      }).join('');
      return `<table>${rows}</table>`;
    }
    default:
      return '';
  }
}

export function renderContent(content) {
  if (!content) return '';
  try {
    const data = JSON.parse(content);
    if (data.blocks && Array.isArray(data.blocks)) return data.blocks.map(renderBlock).join('');
  } catch {}
  if (content.trim().startsWith('<')) return content;
  return marked.parse(content);
}
