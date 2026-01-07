import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Award, Users, Play, Clock, Star, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/tamv/Navbar';
import { IsabellaChat } from '@/components/tamv/IsabellaChat';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import dreamspaceConcert from '@/assets/dreamspace-concert.jpg';
import dreamspaceWorld from '@/assets/dreamspace-world.jpg';

export default function University() {
  const [activeCategory, setActiveCategory] = useState('all');

  const courses = [
    {
      id: '1',
      title: 'Fundamentos del Ecosistema TAMV',
      instructor: 'Isabella AI',
      thumbnail: dreamspaceWorld,
      duration: '4 horas',
      students: 2847,
      rating: 4.9,
      price: 0,
      category: 'Fundamentos',
      modules: 12,
      isFree: true
    },
    {
      id: '2',
      title: 'Desarrollo de DreamSpaces con Three.js',
      instructor: 'Edwin Castillo',
      thumbnail: dreamspaceConcert,
      duration: '12 horas',
      students: 1234,
      rating: 4.8,
      price: 500,
      category: 'Desarrollo',
      modules: 24
    },
    {
      id: '3',
      title: 'Criptografía Caótica 4D',
      instructor: 'Anubis Security',
      thumbnail: dreamspaceWorld,
      duration: '8 horas',
      students: 892,
      rating: 5.0,
      price: 800,
      category: 'Seguridad',
      modules: 16
    },
    {
      id: '4',
      title: 'Economía MSR y Justicia 70/20/10',
      instructor: 'TAMV Economics',
      thumbnail: dreamspaceConcert,
      duration: '6 horas',
      students: 1567,
      rating: 4.7,
      price: 300,
      category: 'Economía',
      modules: 10
    },
    {
      id: '5',
      title: 'Diseño de Mascotas ADN',
      instructor: 'CreativeKorima',
      thumbnail: dreamspaceWorld,
      duration: '10 horas',
      students: 678,
      rating: 4.9,
      price: 600,
      category: 'Arte',
      modules: 18
    },
    {
      id: '6',
      title: 'Gobernanza DAO Híbrida',
      instructor: 'Dekateotl Council',
      thumbnail: dreamspaceConcert,
      duration: '5 horas',
      students: 456,
      rating: 4.8,
      price: 400,
      category: 'Gobernanza',
      modules: 8
    }
  ];

  const categories = ['all', 'Fundamentos', 'Desarrollo', 'Seguridad', 'Economía', 'Arte', 'Gobernanza'];

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-6">
            <GraduationCap className="w-4 h-4" />
            <span>Puentes de Conocimiento Blockchain</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sovereign font-black mb-4">
            <span className="text-gradient-gold">UNIVERSIDAD</span>
            <span className="text-foreground"> TAMV</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Aprende, certifica tus habilidades en blockchain y conviértete en un arquitecto de la Federación Korima
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { icon: BookOpen, label: 'Cursos', value: '45+' },
            { icon: Users, label: 'Estudiantes', value: '12K+' },
            { icon: Award, label: 'Certificados', value: '8.5K' },
            { icon: Star, label: 'Instructores', value: '32' }
          ].map((stat, i) => (
            <div 
              key={i}
              className="p-6 rounded-2xl glass-sovereign border border-primary/10 text-center"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* My Progress (if enrolled) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sovereign font-bold text-lg">Tu Progreso</h3>
            <Button variant="link" className="text-secondary">
              Ver todos <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden">
              <img src={dreamspaceWorld} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Fundamentos del Ecosistema TAMV</p>
              <p className="text-sm text-muted-foreground">Módulo 7 de 12</p>
              <Progress value={58} className="h-2 mt-2" />
            </div>
            <Button className="bg-primary hover:bg-primary/90 rounded-full">
              Continuar
            </Button>
          </div>
        </motion.div>

        {/* Categories */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              variant={activeCategory === cat ? 'default' : 'outline'}
              className={`rounded-full whitespace-nowrap ${activeCategory === cat ? 'bg-primary' : 'border-primary/30'}`}
            >
              {cat === 'all' ? 'Todos' : cat}
            </Button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses
            .filter(c => activeCategory === 'all' || c.category === activeCategory)
            .map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group glass-sovereign rounded-2xl overflow-hidden border border-primary/10 hover:border-primary/30 transition-all"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                
                {course.isFree && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-secondary text-background text-xs font-bold">
                    GRATIS
                  </div>
                )}

                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full bg-background/80 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-background/80 text-xs flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {course.modules} módulos
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" className="w-14 h-14 rounded-full bg-primary/90 hover:bg-primary">
                    <Play className="w-6 h-6 text-background" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <span className="text-xs text-secondary font-medium">{course.category}</span>
                <h3 className="font-semibold mt-1 group-hover:text-primary transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  por {course.instructor}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary/10">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.students.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-primary">
                      <Star className="w-4 h-4 fill-current" />
                      {course.rating}
                    </span>
                  </div>
                  <span className="font-bold text-primary">
                    {course.isFree ? 'Gratis' : `${course.price} MSR`}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certification Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20 border border-primary/20 text-center"
        >
          <Award className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-sovereign font-bold mb-2">
            Certificaciones Blockchain NFT
          </h3>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Cada certificado es un NFT inmutable registrado en el BookPI Ledger, verificable por cualquier institución de la Federación
          </p>
          <Button className="bg-primary hover:bg-primary/90 rounded-full px-8 py-3">
            Ver mis Certificados
          </Button>
        </motion.div>
      </main>

      <IsabellaChat />
    </div>
  );
}
