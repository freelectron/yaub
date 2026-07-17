'use client';

import React, { useState } from 'react';
import AuthForm from './AuthForm';
import '../styles/signing-window.scss';
import { useSession } from 'next-auth/react';

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
    const [showLogin, setShowLogin] = useState<boolean>(false);
    const { data: session, status } = useSession();

    const openLogin = (): void => setShowLogin(true);
    const closeLogin = (): void => setShowLogin(false);

    return (
        <nav className="sidebar-navigation">
            <div className="nav-left"></div>
            <div className="logo-image">
                <svg viewBox="0 0 120 48" width="120" height="48" xmlns="http://www.w3.org/2000/svg" aria-label="YABLO">
                  <text
                    x="60" y="36"
                    textAnchor="middle"
                    fontFamily="'Marker Felt', 'Comic Sans MS', cursive"
                    fontWeight="bold"
                    fontSize="36"
                    fill="#222222"
                    stroke="#222222"
                    strokeWidth="0.5"
                    letterSpacing="2"
                  >YABLO</text>
                </svg>
            </div>
            <ul className="nav-right">
                <li className="nav-item">
                    <a href="/">
                        <i className="nav-bar-icon fa fa-newspaper"></i>
                        <span className="tooltip">Blog</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a href="/chat">
                        <i className="nav-bar-icon fa fa-comments"></i>
                        <span className="tooltip">Chat</span>
                    </a>
                </li>
                <li className="nav-item">
                    <button onClick={openLogin} style={{ position: 'relative' }}>
                        <i className="nav-bar-icon-login-button fa fa-user"></i>
                        {session && (
                            <span style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: '#4caf50',
                                border: '1.5px solid white',
                            }} />
                        )}
                        <span className="tooltip">User</span>
                    </button>
                </li>
            </ul>
            {showLogin && (
                <div className="overlay" onClick={closeLogin}>
                    <div onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                        <AuthForm onClose={closeLogin} session={session} status={status} />
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
