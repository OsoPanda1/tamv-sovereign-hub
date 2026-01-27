/**
 * NotificationCenter - Real-time Notification Panel
 * TAMV MD-X4™ Omniverse Alert System
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  X, 
  Trash2,
  Users,
  Coins,
  Shield,
  Trophy,
  MessageCircle,
  Settings,
  Tv
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { formatNotificationTime, PRIORITY_COLORS } from '@/lib/notifications';
import type { Notification, NotificationType } from '@/lib/notifications';
import { ScrollArea } from '@/components/ui/scroll-area';

const TYPE_ICONS: Record<NotificationType, React.ElementType> = {
  social: Users,
  economic: Coins,
  governance: Shield,
  system: Settings,
  security: Shield,
  achievement: Trophy,
  stream: Tv,
  message: MessageCircle,
};

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { 
    notifications, 
    unreadCount, 
    isLoading,
    markAsRead, 
    markAllAsRead, 
    dismissNotification,
    clearAll
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] z-50"
          >
            <div className="glass-sovereign rounded-2xl overflow-hidden border border-primary/20">
              {/* Header */}
              <div className="p-4 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <h3 className="font-sovereign font-bold text-gradient-gold">
                      Notificaciones
                    </h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-secondary text-secondary-foreground">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Filter Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filter === 'all' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-primary/10 hover:bg-primary/20'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filter === 'unread' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-primary/10 hover:bg-primary/20'
                    }`}
                  >
                    Sin leer ({unreadCount})
                  </button>
                  
                  <div className="flex-1" />
                  
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="px-3 py-1 text-xs rounded-full bg-secondary/20 hover:bg-secondary/30 transition-colors flex items-center gap-1"
                    >
                      <CheckCheck className="h-3 w-3" />
                      Marcar todas
                    </button>
                  )}
                </div>
              </div>
              
              {/* Notification List */}
              <ScrollArea className="h-[400px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <Bell className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">No hay notificaciones</p>
                  </div>
                ) : (
                  <div className="divide-y divide-primary/5">
                    {filteredNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={() => markAsRead(notification.id)}
                        onDismiss={() => dismissNotification(notification.id)}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
              
              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-primary/10 flex justify-between">
                  <button
                    onClick={clearAll}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Limpiar todo
                  </button>
                  <button className="text-xs text-primary hover:underline">
                    Ver historial completo
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: () => void;
  onDismiss: () => void;
}

function NotificationItem({ notification, onMarkAsRead, onDismiss }: NotificationItemProps) {
  const Icon = TYPE_ICONS[notification.type] || Bell;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`p-4 hover:bg-primary/5 transition-colors cursor-pointer group ${
        !notification.read ? 'bg-primary/5' : ''
      }`}
      onClick={onMarkAsRead}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div 
          className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center"
          style={{ 
            backgroundColor: `${PRIORITY_COLORS[notification.priority]}20`,
            color: PRIORITY_COLORS[notification.priority]
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-medium truncate ${
              !notification.read ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {notification.title}
            </p>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {formatNotificationTime(notification.createdAt)}
            </span>
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {notification.message}
          </p>
          
          {notification.actionLabel && (
            <button className="text-xs text-primary hover:underline mt-1">
              {notification.actionLabel} →
            </button>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          {!notification.read && (
            <button
              onClick={(e) => { e.stopPropagation(); onMarkAsRead(); }}
              className="p-1 rounded hover:bg-primary/10 transition-colors"
              title="Marcar como leída"
            >
              <Check className="h-3 w-3" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDismiss(); }}
            className="p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Descartar"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
      
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-secondary rounded-r" />
      )}
    </motion.div>
  );
}

// Bell button component for Navbar
export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-primary/10 transition-colors relative"
      >
        <Bell className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
        {unreadCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-secondary animate-pulse"
          />
        )}
      </button>
      
      <NotificationCenter isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
