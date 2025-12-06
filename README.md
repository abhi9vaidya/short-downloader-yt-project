# 🎬 YouTube Shorts Downloader

A full-stack web application to download YouTube Shorts videos and audio. Built because copying links and using shady websites with 100 pop-ups wasn't cutting it anymore, plus I needed an excuse to play with yt-dlp and call it "productive."

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)

## ✨ Features

- **🎥 Video Download** - Download YouTube Shorts in MP4 format
- **🎵 Audio Download** - Extract audio as MP3 (perfect for that background music you liked)
- **📋 Video Preview** - See thumbnail, title & channel before downloading
- **🌙 Dark Theme** - YouTube-style dark mode (easy on the eyes at 2 am)
- **📱 Responsive** - Works on mobile, tablet, desktop - basically everywhere

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** - Because type safety saves debugging time
- **Vite** - Fast builds, faster refresh
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components

### Backend
- **Node.js** + **Express** - Simple and gets the job done
- **yt-dlp** - The real MVP for handling YouTube downloads
- **Docker** - Containerized for easy deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/abhi9vaidya/short-downloader-yt-project.git
cd short-downloader-yt-project

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Running Locally

```bash
# Terminal 1 - Start backend (runs on port 10000)
cd backend
node server.js

# Terminal 2 - Start frontend (runs on port 8080)
npm run dev
```

Open `http://localhost:8080` and you're good to go! 🎉

## 📁 Project Structure

```
├── src/                  # Frontend React app
│   ├── components/       # UI components
│   ├── pages/           # Route pages
│   └── services/        # API client
├── backend/             # Express server
│   ├── server.js        # Main server file
│   ├── yt-dlp-run.js    # Download logic
│   └── Dockerfile       # Container config
└── public/              # Static assets
```

## 🐳 Docker Deployment

```bash
cd backend
docker build -t shorts-downloader .
docker run -p 10000:10000 shorts-downloader
```

## 🤔 How It Works

1. User pastes a YouTube Shorts URL
2. Frontend sends request to backend
3. Backend uses yt-dlp to fetch video info & download
4. File streams back to user's browser
5. User clicks download, video saved. Simple.

## ⚠️ Known Limitations: Local vs Production

### Why it works perfectly on localhost but has issues in production?

**The Short Answer:** YouTube's bot detection is *really* good.

**The Long Answer:**

| Factor | Local Development | Cloud Deployment |
|--------|-------------------|------------------|
| **IP Reputation** | ✅ Residential IP (trusted) | ❌ Datacenter IP (flagged) |
| **Request Pattern** | ✅ Low volume, natural | ❌ Server-like patterns |
| **Rate Limiting** | ✅ Rarely triggered | ❌ Quickly rate-limited |
| **Bot Detection** | ✅ Looks like normal user | ❌ Detected as automation |

### The Reality of YouTube Downloading

YouTube actively combats automated downloads from cloud servers:

1. **Datacenter IP Blocking** - Cloud providers (Render, Fly.io, AWS, etc.) use IPs that YouTube recognizes and restricts
2. **Rate Limiting** - Even with cookies, high-volume requests get throttled
3. **Cookie Expiration** - Authentication cookies expire, requiring manual refresh
4. **Signature Changes** - YouTube frequently updates their video signature algorithms

### Workarounds (with varying success)

- **Cookies Authentication** - Using browser cookies to appear as a logged-in user (implemented, but expires)
- **Proxy Rotation** - Using residential proxies (expensive, $50-200/month)
- **Self-Hosting** - Running on your own residential network (best reliability)

### Bottom Line

This project works great for:
- ✅ Personal/local use
- ✅ Self-hosted on home server
- ⚠️ Cloud deployment (works but may face intermittent issues)

For cloud deployment, expect occasional failures. It's a cat-and-mouse game with YouTube's anti-bot measures.

## ⚠️ Disclaimer

This tool is for personal use only. Please respect YouTube's Terms of Service and content creators' rights. Don't be that person.

## 📝 License

MIT License - do whatever you want, just don't blame me if something breaks.

---

**Built with ☕ and mass amounts of debugging by [Abhinav Vaidya](https://github.com/abhi9vaidya)**

