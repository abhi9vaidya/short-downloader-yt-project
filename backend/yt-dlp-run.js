// yt-dlp wrapper 
// basically youtube se video download karne ka actual kaam idhar :))

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const sanitize = require('sanitize-filename');

// ytdlp path,agr env mein set nahi hai toh default use karo
const YTDLP_PATH = process.env.YTDLP_PATH || 'yt-dlp';
const DOWNLOADS_DIR = process.env.DOWNLOADS_DIR || path.join(__dirname, 'downloads');

// Cookie handling - env var se ya file se
function getCookiePath() {
  const envCookies = process.env.YOUTUBE_COOKIES;
  const fileCookiePath = process.env.COOKIE_FILE_PATH || path.join(__dirname, 'cookies.txt');
  
  // Agar env var mein cookies hain, temp file mein likh do
  if (envCookies) {
    const tempCookiePath = path.join(__dirname, '.cookies-temp.txt');
    try {
      fs.writeFileSync(tempCookiePath, envCookies);
      return tempCookiePath;
    } catch (e) {
      console.error('Temp cookie file write failed:', e);
    }
  }
  
  // Fallback to file
  if (fs.existsSync(fileCookiePath)) {
    return fileCookiePath;
  }
  
  return null;
}

// downloads folder banana agar nahi hai
function ensureDownloadsDir() {
  try {
    fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
  } catch (e) {
    // koi baat nahi, already hai shayad
  }
}

// yt-dlp command run karo aur output return 
function runYtdlpArgs(args, opts = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(YTDLP_PATH, args, { stdio: ['ignore', 'pipe', 'pipe'], ...opts });

    let out = '';
    let err = '';
    proc.stdout.on('data', d => out += d.toString());
    proc.stderr.on('data', d => err += d.toString());

    proc.on('close', code => {
      if (code === 0) {
        resolve(out);
      } else {
        reject(new Error(`yt-dlp exited ${code}: ${err || out}`));
      }
    });
  });
}

// video ki info fetchtitle,thumbnail,formats wagera
async function fetchVideoInfo(url) {
  const cookiePath = getCookiePath();
  if (!cookiePath) {
    throw new Error('Cookies not found! Set YOUTUBE_COOKIES env var or add cookies.txt file');
  }
  const args = ['-J', '--cookies', cookiePath, url];
  const out = await runYtdlpArgs(args);
  return JSON.parse(out);
}

// video download-best quality mein mp4
function downloadVideo(url, filenameHint = null) {
  const cookiePath = getCookiePath();
  if (!cookiePath) {
    return Promise.reject(new Error('Cookies not found! Set YOUTUBE_COOKIES env var or add cookies.txt file'));
  }
  ensureDownloadsDir();

  // filename sanitization spec characters hatao
  let filename = filenameHint ? sanitize(filenameHint) : '%(title)s.%(ext)s';
  const outPattern = path.join(DOWNLOADS_DIR, filename);

  // best video + audio leke aur mp4 mein merge karo
  const args = [
    '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best',
    '--merge-output-format', 'mp4',
    '--cookies', cookiePath,
    '-o', outPattern,
    url
  ];

  return new Promise((resolve, reject) => {
    const proc = spawn(YTDLP_PATH, args, { stdio: ['ignore', 'pipe', 'pipe'] });

    let stderr = '';
    proc.stderr.on('data', d => stderr += d.toString());

    proc.on('close', code => {
      if (code === 0) {
        // latest file dhundho jo abhi bani hai
        try {
          const files = fs.readdirSync(DOWNLOADS_DIR).map(f => ({
            f,
            mtime: fs.statSync(path.join(DOWNLOADS_DIR, f)).mtimeMs
          })).sort((a,b) => b.mtime - a.mtime);
          if (files.length === 0) return resolve(null);
          return resolve(path.join(DOWNLOADS_DIR, files[0].f));
        } catch (e) {
          return resolve(null);
        }
      } else {
        reject(new Error(`yt-dlp fail ho gaya (${code}): ${stderr}`));
      }
    });
  });
}

// audio extract mp3 mein convert karke
function downloadAudio(url, filenameHint = null) {
  const cookiePath = getCookiePath();
  if (!cookiePath) {
    return Promise.reject(new Error('Cookies not found! Set YOUTUBE_COOKIES env var or add cookies.txt file'));
  }
  ensureDownloadsDir();

  let filename = filenameHint ? sanitize(filenameHint) : '%(title)s.%(ext)s';
  const outPattern = path.join(DOWNLOADS_DIR, filename);

  // mp3 
  const args = [
    '-f', 'bestaudio',
    '-x', '--audio-format', 'mp3',
    '--cookies', cookiePath,
    '-o', outPattern,
    url
  ];

  return new Promise((resolve, reject) => {
    const proc = spawn(YTDLP_PATH, args, { stdio: ['ignore', 'pipe', 'pipe'] });

    let stderr = '';
    proc.stderr.on('data', d => stderr += d.toString());

    proc.on('close', code => {
      if (code === 0) {
        try {
          // latest file return 
          const files = fs.readdirSync(DOWNLOADS_DIR).map(f => ({
            f,
            mtime: fs.statSync(path.join(DOWNLOADS_DIR, f)).mtimeMs
          })).sort((a,b) => b.mtime - a.mtime);
          if (files.length === 0) return resolve(null);
          return resolve(path.join(DOWNLOADS_DIR, files[0].f));
        } catch (e) {
          return resolve(null);
        }
      } else {
        reject(new Error(`yt-dlp fail (${code}): ${stderr}`));
      }
    });
  });
}

module.exports = { fetchVideoInfo, downloadVideo, downloadAudio, DOWNLOADS_DIR };
