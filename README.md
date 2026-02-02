# Meum Diarium ✨

**A Journey Through Time:  Ancient Roman Wisdom Brought to Life**

*Meum Diarium* is an elegantly crafted digital diary and content platform that bridges the ancient Roman world with modern web technology. This immersive progressive web application (PWA) brings the voices of history's greatest Roman thinkers—Caesar, Cicero, Augustus, and Seneca—directly to your fingertips. 

## 🏛️ What Makes It Special

**Time-Travel Through Content**: Experience historical perspectives through beautifully designed diary entries and scholarly articles, each authentically attributed to legendary Roman figures. The platform offers a unique blend of personal reflections and academic insights from antiquity.

**AI-Powered Conversations**: Engage in dialogue with historical personas through an innovative AI integration. Ask Caesar about military strategy, discuss philosophy with Seneca, or explore rhetoric with Cicero—powered by Cloudflare Workers for seamless, intelligent responses.

**Multilingual Excellence**: Content is presented in German as the primary language, with optional translations in English and Latin, making ancient wisdom accessible across cultures while preserving its classical roots.

**Modern Architecture, Classical Soul**: Built with cutting-edge technologies: 
- ⚡ **React + TypeScript** for robust, type-safe development
- 🎨 **Tailwind CSS + shadcn-ui** for stunning, responsive design
- 🚀 **Vite** for lightning-fast performance
- 📱 **PWA capabilities** with offline support and mobile-first design
- 🔒 **Cloudflare deployment** ensuring security and global reach
- 💾 **Cloudflare D1 Database** for scalable edge-based data storage

## 🎯 Key Features

- **Rich Content Management**: A sophisticated TypeScript-based content system with metadata, tags, reading time estimation, and multi-author support
- **Interactive Experience**:  Engage with historical figures through AI-powered Q&A functionality
- **Developer-Friendly**:  Includes a Python CLI wizard for effortless content creation
- **SEO Optimized**: Fully optimized for search engines with structured data and performance enhancements
- **Beautiful UI**: Ancient Roman aesthetics meet modern design principles—think papyrus scrolls and SPQR motifs rendered with contemporary finesse

## 🚀 Getting Started

### Prerequisites
- Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd meum-diarium

# Install dependencies
npm i

# Start the development server
npm run dev
```

## 🛠️ Development

### Quick Start

```bash
npm run dev
```

**Note for Local Development:**
- Local dev shows empty data (no local D1 database configured)
- This is expected behavior
- UI and components work perfectly
- Deploy to Cloudflare Pages to see real data from D1

**See [LOCAL_DEV_GUIDE.md](LOCAL_DEV_GUIDE.md) for detailed local development instructions.**

### Database Setup (Production)

**IMPORTANT**: All blog posts and lexicon entries are now stored in Cloudflare D1 edge database.

**🚀 ONE-COMMAND SETUP:**

```bash
./setup_complete_database.sh
```

This script does EVERYTHING:
- ✅ Verifies database exists
- ✅ Applies migrations (creates all tables)
- ✅ Cleans old data
- ✅ Seeds all content (5 Authors, 42 Posts, 92 Lexicon entries)
- ✅ Verifies data was saved correctly

**Expected output:**
```
✓✓✓ DATABASE SETUP COMPLETE! ✓✓✓

