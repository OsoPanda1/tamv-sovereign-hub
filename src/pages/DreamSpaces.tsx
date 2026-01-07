import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, Lock, Star, Eye, Play, Plus, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/tamv/Navbar';
import { IsabellaChat } from '@/components/tamv/IsabellaChat';
import { Button } from '@/components/ui/button';
import dreamspaceConcert from '@/assets/dreamspace-concert.jpg';
import dreamspaceWorld from '@/assets/dreamspace-world.jpg';

interface DreamSpace {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
  is_public: boolean;
  visitor_count: number;
  max_visitors: number;
  profiles: {
    username: string;
    display_name: string;
    is_verified: boolean;
  };
}

export default function DreamSpaces() {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState<DreamSpace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    const { data, error } = await supabase
      .from('dreamspaces')
      .select(`
        *,
        profiles:owner_id (username, display_name, is_verified)
      `)
      .eq('is_public', true)
      .order('visitor_count', { ascending: false })
      .limit(20);

    if (!error && data) {
      setSpaces(data as any);
    }
    setLoading(false);
  };

  // Demo spaces for display
  const demoSpaces = [
    {
      id: '1',
      name: 'Concierto Sensorial Nocturno',
      description: 'Experiencia audiovisual inmersiva con efectos KAOS Audio 3D',
      thumbnail: dreamspaceConcert,
      visitors: 1247,
      maxVisitors: 5000,
      category: 'Evento',
      live: true
    },
    {
      id: '2',
      name: 'Galería de Arte Digital Korima',
      description: 'Exposición curada de arte NFT y experiencias XR',
      thumbnail: dreamspaceWorld,
      visitors: 892,
      maxVisitors: 1000,
      category: 'Galería',
      live: false
    },
    {
      id: '3',
      name: 'Campus Universidad TAMV',
      description: 'Centro de aprendizaje y certificaciones blockchain',
      thumbnail: dreamspaceConcert,
      visitors: 456,
      maxVisitors: 2000,
      category: 'Educación',
      live: true
    },
    {
      id: '4',
      name: 'Arena de Mascotas ADN',
      description: 'Combates amistosos y evolución de mascotas digitales',
      thumbnail: dreamspaceWorld,
      visitors: 723,
      maxVisitors: 500,
      category: 'Juegos',
      live: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm mb-6">
              <Globe className="w-4 h-4" />
              <span>Mundos Virtuales 4D</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-sovereign font-black mb-4">
              <span className="text-gradient-gold">DREAM</span>
              <span className="text-foreground">SPACES</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explora realidades inmersivas, asiste a conciertos sensoriales y conecta con ciudadanos en mundos creados por la comunidad
            </p>
          </motion.div>
        </div>

        {/* Featured Space */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl overflow-hidden mb-12 group cursor-pointer"
        >
          <div className="aspect-[21/9] relative">
            <img 
              src={dreamspaceConcert}
              alt="Featured DreamSpace"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            
            {/* Live Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/90 text-white text-sm font-bold">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              EN VIVO
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-secondary text-sm font-medium">DESTACADO</span>
                  <h2 className="text-3xl font-sovereign font-bold text-white mt-2">
                    Gala de Año Nuevo Soberano 2026
                  </h2>
                  <p className="text-white/70 mt-2 max-w-xl">
                    Celebración oficial de la Federación Korima con música en vivo, arte generativo y regalos exclusivos MSR
                  </p>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-white/80">
                      <Users className="w-5 h-5" />
                      <span>4,328 ciudadanos</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <Star className="w-5 h-5" />
                      <span>Evento Oficial</span>
                    </div>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-background px-8 py-6 rounded-2xl text-lg font-bold shadow-glow">
                  <Play className="w-5 h-5 mr-2" />
                  Entrar Ahora
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          {['Todos', 'En Vivo', 'Eventos', 'Galerías', 'Educación', 'Juegos', 'Social'].map((cat, i) => (
            <Button
              key={cat}
              variant={i === 0 ? 'default' : 'outline'}
              className={`rounded-full whitespace-nowrap ${i === 0 ? 'bg-primary' : 'border-primary/30'}`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Spaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {demoSpaces.map((space, index) => (
            <motion.div
              key={space.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-4">
                <img 
                  src={space.thumbnail}
                  alt={space.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {space.live && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/90 text-white text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button className="w-full bg-primary/90 hover:bg-primary text-sm py-2 rounded-xl">
                    <Play className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                </div>
              </div>

              <span className="text-xs text-secondary font-medium">{space.category}</span>
              <h3 className="font-semibold mt-1 group-hover:text-primary transition-colors">{space.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{space.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {space.visitors.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {space.maxVisitors.toLocaleString()} max
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Space CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 border border-primary/20 text-center"
        >
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-sovereign font-bold mb-2">Crea tu DreamSpace</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Diseña tu propio mundo virtual 4D y monetiza las visitas con el sistema MSR 70/20/10
          </p>
          <Button className="bg-primary hover:bg-primary/90 rounded-full px-8 py-3">
            <Plus className="w-5 h-5 mr-2" />
            Crear DreamSpace
          </Button>
        </motion.div>
      </main>

      <IsabellaChat />
    </div>
  );
}
