import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Image, Video, Mic, Globe, Lock, Send, Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/tamv/Navbar';
import { IsabellaChat } from '@/components/tamv/IsabellaChat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Post {
  id: string;
  user_id: string;
  content_type: string;
  title: string;
  body: string;
  media_urls: string[];
  likes_count: number;
  views_count: number;
  created_at: string;
  profiles: {
    username: string;
    display_name: string;
    avatar_url: string;
    is_verified: boolean;
  };
}

export default function Feed() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchPosts();
    
    // Real-time subscription
    const channel = supabase
      .channel('content-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'content' },
        (payload) => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('content')
      .select(`
        *,
        profiles:user_id (username, display_name, avatar_url, is_verified)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setPosts(data as any);
    }
    setLoading(false);
  };

  const handlePost = async () => {
    if (!newPost.trim() || !user) return;
    
    setPosting(true);
    
    const { error } = await supabase
      .from('content')
      .insert({
        user_id: user.id,
        content_type: 'post',
        body: newPost,
        title: ''
      });

    if (error) {
      toast({ title: 'Error', description: 'No se pudo publicar', variant: 'destructive' });
    } else {
      toast({ title: '¡Publicado!', description: 'Tu mensaje está en el muro global' });
      setNewPost('');
      setShowComposer(false);
    }
    
    setPosting(false);
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('likes')
      .insert({ user_id: user.id, content_id: postId });

    if (!error) {
      // Increment likes count
      await supabase
        .from('content')
        .update({ likes_count: posts.find(p => p.id === postId)!.likes_count + 1 })
        .eq('id', postId);
      
      fetchPosts();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-32 max-w-2xl">
        {/* Post Composer */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-sovereign rounded-3xl p-4 mb-6 border border-primary/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-background font-bold">
              {profile?.username?.[0]?.toUpperCase() || 'C'}
            </div>
            <div className="flex-1">
              {showComposer ? (
                <div className="space-y-4">
                  <Textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="¿Qué quieres compartir con la Federación?"
                    className="bg-transparent border-none resize-none focus:ring-0 text-base"
                    rows={4}
                    autoFocus
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost" className="rounded-full h-10 w-10">
                        <Image className="w-5 h-5 text-secondary" />
                      </Button>
                      <Button size="icon" variant="ghost" className="rounded-full h-10 w-10">
                        <Video className="w-5 h-5 text-secondary" />
                      </Button>
                      <Button size="icon" variant="ghost" className="rounded-full h-10 w-10">
                        <Mic className="w-5 h-5 text-secondary" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => setShowComposer(false)}
                        className="text-muted-foreground"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handlePost}
                        disabled={!newPost.trim() || posting}
                        className="bg-primary hover:bg-primary/90 rounded-full px-6"
                      >
                        {posting ? 'Publicando...' : 'Publicar'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowComposer(true)}
                  className="w-full text-left text-muted-foreground hover:text-foreground py-3"
                >
                  ¿Qué quieres compartir con la Federación?
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay publicaciones aún. ¡Sé el primero en compartir!</p>
            </div>
          ) : (
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-sovereign rounded-3xl p-6 border border-primary/10 hover:border-primary/30 transition-colors"
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-background font-bold">
                        {post.profiles?.avatar_url ? (
                          <img src={post.profiles.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          post.profiles?.username?.[0]?.toUpperCase() || 'C'
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{post.profiles?.display_name || post.profiles?.username}</span>
                          {post.profiles?.is_verified && (
                            <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center">
                              <span className="text-[8px] text-background">✓</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          @{post.profiles?.username} · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: es })}
                        </span>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Post Content */}
                  <p className="text-foreground whitespace-pre-wrap mb-4">{post.body}</p>

                  {/* Media */}
                  {post.media_urls && post.media_urls.length > 0 && (
                    <div className="rounded-2xl overflow-hidden mb-4">
                      <img 
                        src={post.media_urls[0]} 
                        alt="" 
                        className="w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-2 text-muted-foreground hover:text-red-500"
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart className="w-5 h-5" />
                      <span>{post.likes_count || 0}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-secondary">
                      <MessageCircle className="w-5 h-5" />
                      <span>0</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <Button
        onClick={() => setShowComposer(true)}
        className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-glow z-40"
      >
        <Plus className="w-6 h-6" />
      </Button>

      <IsabellaChat />
    </div>
  );
}
