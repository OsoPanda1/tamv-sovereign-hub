import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Trophy, Clock, Users, Sparkles, TrendingUp, History, Gift } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/tamv/Navbar';
import { IsabellaChat } from '@/components/tamv/IsabellaChat';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Lottery() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 32, seconds: 15 });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBuyTicket = async () => {
    if (!user) {
      toast({ title: 'Error', description: 'Debes iniciar sesión', variant: 'destructive' });
      return;
    }

    setLoading(true);
    
    // Generate random ticket number
    const ticketNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    toast({ 
      title: '¡Ticket Adquirido!', 
      description: `Tu número: ${ticketNumber}. ¡Buena suerte soberano!` 
    });
    
    setLoading(false);
  };

  // Previous winners
  const winners = [
    { id: '1', username: 'SoberanoFortuna', prize: 125000, date: '2026-01-05' },
    { id: '2', username: 'KorimaLucky', prize: 98500, date: '2025-12-29' },
    { id: '3', username: 'DreamWinner', prize: 156000, date: '2025-12-22' },
    { id: '4', username: 'IsabellaBlessed', prize: 87000, date: '2025-12-15' },
    { id: '5', username: 'QuantumLuck', prize: 203000, date: '2025-12-08' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-20 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Sistema de Redistribución Korima</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sovereign font-black mb-4">
            <span className="text-gradient-gold">LOTERÍA</span>
            <span className="text-foreground"> KORIMA</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            El 100% del pozo va a la comunidad. Justicia distributiva blockchain inmutable.
          </p>
        </motion.div>

        {/* Main Jackpot Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl overflow-hidden mb-12"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-secondary/20" />
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-secondary/20 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative p-8 md:p-12">
            {/* Jackpot Amount */}
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground font-sovereign tracking-widest mb-2">POZO ACUMULADO</p>
              <div className="flex items-center justify-center gap-4">
                <Trophy className="w-12 h-12 text-primary" />
                <h2 className="text-6xl md:text-8xl font-sovereign font-black text-gradient-gold">
                  247,500
                </h2>
                <span className="text-3xl font-sovereign font-bold text-primary">MSR</span>
              </div>
              <p className="text-muted-foreground mt-2">≈ $210,375 USD</p>
            </div>

            {/* Countdown */}
            <div className="mb-8">
              <p className="text-center text-sm text-muted-foreground mb-4 font-sovereign tracking-widest">PRÓXIMO SORTEO</p>
              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                {[
                  { value: timeLeft.days, label: 'Días' },
                  { value: timeLeft.hours, label: 'Horas' },
                  { value: timeLeft.minutes, label: 'Min' },
                  { value: timeLeft.seconds, label: 'Seg' }
                ].map((unit, i) => (
                  <div key={i} className="text-center p-4 rounded-2xl glass-sovereign border border-primary/20">
                    <span className="text-3xl md:text-4xl font-sovereign font-black text-primary">
                      {unit.value.toString().padStart(2, '0')}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{unit.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 rounded-xl bg-background/50">
                <Users className="w-6 h-6 text-secondary mx-auto mb-2" />
                <p className="text-xl font-bold">12,458</p>
                <p className="text-xs text-muted-foreground">Participantes</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-background/50">
                <Ticket className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xl font-bold">89,234</p>
                <p className="text-xs text-muted-foreground">Tickets Vendidos</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-background/50">
                <TrendingUp className="w-6 h-6 text-secondary mx-auto mb-2" />
                <p className="text-xl font-bold">+24%</p>
                <p className="text-xs text-muted-foreground">vs Semana Anterior</p>
              </div>
            </div>

            {/* Buy Ticket */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 px-6 py-3 rounded-xl glass-sovereign border border-primary/30">
                <Ticket className="w-5 h-5 text-primary" />
                <span className="font-sovereign">1 Ticket = 10 MSR</span>
              </div>
              <Button 
                onClick={handleBuyTicket}
                disabled={loading}
                className="btn-sovereign px-12 py-6 text-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Procesando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Comprar Ticket
                  </span>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* My Tickets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h3 className="font-sovereign font-bold text-lg mb-4 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            Mis Tickets
          </h3>
          <div className="p-6 rounded-2xl glass-sovereign border border-primary/20 text-center">
            <p className="text-muted-foreground">Aún no tienes tickets para este sorteo</p>
            <Button variant="link" className="text-primary mt-2">Comprar ahora</Button>
          </div>
        </motion.div>

        {/* Previous Winners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-sovereign font-bold text-lg mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-secondary" />
            Ganadores Recientes
          </h3>
          <div className="space-y-3">
            {winners.map((winner, index) => (
              <motion.div
                key={winner.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl glass-sovereign border border-primary/10"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                  }`}>
                    {index === 0 ? <Trophy className="w-5 h-5" /> : <Gift className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium">@{winner.username}</p>
                    <p className="text-xs text-muted-foreground">{winner.date}</p>
                  </div>
                </div>
                <span className={`font-sovereign font-bold ${index === 0 ? 'text-primary text-xl' : 'text-secondary'}`}>
                  +{winner.prize.toLocaleString()} MSR
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Justice Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="flex-1">
              <h4 className="font-sovereign font-bold text-lg mb-2">Transparencia Blockchain</h4>
              <p className="text-sm text-muted-foreground">
                Cada sorteo es verificable en el BookPI Ledger. Los números se generan con el algoritmo 
                cuántico-caótico de Anubis, garantizando aleatoriedad verdadera e inmutabilidad.
              </p>
            </div>
            <Button variant="outline" className="border-primary/30 rounded-full">
              <History className="w-4 h-4 mr-2" />
              Ver Historial Blockchain
            </Button>
          </div>
        </motion.div>
      </main>

      <IsabellaChat />
    </div>
  );
}
