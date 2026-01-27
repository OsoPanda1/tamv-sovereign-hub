/**
 * useNotifications - Real-time Notification System
 * TAMV MD-X4™ Omniverse Notification Engine
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { 
  Notification, 
  NotificationPreferences,
  createDefaultPreferences,
  shouldShowNotification,
  getUnreadCount,
  groupNotifications,
  NOTIFICATION_ICONS
} from '@/lib/notifications';
import { useToast } from './use-toast';

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  preferences: NotificationPreferences;
  
  // Actions
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  dismissNotification: (notificationId: string) => Promise<void>;
  clearAll: () => Promise<void>;
  updatePreferences: (updates: Partial<NotificationPreferences>) => void;
  
  // Computed
  groupedNotifications: ReturnType<typeof groupNotifications>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<NotificationPreferences>(createDefaultPreferences);

  // Fetch initial notifications
  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        const mappedNotifications: Notification[] = (data || []).map(n => ({
          id: n.id,
          type: mapNotificationType(n.notification_type),
          priority: 'normal' as const,
          title: n.title,
          message: n.message || '',
          icon: NOTIFICATION_ICONS[mapNotificationType(n.notification_type)],
          read: n.is_read || false,
          dismissed: false,
          createdAt: new Date(n.created_at || Date.now()),
          metadata: n.metadata as Record<string, unknown> | undefined,
        }));

        setNotifications(mappedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  // Subscribe to realtime notifications
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotif = payload.new as any;
          
          const notification: Notification = {
            id: newNotif.id,
            type: mapNotificationType(newNotif.notification_type),
            priority: 'normal',
            title: newNotif.title,
            message: newNotif.message || '',
            icon: NOTIFICATION_ICONS[mapNotificationType(newNotif.notification_type)],
            read: false,
            dismissed: false,
            createdAt: new Date(newNotif.created_at || Date.now()),
            metadata: newNotif.metadata,
          };

          // Check preferences before showing
          if (shouldShowNotification(notification, preferences)) {
            setNotifications(prev => [notification, ...prev]);
            
            // Show toast for new notification
            toast({
              title: notification.title,
              description: notification.message,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, preferences, toast]);

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user?.id) return;

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [user?.id]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, [user?.id]);

  // Dismiss notification (local only)
  const dismissNotification = useCallback(async (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(n => n.id !== notificationId)
    );
  }, []);

  // Clear all notifications
  const clearAll = useCallback(async () => {
    setNotifications([]);
  }, []);

  // Update preferences
  const updatePreferences = useCallback((updates: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  }, []);

  // Computed values
  const unreadCount = getUnreadCount(notifications);
  const groupedNotifications = groupNotifications(notifications);

  return {
    notifications,
    unreadCount,
    isLoading,
    preferences,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
    updatePreferences,
    groupedNotifications,
  };
};

// Helper to map DB notification types to our types
function mapNotificationType(dbType: string | null): Notification['type'] {
  const typeMap: Record<string, Notification['type']> = {
    system: 'system',
    social: 'social',
    transaction: 'economic',
    alert: 'security',
    isabella: 'message',
  };
  return typeMap[dbType || 'system'] || 'system';
}
