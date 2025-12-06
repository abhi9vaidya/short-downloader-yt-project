// main form component for downloading videos
// yahan se user URL daalke video download kar sakta hai

import { useState } from "react";
import { Download, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// backend se jo format aata hai uska type
interface BackendFormat {
  quality?: string | null;
  container?: string | null;
  hasAudio?: boolean;
  hasVideo?: boolean;
  itag?: number | string;
}

// video info ka type
interface VideoResult {
  title: string;
  thumbnail: string;
  formats: BackendFormat[];
  author?: string;
  lengthSeconds?: string;
  viewCount?: string;
  description?: string;
}

// backend URL - .env se ya default localhost
const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:10000';

const DownloaderForm = () => {
  const [url, setUrl] = useState("");
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [result, setResult] = useState<VideoResult | null>(null);
  const [selectedItag, setSelectedItag] = useState<string | number | null>("highest");
  const [audioOnly, setAudioOnly] = useState(false);

  // youtube URL valid hai ya nahi check 
  const validateUrl = (input: string) => {
    if (!input) return false;
    const url = input.trim();
    // shorts, watch, youtu.be sab accept 
    return /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)\//i.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    if (!validateUrl(url)) {
      toast.error("Please enter a valid YouTube URL");
      return;
    }

    setLoadingInfo(true);
    setResult(null);
    setSelectedItag("highest");

    try {
      const res = await fetch(`${BACKEND}/api/video-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || body.message || res.statusText);
      }

      const json = await res.json();

      // Map backend formats to the shape we use in UI
      const formats: BackendFormat[] = (json.formats || []).map((f: any) => ({
        quality: f.quality || (f.qualityLabel ?? null),
        container: f.container ?? null,
        hasAudio: f.hasAudio ?? null,
        hasVideo: f.hasVideo ?? null,
        itag: f.itag ?? null,
      }));

      setResult({
        title: json.title ?? "Unknown title",
        thumbnail: json.thumbnail ?? "https://source.unsplash.com/random/400x300/?video",
        formats,
        author: json.author,
        lengthSeconds: json.lengthSeconds,
        viewCount: json.viewCount,
        description: json.description,
      });

      // Prefer selecting the highest available itag if present
      if (formats.length > 0) {
        // pick first format with hasVideo & hasAudio or fallback to first
        const preferred = formats.find(f => f.hasVideo && f.hasAudio) || formats[0];
        setSelectedItag(preferred.itag ?? "highest");
      }

      toast.success("Video information retrieved!");
    } catch (err: any) {
      console.error("video-info error", err);
      toast.error("Failed to fetch video info: " + (err.message || err));
    } finally {
      setLoadingInfo(false);
    }
  };

  const handleDownload = async () => {
    if (!url) {
      toast.error("Missing URL");
      return;
    }

    if (!selectedItag) {
      toast.error("Please pick a format");
      return;
    }

    setDownloading(true);
    toast.info(audioOnly ? "Converting to MP3, please wait..." : "Downloading video, please wait...");
    try {
      // When backend expects quality string, we send the itag if available (safer),
      // otherwise send 'highest'
      const qualityParam = selectedItag ?? "highest";

      let res: Response;
      if (audioOnly) {
        // Use audio-only endpoint. If user selected a format itag, include it as quality.
        const body: any = { url };
        if (qualityParam && String(qualityParam) !== "highest") body.quality = qualityParam;

        res = await fetch(`${BACKEND}/api/download-audio`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`${BACKEND}/api/download`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, quality: qualityParam }),
        });
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || body.message || res.statusText);
      }

  const disposition = res.headers.get("Content-Disposition") || "";
      // try extract filename from disposition
      let filename = "video.mp4";
      const match = /filename\*?=.*?''?([^;"]+)/i.exec(disposition);
      if (match && match[1]) {
        filename = decodeURIComponent(match[1]);
      } else {
        // fallback to title if available
        const ext = audioOnly ? ".mp3" : ".mp4";
        filename = (result?.title ?? (audioOnly ? "audio" : "video")).replace(/[\/\\?%*:|"<>]/g, "") + ext;
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);

      toast.success("Download started");
    } catch (err: any) {
      console.error("download error", err);
      toast.error("Download failed: " + (err.message || err));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section id="downloader" className="py-12 px-4 bg-[#0f0f0f]">
      <div className="container mx-auto max-w-xl">
        <div className="bg-[#272727] rounded-xl p-1">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="Paste YouTube Shorts link here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 h-12 bg-[#121212] border-none text-white placeholder:text-[#717171] rounded-lg px-4 focus-visible:ring-1 focus-visible:ring-white/20"
            />
            <Button
              type="submit"
              disabled={loadingInfo}
              className="h-12 px-5 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              {loadingInfo ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Fetching...
                </>
              ) : (
                "Search"
              )}
            </Button>
          </form>
        </div>

          {result && (
            <div className="mt-4 p-4 bg-[#272727] rounded-xl">
              <div className="flex gap-3 mb-4">
                <img
                  src={result.thumbnail}
                  alt={result.title}
                  className="w-32 h-20 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white text-sm line-clamp-2 mb-1">{result.title}</h3>
                  <p className="text-xs text-[#aaa] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    Ready to download
                  </p>
                </div>
              </div>

              {/* options */}
              <div className="space-y-3">
                {/* audio toggle */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[#aaa]">Audio only (MP3)</span>
                  <button
                    type="button"
                    onClick={() => setAudioOnly(!audioOnly)}
                    className={`w-10 h-6 rounded-full transition-colors ${audioOnly ? 'bg-red-600' : 'bg-[#717171]'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-1 ${audioOnly ? 'translate-x-4' : ''}`} />
                  </button>
                </div>

                {/* quality selector */}
                <Select
                  value={String(selectedItag ?? "")}
                  onValueChange={(val) => setSelectedItag(val || null)}
                >
                  <SelectTrigger className="w-full h-10 bg-[#121212] border-none text-white rounded-lg">
                    <SelectValue>
                      {String(selectedItag) === "highest" ? "Highest quality" : 
                       String(selectedItag) === "lowest" ? "Lowest quality" : "Select quality"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-[#272727] border-white/10">
                    <SelectItem value="highest">Highest quality</SelectItem>
                    <SelectItem value="lowest">Lowest quality</SelectItem>
                  </SelectContent>
                </Select>

                {/* download button */}
                <Button
                  onClick={handleDownload}
                  className="w-full h-11 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                  disabled={downloading}
                >
                  {downloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {audioOnly ? 'Converting to MP3...' : 'Downloading video...'}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download {audioOnly ? 'Audio' : 'Video'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
      </div>
    </section>
  );
};

export default DownloaderForm;
