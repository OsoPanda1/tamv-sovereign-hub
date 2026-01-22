import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Gavel, 
  Clock, 
  Eye, 
  Heart,
  Filter,
  Grid3X3,
  LayoutGrid,
  Sparkles,
  Crown,
  Verified
} from 'lucide-react';
import { Navbar } from '@/components/tamv/Navbar';
import { IsabellaChat } from '@/components/tamv/IsabellaChat';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  GALLERY_THEMES,
  formatAuctionCountdown,
  calculateMinimumBid,
  type Auction,
  type NFTArtwork
} from '@/lib/nft-gallery';

import dreamspaceWorld from '@/assets/dreamspace-world.jpg';
import dreamspaceConcert from '@/assets/dreamspace-concert.jpg';

export default function Gallery() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [auctions, setAuctions] = useState<Auction[]>([]);

  const categories = [
    { id: 'all', label: 'Todo', icon: LayoutGrid },
    { id: 'digital_art', label: 'Arte Digital', icon: Palette },
    { id: '3d_sculpture', label: 'Esculturas 3D', icon: Grid3X3 },
    { id: 'music', label: 'Música', icon: Sparkles },
  ];

  const demoArtworks: NFTArtwork[] = [
    {
      id: '1',
      title: 'Obsidiana Cuántica',
      description: 'Arte generativo inspirado en la obsidiana imperial',
      creatorId: 'creator1',
      creatorName: 'ArtistaTAMV',
      category: 'digital_art',
      mediaUrl: dreamspaceWorld,
      thumbnailUrl: dreamspaceWorld,
      is3D: false,
      royaltyPercent: 10,
      edition: { current: 1, total: 10 },
      createdAt: new Date(),
      metadata: { attributes: [] },
    },
    {
      id: '2',
      title: 'Portal Dimensional',
      description: 'Escultura 3D interactiva del metaverso',
      creatorId: 'creator2',
      creatorName: 'Escultor3D',
      category: '3d_sculpture',
      mediaUrl: dreamspaceConcert,
      thumbnailUrl: dreamspaceConcert,
      is3D: true,
      royaltyPercent: 15,
      edition: { current: 3, total: 5 },
      createdAt: new Date(),
      metadata: { attributes: [] },
    },
  ];

  const demoAuctions: Auction[] = [
    {
      id: 'auction1',
      artworkId: '1',
      artwork: demoArtworks[0],
      sellerId: 'seller1',
      startPrice: 500,
      currentBid: 1250,
      minimumIncrement: 50,
      highestBidderId: 'bidder1',
      highestBidderName: 'ColeccionistaPro',
      bidCount: 8,
      bids: [],
      status: 'live',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000 * 5), // 5 hours
      autoExtend: true,
      extensionMinutes: 5,
    },
    {
      id: 'auction2',
      artworkId: '2',
      artwork: demoArtworks[1],
      sellerId: 'seller2',
      startPrice: 1000,
      currentBid: 2100,
      minimumIncrement: 100,
      highestBidderId: 'bidder2',
      highestBidderName: 'ArteLover',
      bidCount: 12,
      bids: [],
      status: 'live',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000 * 2), // 2 hours
      autoExtend: true,
      extensionMinutes: 5,
    },
  ];

  const handleBid = async (auction: Auction) => {
    if (!user) {
      toast({
        title: 'Inicia sesión',
        description: 'Debes iniciar sesión para pujar',
        variant: 'destructive',
      });
      return;
    }
    
    const minBid = calculateMinimumBid(auction);
    toast({
      title: '¡Puja enviada!',
      description: `Tu puja de ${minBid} MSR ha sido registrada`,
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
              <Palette className="h-4 w-4 text-primary" />
              <span className="text-xs font-sovereign text-primary tracking-wider">GALERÍA NFT</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-sovereign font-bold text-gradient-gold mb-4">
              Arte Digital Soberano
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre, colecciona y subasta arte digital único en el ecosistema TAMV
            </p>
          </motion.div>

          {/* Live Auctions Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-sovereign rounded-3xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-destructive/20">
                  <Gavel className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h2 className="text-xl font-sovereign font-bold">Subastas en Vivo</h2>
                  <p className="text-sm text-muted-foreground">Obras exclusivas compitiendo ahora</p>
                </div>
              </div>
              <div className="badge-live flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-background animate-pulse" />
                LIVE
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {demoAuctions.map((auction, index) => (
                <motion.div
                  key={auction.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="content-card overflow-hidden"
                >
                  <div className="relative aspect-[4/3]">
                    <img 
                      src={auction.artwork?.thumbnailUrl} 
                      alt={auction.artwork?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {formatAuctionCountdown(auction.endTime)}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">324</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-sovereign font-bold">{auction.artwork?.title}</span>
                      {auction.artwork?.is3D && (
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-secondary/20 text-secondary">3D</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-muted-foreground">por</span>
                      <span className="text-sm text-primary flex items-center gap-1">
                        {auction.artwork?.creatorName}
                        <Verified className="h-3 w-3" />
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Puja actual</p>
                        <p className="text-2xl font-sovereign font-bold text-gradient-gold">
                          {auction.currentBid.toLocaleString()} MSR
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Pujas</p>
                        <p className="text-lg font-bold">{auction.bidCount}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 btn-sovereign"
                        onClick={() => handleBid(auction)}
                      >
                        Pujar {calculateMinimumBid(auction)} MSR
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-2xl">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Categories */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <cat.icon className="h-4 w-4" />
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-xl">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {demoArtworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="content-card group"
              >
                <div className="relative aspect-square overflow-hidden rounded-t-3xl">
                  <img 
                    src={artwork.thumbnailUrl} 
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {artwork.is3D && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-secondary/90 text-secondary-foreground text-[10px] font-bold">
                      3D
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <h3 className="font-sovereign font-bold mb-1">{artwork.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                    {artwork.creatorName}
                    <Verified className="h-3 w-3 text-primary" />
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Edición</p>
                      <p className="text-sm font-medium">{artwork.edition.current}/{artwork.edition.total}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Royalty</p>
                      <p className="text-sm font-medium text-primary">{artwork.royaltyPercent}%</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Create Gallery CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="glass-sovereign rounded-3xl p-8 max-w-2xl mx-auto">
              <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-sovereign font-bold mb-2">Crea Tu Galería</h3>
              <p className="text-muted-foreground mb-6">
                Curate y exhibe tu colección de NFTs en un espacio 3D inmersivo
              </p>
              <Button className="btn-sovereign">
                <Sparkles className="h-4 w-4 mr-2" />
                Crear Galería
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <IsabellaChat />
    </div>
  );
}
