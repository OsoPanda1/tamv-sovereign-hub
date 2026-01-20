import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  channel_id?: string;
  receiver_id?: string;
  message_type: string;
  created_at: string;
  sender?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  channel_type: string;
  avatar_url: string;
  member_count: number;
  is_verified: boolean;
  owner?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

export function useRealtimeChat(channelId?: string, receiverId?: string) {
  const { session } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('realtime-chat', {
        body: { 
          action: 'get_messages', 
          channel_id: channelId, 
          receiver_id: receiverId,
          limit: 50 
        }
      });

      if (error) throw error;
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session, channelId, receiverId]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!session || !content.trim()) return;

    try {
      const { data, error } = await supabase.functions.invoke('realtime-chat', {
        body: { 
          action: 'send_message', 
          content,
          channel_id: channelId,
          receiver_id: receiverId
        }
      });

      if (error) throw error;
      
      // Optimistically add message
      if (data.message) {
        setMessages(prev => [...prev, {
          ...data.message,
          sender: {
            id: session.user.id,
            username: 'You',
            display_name: 'You',
            avatar_url: ''
          }
        }]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }, [session, channelId, receiverId]);

  // Fetch channels
  const fetchChannels = useCallback(async () => {
    if (!session) return;

    try {
      const { data, error } = await supabase.functions.invoke('realtime-chat', {
        body: { action: 'get_channels' }
      });

      if (error) throw error;
      setChannels(data.channels || []);
    } catch (err) {
      console.error('Failed to fetch channels:', err);
    }
  }, [session]);

  // Create channel
  const createChannel = useCallback(async (name: string, description: string, channelType: string = 'public') => {
    if (!session) return;

    try {
      const { data, error } = await supabase.functions.invoke('realtime-chat', {
        body: { 
          action: 'create_channel',
          name,
          description,
          channel_type: channelType
        }
      });

      if (error) throw error;
      if (data.channel) {
        setChannels(prev => [data.channel, ...prev]);
      }
      return data.channel;
    } catch (err) {
      console.error('Failed to create channel:', err);
    }
  }, [session]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!channelId && !receiverId) return;

    const channel = supabase
      .channel(`messages-${channelId || receiverId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: channelId 
            ? `channel_id=eq.${channelId}` 
            : `receiver_id=eq.${receiverId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId, receiverId]);

  // Initial fetch
  useEffect(() => {
    if (channelId || receiverId) {
      fetchMessages();
    }
  }, [channelId, receiverId, fetchMessages]);

  return {
    messages,
    channels,
    isLoading,
    sendMessage,
    fetchMessages,
    fetchChannels,
    createChannel,
  };
}
