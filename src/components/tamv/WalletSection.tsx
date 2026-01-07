import { motion } from 'framer-motion';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Gift, Sparkles, Shield, Zap } from 'lucide-react';

const transactions = [
  { id: 1, type: 'in', label: 'Streaming recibido', amount: '+245.00', time: 'Hace 2h', icon: TrendingUp },
  { id: 2, type: 'out', label: 'Regalo enviado', amount: '-50.00', time: 'Hace 4h', icon: Gift },
  { id: 3, type: 'in', label: 'Lotería Korima', amount: '+1,200.00', time: 'Ayer', icon: Sparkles },
  { id: 4, type: 'in', label: 'DreamSpace ingresos', amount: '+89.50', time: 'Ayer', icon: Zap },
];

export function WalletSection() {
  return (
    <section id="wallet" className="relative py-24 bg-gradient-sovereign">
      {/* Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[200px]" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="h-5 w-5 text-primary" />
              <span className="text-sm font-sovereign text-primary tracking-widest">NUBIWALLET</span>
            </div>
            <h2 className="font-sovereign text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient-gold">MSR Wallet</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Tu billetera soberana. Cada transacción se distribuye automáticamente 
              bajo el protocolo de Justicia Quantum-Split.
            </p>

            {/* Justice Distribution */}
            <div className="glass-sovereign rounded-3xl p-6 mb-8">
              <h4 className="font-sovereign text-sm tracking-widest text-muted-foreground mb-6">
                DISTRIBUCIÓN DE JUSTICIA
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <span>Creador/Ciudadano</span>
                  </div>
                  <span className="font-sovereign text-2xl font-bold text-primary">70%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-secondary" />
                    <span>Fondo Resiliencia Fénix</span>
                  </div>
                  <span className="font-sovereign text-2xl font-bold text-secondary">20%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                    <span>Infraestructura Kernel</span>
                  </div>
                  <span className="font-sovereign text-2xl font-bold text-muted-foreground">10%</span>
                </div>
              </div>

              {/* Visual Bar */}
              <div className="mt-6 h-3 rounded-full overflow-hidden flex">
                <div className="w-[70%] bg-gradient-to-r from-primary to-imperial-gold-glow" />
                <div className="w-[20%] bg-secondary" />
                <div className="w-[10%] bg-muted-foreground" />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="btn-sovereign">
                <span className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4" />
                  Enviar MSR
                </span>
              </button>
              <button className="btn-ghost-gold flex items-center gap-2">
                <ArrowDownLeft className="h-4 w-4" />
                Recibir
              </button>
            </div>
          </motion.div>

          {/* Right - Wallet Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Balance Card */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/20 via-card to-secondary/10 p-8 border border-primary/20">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary/10 blur-[60px]" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-secondary/10 blur-[50px]" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="font-sovereign text-xs tracking-widest text-muted-foreground">BALANCE SOBERANO</span>
                  </div>
                  <div className="badge-isabella">ACTIVO</div>
                </div>

                <div className="mb-8">
                  <p className="text-sm text-muted-foreground mb-2">Balance Total</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-sovereign text-5xl font-black text-gradient-gold">12,458</span>
                    <span className="text-2xl text-primary">.00</span>
                    <span className="text-lg text-muted-foreground">MSR</span>
                  </div>
                  <p className="text-sm text-secondary mt-2 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    +24.5% este mes
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-4">
                  <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-background/50 hover:bg-background/80 transition-colors">
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                    <span className="text-xs">Enviar</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-background/50 hover:bg-background/80 transition-colors">
                    <ArrowDownLeft className="h-5 w-5 text-secondary" />
                    <span className="text-xs">Recibir</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-background/50 hover:bg-background/80 transition-colors">
                    <Gift className="h-5 w-5 text-primary" />
                    <span className="text-xs">Regalar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Transactions */}
            <div className="glass-sovereign rounded-3xl p-6">
              <h4 className="font-sovereign text-sm tracking-widest text-muted-foreground mb-4">
                MOVIMIENTOS RECIENTES
              </h4>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        tx.type === 'in' ? 'bg-secondary/20' : 'bg-primary/20'
                      }`}>
                        <tx.icon className={`h-5 w-5 ${tx.type === 'in' ? 'text-secondary' : 'text-primary'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{tx.label}</p>
                        <p className="text-xs text-muted-foreground">{tx.time}</p>
                      </div>
                    </div>
                    <span className={`font-sovereign font-bold ${
                      tx.type === 'in' ? 'text-secondary' : 'text-muted-foreground'
                    }`}>
                      {tx.amount} MSR
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
