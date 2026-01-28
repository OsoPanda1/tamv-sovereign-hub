import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/tamv/Navbar';
import { Footer } from '@/components/tamv/Footer';
import { useStaking } from '@/hooks/useStaking';
import { useAuth } from '@/hooks/useAuth';
import { useMSRWallet } from '@/hooks/useMSRWallet';
import { 
  formatMSR, 
  formatAPY, 
  POOL_TYPE_LABELS, 
  POOL_TYPE_ICONS,
  calculateLockRemaining,
  ECONOMIC_DISTRIBUTION,
} from '@/lib/staking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  TrendingUp, 
  Lock, 
  Unlock, 
  Coins, 
  Sparkles, 
  Shield, 
  Flame,
  Building2,
  Users,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Info,
  Zap,
} from 'lucide-react';

const Staking = () => {
  const { user } = useAuth();
  const { balance } = useMSRWallet();
  const { 
    pools, 
    positions, 
    stats, 
    isLoading, 
    isStaking, 
    isUnstaking,
    stake,
    unstake,
    getUserTotalStaked,
    getUserTotalEarned,
    getUserPendingRewards,
    calculateProjection,
    refreshData,
  } = useStaking();

  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [autoCompound, setAutoCompound] = useState(true);
  const [showStakeDialog, setShowStakeDialog] = useState(false);

  const handleStake = async () => {
    if (!selectedPool || !stakeAmount) return;
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    const result = await stake(selectedPool, amount, autoCompound);
    if (result) {
      setShowStakeDialog(false);
      setStakeAmount('');
      setSelectedPool(null);
    }
  };

  const handleUnstake = async (positionId: string, isLocked: boolean) => {
    if (isLocked) {
      const confirm = window.confirm(
        '⚠️ Esta posición está bloqueada. Retirar ahora aplicará una penalización del 10%. ¿Continuar?'
      );
      if (!confirm) return;
    }
    await unstake(positionId, isLocked);
  };

  const openStakeDialog = (poolId: string) => {
    setSelectedPool(poolId);
    setShowStakeDialog(true);
  };

  const selectedPoolData = pools.find(p => p.id === selectedPool);
  const projection = selectedPool && stakeAmount 
    ? calculateProjection(selectedPool, parseFloat(stakeAmount) || 0, 365)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-amber-500 to-orange-500 bg-clip-text text-transparent mb-4">
            MSR Staking
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stake tu MSR y participa en la economía soberana de la Federación Korima.
            Distribución justa: 20% Fénix, 30% Infraestructura, 50% para ti.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Coins className="w-5 h-5" />
                <span className="text-sm font-medium">TVL Total</span>
              </div>
              <p className="text-2xl font-bold">{formatMSR(stats.totalTVL)}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-500 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">APY Promedio</span>
              </div>
              <p className="text-2xl font-bold">{formatAPY(stats.averageAPY)}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-orange-500 mb-2">
                <Flame className="w-5 h-5" />
                <span className="text-sm font-medium">Fénix Acumulado</span>
              </div>
              <p className="text-2xl font-bold">{formatMSR(stats.fenixCollected)}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-500 mb-2">
                <Building2 className="w-5 h-5" />
                <span className="text-sm font-medium">Infraestructura</span>
              </div>
              <p className="text-2xl font-bold">{formatMSR(stats.infraCollected)}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Distribution Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <Card className="border-dashed">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Distribución Económica 20/30/50</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm">20% Fénix (Comunidad)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">30% Infraestructura</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm">50% Tu Utilidad</span>
                </div>
              </div>
              <Progress 
                value={50} 
                className="mt-3 h-2 bg-gradient-to-r from-orange-500 via-blue-500 to-green-500"
              />
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="pools" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="pools">Pools de Staking</TabsTrigger>
            <TabsTrigger value="positions">Mis Posiciones</TabsTrigger>
          </TabsList>

          {/* Pools Tab */}
          <TabsContent value="pools">
            {user ? (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tu balance disponible</p>
                  <p className="text-2xl font-bold">{formatMSR(balance)}</p>
                </div>
                <Button variant="outline" size="sm" onClick={refreshData}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualizar
                </Button>
              </div>
            ) : (
              <Card className="mb-6 border-primary/50">
                <CardContent className="p-4 text-center">
                  <p className="text-muted-foreground">
                    Inicia sesión para hacer staking de tus MSR
                  </p>
                  <Button className="mt-2" asChild>
                    <a href="/auth">Iniciar Sesión</a>
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="space-y-2">
                      <div className="h-6 bg-muted rounded w-2/3" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                pools.map((pool, index) => (
                  <motion.div
                    key={pool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${
                      pool.is_featured ? 'border-primary shadow-primary/20' : ''
                    }`}>
                      {pool.is_featured && (
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl">
                          <Sparkles className="w-3 h-3 inline mr-1" />
                          Destacado
                        </div>
                      )}
                      
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{POOL_TYPE_ICONS[pool.pool_type]}</span>
                          <div>
                            <CardTitle className="text-lg">{pool.name}</CardTitle>
                            <CardDescription>{pool.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">APY Base</p>
                            <p className="text-xl font-bold text-green-500">
                              {formatAPY(Number(pool.base_apy))}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">APY Máximo</p>
                            <p className="text-xl font-bold text-primary">
                              {formatAPY(Number(pool.max_apy))}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">TVL del Pool</span>
                            <span>{formatMSR(Number(pool.total_staked))}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Mínimo</span>
                            <span>{formatMSR(Number(pool.min_stake))}</span>
                          </div>
                          {pool.lock_days > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                Lock Period
                              </span>
                              <span>{pool.lock_days} días</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Badge variant={pool.auto_compound_enabled ? 'default' : 'secondary'}>
                            <Zap className="w-3 h-3 mr-1" />
                            Auto-Compound
                          </Badge>
                          <Badge variant="outline">
                            {POOL_TYPE_LABELS[pool.pool_type]}
                          </Badge>
                        </div>
                        
                        <Button 
                          className="w-full" 
                          onClick={() => openStakeDialog(pool.id)}
                          disabled={!user || isStaking}
                        >
                          <ArrowUpRight className="w-4 h-4 mr-2" />
                          Hacer Stake
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Positions Tab */}
          <TabsContent value="positions">
            {!user ? (
              <Card className="border-primary/50">
                <CardContent className="p-8 text-center">
                  <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Inicia sesión para ver tus posiciones de staking
                  </p>
                  <Button asChild>
                    <a href="/auth">Iniciar Sesión</a>
                  </Button>
                </CardContent>
              </Card>
            ) : positions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Coins className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No tienes posiciones de staking activas
                  </p>
                  <Button onClick={() => (document.querySelector('[value="pools"]') as HTMLElement)?.click()}>
                    Explorar Pools
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* User Stats */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Total Stakeado</p>
                      <p className="text-2xl font-bold">{formatMSR(getUserTotalStaked())}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Total Ganado</p>
                      <p className="text-2xl font-bold text-green-500">{formatMSR(getUserTotalEarned())}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Rewards Pendientes</p>
                      <p className="text-2xl font-bold text-primary">{formatMSR(getUserPendingRewards())}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Positions List */}
                <div className="space-y-4">
                  {positions.map((position) => {
                    const pool = position.pool;
                    const lockInfo = calculateLockRemaining(position.lock_until);
                    const totalStaked = Number(position.staked_amount) + Number(position.compounded_amount);
                    
                    return (
                      <motion.div
                        key={position.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <span className="text-3xl">
                                  {pool ? POOL_TYPE_ICONS[pool.pool_type as keyof typeof POOL_TYPE_ICONS] : '💰'}
                                </span>
                                <div>
                                  <h3 className="font-semibold">{pool?.name || 'Pool'}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Stakeado: {formatMSR(totalStaked)}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-6">
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">APY Bloqueado</p>
                                  <p className="text-lg font-bold text-green-500">
                                    {formatAPY(Number(position.locked_apy))}
                                  </p>
                                </div>
                                
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">Ganado</p>
                                  <p className="text-lg font-bold text-primary">
                                    {formatMSR(Number(position.total_earned))}
                                  </p>
                                </div>
                                
                                {lockInfo.isLocked ? (
                                  <div className="text-center">
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                      <Lock className="w-3 h-3" />
                                      Bloqueado
                                    </p>
                                    <p className="text-lg font-bold">
                                      {lockInfo.daysRemaining}d {lockInfo.hoursRemaining}h
                                    </p>
                                  </div>
                                ) : (
                                  <Badge variant="outline" className="text-green-500 border-green-500">
                                    <Unlock className="w-3 h-3 mr-1" />
                                    Desbloqueado
                                  </Badge>
                                )}
                                
                                <Button 
                                  variant={lockInfo.isLocked ? "destructive" : "outline"}
                                  onClick={() => handleUnstake(position.id, lockInfo.isLocked)}
                                  disabled={isUnstaking}
                                >
                                  <ArrowDownRight className="w-4 h-4 mr-2" />
                                  {lockInfo.isLocked ? 'Retiro Anticipado' : 'Unstake'}
                                </Button>
                              </div>
                            </div>
                            
                            {position.auto_compound && (
                              <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-muted-foreground">
                                <Zap className="w-4 h-4 text-primary" />
                                Auto-compound activo • Último compound: {new Date(position.last_compound_at).toLocaleString()}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Stake Dialog */}
      <Dialog open={showStakeDialog} onOpenChange={setShowStakeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedPoolData && POOL_TYPE_ICONS[selectedPoolData.pool_type]}
              Stake en {selectedPoolData?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedPoolData?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="amount">Cantidad de MSR</Label>
              <div className="relative mt-1">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  min={selectedPoolData?.min_stake || 0}
                  max={balance}
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                  onClick={() => setStakeAmount(balance.toString())}
                >
                  MAX
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Disponible: {formatMSR(balance)} • Mínimo: {formatMSR(Number(selectedPoolData?.min_stake || 0))}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="autoCompound" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Auto-Compound
              </Label>
              <Switch 
                id="autoCompound" 
                checked={autoCompound} 
                onCheckedChange={setAutoCompound}
              />
            </div>
            
            {projection && parseFloat(stakeAmount) > 0 && (
              <Card className="bg-muted/50">
                <CardContent className="p-4 space-y-2">
                  <h4 className="font-medium text-sm">Proyección a 1 año</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Reward Bruto</p>
                      <p className="font-medium">{formatMSR(projection.grossReward)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-green-500">Tu Ganancia (50%)</p>
                      <p className="font-bold text-green-500">{formatMSR(projection.netReward)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-orange-500">Fénix (20%)</p>
                      <p className="text-orange-500">{formatMSR(projection.fenixAmount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-blue-500">Infra (30%)</p>
                      <p className="text-blue-500">{formatMSR(projection.infraAmount)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {selectedPoolData && selectedPoolData.lock_days > 0 && (
              <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm">
                <Lock className="w-4 h-4 text-amber-500" />
                <span>
                  Tus fondos estarán bloqueados por <strong>{selectedPoolData.lock_days} días</strong>. 
                  Retiro anticipado: 10% penalización.
                </span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowStakeDialog(false)} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleStake} 
              disabled={isStaking || !stakeAmount || parseFloat(stakeAmount) <= 0}
              className="flex-1"
            >
              {isStaking ? 'Procesando...' : 'Confirmar Stake'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Staking;
