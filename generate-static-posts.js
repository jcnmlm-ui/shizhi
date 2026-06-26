#!/usr/bin/env node
/**
 * generate-static-posts.js
 * 為每篇已發布文章產生靜態 HTML（含正確 OG meta），解決社群平台爬蟲無法執行 JS 的問題。
 * 使用方式：node generate-static-posts.js
 */

import fs   from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL  = 'https://haxfwofjrfkjwestfzvk.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhheGZ3b2ZqcmZrandlc3RmenZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTg2NzQsImV4cCI6MjA5NjIzNDY3NH0.j-mo1J0D-xDmsLb1sTBjthKHXMJVu1Y_bj5akCKE07w';
const SITE_BASE     = 'https://valuelens.tw';
const OUT_DIR       = path.join(__dirname, 'public', 'posts');

function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        else resolve(JSON.parse(data));
      });
    }).on('error', reject);
  });
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toISOString().slice(0, 10);
}

function makeHtml(post) {
  const title    = esc(post.title);
  const desc     = esc(post.excerpt || post.title);
  const url      = `${SITE_BASE}/story/${post.slug}/`;
  const dateStr  = fmtDate(post.published_at || post.created_at);

  return `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8" />
<title>${title} · 時值</title>
<meta name="description" content="${desc}" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="時值 · 財務地圖" />
<meta property="og:title" content="${title} · 時值" />
<meta property="og:description" content="${desc}" />
<meta property="og:url" content="${url}" />
${dateStr ? `<meta property="article:published_time" content="${dateStr}" />` : ''}
<link rel="canonical" href="${url}" />
<meta http-equiv="refresh" content="0; url=${url}" />
<script>window.location.replace(${JSON.stringify(url)});<\/script>
</head>
<body>
<p>正在跳轉… <a href="${url}">點此前往</a></p>
</body>
</html>`;
}

function makeSitemap(posts) {
  const staticPages = [
    { url: `${SITE_BASE}/`,                        priority: '1.0' },
    { url: `${SITE_BASE}/story/`,                  priority: '0.9' },
    { url: `${SITE_BASE}/about/`,                  priority: '0.8' },
    { url: `${SITE_BASE}/tools/postal-salary/`,    priority: '0.8' },
    { url: `${SITE_BASE}/terms/`,                  priority: '0.5' },
  ];
  const postPages = posts.map(p => ({
    url: `${SITE_BASE}/story/${p.slug}/`,
    priority: '0.8',
    lastmod: fmtDate(p.updated_at || p.published_at),
  }));

  const urlEntries = [...staticPages, ...postPages].map(p => `  <url>
    <loc>${p.url}</loc>
    ${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}
    <priority>${p.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

async function main() {
  console.log('📡 從 Supabase 抓取已發布文章…');
  const posts = await httpsGet(
    `${SUPABASE_URL}/rest/v1/fp_posts?select=*&published=eq.true&order=published_at.desc`,
    { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` }
  );

  if (!posts.length) {
    console.log('⚠️  沒有已發布的文章，跳過靜態頁面產生。');
    return;
  }

  console.log(`✅ 找到 ${posts.length} 篇已發布文章`);

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const post of posts) {
    const dir = path.join(OUT_DIR, post.slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), makeHtml(post), 'utf8');
    console.log(`  📄 public/posts/${post.slug}/index.html`);
  }

  const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, makeSitemap(posts), 'utf8');
  console.log('  🗺️  public/sitemap.xml 已更新');

  console.log('\n✨ 完成！記得 git add public/posts/ public/sitemap.xml && git push');
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
