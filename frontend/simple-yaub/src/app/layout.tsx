import React from 'react';
import SessionWrapper from '@/components/sessionWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <SessionWrapper>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <title>{'Yet Another Useless | Blog'}</title>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
