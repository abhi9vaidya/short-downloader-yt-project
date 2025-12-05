// Header - youtube style navbar
import { Github } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-[#0f0f0f] border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* logo */}
        <div className="flex items-center gap-2">
          <div className="bg-red-600 rounded-lg px-2 py-1 flex items-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
            </svg>
            <span className="ml-1 font-bold text-white text-sm">Shorts</span>
          </div>
          <span className="text-white font-medium hidden sm:block">Downloader</span>
        </div>
        
        <a 
          href="https://github.com/abhi9vaidya/short-downloader-yt-project" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm text-white"
        >
          <Github className="w-4 h-4" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
