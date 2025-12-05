// Footer - simple footer
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0f0f0f] border-t border-white/10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#aaa]">
            Made by{" "}
            <a 
              href="https://github.com/abhi9vaidya" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-red-500 transition-colors"
            >
              Abhinav Vaidya
            </a>
            <span className="text-[#717171]"> :)</span>
          </p>
          
          <a 
            href="https://github.com/abhi9vaidya/short-downloader-yt-project" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#aaa] hover:text-white transition-colors text-sm"
          >
            <Github className="w-4 h-4" />
            Star on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
