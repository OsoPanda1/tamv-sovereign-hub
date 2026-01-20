import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Lock, Users, Plus, Search, Video, Mic, Settings, Bell, Star, Crown, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/tamv/Navbar';
import { IsabellaChat } from '@/components/tamv/IsabellaChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import dreamspaceConcert from '@/assets/dreamspace-concert.jpg';
import dreamspaceWorld from '@/assets/dreamspace-world.jpg';
import isabellaAvatar from '@/assets/isabella-avatar.png';

interface Channel {
  id: string;
  name: string;
  description: string;
  avatar_url: string;
  channel_type: 'public' | 'private' | 'group' | 'direct';
  member_count: number;
  is_verified: boolean;
  owner_id: string;
}

export default function Channels() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'joined' | 'owned'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newChannel, setNewChannel] = useState({ name: '', description: '', type: 'public' as const });

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .order('member_count', { ascending: false })
      .limit(50);

    if (!error && data) {
      setChannels(data as Channel[]);
    }
    setLoading(false);
  };

  const handleCreateChannel = async () => {
    if (!user || !newChannel.name.trim()) return;

    const { data, error } = await supabase
      .from('channels')
      .insert({
        name: newChannel.name,
        description: newChannel.description,
        channel_type: newChannel.type as 'public' | 'private' | 'group' | 'direct',
        owner_id: user.id
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: 'No se pudo crear el canal', variant: 'destructive' });
    } else {
      toast({ title: '¡Creado!', description: 'Tu canal está listo' });
      setShowCreateDialog(false);
      setNewChannel({ name: '', description: '', type: 'public' });
      fetchChannels();
    }
  };

  const handleJoinChannel = async (channelId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('channel_members')
      .insert({ channel_id: channelId, user_id: user.id });

    if (!error) {
      toast({ title: '¡Unido!', description: 'Ya eres miembro del canal' });
      fetchChannels();
    }
  };

  // Featured channels demo
  const featuredChannels = [
    {
      id: 'official',
      name: 'TAMV Official',
      description: 'Canal oficial de la Federación Korima',
      avatar: isabellaAvatar,
      members: 24567,
      verified: true,
      category: 'Oficial'
    },
    {
      id: 'developers',
      name: 'TAMVDevs Guild',
      description: 'Gremio de desarrolladores del ecosistema',
      avatar: dreamspaceConcert,
      members: 3421,
      verified: true,
      category: 'Desarrollo'
    },
    {
      id: 'art',
      name: 'Arte Digital Korima',
      description: 'Comunidad de artistas y creadores visuales',
      avatar: dreamspaceWorld,
      members: 5892,
      verified: false,
      category: 'Arte'
    },
    {
      id: 'music',
      name: 'Sonidos Soberanos',
      description: 'Productores y músicos de la federación',
      avatar: dreamspaceConcert,
      members: 2134,
      verified: false,
      category: 'Música'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-sovereign font-black">
              <span className="text-gradient-gold">CANALES</span>
              <span className="text-foreground"> & GRUPOS</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Comunidades cifradas · Videollamadas 4D · Chat en tiempo real
            </p>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 rounded-full">
                <Plus className="w-4 h-4 mr-2" />
                Crear Canal
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-sovereign border-primary/20">
              <DialogHeader>
                <DialogTitle className="font-sovereign text-xl">Crear Nuevo Canal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm text-muted-foreground">Nombre del Canal</label>
                  <Input
                    value={newChannel.name}
                    onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                    placeholder="mi-canal-increible"
                    className="mt-1 bg-background/50 border-primary/30"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Descripción</label>
                  <Input
                    value={newChannel.description}
                    onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })}
                    placeholder="Describe tu comunidad..."
                    className="mt-1 bg-background/50 border-primary/30"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={newChannel.type === 'public' ? 'default' : 'outline'}
                    onClick={() => setNewChannel({ ...newChannel, type: 'public' })}
                    className="flex-1 rounded-xl"
                  >
                    <Hash className="w-4 h-4 mr-2" />
                    Público
                  </Button>
                  <Button
                    variant={newChannel.type === 'private' ? 'default' : 'outline'}
                    onClick={() => setNewChannel({ ...newChannel, type: 'private' })}
                    className="flex-1 rounded-xl"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Privado
                  </Button>
                </div>
                <Button onClick={handleCreateChannel} className="w-full bg-primary hover:bg-primary/90 rounded-xl">
                  Crear Canal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar canales, grupos, comunidades..."
            className="pl-12 h-12 bg-background/50 border-primary/30 rounded-xl"
          />
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'Descubrir' },
            { id: 'joined', label: 'Mis Canales' },
            { id: 'owned', label: 'Administrados' }
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              className={`rounded-full ${activeTab === tab.id ? 'bg-primary' : 'border-primary/30'}`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Featured Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-primary" />
            <h2 className="font-sovereign font-bold text-lg">Canales Destacados</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredChannels.map((channel, index) => (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group p-4 rounded-2xl glass-sovereign border border-primary/10 hover:border-primary/30 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl overflow-hidden">
                      <img src={channel.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    {channel.verified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                        <Crown className="w-3 h-3 text-background" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold truncate">{channel.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{channel.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{channel.members.toLocaleString()}</span>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">
                        {channel.category}
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-sm"
                  onClick={() => handleJoinChannel(channel.id)}
                >
                  Unirse
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Active Channels */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="w-5 h-5 text-secondary" />
            <h2 className="font-sovereign font-bold text-lg">Chats Activos</h2>
          </div>

          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : channels.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Hash className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay canales todavía. ¡Crea el primero!</p>
              </div>
            ) : (
              channels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between p-4 rounded-xl glass-sovereign border border-primary/10 hover:border-primary/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      {String(channel.channel_type) === 'private' ? (
                        <Lock className="w-5 h-5 text-primary" />
                      ) : (
                        <Hash className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <span className="font-medium">{channel.name}</span>
                      <p className="text-xs text-muted-foreground">{channel.description || 'Sin descripción'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {channel.member_count || 0}
                    </span>
                    <Button size="icon" variant="ghost" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Voice Rooms Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-secondary/20 via-primary/10 to-secondary/20 border border-secondary/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center">
                <Video className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-sovereign font-bold">Videollamadas 4D</h3>
                <p className="text-muted-foreground">Cifrado caótico end-to-end con WebRTC soberano</p>
              </div>
            </div>
            <Button className="bg-secondary hover:bg-secondary/90 text-background rounded-full px-6">
              Iniciar Sala
            </Button>
          </div>
        </motion.div>
      </main>

      <IsabellaChat />
    </div>
  );
}
