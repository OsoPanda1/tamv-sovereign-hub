import { motion } from 'framer-motion';
import { Play, Sparkles, ArrowRight, Zap } from 'lucide-react';
import heroBackground from '@/assets/hero-background.jpg';
import isabellaAvatar from '@/assets/isabella-avatar.png';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBackground} 
          alt="TAMV Universe" 
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
      </div>

      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Isabella Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-isabella mb-8"
          >
            <div className="relative h-8 w-8 rounded-full overflow-hidden border border-secondary/50">
              <img src={isabellaAvatar} alt="Isabella AI" className="h-full w-full object-cover" />
            </div>
            <span className="text-sm font-medium text-secondary">Isabella AI Activa</span>
            <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sovereign text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
          >
            <span className="text-gradient-gold">TAMV</span>
            <br />
            <span className="text-foreground">MD-X4</span>
            <span className="text-primary">™</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4 font-body"
          >
            La Civilización Digital Soberana
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-base md:text-lg text-muted-foreground/70 max-w-2xl mx-auto mb-12"
          >
            Red social, economía justa 70/20/10, metaverso XR y educación 
            fusionados en un ecosistema gobernado por principios éticos.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="btn-sovereign group">
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Entrar al Nexo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            <button className="btn-ghost-gold flex items-center gap-2">
              <Play className="h-5 w-5" />
              Ver DreamSpaces
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: 'Ciudadanos', value: '2.4M+', icon: Sparkles },
              { label: 'DreamSpaces', value: '1,200+', icon: Play },
              { label: 'MSR en Circulación', value: '∞', icon: Zap },
              { label: 'Justicia', value: '70/20/10', icon: Sparkles },
            ].map((stat, i) => (
              <div key={stat.label} className="content-card p-6 text-center">
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-3" />
                <div className="font-sovereign text-2xl md:text-3xl font-bold text-gradient-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground font-sovereign tracking-widest">EXPLORAR</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
