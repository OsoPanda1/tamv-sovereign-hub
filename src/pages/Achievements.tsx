import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Star,
  TrendingUp,
  Flame,
  Crown,
  Sparkles,
  Lock,
  Unlock,
  Gift,
  Users,
  ChevronRight
} from 'lucide-react';
import { Navbar } from '@/components/tamv/Navbar';
import { IsabellaChat } from '@/components/tamv/IsabellaChat';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  DEFAULT_ACHIEVEMENTS,
  RARITY_CONFIG,
  REPUTATION_LEVELS,
  getReputationLevel,
  formatRank,
  type Achievement,
  type LeaderboardEntry
} from '@/lib/gamification';

export default function Achievements() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'achievements' | 'leaderboard' | 'rewards'>('achievements');

  const userProgress = {
    level: 'pioneer' as const,
    xp: 4250,
    nextLevelXp: 10000,
    reputation: 2450,
    unlockedCount: 12,
    totalAchievements: 25,
  };

  const demoLeaderboard: LeaderboardEntry[] = [
    { rank: 1, userId: '1', username: 'SovereignMaster', displayName: 'Sovereign Master', score: 125000, change: 0, tier: 'Diamond' },
    { rank: 2, userId: '2', username: 'QuantumPioneer', displayName: 'Quantum Pioneer', score: 98500, change: 2, tier: 'Diamond' },
    { rank: 3, userId: '3', username: 'IsabellaFriend', displayName: 'Isabella Friend', score: 87200, change: -1, tier: 'Platinum' },
    { rank: 4, userId: '4', username: 'DreamWeaver', displayName: 'Dream Weaver', score: 76300, change: 1, tier: 'Platinum' },
    { rank: 5, userId: '5', username: 'MSRWhale', displayName: 'MSR Whale', score: 65000, change: -2, tier: 'Gold' },
    { rank: 6, userId: '6', username: 'ArtCollector', displayName: 'Art Collector', score: 54200, change: 3, tier: 'Gold' },
    { rank: 7, userId: '7', username: 'DAOVoter', displayName: 'DAO Voter', score: 43100, change: 0, tier: 'Silver' },
    { rank: 8, userId: '8', username: 'StreamerPro', displayName: 'Streamer Pro', score: 38900, change: -1, tier: 'Silver' },
  ];

  const handleClaimReward = (achievement: Achievement) => {
    toast({
      title: '¡Recompensa reclamada!',
      description: `Has obtenido ${achievement.xpReward} XP y ${achievement.msrReward} MSR`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-28 pb-32 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-xs font-sovereign text-primary tracking-wider">GAMIFICACIÓN</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-sovereign font-bold text-gradient-gold mb-4">
              Logros y Recompensas
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Desbloquea logros, sube de nivel y compite en los rankings del ecosistema
            </p>
          </motion.div>

          {/* User Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-sovereign rounded-3xl p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Level Badge */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <div className="text-center">
                      <Crown className="h-8 w-8 text-primary mx-auto mb-1" />
                      <span className="text-2xl font-sovereign font-bold">24</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  PIONEER
                </div>
              </div>

              {/* Progress */}
              <div className="flex-1 w-full lg:w-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Progreso al siguiente nivel</span>
                  <span className="text-sm font-medium">{userProgress.xp.toLocaleString()} / {userProgress.nextLevelXp.toLocaleString()} XP</span>
                </div>
                <Progress value={(userProgress.xp / userProgress.nextLevelXp) * 100} className="h-3 mb-4" />
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-sovereign font-bold text-primary">{userProgress.unlockedCount}</p>
                    <p className="text-xs text-muted-foreground">Logros</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-sovereign font-bold text-secondary">{userProgress.reputation.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Reputación</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-sovereign font-bold">#47</p>
                    <p className="text-xs text-muted-foreground">Ranking</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-2">
                <Button className="btn-sovereign">
                  <Gift className="h-4 w-4 mr-2" />
                  Reclamar Recompensas
                </Button>
                <Button variant="outline" className="rounded-2xl">
                  <Users className="h-4 w-4 mr-2" />
                  Ver Perfil Público
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {[
              { id: 'achievements', label: 'Logros', icon: Medal },
              { id: 'leaderboard', label: 'Ranking', icon: Trophy },
              { id: 'rewards', label: 'Recompensas', icon: Gift },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'achievements' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEFAULT_ACHIEVEMENTS.map((achievement, index) => {
                const isUnlocked = index < 3; // Demo: first 3 unlocked
                const progress = isUnlocked ? 100 : Math.random() * 80;
                
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`glass-sovereign rounded-2xl p-5 relative overflow-hidden ${
                      !isUnlocked ? 'opacity-70' : ''
                    }`}
                  >
                    {achievement.isSecret && !isUnlocked && (
                      <div className="absolute inset-0 backdrop-blur-sm bg-background/50 flex items-center justify-center z-10">
                        <div className="text-center">
                          <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <span className="text-sm text-muted-foreground">Logro Secreto</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      <div 
                        className="text-4xl p-3 rounded-2xl"
                        style={{ backgroundColor: `${RARITY_CONFIG[achievement.rarity].color}20` }}
                      >
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-sovereign font-bold">{achievement.name}</h3>
                          {isUnlocked && <Unlock className="h-4 w-4 text-green-500" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                        
                        <div className="flex items-center gap-3 mb-3">
                          <span 
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                            style={{ 
                              backgroundColor: `${RARITY_CONFIG[achievement.rarity].color}20`,
                              color: RARITY_CONFIG[achievement.rarity].color 
                            }}
                          >
                            {achievement.rarity}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {achievement.xpReward} XP
                          </span>
                          <span className="text-xs text-primary flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            {achievement.msrReward} MSR
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Progreso</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                    
                    {isUnlocked && (
                      <Button 
                        size="sm" 
                        className="w-full mt-4"
                        onClick={() => handleClaimReward(achievement)}
                      >
                        Reclamar
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="glass-sovereign rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-sovereign font-bold">Ranking Global</h3>
                  <select className="bg-muted rounded-xl px-3 py-2 text-sm">
                    <option>Esta semana</option>
                    <option>Este mes</option>
                    <option>Todos los tiempos</option>
                  </select>
                </div>
              </div>
              
              <div className="divide-y divide-border">
                {demoLeaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors ${
                      entry.rank <= 3 ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="w-12 text-center">
                      <span className="text-2xl">{formatRank(entry.rank)}</span>
                    </div>
                    
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg font-bold">
                      {entry.displayName[0]}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-sovereign font-bold">{entry.displayName}</p>
                      <p className="text-sm text-muted-foreground">@{entry.username}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-sovereign font-bold text-primary">{entry.score.toLocaleString()}</p>
                      <div className={`text-xs flex items-center justify-end gap-1 ${
                        entry.change > 0 ? 'text-green-500' : entry.change < 0 ? 'text-red-500' : 'text-muted-foreground'
                      }`}>
                        {entry.change > 0 ? <TrendingUp className="h-3 w-3" /> : entry.change < 0 ? <TrendingUp className="h-3 w-3 rotate-180" /> : null}
                        {entry.change !== 0 && Math.abs(entry.change)}
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      entry.tier === 'Diamond' ? 'bg-cyan-500/20 text-cyan-400' :
                      entry.tier === 'Platinum' ? 'bg-purple-500/20 text-purple-400' :
                      entry.tier === 'Gold' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {entry.tier}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="p-4 text-center">
                <Button variant="ghost" className="text-primary">
                  Ver ranking completo
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Bonus Diario', description: 'Inicia sesión cada día', reward: '50 MSR', icon: Flame, available: true },
                { title: 'Racha Semanal', description: '7 días consecutivos', reward: '500 MSR', icon: Star, available: true },
                { title: 'Top 100 Mensual', description: 'Ranking mensual', reward: '1,000 MSR', icon: Trophy, available: false },
                { title: 'Pionero Early', description: 'Usuario temprano', reward: 'Badge Único', icon: Crown, available: true },
                { title: 'Contribuidor DAO', description: '10 votos en propuestas', reward: '250 MSR', icon: Medal, available: false },
                { title: 'Coleccionista', description: '10 NFTs en galería', reward: 'Galería Premium', icon: Sparkles, available: false },
              ].map((reward, index) => (
                <motion.div
                  key={reward.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-sovereign rounded-2xl p-6 ${!reward.available ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-primary/20">
                      <reward.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-sovereign font-bold">{reward.title}</h3>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-sovereign font-bold text-gradient-gold">{reward.reward}</span>
                    <Button 
                      size="sm" 
                      disabled={!reward.available}
                      className={reward.available ? 'btn-sovereign' : ''}
                    >
                      {reward.available ? 'Reclamar' : 'Bloqueado'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <IsabellaChat />
    </div>
  );
}
