# My Personal Site

A minimalist personal website with a built-in CMS. Write posts, manage projects, update your experience — all from the browser, no backend needed.

## 📁 File Structure

```
/
├── index.html        ← Home page
├── thoughts.html     ← Blog post list
├── post.html         ← Single post reader
├── portfolio.html    ← Projects grid
├── experience.html   ← Career timeline
├── about.html        ← About me
├── admin.html        ← CMS Dashboard ✦
├── css/
│   └── style.css     ← All styles
└── js/
    ├── cms.js        ← Data engine (localStorage)
    └── main.js       ← Shared nav, animations, toast
```

## 🚀 Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `my-site` or `yourusername.github.io`)
2. Upload all files keeping the folder structure intact
3. Go to **Settings → Pages**
4. Set Source to **Deploy from a branch → main → / (root)**
5. Your site will be live at `https://yourusername.github.io/my-site/`

### Via GitHub CLI (fastest):
```bash
git init
git add .
git commit -m "Initial site"
git remote add origin https://github.com/yourusername/my-site.git
git push -u origin main
```
Then enable Pages in Settings.

## ✦ Using the CMS

Visit `/admin.html` to manage all content:

| Section    | What you can manage                          |
|------------|----------------------------------------------|
| Profile    | Name, bio, hero text, avatar, social links   |
| Posts      | Blog posts with rich text editor, cover image|
| Projects   | Project cards with image, tags, URL          |
| Experience | Career timeline entries                      |

All data is stored in **localStorage** in your browser. It persists between sessions on the same device/browser.

### Adding images
Paste any public image URL into the image fields. You can use:
- Your own images hosted on GitHub, Cloudinary, or Imgur
- Unsplash URLs: `https://images.unsplash.com/photo-...`

## 🔒 Note on CMS data
Since data is stored in localStorage, it's per-browser. To share content across devices, you could:
- Export/import via the browser console: `localStorage.getItem('cms_data')`
- Upgrade to a backend like Supabase or Firebase in the future

## 🛠 Customization

- **Colors**: Edit CSS variables at the top of `css/style.css`
- **Fonts**: Change the Google Fonts import in each HTML file
- **Seed data**: Edit the `seed` object in `js/cms.js` to pre-fill your real info before deploying
