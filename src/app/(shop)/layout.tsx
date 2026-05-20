import React from 'react';
import ChatBot from '@/components/shop/ChatBot';

export default function ShopGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Rendert die jeweilige Shop-Page */}
      {children}
      
      {/* Der Chatbot ist nur hier innerhalb der Shop-Gruppe aktiv */}
      <ChatBot />
    </>
  );
}