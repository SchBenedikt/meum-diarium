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

### Database Setup

**IMPORTANT**: All blog posts and lexicon entries are now stored in Cloudflare D1 database.

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
   
   **Note:** The improved `seed_database.sh` script handles errors gracefully and always cleans up before seeding.

4. **Verify database contents**:
   ```bash
   npm run db:verify:remote
   ```

After seeding, the database will contain:
- ✅ 5 Authors (Caesar, Cicero, Augustus, Catilina, Seneca)
- ✅ 42 Blog Posts (diary entries and articles)
- ✅ 92 Lexicon Entries (terms and concepts)
- ✅ Multiple literary works

**Note**: Content files in `src/content/` are kept as backup. The app prioritizes the database but falls back to files if needed.

📖 **Documentation:**
- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Complete setup guide
- [TROUBLESHOOTING_DUPLICATES.md](TROUBLESHOOTING_DUPLICATES.md) - **Fix UNIQUE constraint errors**

### Creating Content
Use the included Python CLI wizard for easy content creation:

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

- [Database Setup Guide](DATABASE_SETUP.md) - **Start here for D1 setup**
- [Logging Guide](LOGGING_GUIDE.md) - **D1 usage in console logs**
- [Troubleshooting Duplicates](TROUBLESHOOTING_DUPLICATES.md) - **Fix UNIQUE constraint errors**
- [CMS Documentation](CMS_DOCUMENTATION.md)
- [Content Translation Templates](CONTENT_TRANSLATION_TEMPLATES.md)
- [SEO Implementation](SEO_IMPLEMENTATION_COMPLETE.md)
- [Future Enhancements](FUTURE_ENHANCEMENTS.md)

---

*Meum Diarium* isn't just a blog—it's a portal to the past, thoughtfully crafted with modern web excellence. Whether you're a scholar, a student, or simply curious about Roman history, this platform offers an engaging, beautiful, and technically sophisticated way to explore timeless wisdom. 

**Live the wisdom of Rome, one entry at a time. ** 🏛️✨