import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Gavel, Tag, Filter, Search, Star, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/tamv/Navbar';
import { IsabellaChat } from '@/components/tamv/IsabellaChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import dreamspaceWorld from '@/assets/dreamspace-world.jpg';
import dreamspaceConcert from '@/assets/dreamspace-concert.jpg';

export default function Marketplace() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'auctions' | 'digital' | 'services'>('all');

  // Demo items
  const items = [
    {
      id: '1',
      title: 'Mascota Legendaria: Dragón de Obsidiana',
      price: 2500,
      image: dreamspaceWorld,
      category: 'Digital',
      seller: 'AnubisCreator',
      isAuction: false,
      rating: 4.9,
      sold: 23
    },
    {
      id: '2',
      title: 'Acceso VIP Concierto Sensorial 2026',
      price: 1200,
      image: dreamspaceConcert,
      category: 'Eventos',
      seller: 'TAMVOfficial',
      isAuction: true,
      currentBid: 1450,
      timeLeft: '2h 34m',
      rating: 5.0
    },
    {
      id: '3',
      title: 'DreamSpace Template: Galería Cyberpunk',
      price: 800,
      image: dreamspaceWorld,
      category: 'Templates',
      seller: 'DreamDesigner',
      isAuction: false,
      rating: 4.7,
      sold: 156
    },
    {
      id: '4',
      title: 'Pack Efectos KAOS Audio Premium',
      price: 500,
      image: dreamspaceConcert,
      category: 'Audio',
      seller: 'SoundMaster',
      isAuction: false,
      rating: 4.8,
      sold: 89
    },
    {
      id: '5',
      title: 'NFT Arte Generativo: Aurora Soberana',
      price: 3200,
      image: dreamspaceWorld,
      category: 'Arte',
      seller: 'ArtistKorima',
      isAuction: true,
      currentBid: 4100,
      timeLeft: '5h 12m',
      rating: 5.0
    },
    {
      id: '6',
      title: 'Curso Completo: Desarrollo TAMV',
      price: 1500,
      image: dreamspaceConcert,
      category: 'Educación',
      seller: 'TAMVUniversity',
      isAuction: false,
      rating: 4.9,
      sold: 412
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
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-sovereign font-black">
                <span className="text-gradient-gold">MARKET</span>
                <span className="text-foreground">PLACE</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Economía justa 70/20/10 · Subastas · Arte Digital · Servicios
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 rounded-full">
              <Tag className="w-4 h-4 mr-2" />
              Vender
            </Button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Buscar productos, servicios, arte..."
                className="pl-12 h-12 bg-background/50 border-primary/30 rounded-xl"
              />
            </div>
            <Button variant="outline" className="h-12 rounded-xl border-primary/30">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'Todo', icon: ShoppingBag },
            { id: 'auctions', label: 'Subastas', icon: Gavel },
            { id: 'digital', label: 'Digital', icon: Star },
            { id: 'services', label: 'Servicios', icon: TrendingUp }
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              className={`rounded-full whitespace-nowrap ${activeTab === tab.id ? 'bg-primary' : 'border-primary/30'}`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Volumen Total', value: '2.4M MSR' },
            { label: 'Artículos Activos', value: '12,847' },
            { label: 'Vendedores', value: '3,421' },
            { label: 'Subastas Activas', value: '234' }
          ].map((stat, i) => (
            <div 
              key={i}
              className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center"
            >
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group glass-sovereign rounded-2xl overflow-hidden border border-primary/10 hover:border-primary/30 transition-all"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                
                {item.isAuction && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/90 text-background text-xs font-bold">
                    <Gavel className="w-3 h-3" />
                    SUBASTA
                  </div>
                )}

                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-1 rounded-full bg-primary/80 text-background text-xs">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  por @{item.seller}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <div>
                    {item.isAuction ? (
                      <>
                        <p className="text-xs text-muted-foreground">Oferta actual</p>
                        <p className="text-xl font-bold text-secondary">{item.currentBid?.toLocaleString()} MSR</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.timeLeft}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-muted-foreground">Precio</p>
                        <p className="text-xl font-bold text-primary">{item.price.toLocaleString()} MSR</p>
                        {item.sold && (
                          <p className="text-xs text-muted-foreground">{item.sold} vendidos</p>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                </div>

                <Button 
                  className={`w-full mt-4 rounded-xl ${item.isAuction ? 'bg-secondary hover:bg-secondary/90' : 'bg-primary hover:bg-primary/90'}`}
                >
                  {item.isAuction ? 'Ofertar' : 'Comprar'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Justice Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-sovereign font-bold mb-2">
                Justicia Distributiva <span className="text-primary">70/20/10</span>
              </h3>
              <p className="text-muted-foreground max-w-lg">
                Cada transacción distribuye automáticamente: 70% al creador, 20% al Fondo Fénix de resiliencia, 10% a la infraestructura del Kernel
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center p-4 rounded-xl bg-primary/20">
                <p className="text-3xl font-bold text-primary">70%</p>
                <p className="text-xs text-muted-foreground">Creador</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/20">
                <p className="text-3xl font-bold text-secondary">20%</p>
                <p className="text-xs text-muted-foreground">Fénix</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-accent/20">
                <p className="text-3xl font-bold text-accent">10%</p>
                <p className="text-xs text-muted-foreground">Kernel</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <IsabellaChat />
    </div>
  );
}
