import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Radio, Users, Heart, MessageCircle, Gift, Share2, Volume2, Maximize, Settings, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/tamv/Navbar';
import { IsabellaChat } from '@/components/tamv/IsabellaChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import dreamspaceConcert from '@/assets/dreamspace-concert.jpg';
import dreamspaceWorld from '@/assets/dreamspace-world.jpg';
import isabellaAvatar from '@/assets/isabella-avatar.png';

interface Stream {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  viewer_count: number;
  is_live: boolean;
  is_premium: boolean;
  total_tips: number;
  profiles: {
    username: string;
    display_name: string;
    avatar_url: string;
    is_verified: boolean;
  };
}

export default function Streaming() {
  const { user } = useAuth();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStream, setSelectedStream] = useState<any>(null);

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    const { data, error } = await supabase
      .from('streams')
      .select(`
        *,
        profiles:host_id (username, display_name, avatar_url, is_verified)
      `)
      .eq('is_live', true)
      .order('viewer_count', { ascending: false })
      .limit(20);

    if (!error && data) {
      setStreams(data as any);
    }
    setLoading(false);
  };

  // Demo streams
  const demoStreams = [
    {
      id: '1',
      title: 'Concierto en Vivo: Sinfonía Cuántica',
      host: 'SoberanSound',
      avatar: isabellaAvatar,
      thumbnail: dreamspaceConcert,
      viewers: 12458,
      tips: 45230,
      isPremium: true,
      isLive: true,
      category: 'Música'
    },
    {
      id: '2',
      title: 'Desarrollo DreamSpaces - Tutorial Avanzado',
      host: 'EdwinCastillo',
      avatar: dreamspaceWorld,
      thumbnail: dreamspaceWorld,
      viewers: 3421,
      tips: 12500,
      isPremium: false,
      isLive: true,
      category: 'Educación'
    },
    {
      id: '3',
      title: 'Arte Generativo con IA - Sesión Creativa',
      host: 'ArtistKorima',
      avatar: dreamspaceConcert,
      thumbnail: dreamspaceConcert,
      viewers: 2156,
      tips: 8900,
      isPremium: false,
      isLive: true,
      category: 'Arte'
    },
    {
      id: '4',
      title: 'Batalla de Mascotas ADN - Torneo Semanal',
      host: 'GameMaster',
      avatar: dreamspaceWorld,
      thumbnail: dreamspaceWorld,
      viewers: 5678,
      tips: 23400,
      isPremium: true,
      isLive: true,
      category: 'Gaming'
    },
    {
      id: '5',
      title: 'Meditación Binaural - Frecuencias Soberanas',
      host: 'IsabellaAI',
      avatar: isabellaAvatar,
      thumbnail: dreamspaceConcert,
      viewers: 1892,
      tips: 5600,
      isPremium: false,
      isLive: true,
      category: 'Bienestar'
    },
    {
      id: '6',
      title: 'Análisis Económico MSR - Mercados en Vivo',
      host: 'CryptoKorima',
      avatar: dreamspaceWorld,
      thumbnail: dreamspaceWorld,
      viewers: 4532,
      tips: 18900,
      isPremium: true,
      isLive: true,
      category: 'Finanzas'
    }
  ];

  const categories = ['Todos', 'Música', 'Educación', 'Arte', 'Gaming', 'Bienestar', 'Finanzas'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-sm mb-6">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="font-bold">{demoStreams.reduce((a, s) => a + s.viewers, 0).toLocaleString()} espectadores en vivo</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sovereign font-black mb-4">
            <span className="text-gradient-gold">STREAMING</span>
            <span className="text-foreground"> 4D</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transmisiones cifradas con el Shader Caótico · Propinas MSR instantáneas · Distribución 70/20/10
          </p>
        </motion.div>

        {/* Categories */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat, i) => (
            <Button
              key={cat}
              variant={i === 0 ? 'default' : 'outline'}
              className={`rounded-full whitespace-nowrap ${i === 0 ? 'bg-primary' : 'border-primary/30'}`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Featured Stream */}
        {demoStreams[0] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-3xl overflow-hidden mb-12 group cursor-pointer"
            onClick={() => setSelectedStream(demoStreams[0])}
          >
            <div className="aspect-video relative">
              <img 
                src={demoStreams[0].thumbnail}
                alt={demoStreams[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              
              {/* Live Badge */}
              <div className="absolute top-6 left-6 flex items-center gap-3">
                <span className="badge-live flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-background animate-pulse" />
                  EN VIVO
                </span>
                {demoStreams[0].isPremium && (
                  <span className="px-3 py-1 rounded-full bg-secondary text-background text-xs font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    PREMIUM
                  </span>
                )}
              </div>

              {/* Viewers */}
              <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full glass-dark">
                <Users className="w-4 h-4 text-primary" />
                <span className="font-bold">{demoStreams[0].viewers.toLocaleString()}</span>
              </div>

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-24 h-24 rounded-full bg-primary/90 flex items-center justify-center border-4 border-white/20 hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-background fill-background ml-1" />
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-primary text-sm font-medium">{demoStreams[0].category}</span>
                    <h2 className="text-3xl font-sovereign font-bold text-white mt-2">
                      {demoStreams[0].title}
                    </h2>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
                          <img src={demoStreams[0].avatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-white font-medium">{demoStreams[0].host}</span>
                      </div>
                      <div className="flex items-center gap-2 text-secondary">
                        <Gift className="w-5 h-5" />
                        <span className="font-bold">{demoStreams[0].tips.toLocaleString()} MSR</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Live Streams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoStreams.slice(1).map((stream, index) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedStream(stream)}
            >
              <div className="relative rounded-2xl overflow-hidden aspect-video mb-4">
                <img 
                  src={stream.thumbnail}
                  alt={stream.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full bg-red-500/90 text-white text-xs font-bold flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </span>
                  {stream.isPremium && (
                    <span className="px-2 py-1 rounded-full bg-secondary/90 text-background text-xs font-bold">
                      <Zap className="w-3 h-3 inline" />
                    </span>
                  )}
                </div>

                {/* Viewers */}
                <div className="absolute top-3 right-3 px-2 py-1 rounded-full glass-dark text-xs">
                  <Users className="w-3 h-3 inline mr-1" />
                  {stream.viewers.toLocaleString()}
                </div>

                {/* Play on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="w-6 h-6 text-background fill-background ml-0.5" />
                  </div>
                </div>
              </div>

              <span className="text-xs text-secondary font-medium">{stream.category}</span>
              <h3 className="font-semibold mt-1 group-hover:text-primary transition-colors line-clamp-2">
                {stream.title}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img src={stream.avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm text-muted-foreground">{stream.host}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-secondary">
                  <Gift className="w-3 h-3" />
                  {stream.tips.toLocaleString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Start Stream CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-red-500/20 via-primary/10 to-red-500/20 border border-red-500/20 text-center"
        >
          <Radio className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-2xl font-sovereign font-bold mb-2">
            Inicia tu Transmisión <span className="text-primary">4D</span>
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Monetiza tu contenido con el sistema 70/20/10. Recibe propinas instantáneas en MSR mientras transmites.
          </p>
          <Button className="bg-red-500 hover:bg-red-600 rounded-full px-8 py-3">
            <Radio className="w-5 h-5 mr-2" />
            Ir en Vivo
          </Button>
        </motion.div>
      </main>

      <IsabellaChat />
    </div>
  );
}
