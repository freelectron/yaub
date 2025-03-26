"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LogInForm";

const NavBar = () => {
    const [showLogin, setShowLogin] = useState(false);

    const openLogin = () => setShowLogin(true);
    const closeLogin = () => setShowLogin(false);

    return (
        <div>
            {/* Navigation Bar */}
            <nav className="sidebar-navigation">
                <ul>
                    {/*<div className="logo">*/}
                    {/*    <span>yaBlo</span>*/}
                    {/*</div>*/}

                    <div className="logo-image img">
                        <img src="/favicon.svg" alt="Logo" />
                    </div>

                    <li>
                        <a href="/">
                            <i className="nav-bar-icon fa fa-newspaper"></i>
                            <span className="tooltip">Blog</span>
                        </a>
                    </li>
                    <li>
                        <button onClick={openLogin}>
                            <i className="nav-bar-icon-login-button fa fa-user"></i>
                            <span className="tooltip">User</span>
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Animated Login Modal */}
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
                            className="bg-white shape-login-form shadow-login-form width-login-form relative"
                            initial={{ y: "0", opacity: 0 }}
                            animate={{ y: "50%", x: "50%",opacity: 1 }}
                            exit={{ y: "0", opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                        >
                            <h2 className="text-2xl font-bold mb-4">Login</h2>
                            <LoginForm onClose={closeLogin} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default NavBar;
