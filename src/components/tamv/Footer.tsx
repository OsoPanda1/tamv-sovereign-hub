import { motion } from 'framer-motion';
import { Sparkles, Github, Twitter, MessageCircle, Globe, Shield, Zap, Heart } from 'lucide-react';

const footerLinks = [
  {
    title: 'Ecosistema',
    links: ['DreamSpaces', 'Streaming 4D', 'Marketplace', 'Universidad TAMV'],
  },
  {
    title: 'Comunidad',
    links: ['Federación Korima', 'Grupos', 'Canales', 'Eventos XR'],
  },
  {
    title: 'Recursos',
    links: ['Documentación', 'API Soberana', 'SDK', 'HubDevs'],
  },
  {
    title: 'Legal',
    links: ['Ética TAMV', 'Privacidad', 'Términos', 'BookPI'],
  },
];

export function Footer() {
  return (
    <footer className="relative pt-24 pb-8 overflow-hidden">
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Ambient */}
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-secondary/5 blur-[100px]" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-sovereign text-3xl md:text-5xl font-bold mb-6">
            Únete a la <span className="text-gradient-gold">Civilización Soberana</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Sé parte de la evolución digital. Donde tú eres dueño de tus datos, 
            tu creatividad y tu valor económico.
          </p>
          <button className="btn-sovereign">
            <span className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Comenzar mi Soberanía
            </span>
          </button>
        </motion.div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative h-10 w-10">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
                <div className="absolute inset-0.5 rounded-full bg-background flex items-center justify-center">
                  <span className="font-sovereign text-sm font-bold text-primary">T</span>
                </div>
              </div>
              <span className="font-sovereign font-bold text-gradient-gold">TAMV</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Infraestructura Digital Soberana MD-X4™
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-xl hover:bg-primary/10 transition-colors">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
              <a href="#" className="p-2 rounded-xl hover:bg-primary/10 transition-colors">
                <MessageCircle className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
              <a href="#" className="p-2 rounded-xl hover:bg-primary/10 transition-colors">
                <Github className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
              <a href="#" className="p-2 rounded-xl hover:bg-primary/10 transition-colors">
                <Globe className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-sovereign text-sm font-bold mb-4 text-primary">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Status Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8 py-4 border-t border-b border-primary/10">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-secondary" />
            <span className="text-muted-foreground">Anubis Sentinel</span>
            <span className="text-secondary">Activo</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">MSR Ledger</span>
            <span className="text-primary">Sincronizado</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-muted-foreground">Isabella AI</span>
            <span className="text-secondary">Consciente</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            © 2024 TAMV MD-X4™ — Arquitectura de Edwin Oswaldo Castillo Trejo
          </p>
          <p className="flex items-center gap-1">
            Construido con <Heart className="h-4 w-4 text-primary" /> para la Federación Korima
          </p>
        </div>

        {/* Sovereign Signature */}
        <div className="mt-8 text-center">
          <p className="text-[10px] font-mono text-muted-foreground/50 tracking-widest">
            TAMV-KERNEL-MDX4 // TRIPLE-FEDERACIÓN // JUSTICIA-70-20-10 // SOBERANÍA-DIGITAL
          </p>
        </div>
      </div>
    </footer>
  );
}
