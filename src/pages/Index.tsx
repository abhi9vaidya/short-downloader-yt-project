import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DownloaderForm from "@/components/DownloaderForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />
      <main>
        <Hero />
        <DownloaderForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
