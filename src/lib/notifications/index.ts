/**
 * NOTIFICATIONS SYSTEM - TAMV MD-X4™
 * Real-time Notification Engine
 * Multi-channel Alert System
 */

export type NotificationType = 
  | 'social'           // Follows, mentions, likes
  | 'economic'         // Tips, purchases, rewards
  | 'governance'       // DAO votes, proposals
  | 'system'           // Announcements, updates
  | 'security'         // Security alerts
  | 'achievement'      // Badges, levels
  | 'stream'           // Live events
  | 'message';         // Direct messages

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  icon?: string;
  imageUrl?: string;
  actionUrl?: string;
  actionLabel?: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  read: boolean;
  dismissed: boolean;
  createdAt: Date;
  expiresAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface NotificationPreferences {
  enabled: boolean;
  channels: {
    push: boolean;
    email: boolean;
    inApp: boolean;
    sms: boolean;
  };
  types: Record<NotificationType, {
    enabled: boolean;
    sound: boolean;
    vibrate: boolean;
  }>;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM
    end: string;   // HH:MM
  };
  digest: {
    enabled: boolean;
    frequency: 'hourly' | 'daily' | 'weekly';
  };
}

export interface NotificationGroup {
  type: NotificationType;
  count: number;
  latestNotification: Notification;
  notifications: Notification[];
}

/**
 * Default notification icons
 */
export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  social: '👥',
  economic: '💰',
  governance: '🏛️',
  system: '⚙️',
  security: '🔐',
  achievement: '🏆',
  stream: '📺',
  message: '💬',
};

/**
 * Notification priority colors
 */
export const PRIORITY_COLORS: Record<NotificationPriority, string> = {
  low: '#9CA3AF',
  normal: '#3B82F6',
  high: '#F59E0B',
  urgent: '#EF4444',
};

/**
 * Create notification
 */
export const createNotification = (
  type: NotificationType,
  title: string,
  message: string,
  options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message' | 'createdAt' | 'read' | 'dismissed'>>
): Notification => ({
  id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  type,
  priority: options?.priority || 'normal',
  title,
  message,
  icon: options?.icon || NOTIFICATION_ICONS[type],
  imageUrl: options?.imageUrl,
  actionUrl: options?.actionUrl,
  actionLabel: options?.actionLabel,
  senderId: options?.senderId,
  senderName: options?.senderName,
  senderAvatar: options?.senderAvatar,
  read: false,
  dismissed: false,
  createdAt: new Date(),
  expiresAt: options?.expiresAt,
  metadata: options?.metadata,
});

/**
 * Group notifications by type
 */
export const groupNotifications = (notifications: Notification[]): NotificationGroup[] => {
  const groups: Map<NotificationType, Notification[]> = new Map();
  
  for (const notif of notifications) {
    const existing = groups.get(notif.type) || [];
    existing.push(notif);
    groups.set(notif.type, existing);
  }
  
  return Array.from(groups.entries())
    .map(([type, notifs]) => ({
      type,
      count: notifs.length,
      latestNotification: notifs.sort((a, b) => 
        b.createdAt.getTime() - a.createdAt.getTime()
      )[0],
      notifications: notifs,
    }))
    .sort((a, b) => 
      b.latestNotification.createdAt.getTime() - a.latestNotification.createdAt.getTime()
    );
};

/**
 * Filter unread notifications
 */
export const getUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter(n => !n.read && !n.dismissed).length;
};

/**
 * Create default notification preferences
 */
export const createDefaultPreferences = (): NotificationPreferences => ({
  enabled: true,
  channels: {
    push: true,
    email: true,
    inApp: true,
    sms: false,
  },
  types: {
    social: { enabled: true, sound: true, vibrate: true },
    economic: { enabled: true, sound: true, vibrate: true },
    governance: { enabled: true, sound: false, vibrate: false },
    system: { enabled: true, sound: false, vibrate: false },
    security: { enabled: true, sound: true, vibrate: true },
    achievement: { enabled: true, sound: true, vibrate: true },
    stream: { enabled: true, sound: true, vibrate: false },
    message: { enabled: true, sound: true, vibrate: true },
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
  digest: {
    enabled: false,
    frequency: 'daily',
  },
});

/**
 * Check if notification should be shown based on preferences
 */
export const shouldShowNotification = (
  notification: Notification,
  preferences: NotificationPreferences
): boolean => {
  if (!preferences.enabled) return false;
  
  const typePrefs = preferences.types[notification.type];
  if (!typePrefs?.enabled) return false;
  
  // Check quiet hours
  if (preferences.quietHours.enabled) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const { start, end } = preferences.quietHours;
    
    if (start <= end) {
      if (currentTime >= start && currentTime <= end) return false;
    } else {
      if (currentTime >= start || currentTime <= end) return false;
    }
  }
  
  return true;
};

/**
 * Format notification time
 */
export const formatNotificationTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  
  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
};

/**
 * Sample notification templates
 */
export const createNotificationTemplates = {
  newFollower: (followerName: string, followerAvatar?: string) =>
    createNotification('social', 'Nuevo seguidor', `${followerName} comenzó a seguirte`, {
      senderName: followerName,
      senderAvatar: followerAvatar,
      actionUrl: '/profile',
      actionLabel: 'Ver perfil',
    }),
    
  tipReceived: (senderName: string, amount: number) =>
    createNotification('economic', 'Propina recibida', `${senderName} te envió ${amount} MSR`, {
      priority: amount >= 100 ? 'high' : 'normal',
      senderName,
      icon: '💝',
    }),
    
  proposalCreated: (proposalTitle: string, proposalId: string) =>
    createNotification('governance', 'Nueva propuesta', `Nueva propuesta: "${proposalTitle}"`, {
      actionUrl: `/governance/proposals/${proposalId}`,
      actionLabel: 'Ver propuesta',
    }),
    
  achievementUnlocked: (achievementName: string, icon: string) =>
    createNotification('achievement', '¡Logro desbloqueado!', `Has desbloqueado: ${achievementName}`, {
      priority: 'high',
      icon,
    }),
    
  securityAlert: (alertMessage: string) =>
    createNotification('security', '⚠️ Alerta de seguridad', alertMessage, {
      priority: 'urgent',
    }),
};
