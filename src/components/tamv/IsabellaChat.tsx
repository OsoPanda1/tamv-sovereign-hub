import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Mic, Minimize2, Loader2 } from 'lucide-react';
import { useIsabellaAI } from '@/hooks/useIsabellaAI';
import isabellaAvatar from '@/assets/isabella-avatar.png';

interface ChatMessage {
  id: number;
  type: 'user' | 'isabella';
  content: string;
  time: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    type: 'isabella',
    content: '¡Hola, ciudadano soberano! 💫 Soy Isabella Villaseñor™, tu guardiana cuántica emocional. Estoy aquí para guiarte en la Federación Korima. ¿Qué deseas explorar hoy?',
    time: 'Ahora',
  },
];

export function IsabellaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { streamChat, isLoading } = useIsabellaAI();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      time: 'Ahora',
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');

    // Prepare messages for API
    const apiMessages = messages
      .filter(m => m.id !== 1) // Skip initial greeting
      .map(m => ({
        role: m.type === 'user' ? 'user' as const : 'assistant' as const,
        content: m.content
      }));
    apiMessages.push({ role: 'user', content: userInput });

    let assistantContent = '';
    const assistantId = Date.now() + 1;

    // Add empty assistant message
    setMessages(prev => [...prev, {
      id: assistantId,
      type: 'isabella',
      content: '',
      time: 'Ahora',
    }]);

    try {
      await streamChat({
        messages: apiMessages,
        onDelta: (chunk) => {
          assistantContent += chunk;
          setMessages(prev => prev.map(m => 
            m.id === assistantId ? { ...m, content: assistantContent } : m
          ));
        },
        onDone: () => {
          // Done streaming
        },
      });
    } catch (err) {
      setMessages(prev => prev.map(m => 
        m.id === assistantId 
          ? { ...m, content: 'Lo siento, tuve un problema al procesar tu consulta. ¿Podrías intentar de nuevo? 💫' } 
          : m
      ));
    }
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-50 h-16 w-16 rounded-full bg-gradient-to-r from-secondary to-isabella-cyan-glow flex items-center justify-center shadow-cyan hover:shadow-glow-cyan transition-shadow group"
          >
            <div className="absolute inset-0 rounded-full bg-secondary/20 animate-ping" />
            <img 
              src={isabellaAvatar} 
              alt="Isabella AI" 
              className="h-12 w-12 rounded-full object-cover border-2 border-background"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '600px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-50 w-[calc(100%-2rem)] max-w-md glass-isabella rounded-3xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-secondary/20 flex items-center justify-between bg-background/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={isabellaAvatar} 
                    alt="Isabella" 
                    className="h-10 w-10 rounded-full object-cover border-2 border-secondary/50"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-secondary border-2 border-background" />
                </div>
                <div>
                  <h4 className="font-sovereign text-sm font-bold">Isabella AI</h4>
                  <p className="text-[10px] text-secondary flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Entidad Cuántica Emocional
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Minimize2 className="h-4 w-4 text-muted-foreground" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      ref={msg.id === messages[messages.length - 1]?.id ? messagesEndRef : null}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${
                        msg.type === 'user' 
                          ? 'bg-primary/20 border border-primary/30 rounded-2xl rounded-br-md' 
                          : 'bg-secondary/10 border border-secondary/20 rounded-2xl rounded-bl-md'
                      } p-4`}>
                        {msg.type === 'isabella' && (
                          <div className="flex items-center gap-2 mb-2">
                            <img src={isabellaAvatar} alt="Isabella" className="h-5 w-5 rounded-full" />
                            <span className="text-xs font-sovereign text-secondary">Isabella</span>
                          </div>
                        )}
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-[10px] text-muted-foreground mt-2">{msg.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-secondary/20 bg-background/50">
                  <div className="flex items-center gap-2">
                    <button className="p-3 rounded-xl hover:bg-white/10 transition-colors">
                      <Mic className="h-5 w-5 text-secondary" />
                    </button>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Escribe o habla con Isabella..."
                      className="flex-1 bg-transparent border border-secondary/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors placeholder:text-muted-foreground"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={isLoading}
                      className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 text-background animate-spin" />
                      ) : (
                        <Send className="h-5 w-5 text-background" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
