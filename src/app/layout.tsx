"use client"; // This makes the component a Client Component

import { useEffect } from 'react';
import ServerLayout from './ServerLayout';
import ClientWrapper from './RootLayout';
import './globals.css';


interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  useEffect(() => {
    // Set the document title dynamically
    const pageTitle = title ? `${title} | Co-Finance` : 'Co-Finance';
    document.title = pageTitle;
  }, [title]);

  return (
    <ServerLayout>
      <ClientWrapper>
        {children}
      </ClientWrapper>
    </ServerLayout>
  );
}
