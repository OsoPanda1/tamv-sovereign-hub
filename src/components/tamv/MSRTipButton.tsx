/**
 * MSRTipButton - Quick tip button with 70/20/10 distribution
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Sparkles, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMSRWallet } from '@/hooks/useMSRWallet';
import { useToast } from '@/hooks/use-toast';
import { formatMSR, MSR_DISTRIBUTION } from '@/lib/msr-ledger';

interface MSRTipButtonProps {
  creatorId: string;
  creatorName: string;
  contentId?: string;
  defaultAmounts?: number[];
  size?: 'sm' | 'md' | 'lg';
}

export function MSRTipButton({
  creatorId,
  creatorName,
  contentId,
  defaultAmounts = [1, 5, 10, 25],
  size = 'md',
}: MSRTipButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { sendTip, balance } = useMSRWallet();
  const { toast } = useToast();

  const handleTip = async (amount: number) => {
    if (balance < amount) {
      toast({
        title: 'Saldo insuficiente',
        description: `Necesitas ${formatMSR(amount)} para esta propina`,
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    setSelectedAmount(amount);

    try {
      const result = await sendTip(creatorId, amount, contentId);
      
      if (result) {
        setSuccess(true);
        toast({
          title: '¡Propina enviada!',
          description: `${formatMSR(amount * MSR_DISTRIBUTION.CREATOR_SHARE)} para ${creatorName}`,
        });
        
        setTimeout(() => {
          setSuccess(false);
          setIsOpen(false);
          setSelectedAmount(null);
        }, 2000);
      }
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo enviar la propina',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const buttonSizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`${buttonSizes[size]} rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity`}
      >
        {success ? (
          <Check className="w-4 h-4 mr-2" />
        ) : (
          <Coins className="w-4 h-4 mr-2" />
        )}
        {success ? '¡Enviado!' : 'Propina MSR'}
      </Button>

      <AnimatePresence>
        {isOpen && !success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="glass-sovereign rounded-2xl p-4 min-w-[200px]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium">Propina para {creatorName}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                {defaultAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleTip(amount)}
                    disabled={isSending}
                    className={`
                      p-3 rounded-xl text-sm font-medium transition-all
                      ${selectedAmount === amount && isSending
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-primary/10 hover:bg-primary/20 text-primary'
                      }
                      disabled:opacity-50
                    `}
                  >
                    {isSending && selectedAmount === amount ? (
                      <Loader2 className="w-4 h-4 mx-auto animate-spin" />
                    ) : (
                      formatMSR(amount)
                    )}
                  </button>
                ))}
              </div>

              <div className="text-[10px] text-muted-foreground text-center">
                <span className="text-secondary">{MSR_DISTRIBUTION.CREATOR_SHARE * 100}%</span> Creador · 
                <span className="text-primary"> {MSR_DISTRIBUTION.RESILIENCE_SHARE * 100}%</span> Resiliencia · 
                <span className="text-muted-foreground"> {MSR_DISTRIBUTION.KERNEL_SHARE * 100}%</span> Kernel
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
