# 📦 How to Share Sakura Player on GitHub

## Quick Summary

Your project is now ready to share! Follow these steps to put it on GitHub so others can test it.

---

## Step-by-Step Setup

### **Step 1: Create a GitHub Repository**

1. Go to https://github.com/new
2. Sign in (create account if needed)
3. Fill in:
   - **Repository name**: `sakura-player` (or similar)
   - **Description**: "A Spotify-integrated desktop music player built with Electron"
   - **Public** (so others can access it)
   - **Don't initialize** with README, .gitignore, or license (we have these)
4. Click "Create repository"
5. **Copy the HTTPS URL** (you'll need it next)

### **Step 2: Add GitHub Remote to Your Local Repo**

Replace `YOUR_USERNAME` and `YOUR_REPO_URL` with your actual GitHub info:

```bash
cd "/Users/ongtenghwee/VScode stuff/Desktop app/Sakura Player/final-app"

# Add the remote (replace with your repo URL from Step 1)
git remote add origin https://github.com/YOUR_USERNAME/sakura-player.git

# Rename main branch if needed (GitHub uses main by default)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

You'll be prompted for your GitHub credentials. Use:
- **Username**: Your GitHub username
- **Password**: A Personal Access Token (see below)

### **Step 3: Create a GitHub Personal Access Token** (if needed)

If prompted for password and you have 2FA enabled:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token"
3. Name it "sakura-player"
4. Select scopes: `repo` (full control)
5. Click "Generate token"
6. **Copy the token** (you'll only see it once!)
7. Use this token as your "password" when pushing

### **Step 4: Verify It's on GitHub**

Go to `https://github.com/YOUR_USERNAME/sakura-player` - you should see your code!

---

## What to Share with Testers

### **Method 1: Clone (Easiest for Testers)**
Share this command and link with testers:

```bash
git clone https://github.com/YOUR_USERNAME/sakura-player.git
cd sakura-player
npm install
npm start
```

### **Method 2: Direct Link**
Just send them: `https://github.com/YOUR_USERNAME/sakura-player`

They can click the green "Code" button → "Download ZIP" to get it without Git.

### **Method 3: Share Instructions**
Create a simple instruction file for testers. See "**TESTER_SETUP.md**" section below.

---

## Create a TESTER_SETUP.md File

Add this file to make it SUPER easy for testers:

```markdown
# Getting Started - For Testers

## Prerequisites
- Node.js installed
- Spotify account (free or premium)

## Quick Start (3 steps)

### 1. Clone the project
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/sakura-player.git
cd sakura-player
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Add Spotify credentials
Create a `.env` file in the project root with:
\`\`\`
SPOTIFY_CLIENT_ID=your_id_here
SPOTIFY_CLIENT_SECRET=your_secret_here
REDIRECT_URI=http://127.0.0.1:8888/callback
\`\`\`

Get these from: https://developer.spotify.com/dashboard

### 4. Verify setup
\`\`\`bash
node verify-backend.js
\`\`\`

### 5. Run the app
\`\`\`bash
npm start
\`\`\`

## What to Test

1. **Login**: Click "Connect with Spotify"
2. **Search**: Try searching for songs
3. **Browse**: Check recommended tracks
4. **Queue**: Add songs to queue
5. **Report any bugs**: Issues tab on GitHub

## Need Help?

See `DEBUGGING_GUIDE.md` for troubleshooting.
```

---

## Complete Git Workflow (After Initial Setup)

Once everything is on GitHub, here's how you make updates:

### When You Make Changes:
```bash
cd "/Users/ongtenghwee/VScode stuff/Desktop app/Sakura Player/final-app"

# Check what changed
git status

# Add changes
git add .

# Commit with a message
git commit -m "Fixed search logging"

# Push to GitHub
git push origin main
```

### Examples of Good Commit Messages:
- `"Fixed search not displaying results"`
- `"Added more detailed logging to auth flow"`
- `"Improved UI responsiveness"`
- `"Fixed 403 error handling"`

---

## GitHub Features for Collaboration

### **Issues Tab**
Testers can report bugs here:
- Click "Issues" on your GitHub page
- Click "New Issue"
- They can describe problems and you can discuss solutions

### **Discussions Tab** (optional)
For general questions and feedback:
- Enable in Settings → Features
- Good for "How do I..." questions

### **Releases** (optional)
Create releases for testers to easily download:
1. Create a tag: `git tag v1.0.0`
2. Push: `git push origin v1.0.0`
3. Go to GitHub → Releases → Create release
4. Add release notes

---

## Complete Checklist

- [ ] Created GitHub account (if needed)
- [ ] Created new repository on GitHub
- [ ] Ran `git remote add origin https://github.com/YOUR_USERNAME/sakura-player.git`
- [ ] Ran `git push -u origin main`
- [ ] Verified code appears on GitHub
- [ ] Created TESTER_SETUP.md file
- [ ] Shared link with testers
- [ ] Enabled Issues tab for feedback

---

## What Testers Will See

Your GitHub repo will show:
- ✅ All source code
- ✅ Documentation (README_COMPLETE.md, DEBUGGING_GUIDE.md, etc.)
- ✅ Setup instructions
- ✅ Package info (package.json)

What they WON'T see (protected by .gitignore):
- ❌ .env (their Spotify credentials stay private)
- ❌ node_modules (they reinstall with `npm install`)
- ❌ .DS_Store (macOS files)

---

## Example GitHub URL

Once set up, your repo will look like:
```
https://github.com/ongtenghwee/sakura-player
```

Share this with testers!

---

## Quick Commands Reference

```bash
# First time setup
git init
git add .
git commit -m "Initial commit"
git remote add origin [YOUR_GITHUB_URL]
git push -u origin main

# Later updates
git add .
git commit -m "Your message"
git push origin main

# Check status
git status

# See commit history
git log

# See what changed
git diff
```

---

## Common Issues

**"fatal: not a git repository"**
- Make sure you're in the right folder
- Run `git init` if needed

**"Permission denied"**
- Use HTTPS URL, not SSH
- Use a Personal Access Token as password (not your GitHub password)

**"rejected... (non-fast-forward)"**
- Run `git pull origin main` first
- Then `git push origin main`

---

## Next Steps

1. ✅ You're already on GitHub (local repo created)
2. Create the GitHub repo online
3. Push your code
4. Share the link with testers
5. Ask them to report issues in the Issues tab

**You're ready to share! 🚀**
