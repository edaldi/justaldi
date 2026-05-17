/**
 * cms.js — Supabase-backed CMS engine
 *
 * PUBLIC API (same as before, all methods now return Promises):
 *   CMS.getProfile()            → Promise<profile>
 *   CMS.saveProfile(obj)        → Promise
 *   CMS.getPosts()              → Promise<post[]>
 *   CMS.getPost(id)             → Promise<post|null>
 *   CMS.savePost(post)          → Promise
 *   CMS.deletePost(id)          → Promise
 *   CMS.getProjects()           → Promise<project[]>
 *   CMS.saveProject(proj)       → Promise
 *   CMS.deleteProject(id)       → Promise
 *   CMS.getExperience()         → Promise<exp[]>
 *   CMS.saveExp(exp)            → Promise
 *   CMS.deleteExp(id)           → Promise
 *   CMS.uid()                   → string
 *   CMS.formatDate(iso)         → string
 *
 * SUPABASE SETUP — replace the two values below with yours:
 *   SUPABASE_URL  → Settings → API → Project URL
 *   SUPABASE_KEY  → Settings → API → anon/public key
 *
 * REQUIRED TABLES (run this SQL in Supabase → SQL Editor):
 * ─────────────────────────────────────────────────────────
 *   create table profile (
 *     id text primary key default 'main',
 *     data jsonb not null default '{}'
 *   );
 *   create table posts (
 *     id text primary key,
 *     tag text, title text, excerpt text,
 *     content text, cover text,
 *     date text, read_min integer,
 *     created_at timestamptz default now()
 *   );
 *   create table projects (
 *     id text primary key,
 *     title text, description text,
 *     tags text, url text, cover text,
 *     created_at timestamptz default now()
 *   );
 *   create table experience (
 *     id text primary key,
 *     period text, role text, company text,
 *     description text, skills text,
 *     created_at timestamptz default now()
 *   );
 *
 *   -- Allow public read + write (no auth needed for personal site):
 *   alter table profile    enable row level security;
 *   alter table posts      enable row level security;
 *   alter table projects   enable row level security;
 *   alter table experience enable row level security;
 *
 *   create policy "public all" on profile    for all using (true) with check (true);
 *   create policy "public all" on posts      for all using (true) with check (true);
 *   create policy "public all" on projects   for all using (true) with check (true);
 *   create policy "public all" on experience for all using (true) with check (true);
 * ─────────────────────────────────────────────────────────
 */

