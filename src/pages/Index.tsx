import { Navbar } from '@/components/tamv/Navbar';
import { HeroSection } from '@/components/tamv/HeroSection';
import { FeedSection } from '@/components/tamv/FeedSection';
import { DreamSpacesSection } from '@/components/tamv/DreamSpacesSection';
import { WalletSection } from '@/components/tamv/WalletSection';
import { LotterySection } from '@/components/tamv/LotterySection';
import { IsabellaChat } from '@/components/tamv/IsabellaChat';
import { Footer } from '@/components/tamv/Footer';
import { ParticleBackground } from '@/components/tamv/ParticleBackground';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* 3D Particle Background */}
      <ParticleBackground />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero - Visual First */}
        <HeroSection />

        {/* Feed Social - Primer Plano Visual */}
        <FeedSection />

        {/* DreamSpaces - Metaverso XR */}
        <DreamSpacesSection />

        {/* Wallet MSR - Economía 70/20/10 */}
        <WalletSection />

        {/* Lotería Korima */}
        <LotterySection />
      </main>

      {/* Isabella AI Chat */}
      <IsabellaChat />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
