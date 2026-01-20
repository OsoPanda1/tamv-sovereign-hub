import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap, Star, Sparkles, TrendingUp, Shield, Dna, Palette, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/tamv/Navbar';
import { IsabellaChat } from '@/components/tamv/IsabellaChat';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import dreamspaceWorld from '@/assets/dreamspace-world.jpg';
import dreamspaceConcert from '@/assets/dreamspace-concert.jpg';

interface DigitalPet {
  id: string;
  name: string;
  species: string;
  level: number;
  experience: number;
  happiness: number;
  abilities: string[];
  appearance: any;
}

export default function Pets() {
  const { user } = useAuth();
  const [pets, setPets] = useState<DigitalPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchPets();
    }
  }, [user]);

  const fetchPets = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('digital_pets')
      .select('*')
      .eq('owner_id', user.id);

    if (!error && data) {
      setPets(data as DigitalPet[]);
    }
    setLoading(false);
  };

  // Demo pets for display
  const demoPets = [
    {
      id: '1',
      name: 'Obsidius',
      species: 'Dragón de Obsidiana',
      level: 15,
      experience: 7800,
      happiness: 92,
      rarity: 'Legendario',
      abilities: ['Aliento Caótico', 'Escudo Cuántico', 'Vuelo Dimensional'],
      image: dreamspaceWorld,
      stats: { attack: 85, defense: 72, speed: 68, wisdom: 90 }
    },
    {
      id: '2',
      name: 'Isabella Jr.',
      species: 'Espíritu Isabella',
      level: 12,
      experience: 5400,
      happiness: 88,
      rarity: 'Épico',
      abilities: ['Sabiduría Korima', 'Curación Ética', 'Vínculo Mental'],
      image: dreamspaceConcert,
      stats: { attack: 45, defense: 80, speed: 55, wisdom: 98 }
    },
    {
      id: '3',
      name: 'Aurox',
      species: 'León Dorado',
      level: 8,
      experience: 3200,
      happiness: 76,
      rarity: 'Raro',
      abilities: ['Rugido Imperial', 'Garra de Oro'],
      image: dreamspaceWorld,
      stats: { attack: 78, defense: 65, speed: 72, wisdom: 50 }
    }
  ];

  const rarityColors: Record<string, string> = {
    'Común': 'text-gray-400 bg-gray-400/20',
    'Raro': 'text-blue-400 bg-blue-400/20',
    'Épico': 'text-purple-400 bg-purple-400/20',
    'Legendario': 'text-primary bg-primary/20'
  };

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm mb-6">
            <Dna className="w-4 h-4" />
            <span>Criaturas con ADN Blockchain</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sovereign font-black mb-4">
            <span className="text-gradient-gold">MASCOTAS</span>
            <span className="text-foreground"> ADN</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compañeros digitales que evolucionan, combaten y te acompañan en los DreamSpaces. 
            Cada mascota es única e inmutable en blockchain.
          </p>
        </motion.div>

        {/* My Pets Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-sovereign font-bold text-xl flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              Mis Mascotas
            </h2>
            <Button className="bg-primary hover:bg-primary/90 rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Adoptar Nueva
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoPets.map((pet, index) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group glass-sovereign rounded-3xl overflow-hidden border border-primary/10 hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => setSelectedPet(pet)}
              >
                {/* Pet Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  
                  {/* Rarity Badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${rarityColors[pet.rarity]}`}>
                    <Star className="w-3 h-3 inline mr-1" />
                    {pet.rarity}
                  </div>

                  {/* Level */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass-dark text-xs font-bold">
                    Nv. {pet.level}
                  </div>

                  {/* Pet Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-sovereign text-xl font-bold text-white">{pet.name}</h3>
                    <p className="text-sm text-white/70">{pet.species}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="p-4 space-y-3">
                  {/* Happiness */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="flex items-center gap-1 text-red-400">
                        <Heart className="w-3 h-3" />
                        Felicidad
                      </span>
                      <span>{pet.happiness}%</span>
                    </div>
                    <Progress value={pet.happiness} className="h-2" />
                  </div>

                  {/* Experience */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="flex items-center gap-1 text-secondary">
                        <Zap className="w-3 h-3" />
                        Experiencia
                      </span>
                      <span>{pet.experience.toLocaleString()} XP</span>
                    </div>
                    <Progress value={(pet.experience % 1000) / 10} className="h-2" />
                  </div>

                  {/* Abilities */}
                  <div className="flex flex-wrap gap-1 pt-2">
                    {pet.abilities.map((ability, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">
                        {ability}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add New Pet Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl border-2 border-dashed border-primary/30 flex items-center justify-center p-8 cursor-pointer hover:border-primary transition-colors min-h-[400px]"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <p className="font-medium text-muted-foreground">Adoptar Mascota</p>
                <p className="text-xs text-muted-foreground mt-1">desde 500 MSR</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Pet Arena */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-3xl glass-sovereign border border-secondary/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-sovereign font-bold">Arena de Combate</h3>
                <p className="text-sm text-muted-foreground">Batallas amistosas por MSR</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-xl bg-background/50 text-center">
                <p className="text-2xl font-bold text-secondary">156</p>
                <p className="text-xs text-muted-foreground">Victorias</p>
              </div>
              <div className="p-4 rounded-xl bg-background/50 text-center">
                <p className="text-2xl font-bold text-primary">23,450</p>
                <p className="text-xs text-muted-foreground">MSR Ganados</p>
              </div>
            </div>
            <Button className="w-full bg-secondary hover:bg-secondary/90 rounded-xl">
              Entrar a la Arena
            </Button>
          </motion.div>

          {/* Customization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-3xl glass-sovereign border border-primary/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-sovereign font-bold">Personalización</h3>
                <p className="text-sm text-muted-foreground">Accesorios y skins únicos</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              {[dreamspaceWorld, dreamspaceConcert, dreamspaceWorld, dreamspaceConcert].map((img, i) => (
                <div key={i} className="w-12 h-12 rounded-lg overflow-hidden border border-primary/20">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                +24
              </div>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl">
              Ver Tienda de Skins
            </Button>
          </motion.div>
        </div>

        {/* Evolution Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20 border border-primary/20 text-center"
        >
          <Dna className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-sovereign font-bold mb-2">
            Evolución <span className="text-secondary">Genética</span>
          </h3>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Cada mascota tiene un ADN único registrado en blockchain. Al evolucionar, 
            sus genes mutan creando habilidades y apariencias exclusivas.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-primary hover:bg-primary/90 rounded-full px-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Evolucionar
            </Button>
            <Button variant="outline" className="border-primary/30 rounded-full px-6">
              Ver Árbol Genético
            </Button>
          </div>
        </motion.div>
      </main>

      <IsabellaChat />
    </div>
  );
}
