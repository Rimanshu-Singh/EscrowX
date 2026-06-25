import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image, File, User as UserIcon, Shield, Search, Smile, Paperclip, MessageSquare, Briefcase, PlusCircle, ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import { useSocket } from '../../hooks/useSocket';
import { chatService } from '../../services/api';

export default function ChatPage() {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    contacts,
    activeContact,
    messages,
    isCounterpartyTyping,
    setContacts,
    setMessages,
    setActiveContact,
    addMessage,
  } = useChatStore();

  const { sendMessage, sendTyping } = useSocket();

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any | null>(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse query params to auto-select conversation
  const queryParams = new URLSearchParams(location.search);
  const targetConvId = queryParams.get('conversationId');

  // Load all conversation threads on mount
  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data || []);
      
      // Auto-select conversation if query param matches
      if (targetConvId && data.length > 0) {
        const found = data.find((c: any) => c._id === targetConvId || c.id === targetConvId);
        if (found) {
          setActiveConv(found);
          const counterparty = found.participants.find((p: any) => p._id !== user?.id && p.id !== user?.id);
          if (counterparty) {
            setActiveContact(counterparty);
          }
        }
      } else if (data.length > 0 && !activeConv) {
        // Fallback: select first conversation
        setActiveConv(data[0]);
        const counterparty = data[0].participants.find((p: any) => p._id !== user?.id && p.id !== user?.id);
        if (counterparty) {
          setActiveContact(counterparty);
        }
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
    }
  };

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, targetConvId]);

  // Load messages whenever active conversation changes
  useEffect(() => {
    if (!activeConv) return;
    async function loadMessages() {
      try {
        const history = await chatService.getConversationMessages(activeConv._id);
        setMessages(history);
      } catch (err) {
        console.error('Error loading thread messages:', err);
      }
    }
    loadMessages();
  }, [activeConv, setMessages]);

  // Scroll messages to bottom on update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedMessage(e.target.value);
    if (activeContact) {
      sendTyping(activeContact.walletAddress, e.target.value.length > 0);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeContact || !user || !activeConv) return;

    // Send via socket, including the conversationId
    sendMessage(activeContact._id, activeContact.walletAddress, typedMessage, activeConv._id);

    // Optimistically add to store
    addMessage({
      _id: Math.random().toString(),
      sender: user.id,
      recipient: activeContact._id,
      content: typedMessage,
      createdAt: new Date(),
    } as any);

    setTypedMessage('');
    sendTyping(activeContact.walletAddress, false);
    
    // Refresh conversations list to update last message preview
    setTimeout(loadConversations, 500);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeContact || !activeConv) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('recipientId', activeContact._id);
    formData.append('attachmentType', file.type.startsWith('image/') ? 'image' : 'file');
    formData.append('conversationId', activeConv._id);

    setUploading(true);
    try {
      const savedMsg = await chatService.sendAttachment(formData);
      addMessage(savedMsg);
      
      // Notify counterparty via socket
      sendMessage(activeContact._id, activeContact.walletAddress, `Sent an attachment: ${file.name}`, activeConv._id);
      
      setTimeout(loadConversations, 500);
    } catch (err) {
      console.error('Error uploading attachment:', err);
    }
    setUploading(false);
  };

  // Filter conversations list by other participant name or listing title
  const filteredConvs = conversations.filter((c) => {
    const counterpart = c.participants.find((p: any) => p._id !== user?.id && p.id !== user?.id);
    const counterpartName = counterpart?.name || counterpart?.username || '';
    const listingTitle = c.listing?.title || '';
    return (
      counterpartName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listingTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh_-_150px)] bg-white border border-[#E4E8F0] rounded-2xl shadow-sm overflow-hidden grid grid-cols-[300px_1fr]">
        
        {/* LEFT COLUMN: Active threads */}
        <div className="border-r border-[#E4E8F0] flex flex-col bg-[#FAFAFA]">
          {/* Search */}
          <div className="p-4 border-b border-[#E4E8F0]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages, listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-xl text-xs bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              />
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Threads list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredConvs.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-8">No active chats</p>
            ) : (
              filteredConvs.map((conv) => {
                const isSelected = activeConv?._id === conv._id;
                const counterparty = conv.participants.find((p: any) => p._id !== user?.id && p.id !== user?.id);
                if (!counterparty) return null;

                return (
                  <button
                    key={conv._id}
                    onClick={() => {
                      setActiveConv(conv);
                      setActiveContact(counterparty);
                    }}
                    className={`w-full flex flex-col gap-1.5 p-3 rounded-xl text-left transition-all ${
                      isSelected ? 'bg-[#F5F3FF] border border-[#7C3AED]/15' : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={counterparty.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${counterparty.name || 'User'}`}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover border border-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-bold truncate ${isSelected ? 'text-[#7C3AED]' : 'text-[#0F172A]'}`}>
                            {counterparty.name}
                          </p>
                          <span className="text-[8px] uppercase font-extrabold text-gray-400">
                            {counterparty.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {conv.listing && (
                      <div className="flex items-center gap-1 text-[9px] text-[#7C3AED] bg-[#F5F3FF] px-2 py-0.5 rounded-md font-semibold truncate">
                        <Briefcase className="w-2.5 h-2.5 shrink-0" />
                        {conv.listing.title}
                      </div>
                    )}

                    <p className="text-[10px] text-gray-400 truncate pl-0.5">
                      {conv.lastMessage || 'Open chat thread'}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Conversation Window */}
        {activeConv && activeContact ? (
          <div className="flex flex-col bg-white">
            {/* Header / Active Listing details */}
            <div className="px-6 py-4 border-b border-[#E4E8F0] flex flex-col bg-[#FAFAFA] gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={activeContact.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeContact.name || 'User'}`}
                    alt=""
                    className="w-8 h-8 rounded-full border border-slate-100"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">{activeContact.name}</h4>
                    <p className="text-[9px] font-mono text-gray-400 leading-none mt-0.5">{activeContact.walletAddress}</p>
                  </div>
                </div>
                
                <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-0.5">
                  ★ {(activeContact.trustScore / 20).toFixed(1)}
                </span>
              </div>

              {/* Listing Context Banner */}
              {activeConv.listing && (
                <div className="flex items-center justify-between p-3 bg-white border border-[#E4E8F0] rounded-xl shadow-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-lg bg-purple-50 text-[#7C3AED]">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-[#7C3AED]">Negotiating Listing</p>
                      <h4 className="text-xs font-bold text-[#0F172A] truncate leading-normal">{activeConv.listing.title}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 pl-4">
                    <p className="text-xs font-bold text-[#0F172A] font-mono">
                      {activeConv.listing.price || activeConv.listing.budget} XLM
                    </p>
                    <Link
                      to={`/escrow/create?listingId=${activeConv.listing._id}&amount=${activeConv.listing.price || activeConv.listing.budget}&counterpartyAddress=${activeContact.walletAddress}&counterpartyId=${activeContact._id}&title=${encodeURIComponent(activeConv.listing.title)}`}
                      className="px-3.5 py-1.5 rounded-lg bg-[#0F172A] text-white text-[10px] font-bold hover:bg-[#1E293B] flex items-center gap-1 shadow-sm"
                    >
                      <PlusCircle className="w-3 h-3" />
                      Create Escrow
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Chat History Panel */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {messages.map((msg) => {
                const isMe = msg.sender === user?.id;
                return (
                  <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[65%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                      isMe 
                        ? 'bg-[#7C3AED] text-white rounded-br-none' 
                        : 'bg-white border border-[#E4E8F0] text-[#0F172A] rounded-bl-none'
                    }`}>
                      {msg.content}
                      
                      {msg.attachmentUrl && (
                        <div className="mt-2 border-t border-slate-100/10 pt-2">
                          {msg.attachmentType === 'image' ? (
                            <img src={msg.attachmentUrl} alt="attachment" className="rounded-lg max-w-full max-h-40 object-cover" />
                          ) : (
                            <a 
                              href={msg.attachmentUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className={`flex items-center gap-1.5 underline font-bold ${isMe ? 'text-white' : 'text-[#7C3AED]'}`}
                            >
                              <File className="w-4 h-4 shrink-0" />
                              View Attachment
                            </a>
                          )}
                        </div>
                      )}
                      
                      <p className={`text-[8px] mt-1.5 text-right ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input panel */}
            <div className="p-4 border-t border-[#E4E8F0] bg-[#FAFAFA]">
              {isCounterpartyTyping && (
                <p className="text-[10px] text-gray-400 italic mb-2 pl-1">typing...</p>
              )}
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-lg bg-white border border-[#E2E8F0] text-gray-500 hover:text-[#7C3AED] transition-colors cursor-pointer"
                  title="Upload attachment"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder="Type your message..."
                  value={typedMessage}
                  onChange={handleMessageChange}
                  className="flex-1 px-4 py-2 border border-[#E2E8F0] rounded-xl text-xs bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
                />

                <button
                  type="submit"
                  disabled={!typedMessage.trim()}
                  className="p-2.5 rounded-xl bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all disabled:opacity-40 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-12 bg-slate-50/50">
            <MessageSquare className="w-12 h-12 text-[#94A3B8] mb-3" />
            <h3 className="text-sm font-bold text-[#0F172A]">Select a Chat</h3>
            <p className="text-xs text-[#64748B] mt-1">Pick a conversation thread from the sidebar or click "Chat Now" on a listing details page.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