const CMS = (() => {

  /* ── CONFIG — REPLACE THESE ──────────────────── */
  const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
  const SUPABASE_KEY = 'YOUR_ANON_PUBLIC_KEY';
  /* ─────────────────────────────────────────────── */

  const BASE = SUPABASE_URL + '/rest/v1';
  const HEADERS = {
    'apikey':        SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type':  'application/json',
    'Prefer':        'return=representation'
  };

  /* ── FETCH HELPERS ───────────────────────────── */
  async function db(path, options) {
    const res = await fetch(BASE + path, { headers: HEADERS, ...options });
    if (!res.ok) {
      const err = await res.text();
      throw new Error('Supabase error ' + res.status + ': ' + err);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  const get  = (path)        => db(path);
  const post = (path, body)  => db(path, { method: 'POST',   body: JSON.stringify(body) });
  const put  = (path, body)  => db(path, { method: 'PUT',    body: JSON.stringify(body) });
  const del  = (path)        => db(path, { method: 'DELETE' });

  /* ── PROFILE ──────────────────────────────────
     Stored as a single row with id='main' and
     a jsonb column containing the whole object.
  ─────────────────────────────────────────────── */
  const DEFAULT_PROFILE = {
    name: 'Your Name', role: 'Your Role',
    tagline: 'I build things and write about', taglineEm: 'the process.',
    bio: 'Short bio shown on the home page.',
    location: '', currently: '', interests: '', education: '', openTo: '',
    about1: '', about2: '', about3: '', avatar: '',
    social: { twitter: '', github: '', linkedin: '', dribbble: '', email: '' }
  };

  async function getProfile() {
    try {
      const rows = await get('/profile?id=eq.main&select=data');
      if (rows && rows.length > 0) return { ...DEFAULT_PROFILE, ...rows[0].data };
      return DEFAULT_PROFILE;
    } catch (e) {
      console.error('getProfile failed', e);
      return DEFAULT_PROFILE;
    }
  }

  async function saveProfile(profile) {
    // upsert: insert or replace the single "main" row
    await db('/profile', {
      method: 'POST',
      headers: { ...HEADERS, 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify({ id: 'main', data: profile })
    });
  }

  /* ── POSTS ────────────────────────────────────── */
  async function getPosts() {
    try {
      const rows = await get('/posts?select=*&order=date.desc,created_at.desc');
      return (rows || []).map(rowToPost);
    } catch (e) { console.error('getPosts failed', e); return []; }
  }

  async function getPost(id) {
    try {
      const rows = await get('/posts?id=eq.' + encodeURIComponent(id) + '&select=*');
      return rows && rows.length > 0 ? rowToPost(rows[0]) : null;
    } catch (e) { console.error('getPost failed', e); return null; }
  }

  async function savePost(p) {
    await db('/posts', {
      method: 'POST',
      headers: { ...HEADERS, 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(postToRow(p))
    });
  }

  async function deletePost(id) {
    await del('/posts?id=eq.' + encodeURIComponent(id));
  }

  function rowToPost(r) {
    return {
      id: r.id, tag: r.tag || '', title: r.title || '',
      excerpt: r.excerpt || '', content: r.content || '',
      cover: r.cover || '', date: r.date || '',
      readMin: r.read_min || 5
    };
  }
  function postToRow(p) {
    return {
      id: p.id, tag: p.tag, title: p.title,
      excerpt: p.excerpt, content: p.content,
      cover: p.cover, date: p.date, read_min: p.readMin || 5
    };
  }

  /* ── PROJECTS ─────────────────────────────────── */
  async function getProjects() {
    try {
      const rows = await get('/projects?select=*&order=created_at.desc');
      return (rows || []).map(rowToProject);
    } catch (e) { console.error('getProjects failed', e); return []; }
  }

  async function saveProject(p) {
    await db('/projects', {
      method: 'POST',
      headers: { ...HEADERS, 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(projectToRow(p))
    });
  }

  async function deleteProject(id) {
    await del('/projects?id=eq.' + encodeURIComponent(id));
  }

  function rowToProject(r) {
    return {
      id: r.id, title: r.title || '',
      desc: r.description || '', tags: r.tags || '',
      url: r.url || '', cover: r.cover || ''
    };
  }
  function projectToRow(p) {
    return {
      id: p.id, title: p.title,
      description: p.desc, tags: p.tags,
      url: p.url, cover: p.cover
    };
  }

  /* ── EXPERIENCE ───────────────────────────────── */
  async function getExperience() {
    try {
      const rows = await get('/experience?select=*&order=created_at.desc');
      return (rows || []).map(rowToExp);
    } catch (e) { console.error('getExperience failed', e); return []; }
  }

  async function saveExp(e) {
    await db('/experience', {
      method: 'POST',
      headers: { ...HEADERS, 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(expToRow(e))
    });
  }

  async function deleteExp(id) {
    await del('/experience?id=eq.' + encodeURIComponent(id));
  }

  function rowToExp(r) {
    return {
      id: r.id, period: r.period || '',
      role: r.role || '', company: r.company || '',
      desc: r.description || '', skills: r.skills || ''
    };
  }
  function expToRow(e) {
    return {
      id: e.id, period: e.period,
      role: e.role, company: e.company,
      description: e.desc, skills: e.skills
    };
  }

  /* ── HELPERS ──────────────────────────────────── */
  function uid() { return 'id-' + Math.random().toString(36).slice(2, 9); }

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  return {
    getProfile, saveProfile,
    getPosts, getPost, savePost, deletePost,
    getProjects, saveProject, deleteProject,
    getExperience, saveExp, deleteExp,
    uid, formatDate
  };
})();
