"use client";

import { useState } from "react";
import AuthForm from "./AuthForm";
import "../styles/signing-window.scss";
import {SessionProvider, useSession} from "next-auth/react";

const NavBar = () => {
    const [showLogin, setShowLogin] = useState(false);
    const { data: session, status } = useSession();

    const openLogin = () => setShowLogin(true);
    const closeLogin = () => setShowLogin(false);

    return (
        <nav className="sidebar-navigation">
            <div className="nav-left"></div>
            <div className="logo-image">
                <img src="/icon_yablo_no_background.png" alt="Yablo Logo" />
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
                    <button onClick={openLogin}>
                        <i className="nav-bar-icon-login-button fa fa-user"></i>
                        <span className="tooltip">User</span>
                    </button>
                </li>
            </ul>
            {showLogin && (
                <div
                    className="overlay"
                    onClick={closeLogin}
                >
                    <div onClick={(e) => e.stopPropagation()}>
                        <AuthForm onClose={closeLogin}
                                  session={session}
                                  status={status}
                        />
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavBar;