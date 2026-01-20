import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  description: string;
  creator_share: number;
  resilience_share: number;
  kernel_share: number;
  created_at: string;
}

export function useMSRWallet() {
  const { profile, session } = useAuth();
  const { toast } = useToast();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get current balance
  const refreshBalance = useCallback(async () => {
    if (!session) return;

    try {
      const { data, error } = await supabase.functions.invoke('msr-transaction', {
        body: { action: 'get_balance' }
      });

      if (error) throw error;
      setBalance(data.balance || 0);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
  }, [session]);

  // Send tip with 70/20/10 distribution
  const sendTip = useCallback(async (creatorId: string, amount: number, referenceId?: string) => {
    if (!session) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para enviar propinas",
        variant: "destructive"
      });
      return { success: false };
    }

    if (amount <= 0) {
      toast({
        title: "Error",
        description: "El monto debe ser mayor a 0",
        variant: "destructive"
      });
      return { success: false };
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('msr-transaction', {
        body: { 
          action: 'tip',
          creator_id: creatorId,
          amount,
          reference_id: referenceId
        }
      });

      if (error) throw error;

      toast({
        title: "¡Propina enviada! 💰",
        description: `Distribución Korima: ${data.distribution.creator} MSR al creador, ${data.distribution.resilience} MSR a resiliencia, ${data.distribution.kernel} MSR al kernel`,
      });

      await refreshBalance();
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al enviar propina';
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [session, toast, refreshBalance]);

  // Get transaction history
  const fetchTransactions = useCallback(async () => {
    if (!session) return;

    try {
      const { data, error } = await supabase.functions.invoke('msr-transaction', {
        body: { action: 'get_transactions', limit: 20 }
      });

      if (error) throw error;
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  }, [session]);

  // Purchase item
  const purchase = useCallback(async (sellerId: string, amount: number, itemId: string, itemType: string) => {
    if (!session) return { success: false };

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('msr-transaction', {
        body: { 
          action: 'purchase',
          seller_id: sellerId,
          amount,
          item_id: itemId,
          item_type: itemType
        }
      });

      if (error) throw error;

      toast({
        title: "¡Compra exitosa! 🎉",
        description: "La distribución 70/20/10 ha sido aplicada",
      });

      await refreshBalance();
      return { success: true, data };
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo completar la compra",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [session, toast, refreshBalance]);

  // Initialize
  useEffect(() => {
    if (profile) {
      setBalance(profile.msr_balance || 0);
    }
  }, [profile]);

  useEffect(() => {
    if (session) {
      refreshBalance();
      fetchTransactions();
    }
  }, [session, refreshBalance, fetchTransactions]);

  return {
    balance,
    transactions,
    isLoading,
    sendTip,
    purchase,
    refreshBalance,
    fetchTransactions,
  };
}
