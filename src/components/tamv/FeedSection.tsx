import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, Play, Users, Eye, Verified } from 'lucide-react';
import dreamspaceConcert from '@/assets/dreamspace-concert.jpg';
import dreamspaceWorld from '@/assets/dreamspace-world.jpg';
import creator1 from '@/assets/creator-1.jpg';
import isabellaAvatar from '@/assets/isabella-avatar.png';

const feedPosts = [
  {
    id: 1,
    type: 'live',
    creator: {
      name: 'Neo-Tokio Stage',
      avatar: isabellaAvatar,
      verified: true,
    },
    content: {
      image: dreamspaceConcert,
      title: 'Concierto en Vivo 4D',
      viewers: '12.4K',
    },
    stats: { likes: '24.5K', comments: '1.2K', shares: '890' },
  },
  {
    id: 2,
    type: 'dreamspace',
    creator: {
      name: 'Santuario Fractal',
      avatar: creator1,
      verified: true,
    },
    content: {
      image: dreamspaceWorld,
      title: 'Explora el nuevo DreamSpace',
      viewers: '8.2K',
    },
    stats: { likes: '18.3K', comments: '956', shares: '432' },
  },
];

const stories = [
  { id: 1, name: 'Isabella', avatar: isabellaAvatar, isLive: true, isIsabella: true },
  { id: 2, name: 'Neo-Tokio', avatar: dreamspaceConcert, isLive: true },
  { id: 3, name: 'Fractal', avatar: dreamspaceWorld, isLive: false },
  { id: 4, name: 'Creador', avatar: creator1, isLive: true },
  { id: 5, name: 'Marte XR', avatar: dreamspaceWorld, isLive: false },
];

export function FeedSection() {
  return (
    <section id="nexo" className="relative py-20 bg-gradient-sovereign">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-sovereign text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient-gold">Nexo Social</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Feed de la Federación Korima - Contenido cifrado 4D con distribución justa
          </p>
        </motion.div>

        {/* Stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 overflow-x-auto scrollbar-hide"
        >
          <div className="flex gap-4 pb-4">
            {stories.map((story) => (
              <div key={story.id} className="flex flex-col items-center gap-2 min-w-[80px]">
                <div className={`relative p-0.5 rounded-full ${story.isLive ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-muted'}`}>
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-background">
                    <img src={story.avatar} alt={story.name} className="h-full w-full object-cover" />
                  </div>
                  {story.isLive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[8px] font-bold bg-primary text-background rounded-full">
                      LIVE
                    </span>
                  )}
                  {story.isIsabella && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
                      <Verified className="h-3 w-3 text-background" />
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground truncate max-w-[70px]">{story.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {feedPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="content-card group"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden border border-primary/30">
                    <img src={post.creator.avatar} alt={post.creator.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-sm">{post.creator.name}</span>
                      {post.creator.verified && <Verified className="h-4 w-4 text-secondary" />}
                    </div>
                    <span className="text-xs text-muted-foreground">DreamSpace • Ahora</span>
                  </div>
                </div>
                {post.type === 'live' && (
                  <span className="badge-live flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-background animate-pulse" />
                    EN VIVO
                  </span>
                )}
              </div>

              {/* Post Media */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={post.content.image} 
                  alt={post.content.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-primary/30 hover:scale-110 transform transition-all">
                    <Play className="h-6 w-6 text-primary fill-primary" />
                  </div>
                </div>

                {/* Viewers */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-dark text-sm">
                  <Eye className="h-4 w-4 text-primary" />
                  <span className="font-medium">{post.content.viewers}</span>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-sovereign text-xl font-bold text-glow-gold">{post.content.title}</h3>
                </div>
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group/btn">
                    <Heart className="h-5 w-5 group-hover/btn:fill-primary group-hover/btn:text-primary" />
                    <span className="text-sm font-medium">{post.stats.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">{post.stats.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Share2 className="h-5 w-5" />
                    <span className="text-sm font-medium">{post.stats.shares}</span>
                  </button>
                </div>
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="btn-ghost-gold">
            Cargar más contenido
          </button>
        </div>
      </div>
    </section>
  );
}
