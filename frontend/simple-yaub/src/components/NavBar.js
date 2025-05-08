"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LogInForm";
import "../styles/signing-window.css";

const NavBar = () => {
    const [showLogin, setShowLogin] = useState(false);

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
                    <button onClick={openLogin}>
                        <i className="nav-bar-icon-login-button fa fa-user"></i>
                        <span className="tooltip">User</span>
                    </button>
                </li>
            </ul>
            <AnimatePresence>
                {showLogin && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeLogin}
                    >
                        <motion.div
                            className="relative"
                            initial={{ y: "0", opacity: 0 }}
                            animate={{ y: "50%", x: "50%", opacity: 1 }}
                            exit={{ y: "0", opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <LoginForm onClose={closeLogin} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default NavBar;