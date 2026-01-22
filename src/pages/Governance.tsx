import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Vote, 
  Clock, 
  Users,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  TrendingUp,
  Shield,
  Wallet,
  Filter,
  ChevronRight
} from 'lucide-react';
import { Navbar } from '@/components/tamv/Navbar';
import { IsabellaChat } from '@/components/tamv/IsabellaChat';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  type Proposal,
  type ProposalType,
  type VoteChoice,
  DEFAULT_DAO_CONFIG,
  calculateVoteStats
} from '@/lib/dao-governance';

export default function Governance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'active' | 'passed' | 'rejected'>('active');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const proposalTypes: { type: ProposalType; icon: React.ReactNode; label: string }[] = [
    { type: 'treasury', icon: <Wallet className="h-4 w-4" />, label: 'Tesorería' },
    { type: 'policy', icon: <FileText className="h-4 w-4" />, label: 'Políticas' },
    { type: 'election', icon: <Users className="h-4 w-4" />, label: 'Elecciones' },
    { type: 'integration', icon: <Shield className="h-4 w-4" />, label: 'Integración' },
  ];

  const demoProposals: Proposal[] = [
    {
      id: 'prop1',
      title: 'Fondo de Desarrollo Comunitario Q1 2026',
      description: 'Asignación de 50,000 MSR para proyectos comunitarios seleccionados por votación',
      fullText: 'Propuesta completa...',
      type: 'treasury',
      status: 'voting',
      creatorId: 'creator1',
      creatorName: 'ConsejoCiudadano',
      createdAt: new Date(Date.now() - 86400000 * 3),
      discussionEndAt: new Date(Date.now() - 86400000),
      votingStartAt: new Date(Date.now() - 86400000),
      votingEndAt: new Date(Date.now() + 86400000 * 4),
      executionDelay: 48,
      quorumRequired: 10,
      passingThreshold: 60,
      votes: [],
      voteStats: {
        totalVotes: 847,
        totalVotingPower: 125000,
        yesVotes: 612,
        yesPower: 89000,
        noVotes: 198,
        noPower: 31000,
        abstainVotes: 37,
        abstainPower: 5000,
        quorumReached: true,
        currentPercentage: 74.2,
      },
      tags: ['tesorería', 'comunidad', 'desarrollo'],
      attachments: [],
    },
    {
      id: 'prop2',
      title: 'Actualización del Sistema de Reputación',
      description: 'Implementar nuevo algoritmo de reputación con métricas mejoradas de participación',
      fullText: 'Propuesta completa...',
      type: 'policy',
      status: 'voting',
      creatorId: 'creator2',
      creatorName: 'TechCouncil',
      createdAt: new Date(Date.now() - 86400000 * 5),
      discussionEndAt: new Date(Date.now() - 86400000 * 2),
      votingStartAt: new Date(Date.now() - 86400000 * 2),
      votingEndAt: new Date(Date.now() + 86400000 * 2),
      executionDelay: 72,
      quorumRequired: 15,
      passingThreshold: 65,
      votes: [],
      voteStats: {
        totalVotes: 423,
        totalVotingPower: 68000,
        yesVotes: 289,
        yesPower: 45000,
        noVotes: 112,
        noPower: 19000,
        abstainVotes: 22,
        abstainPower: 4000,
        quorumReached: false,
        currentPercentage: 70.3,
      },
      tags: ['sistema', 'reputación', 'mejora'],
      attachments: [],
    },
  ];

  const handleVote = (proposalId: string, choice: VoteChoice) => {
    if (!user) {
      toast({
        title: 'Inicia sesión',
        description: 'Debes iniciar sesión para votar',
        variant: 'destructive',
      });
      return;
    }
    
    const voteLabels = { yes: 'A FAVOR', no: 'EN CONTRA', abstain: 'ABSTENCIÓN' };
    toast({
      title: '¡Voto registrado!',
      description: `Tu voto "${voteLabels[choice]}" ha sido registrado en la blockchain`,
    });
  };

  const getTimeRemaining = (endDate: Date) => {
    const diff = endDate.getTime() - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
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
              <Vote className="h-4 w-4 text-primary" />
              <span className="text-xs font-sovereign text-primary tracking-wider">DAO HÍBRIDA</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-sovereign font-bold text-gradient-gold mb-4">
              Gobernanza Soberana
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tu voz importa. Participa en las decisiones que moldean el futuro del ecosistema TAMV
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Propuestas Activas', value: '7', icon: FileText, color: 'text-primary' },
              { label: 'Poder de Voto', value: '2,450', icon: TrendingUp, color: 'text-secondary' },
              { label: 'Participación', value: '68%', icon: Users, color: 'text-green-500' },
              { label: 'Tesorería', value: '1.2M MSR', icon: Wallet, color: 'text-amber-500' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-sovereign rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-2xl font-sovereign font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Create Proposal Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex gap-2">
              {['active', 'passed', 'rejected'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {tab === 'active' ? 'Activas' : tab === 'passed' ? 'Aprobadas' : 'Rechazadas'}
                </button>
              ))}
            </div>
            <Button className="btn-sovereign">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Propuesta
            </Button>
          </motion.div>

          {/* Proposals List */}
          <div className="space-y-4">
            {demoProposals.map((proposal, index) => (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="glass-sovereign rounded-3xl p-6 hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => setSelectedProposal(proposal)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Proposal Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-xl ${
                        proposal.type === 'treasury' ? 'bg-amber-500/20 text-amber-500' :
                        proposal.type === 'policy' ? 'bg-blue-500/20 text-blue-500' :
                        proposal.type === 'election' ? 'bg-purple-500/20 text-purple-500' :
                        'bg-green-500/20 text-green-500'
                      }`}>
                        {proposalTypes.find(t => t.type === proposal.type)?.icon}
                      </div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {proposalTypes.find(t => t.type === proposal.type)?.label}
                      </span>
                      <div className={`ml-auto px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                        proposal.voteStats.quorumReached 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-amber-500/20 text-amber-500'
                      }`}>
                        {proposal.voteStats.quorumReached ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            Quórum alcanzado
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3" />
                            Quórum pendiente
                          </>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-sovereign font-bold mb-2">{proposal.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{proposal.description}</p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Por: <span className="text-primary">{proposal.creatorName}</span></span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getTimeRemaining(proposal.votingEndAt)} restantes
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {proposal.voteStats.totalVotes} votos
                      </span>
                    </div>
                  </div>

                  {/* Vote Progress */}
                  <div className="lg:w-80">
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-green-500 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            A Favor
                          </span>
                          <span className="text-sm font-medium">{Math.round(proposal.voteStats.currentPercentage)}%</span>
                        </div>
                        <Progress value={proposal.voteStats.currentPercentage} className="h-2 bg-muted" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-red-500 flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            En Contra
                          </span>
                          <span className="text-sm font-medium">{Math.round(100 - proposal.voteStats.currentPercentage)}%</span>
                        </div>
                        <Progress value={100 - proposal.voteStats.currentPercentage} className="h-2 bg-muted [&>div]:bg-red-500" />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={(e) => { e.stopPropagation(); handleVote(proposal.id, 'yes'); }}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Sí
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        className="flex-1"
                        onClick={(e) => { e.stopPropagation(); handleVote(proposal.id, 'no'); }}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        No
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); handleVote(proposal.id, 'abstain'); }}
                      >
                        Abstención
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* DAO Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 glass-isabella rounded-3xl p-8"
          >
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-sovereign font-bold text-gradient-isabella mb-4">
                  DAO Híbrida TAMV
                </h3>
                <p className="text-muted-foreground mb-4">
                  Nuestra gobernanza combina la democracia directa con delegación líquida, 
                  permitiendo que cada ciudadano participe según su disponibilidad y expertise.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-secondary" />
                    <span>Votos inmutables en blockchain</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-secondary" />
                    <span>Delegación flexible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Vote className="h-4 w-4 text-secondary" />
                    <span>Consenso cuántico</span>
                  </div>
                </div>
              </div>
              <Button className="btn-ghost-gold flex items-center gap-2">
                Aprende más sobre la DAO
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <IsabellaChat />
    </div>
  );
}
