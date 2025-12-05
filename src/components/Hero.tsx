// Hero section - landing page ka top part
import { ArrowDown, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToDownloader = () => {
    document.getElementById('downloader')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[80vh] flex items-center bg-[#0f0f0f] overflow-hidden">
      {/* subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* YouTube Shorts icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-600 mb-6">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            YouTube Shorts Downloader
          </h1>
          
          <p className="text-lg text-[#aaa] mb-8">
            Download any YouTube Shorts video in HD quality. Fast, free, and easy to use.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Button 
              onClick={scrollToDownloader}
              size="lg" 
              className="h-11 px-6 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium"
            >
              Start Downloading
              <ArrowDown className="ml-2 w-4 h-4" />
            </Button>
            
            <a href="https://github.com/abhi9vaidya/short-downloader-yt-project" target="_blank" rel="noopener noreferrer">
              <Button 
                variant="outline" 
                size="lg"
                className="h-11 px-6 border-white/20 text-white hover:bg-white/10 rounded-full"
              >
                <Github className="mr-2 w-4 h-4" />
                View Code
              </Button>
            </a>
          </div>

          {/* tech badges */}
          <div className="flex flex-wrap justify-center gap-2">
            {['React', 'Node.js', 'TypeScript', 'yt-dlp'].map((tech) => (
              <span 
                key={tech} 
                className="px-3 py-1 rounded-full bg-[#272727] text-sm text-[#aaa]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