✓ Authors: 5/5
✓ Posts: 42/42
✓ Lexicon: 92/92
```

**Alternative (Schritt für Schritt):**

1. **Apply database migrations** (creates tables):
   ```bash
   npx wrangler d1 migrations apply meum-diarium --remote
   ```

2. **Check for duplicates** (optional but recommended):
   ```bash
   npm run db:check-duplicates
   ```

3. **Seed the database** (populates with all content):
   ```bash
   chmod +x seed_database.sh
   ./seed_database.sh
   ```

4. **Verify database contents**:
   ```bash
   npm run db:verify:remote
   ```

After seeding, the database will contain:
- ✅ 5 Authors (Caesar, Cicero, Augustus, Catilina, Seneca)
- ✅ 42 Blog Posts (diary entries and articles)
- ✅ 92 Lexicon Entries (terms and concepts)
- ✅ Multiple literary works

**Important Changes:**
- 🗑️ Static content files have been removed (`src/content/posts/`, `src/content/lexicon/`)
- 💾 All data now comes from D1 database exclusively
- 🔐 Admin CMS added for content management (password: "benedikt")
- 📱 Local development shows empty data (deploy to see real data)

📖 **Documentation:**
- [LOCAL_DEV_GUIDE.md](LOCAL_DEV_GUIDE.md) - **🆕 Local development guide**
- [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md) - **🔥 Database troubleshooting**
- [SYSTEM_SUMMARY.md](SYSTEM_SUMMARY.md) - Architecture overview
- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Complete setup guide
- [TROUBLESHOOTING_DUPLICATES.md](TROUBLESHOOTING_DUPLICATES.md) - Fix UNIQUE constraint errors
- [LOGGING_GUIDE.md](LOGGING_GUIDE.md) - Console logging reference

### Admin CMS

Access the admin panel to manage all content:

1. Navigate to `/admin/login`
2. Enter password: `benedikt`
3. Access admin dashboard

**Features:**
- ✅ Create/edit/delete posts
- ✅ Manage lexicon entries
- ✅ Edit author profiles
- ✅ Manage works and translations
- ✅ Tag management
- ✅ Secure authentication with logout

### Creating Content (Old Method - No Longer Used)

**Note:** The Python CLI wizard is deprecated. Use the Admin CMS instead (see above).

```bash
python3 tools/content_wizard.py
```

Options:
- `--author cicero|caesar|augustus|seneca`
- `--title "Your Title"`
- `--slug your-slug`
- `--date YYYY-MM-DD`
- `--cover /images/post-default.jpg`

Or use the built-in CMS at `/admin` (requires authentication).

### AI Integration
Test the AI endpoint locally: 

```sh
curl "http://localhost:5173/api/ask?persona=cicero&ask=$(python -c 'import urllib.parse; print(urllib.parse.quote("Wer bist du?"))')"
```

## 📦 Deployment

Deploy via [Lovable](https://lovable.dev/projects/9ca2799d-c7bd-4b69-8ca7-2dcd462ef925):
1. Click Share → Publish
2. Optionally connect a custom domain in Project → Settings → Domains

## 🌟 Perfect For

- History enthusiasts seeking immersive content experiences
- Educators looking to bring classical studies to life
- Developers interested in innovative content platforms
- Anyone fascinated by the intersection of ancient wisdom and modern technology

## 📚 Documentation

### Getting Started
- [Quick Start Guide](QUICK_START.md) - **3-step database setup**
- [Local Development Guide](LOCAL_DEV_GUIDE.md) - **How to develop locally**
- [Console Errors Explained](CONSOLE_ERRORS_EXPLAINED.md) - **⭐ Understand console messages**

### Database & Deployment
- [Database Setup Guide](DATABASE_SETUP.md) - **D1 setup details**
- [Deployment Fix](DEPLOYMENT_FIX.md) - **Fix build errors**
- [Troubleshooting Duplicates](TROUBLESHOOTING_DUPLICATES.md) - **Fix UNIQUE constraint errors**

### Features & Content
- [CMS Documentation](CMS_DOCUMENTATION.md) - **Admin panel guide**
- [Logging Guide](LOGGING_GUIDE.md) - **D1 usage in console logs**
- [Content Translation Templates](CONTENT_TRANSLATION_TEMPLATES.md)
- [SEO Implementation](SEO_IMPLEMENTATION_COMPLETE.md)
- [Future Enhancements](FUTURE_ENHANCEMENTS.md)

---

*Meum Diarium* isn't just a blog—it's a portal to the past, thoughtfully crafted with modern web excellence. Whether you're a scholar, a student, or simply curious about Roman history, this platform offers an engaging, beautiful, and technically sophisticated way to explore timeless wisdom. 

**Live the wisdom of Rome, one entry at a time. ** 🏛️✨