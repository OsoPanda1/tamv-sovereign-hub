import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, RefreshCw, Copy, ExternalLink, TrendingUp, Shield, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/tamv/Navbar';
import { IsabellaChat } from '@/components/tamv/IsabellaChat';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Wallet() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('msr_ledger')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setTransactions(data);
    }
    setLoading(false);
  };

  const copyAddress = () => {
    const address = profile?.wallet_address || `tamv:${user?.id?.slice(0, 16)}`;
    navigator.clipboard.writeText(address);
    toast({ title: 'Copiado', description: 'Dirección copiada al portapapeles' });
  };

  // Demo transactions
  const demoTransactions = [
    { id: '1', type: 'earning', amount: 350, description: 'Venta en Marketplace', date: '2026-01-07' },
    { id: '2', type: 'tip', amount: 50, description: 'Propina de @usuario123', date: '2026-01-07' },
    { id: '3', type: 'lottery', amount: -10, description: 'Ticket Lotería Korima', date: '2026-01-06' },
    { id: '4', type: 'purchase', amount: -200, description: 'Compra: DreamSpace Template', date: '2026-01-06' },
    { id: '5', type: 'subscription', amount: 1200, description: 'Suscripción Premium x12', date: '2026-01-05' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-20 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-sovereign font-black">
            <span className="text-gradient-gold">MSR</span>
            <span className="text-foreground"> WALLET</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Tu billetera soberana en la Blockchain Korima
          </p>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl overflow-hidden mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
          
          <div className="relative p-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-background/70 text-sm mb-1">Balance Total</p>
                <h2 className="text-5xl md:text-6xl font-black text-background">
                  {profile?.msr_balance?.toLocaleString() || '0.00'}
                  <span className="text-2xl ml-2">MSR</span>
                </h2>
                <p className="text-background/70 text-sm mt-2">
                  ≈ ${((profile?.msr_balance || 0) * 0.85).toFixed(2)} USD
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-background/20 flex items-center justify-center">
                <WalletIcon className="w-8 h-8 text-background" />
              </div>
            </div>

            {/* Wallet Address */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-background/10">
              <code className="text-background/80 text-sm flex-1 truncate">
                tamv:{user?.id?.slice(0, 16) || 'loading...'}
              </code>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 text-background/80 hover:text-background hover:bg-background/20"
                onClick={copyAddress}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <Button className="bg-background/20 hover:bg-background/30 text-background rounded-xl py-6 flex-col h-auto">
                <ArrowUpRight className="w-6 h-6 mb-2" />
                <span className="text-sm">Enviar</span>
              </Button>
              <Button className="bg-background/20 hover:bg-background/30 text-background rounded-xl py-6 flex-col h-auto">
                <ArrowDownLeft className="w-6 h-6 mb-2" />
                <span className="text-sm">Recibir</span>
              </Button>
              <Button className="bg-background/20 hover:bg-background/30 text-background rounded-xl py-6 flex-col h-auto">
                <RefreshCw className="w-6 h-6 mb-2" />
                <span className="text-sm">Intercambiar</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Justice Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="p-4 rounded-2xl glass-sovereign border border-primary/20 text-center">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary">70%</p>
            <p className="text-xs text-muted-foreground">Tus Ganancias</p>
          </div>
          <div className="p-4 rounded-2xl glass-sovereign border border-secondary/20 text-center">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-2">
              <Shield className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-2xl font-bold text-secondary">20%</p>
            <p className="text-xs text-muted-foreground">Fondo Fénix</p>
          </div>
          <div className="p-4 rounded-2xl glass-sovereign border border-accent/20 text-center">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <p className="text-2xl font-bold text-accent">10%</p>
            <p className="text-xs text-muted-foreground">Kernel</p>
          </div>
        </motion.div>

        {/* Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-sovereign rounded-2xl border border-primary/20 overflow-hidden"
        >
          <div className="p-4 border-b border-primary/10 flex items-center justify-between">
            <h3 className="font-sovereign font-bold">Historial de Transacciones</h3>
            <Button variant="ghost" size="sm" className="text-secondary">
              Ver todo <ExternalLink className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="divide-y divide-primary/10">
            {(transactions.length > 0 ? transactions : demoTransactions).map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.amount > 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.date || new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`font-bold ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount?.toLocaleString()} MSR
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      <IsabellaChat />
    </div>
  );
}
