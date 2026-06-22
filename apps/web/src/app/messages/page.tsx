'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { IoSearch, IoChatbubblesOutline, IoSend, IoImageOutline, IoEllipsisVertical } from 'react-icons/io5';
import Image from 'next/image';
import styles from './page.module.css';

const MOCK_CHATS = [
  {
    id: 1,
    user: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    product: 'Vintage Wooden Bookshelf',
    productImage: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=100&h=100&fit=crop',
    lastMessage: 'Is this still available?',
    time: '2m',
    unread: true,
  },
  {
    id: 2,
    user: 'Rahul Kumar',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    product: 'KitchenAid Mixer',
    productImage: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=100&h=100&fit=crop',
    lastMessage: 'I can come pick it up tomorrow at 10 AM.',
    time: '1h',
    unread: false,
  },
  {
    id: 3,
    user: 'Anita Verma',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    product: 'Children\'s Books Set',
    productImage: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=100&h=100&fit=crop',
    lastMessage: 'Thank you so much! The kids love them.',
    time: '1d',
    unread: false,
  },
];

export default function MessagesPage() {
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  const activeChat = MOCK_CHATS.find(c => c.id === activeChatId);

  return (
    <div className={styles.pageLayout}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          
          {/* Sidebar List */}
          <div className={`${styles.sidebar} ${activeChatId ? styles.sidebarHiddenOnMobile : ''}`}>
            <div className={styles.sidebarHeader}>
              <h1 className={styles.title}>Messages</h1>
              <div className={styles.searchContainer}>
                <IoSearch size={16} className={styles.searchIcon} />
                <input type="text" placeholder="Search messages..." className={styles.searchInput} />
              </div>
            </div>

            <div className={styles.chatList}>
              {MOCK_CHATS.map(chat => (
                <button 
                  key={chat.id} 
                  className={`${styles.chatItem} ${chat.unread ? styles.chatItemUnread : ''} ${activeChatId === chat.id ? styles.chatItemActive : ''}`}
                  onClick={() => setActiveChatId(chat.id)}
                >
                  <div className={styles.productImageContainer}>
                    <Image src={chat.productImage} alt={chat.product} width={48} height={48} className={styles.productImage} />
                    {chat.unread && <div className={styles.unreadDot} />}
                  </div>
                  <div className={styles.chatInfo}>
                    <div className={styles.chatHeader}>
                      <span className={`${styles.userName} ${chat.unread ? styles.userNameUnread : ''}`}>{chat.user}</span>
                      <span className={styles.timeAgo}>{chat.time}</span>
                    </div>
                    <p className={styles.productName}>{chat.product}</p>
                    <p className={`${styles.lastMessage} ${chat.unread ? styles.lastMessageUnread : ''}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Chat Pane */}
          <div className={`${styles.chatPane} ${!activeChatId ? styles.chatPaneHiddenOnMobile : ''}`}>
            {activeChat ? (
              <>
                <div className={styles.chatPaneHeader}>
                  <div className={styles.chatPaneUser}>
                    <button className={styles.mobileBackBtn} onClick={() => setActiveChatId(null)}>←</button>
                    <Image src={activeChat.avatar} alt={activeChat.user} width={40} height={40} className={styles.chatAvatar} />
                    <div>
                      <h3 className={styles.chatPaneUserName}>{activeChat.user}</h3>
                      <p className={styles.chatPaneProductName}>Regarding: {activeChat.product}</p>
                    </div>
                  </div>
                  <button className={styles.iconBtn}>
                    <IoEllipsisVertical size={20} />
                  </button>
                </div>

                <div className={styles.chatHistory}>
                  <div className={styles.messageBubbleLeft}>
                    <p>{activeChat.lastMessage}</p>
                    <span className={styles.messageTime}>10:42 AM</span>
                  </div>
                  {/* Mock history could go here */}
                </div>

                <div className={styles.chatInputArea}>
                  <button className={styles.iconBtn}><IoImageOutline size={24} /></button>
                  <input type="text" placeholder="Type a message..." className={styles.messageInput} />
                  <button className={styles.sendBtn}><IoSend size={18} /></button>
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <IoChatbubblesOutline size={64} className={styles.emptyIcon} />
                <h2 className={styles.emptyTitle}>Your Messages</h2>
                <p className={styles.emptyDesc}>Select a conversation from the sidebar to view details or reply.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
