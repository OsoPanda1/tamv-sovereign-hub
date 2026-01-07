import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Compass, 
  Play, 
  Wallet, 
  GraduationCap, 
  Sparkles, 
  Menu, 
  X,
  Search,
  Bell,
  MessageCircle
} from 'lucide-react';
import isabellaAvatar from '@/assets/isabella-avatar.png';

const navItems = [
  { icon: Home, label: 'Nexo', href: '#nexo' },
  { icon: Compass, label: 'DreamSpaces', href: '#dreamspaces' },
  { icon: Play, label: 'Streaming', href: '#streaming' },
  { icon: Wallet, label: 'MSR Wallet', href: '#wallet' },
  { icon: GraduationCap, label: 'Universidad', href: '#universidad' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isIsabellaActive, setIsIsabellaActive] = useState(true);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden lg:block">
        <div className="glass-sovereign mx-auto mt-4 max-w-6xl rounded-full px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
                <div className="absolute inset-0.5 rounded-full bg-background flex items-center justify-center">
                  <span className="font-sovereign text-sm font-bold text-primary">T</span>
                </div>
              </div>
              <span className="font-sovereign text-lg font-bold text-gradient-gold">TAMV</span>
              <span className="text-[10px] font-sovereign text-muted-foreground tracking-widest">MD-X4™</span>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="nav-link flex items-center gap-2 rounded-full px-4 py-2 transition-all hover:bg-primary/10"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                <Search className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </button>
              <button className="p-2 rounded-full hover:bg-primary/10 transition-colors relative">
                <Bell className="h-5 w-5 text-muted-foreground hover:text-primary" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-secondary animate-pulse" />
              </button>
              <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                <MessageCircle className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </button>
              
              {/* Isabella Status */}
              <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-isabella cursor-pointer"
                onClick={() => setIsIsabellaActive(!isIsabellaActive)}
              >
                <div className={`h-2 w-2 rounded-full ${isIsabellaActive ? 'bg-secondary animate-pulse' : 'bg-muted-foreground'}`} />
                <span className="text-[10px] font-sovereign text-secondary tracking-wider">ISABELLA</span>
              </div>

              {/* Profile */}
              <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-primary/50 hover:border-primary transition-colors cursor-pointer">
                <img 
                  src={isabellaAvatar} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <div className="glass-sovereign m-4 rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
                <div className="absolute inset-0.5 rounded-full bg-background flex items-center justify-center">
                  <span className="font-sovereign text-xs font-bold text-primary">T</span>
                </div>
              </div>
              <span className="font-sovereign text-sm font-bold text-gradient-gold">TAMV</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/10">
                <div className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="text-[8px] font-sovereign text-secondary">ISABELLA</span>
              </div>
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl hover:bg-primary/10 transition-colors"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-sovereign mx-4 mt-2 rounded-2xl p-4"
            >
              <div className="grid grid-cols-3 gap-3">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-primary/10 transition-colors"
                  >
                    <item.icon className="h-6 w-6 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="glass-sovereign mx-4 mb-4 rounded-2xl px-2 py-3">
          <div className="flex items-center justify-around">
            {navItems.slice(0, 5).map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-primary/10 transition-colors group"
              >
                <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
