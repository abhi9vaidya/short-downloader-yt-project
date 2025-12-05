import { Zap, Shield, Sparkles, Code2, Server, Palette } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Modern Frontend",
    description: "Built with React 18, TypeScript, and Tailwind CSS for a responsive, type-safe UI",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Server,
    title: "Robust Backend",
    description: "Node.js + Express server with yt-dlp integration for reliable video processing",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized download pipeline with streaming responses for instant delivery",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "No tracking, no data storage. Your downloads stay completely private",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Sparkles,
    title: "HD Quality",
    description: "Download in the highest available quality with audio-video merging support",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: Palette,
    title: "Beautiful UI",
    description: "Clean, modern interface with dark mode, animations, and glassmorphism effects",
    color: "from-indigo-500 to-purple-500",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-4 bg-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[150px]" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-slate-400 mb-4">
            Technical Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built with Modern Tech
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            A showcase of full-stack development skills using industry-standard tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:border-white/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
