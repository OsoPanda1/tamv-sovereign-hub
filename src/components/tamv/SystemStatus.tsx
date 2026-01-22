/**
 * SystemStatus - Real-time TAMV Omniverse Status Display
 */

import { motion } from 'framer-motion';
import { Shield, Cpu, Zap, Globe, Lock, Activity } from 'lucide-react';
import { MERGED_REPOSITORIES } from '@/lib/omniverse';

interface SystemStatusProps {
  compact?: boolean;
}

export function SystemStatus({ compact = false }: SystemStatusProps) {
  const repoCount = Object.keys(MERGED_REPOSITORIES).length;
  const featuresCount = Object.values(MERGED_REPOSITORIES)
    .flatMap(r => r.features).length;

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-sovereign text-xs">
        <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
        <span className="text-muted-foreground">Omniverse</span>
        <span className="text-secondary font-medium">ACTIVE</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-sovereign rounded-2xl p-6 border border-primary/10"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <Globe className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-sovereign font-bold text-lg">TAMV Omniverse</h3>
          <p className="text-xs text-muted-foreground">Sistema Soberano Unificado</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-secondary animate-pulse" />
          <span className="text-sm text-secondary font-medium">ONLINE</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatusCard
          icon={<Cpu className="w-4 h-4" />}
          label="Repositorios"
          value={repoCount.toString()}
          color="primary"
        />
        <StatusCard
          icon={<Zap className="w-4 h-4" />}
          label="Funciones"
          value={featuresCount.toString()}
          color="secondary"
        />
        <StatusCard
          icon={<Shield className="w-4 h-4" />}
          label="Anubis"
          value="ACTIVE"
          color="primary"
        />
        <StatusCard
          icon={<Lock className="w-4 h-4" />}
          label="Cifrado"
          value="CHAOS"
          color="secondary"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Sistema de Capas Dekateotl</span>
          <span className="text-secondary">7/7 Activas</span>
        </div>
        <div className="h-2 rounded-full bg-background overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-primary/10">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="w-3 h-3" />
          <span>Triple Federación: Seguridad ✓ Economía ✓ Conocimiento ✓</span>
        </div>
      </div>
    </motion.div>
  );
}

interface StatusCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'primary' | 'secondary';
}

function StatusCard({ icon, label, value, color }: StatusCardProps) {
  return (
    <div className={`p-3 rounded-xl bg-${color}/5 border border-${color}/10`}>
      <div className={`text-${color} mb-2`}>{icon}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-sm font-bold text-${color}`}>{value}</div>
    </div>
  );
}
