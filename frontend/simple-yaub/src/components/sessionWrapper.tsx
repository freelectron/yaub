"use client";

import React from 'react';
import { SessionProvider } from "next-auth/react";

interface SessionWrapperProps {
  children: React.ReactNode;
}

export default function SessionWrapper({ children }: SessionWrapperProps): React.JSX.Element {
  return <SessionProvider>{children}</SessionProvider>;
}
