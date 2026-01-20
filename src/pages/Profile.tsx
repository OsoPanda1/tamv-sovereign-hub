import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Settings, Share2, Crown, Star, Heart, Eye, Edit2, Shield, Zap, Award, Grid, Play, Bookmark } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/tamv/Navbar';
import { IsabellaChat } from '@/components/tamv/IsabellaChat';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import dreamspaceConcert from '@/assets/dreamspace-concert.jpg';
import dreamspaceWorld from '@/assets/dreamspace-world.jpg';
import isabellaAvatar from '@/assets/isabella-avatar.png';

export default function Profile() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ followers: 0, following: 0, posts: 0 });
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchContent();
      fetchStats();
    }
  }, [user]);

  const fetchContent = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(12);

    if (!error && data) {
      setContent(data);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    if (!user) return;

    // Fetch followers count
    const { count: followersCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', user.id);

    // Fetch following count
    const { count: followingCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', user.id);

    // Fetch posts count
    const { count: postsCount } = await supabase
      .from('content')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    setStats({
      followers: followersCount || 0,
      following: followingCount || 0,
      posts: postsCount || 0
    });
  };

  const membershipColors: Record<string, { bg: string; text: string; icon: any }> = {
    citizen: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: Shield },
    creator: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Star },
    sovereign: { bg: 'bg-primary/20', text: 'text-primary', icon: Crown },
    guardian: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: Shield },
    architect: { bg: 'bg-secondary/20', text: 'text-secondary', icon: Zap }
  };

  const membership = membershipColors[profile?.membership_level || 'citizen'];
  const MembershipIcon = membership.icon;

  // Demo content
  const demoContent = [
    { id: '1', image: dreamspaceConcert, type: 'video', views: 12400, likes: 1200 },
    { id: '2', image: dreamspaceWorld, type: 'image', views: 8900, likes: 890 },
    { id: '3', image: dreamspaceConcert, type: 'dreamspace', views: 5600, likes: 560 },
    { id: '4', image: dreamspaceWorld, type: 'video', views: 23500, likes: 2350 },
    { id: '5', image: dreamspaceConcert, type: 'image', views: 4500, likes: 450 },
    { id: '6', image: dreamspaceWorld, type: 'video', views: 18900, likes: 1890 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-20 max-w-4xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Banner */}
          <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden mb-20">
            <img 
              src={profile?.banner_url || dreamspaceConcert}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <Button 
              size="icon" 
              variant="secondary" 
              className="absolute top-4 right-4 rounded-full bg-background/50 hover:bg-background/80"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          {/* Avatar */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-16">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-background overflow-hidden bg-gradient-to-br from-primary to-secondary">
                <img 
                  src={profile?.avatar_url || isabellaAvatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {profile?.is_verified && (
                <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center border-2 border-background">
                  <Crown className="w-4 h-4 text-background" />
                </div>
              )}
              <Button 
                size="icon" 
                className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-primary hover:bg-primary/90"
              >
                <Edit2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mt-6"
        >
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-sovereign font-bold">
              {profile?.display_name || profile?.username || 'Ciudadano Soberano'}
            </h1>
            {profile?.is_verified && (
              <Crown className="w-5 h-5 text-secondary" />
            )}
          </div>
          <p className="text-muted-foreground">@{profile?.username || 'usuario'}</p>
          
          {/* Membership Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mt-3 ${membership.bg} ${membership.text}`}>
            <MembershipIcon className="w-4 h-4" />
            <span className="text-sm font-medium capitalize">{profile?.membership_level || 'citizen'}</span>
          </div>

          {/* Bio */}
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            {profile?.bio || 'Ciudadano de la Federación Korima. Explorando DreamSpaces y creando en el ecosistema TAMV.'}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-8 mt-6"
        >
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.posts}</p>
            <p className="text-sm text-muted-foreground">Posts</p>
          </div>
          <div className="text-center cursor-pointer hover:text-primary transition-colors">
            <p className="text-2xl font-bold">{stats.followers.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Seguidores</p>
          </div>
          <div className="text-center cursor-pointer hover:text-primary transition-colors">
            <p className="text-2xl font-bold">{stats.following.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Siguiendo</p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3 mt-6"
        >
          <Button className="bg-primary hover:bg-primary/90 rounded-full px-8">
            Editar Perfil
          </Button>
          <Button variant="outline" className="rounded-full border-primary/30">
            <Share2 className="w-4 h-4 mr-2" />
            Compartir
          </Button>
          <Button size="icon" variant="outline" className="rounded-full border-primary/30">
            <Settings className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* MSR & Reputation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4 mt-8"
        >
          <div className="p-4 rounded-2xl glass-sovereign border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Balance MSR</p>
                <p className="text-xl font-sovereign font-bold text-primary">
                  {profile?.msr_balance?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-2xl glass-sovereign border border-secondary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Reputación</p>
                <p className="text-xl font-sovereign font-bold text-secondary">
                  {profile?.reputation_score?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full glass-sovereign rounded-full p-1">
              <TabsTrigger value="posts" className="flex-1 rounded-full data-[state=active]:bg-primary data-[state=active]:text-background">
                <Grid className="w-4 h-4 mr-2" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex-1 rounded-full data-[state=active]:bg-primary data-[state=active]:text-background">
                <Play className="w-4 h-4 mr-2" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex-1 rounded-full data-[state=active]:bg-primary data-[state=active]:text-background">
                <Bookmark className="w-4 h-4 mr-2" />
                Guardados
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-6">
              <div className="grid grid-cols-3 gap-2">
                {demoContent.map((item) => (
                  <div 
                    key={item.id}
                    className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                  >
                    <img 
                      src={item.image}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <div className="flex items-center gap-1 text-white">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.views.toLocaleString()}</span>
                      </div>
                    </div>
                    {item.type === 'video' && (
                      <div className="absolute top-2 right-2">
                        <Play className="w-5 h-5 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
              <div className="grid grid-cols-3 gap-2">
                {demoContent.filter(c => c.type === 'video').map((item) => (
                  <div 
                    key={item.id}
                    className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer"
                  >
                    <img 
                      src={item.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                        <Play className="w-5 h-5 text-background" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              <div className="text-center py-12 text-muted-foreground">
                <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay contenido guardado</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <IsabellaChat />
    </div>
  );
}
