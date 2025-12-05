//main server file
//yeh file pura backend handle krega, express use karke

require('./startup-check'); // cookie check 

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const { fetchVideoInfo, downloadVideo, downloadAudio, DOWNLOADS_DIR } = require('./yt-dlp-run');

const app = express();
app.use(cors()); // cors lagana padta hai warna frontend se call nahi hoti damn
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

// health check - render.com ko batane ke liye ki server zinda hai ki nahi
app.get('/healthz', (req, res) => res.json({ ok: true }));

// video info - yt-dlp se metadata fetch 
app.post('/api/video-info', async (req, res) => {
  const url = req.body && req.body.url;
  if (!url) return res.status(400).json({ error: 'bhau url toh de' });
  try {
    const info = await fetchVideoInfo(url);
    return res.json(info);
  } catch (err) {
    console.error('video-info error:', err && err.message ? err.message : err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});

// download endpoint - yaha pe actual video download 
// file ko stream karte hai client ko directly
app.post('/api/download', async (req, res) => {
  const url = req.body && req.body.url;
  if (!url) return res.status(400).json({ error: 'url kahan hai bro?' });

  try {
    const hint = req.body.filename || null;
    const outFile = await downloadVideo(url, hint);
    if (!outFile) return res.status(500).json({ error: 'download completed but could not determine file path' });

    const stat = fs.statSync(outFile);
    const filename = path.basename(outFile);
    
    // seting headers for download
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    
    // streaming file ko
    const readStream = fs.createReadStream(outFile);
    readStream.pipe(res);
    
    // file delete karo end mein (storage bachane ke liye)
    readStream.on('end', () => {
      fs.unlink(outFile, (err) => {
        if (err) console.error('file delete nahi hui:', err);
      });
    });
  } catch (err) {
    console.error('download error:', err && err.message ? err.message : err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});

//sirf audio chahiye toh yeh use karo
app.post('/api/download-audio', async (req, res) => {
  const url = req.body && req.body.url;
  if (!url) return res.status(400).json({ error: 'url daal na re' });

  try {
    const hint = req.body.filename || null;
    const outFile = await downloadAudio(url, hint);
    if (!outFile) return res.status(500).json({ error: 'download completed but could not determine file path' });

    const stat = fs.statSync(outFile);
    const filename = path.basename(outFile);
    
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    
    const readStream = fs.createReadStream(outFile);
    readStream.pipe(res);
    
    readStream.on('end', () => {
      fs.unlink(outFile, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    });
  } catch (err) {
    console.error('download-audio error:', err && err.message ? err.message : err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});

// downloads folder 
app.use('/downloads', express.static(DOWNLOADS_DIR, { dotfiles: 'deny', index: false }));

const PORT = process.env.PORT || 10000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`Server chalu hai: http://${HOST}:${PORT}`);
  console.log(`Downloads folder: ${DOWNLOADS_DIR}`);
});

server.on('error', (err) => {
  console.error('Arre server crash ho gaya :(', err);
  process.exit(1);
});
