import { motion } from 'framer-motion';
import { Sparkles, Users, ArrowRight, Globe, Zap } from 'lucide-react';
import dreamspaceConcert from '@/assets/dreamspace-concert.jpg';
import dreamspaceWorld from '@/assets/dreamspace-world.jpg';

const dreamspaces = [
  {
    id: 1,
    name: 'Neo-Tokio Stage',
    description: 'Escenario de conciertos 4D con capacidad infinita',
    image: dreamspaceConcert,
    visitors: '124K',
    category: 'Entretenimiento',
    isLive: true,
  },
  {
    id: 2,
    name: 'Santuario Fractal',
    description: 'Espacio de meditación y aprendizaje XR',
    image: dreamspaceWorld,
    visitors: '89K',
    category: 'Bienestar',
    isLive: false,
  },
  {
    id: 3,
    name: 'Marte Colonial',
    description: 'El primer asentamiento humano virtual en Marte',
    image: dreamspaceConcert,
    visitors: '67K',
    category: 'Exploración',
    isLive: true,
  },
];

export function DreamSpacesSection() {
  return (
    <section id="dreamspaces" className="relative py-24 overflow-hidden">
      {/* Ambient Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-secondary/5 blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-secondary" />
              <span className="text-sm font-sovereign text-secondary tracking-widest">METAVERSO XR</span>
            </div>
            <h2 className="font-sovereign text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-isabella">DreamSpaces</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Mundos virtuales persistentes donde la imaginación cobra vida. 
              Cada espacio es una economía y comunidad autónoma.
            </p>
          </div>
          <button className="btn-ghost-gold flex items-center gap-2 shrink-0">
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

        {/* DreamSpaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dreamspaces.map((space, index) => (
            <motion.div
              key={space.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group relative overflow-hidden rounded-[2rem] cursor-pointer"
            >
              {/* Background */}
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={space.image} 
                  alt={space.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* Status Badge */}
              {space.isLive && (
                <div className="absolute top-4 left-4">
                  <span className="badge-live">
                    <Zap className="h-3 w-3 inline mr-1" />
                    ACTIVO
                  </span>
                </div>
              )}

              {/* Category */}
              <div className="absolute top-4 right-4">
                <span className="badge-isabella">{space.category}</span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-sovereign text-2xl font-bold mb-2 text-glow-gold">
                  {space.name}
                </h3>
                <p className="text-sm text-white/70 mb-4 line-clamp-2">
                  {space.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-secondary" />
                    <span className="text-white/80">{space.visitors} exploradores</span>
                  </div>
                  <button className="h-10 w-10 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <ArrowRight className="h-5 w-5 text-background" />
                  </button>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 border-2 border-primary/50 rounded-[2rem]" />
                <div className="absolute inset-0 shadow-glow-gold rounded-[2rem]" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured DreamSpace CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 relative overflow-hidden rounded-[2.5rem] glass-sovereign p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-sovereign text-primary tracking-widest">CREA TU MUNDO</span>
              </div>
              <h3 className="font-sovereign text-3xl md:text-4xl font-bold mb-4">
                Diseña tu propio <span className="text-gradient-gold">DreamSpace</span>
              </h3>
              <p className="text-muted-foreground mb-6">
                Con el motor de realidad de TAMV puedes crear espacios virtuales que 
                generan ingresos reales bajo el modelo de Justicia 70/20/10.
              </p>
              <button className="btn-sovereign">
                Comenzar a Crear
              </button>
            </div>
            <div className="relative w-full md:w-1/3 aspect-square">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse" />
              <div className="absolute inset-4 rounded-full glass-sovereign flex items-center justify-center">
                <Globe className="h-20 w-20 text-primary/50" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
