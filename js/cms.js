/**
 * cms.js — Local CMS data engine
 * All data is stored in localStorage under the key "cms_data"
 * Seed data is loaded on first visit.
 */

const CMS = (() => {
  const KEY = 'cms_data';

  /* ── SEED DATA ─────────────────────────── */
  const seed = {
    profile: {
      name:       'Alex Mercer',
      tagline:    'I build things and write about',
      taglineEm:  'the process.',
      role:       'Designer & Developer',
      bio:        "I'm Alex — a product designer and front-end developer. I care about craft, clarity, and the small details that make software feel human.",
      location:   'San Francisco, CA',
      currently:  'Senior Product Designer at Stripe',
      interests:  'Typography, design systems, writing, photography',
      education:  'B.S. Computer Science — UC Berkeley, 2019',
      openTo:     'Interesting projects & conversations',
      about1:     "I'm a designer who codes and a developer who designs. I've spent the last 7 years helping teams build products that feel effortless to use — which is the hardest kind of work to do.",
      about2:     'Outside of screens, I\'m usually reading, making espresso badly, or somewhere near a mountain with a camera.',
      about3:     "If you're building something interesting or just want to think out loud about design and engineering — I'd love to hear from you.",
      avatar:     '',
      social: {
        twitter:  '#',
        github:   '#',
        linkedin: '#',
        dribbble: '#',
        email:    'hello@example.com'
      }
    },
    posts: [
      {
        id: 'post-1',
        tag:     'Design',
        title:   'Why constraints are the most underrated design tool',
        excerpt: 'Limitations force creativity. When you can\'t add more, you have to get better — and that\'s where the real work begins.',
        content: '<p>Every designer has heard the phrase "we have full creative freedom." And every designer knows what follows: weeks of indecision, endless revisions, and work that somehow feels less interesting than the projects with tight constraints.</p><p>Constraints are clarifying. A deadline tells you to stop perfecting and start shipping. A fixed budget forces you to prioritize. A narrow brief forces you to find depth instead of breadth.</p><h2>The paradox of choice</h2><p>Barry Schwartz wrote about this in a different context — that more options often lead to worse decisions and less satisfaction. The same is true in design. An infinite canvas is a blank page. A constraint is a starting point.</p><blockquote>The enemy of art is the absence of limitations. — Orson Welles</blockquote><p>Next time you feel frustrated by a constraint, treat it as your brief. Work within it seriously. The result might surprise you.</p>',
        cover:   '',
        date:    '2026-05-08',
        readMin: 6
      },
      {
        id: 'post-2',
        tag:     'Engineering',
        title:   'The quiet power of boring technology',
        excerpt: 'Chasing the newest framework is exciting. Shipping reliable software is the job. The two aren\'t always the same thing.',
        content: '<p>There\'s a recurring pattern I\'ve noticed across teams: the most productive engineers aren\'t always the ones using the most exciting tools. Often, they\'re the ones using boring ones.</p><p>Boring technology is technology that\'s been around long enough to have all its sharp edges filed down. It has known failure modes, extensive documentation, and communities large enough to have answered your exact question on Stack Overflow in 2014.</p><h2>What boring buys you</h2><p>When you pick a boring tool, you\'re buying yourself time. Time to focus on the actual problem instead of fighting the framework. Time to ship, iterate, and learn from real users.</p><p>The next time you\'re evaluating a new technology, ask yourself: am I excited about this because it\'s the right tool, or because it\'s the new one?</p>',
        cover:   '',
        date:    '2026-04-22',
        readMin: 8
      }
    ],
    projects: [
      {
        id:    'proj-1',
        title: 'Folio — Design System',
        desc:  'A token-based design system for a fintech startup. 200+ components, dark mode, and full Figma/code sync.',
        tags:  'Figma, React, Storybook',
        url:   '#',
        cover: ''
      },
      {
        id:    'proj-2',
        title: 'Pulse — Analytics Dashboard',
        desc:  'Real-time business intelligence dashboard. Redesigned the data visualization layer for a 40% drop in time-to-insight.',
        tags:  'TypeScript, D3.js, Tailwind',
        url:   '#',
        cover: ''
      },
      {
        id:    'proj-3',
        title: 'Quill — Writing App',
        desc:  'A distraction-free writing environment. Focus mode, version history, and reader view.',
        tags:  'Next.js, ProseMirror, Supabase',
        url:   '#',
        cover: ''
      }
    ],
    experience: [
      {
        id:      'exp-1',
        period:  '2023 — Present',
        role:    'Senior Product Designer',
        company: 'Stripe',
        desc:    'Leading design for the Stripe Dashboard\'s core navigation and billing product lines. Part of a 4-person design team working closely with engineering and product leadership.',
        skills:  'Product Design, Systems, Research'
      },
      {
        id:      'exp-2',
        period:  '2021 — 2023',
        role:    'Design Engineer',
        company: 'Linear',
        desc:    'Bridged design and engineering — built the component library, maintained design tokens, and shipped production UI for Linear\'s issue tracking and roadmap features.',
        skills:  'React, CSS, Figma'
      },
      {
        id:      'exp-3',
        period:  '2019 — 2021',
        role:    'UI / UX Designer',
        company: 'Freelance',
        desc:    'Worked with 12+ clients across SaaS, e-commerce, and media — from early-stage startups to series B companies.',
        skills:  'Web, Mobile, Branding'
      }
    ]
  };

  /* ── INIT ──────────────────────────────── */
  function init() {
    if (!localStorage.getItem(KEY)) {
      localStorage.setItem(KEY, JSON.stringify(seed));
    }
  }

  function getData() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || seed;
    } catch {
      return seed;
    }
  }

  function saveData(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  /* ── PROFILE ───────────────────────────── */
  function getProfile() { return getData().profile; }
  function saveProfile(profile) {
    const d = getData(); d.profile = { ...d.profile, ...profile };
    saveData(d);
  }

  /* ── POSTS ─────────────────────────────── */
  function getPosts() { return getData().posts || []; }
  function getPost(id) { return getPosts().find(p => p.id === id) || null; }
  function savePost(post) {
    const d = getData();
    const idx = d.posts.findIndex(p => p.id === post.id);
    if (idx > -1) d.posts[idx] = post;
    else d.posts.unshift(post);
    saveData(d);
  }
  function deletePost(id) {
    const d = getData(); d.posts = d.posts.filter(p => p.id !== id); saveData(d);
  }

  /* ── PROJECTS ──────────────────────────── */
  function getProjects() { return getData().projects || []; }
  function saveProject(proj) {
    const d = getData();
    const idx = d.projects.findIndex(p => p.id === proj.id);
    if (idx > -1) d.projects[idx] = proj;
    else d.projects.unshift(proj);
    saveData(d);
  }
  function deleteProject(id) {
    const d = getData(); d.projects = d.projects.filter(p => p.id !== id); saveData(d);
  }

  /* ── EXPERIENCE ────────────────────────── */
  function getExperience() { return getData().experience || []; }
  function saveExp(exp) {
    const d = getData();
    const idx = d.experience.findIndex(e => e.id === exp.id);
    if (idx > -1) d.experience[idx] = exp;
    else d.experience.unshift(exp);
    saveData(d);
  }
  function deleteExp(id) {
    const d = getData(); d.experience = d.experience.filter(e => e.id !== id); saveData(d);
  }

  /* ── HELPERS ───────────────────────────── */
  function uid() { return 'id-' + Math.random().toString(36).slice(2, 9); }

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function resetToSeed() {
    localStorage.setItem(KEY, JSON.stringify(seed));
  }

  init();

  return {
    getProfile, saveProfile,
    getPosts, getPost, savePost, deletePost,
    getProjects, saveProject, deleteProject,
    getExperience, saveExp, deleteExp,
    uid, formatDate, resetToSeed
  };
})();
