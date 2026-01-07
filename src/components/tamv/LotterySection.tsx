import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, Users, Clock, Zap } from 'lucide-react';

export function LotterySection() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-primary/5 blur-[200px] animate-pulse" />
      </div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3rem] glass-sovereign border-2 border-primary/20"
        >
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/50 rounded-tl-[3rem]" />
          <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-primary/50 rounded-tr-[3rem]" />
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-primary/50 rounded-bl-[3rem]" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/50 rounded-br-[3rem]" />

          <div className="p-8 md:p-16 text-center">
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              <span className="font-sovereign text-sm tracking-[0.5em] text-primary">LOTERÍA KORIMA</span>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>

            <h2 className="font-sovereign text-4xl md:text-6xl font-black mb-4">
              <span className="text-gradient-gold">RECLAMA TU DESTINO</span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              Sistema de azar auditable con VRF y reparto Quantum-Split. 
              Participa éticamente, gana soberanamente.
            </p>

            {/* Jackpot */}
            <div className="mb-12">
              <p className="text-sm text-muted-foreground mb-2 font-sovereign tracking-widest">PREMIO ACUMULADO</p>
              <div className="flex items-center justify-center gap-2">
                <Trophy className="h-10 w-10 text-primary" />
                <span className="font-sovereign text-6xl md:text-8xl font-black text-gradient-gold">
                  250,000
                </span>
                <span className="text-3xl text-primary font-sovereign">MSR</span>
              </div>
            </div>

            {/* Countdown */}
            <div className="mb-12">
              <div className="flex items-center justify-center gap-1 mb-4">
                <Clock className="h-4 w-4 text-secondary" />
                <span className="text-sm text-secondary font-sovereign tracking-widest">PRÓXIMO SORTEO</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                {[
                  { value: timeLeft.hours, label: 'HORAS' },
                  { value: timeLeft.minutes, label: 'MIN' },
                  { value: timeLeft.seconds, label: 'SEG' },
                ].map((unit, i) => (
                  <div key={unit.label} className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-card border border-primary/30 flex items-center justify-center">
                        <span className="font-sovereign text-3xl md:text-4xl font-black text-gradient-gold">
                          {String(unit.value).padStart(2, '0')}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-2 font-sovereign tracking-widest">
                        {unit.label}
                      </span>
                    </div>
                    {i < 2 && <span className="text-3xl text-primary font-bold mb-6">:</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { label: 'Participantes', value: '24,892' },
                { label: 'Ganadores totales', value: '8,234' },
                { label: 'MSR repartidos', value: '12.5M' },
                { label: 'Próximo premio', value: '250K' },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-2xl bg-card/50">
                  <p className="text-2xl font-sovereign font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className="btn-sovereign text-lg px-12 py-6 group">
              <span className="flex items-center gap-3">
                <Zap className="h-6 w-6" />
                PARTICIPAR AHORA
                <Sparkles className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </button>

            <p className="text-xs text-muted-foreground mt-6">
              Participación ética • Sin patrones de adicción • Auditable en blockchain MSR
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
