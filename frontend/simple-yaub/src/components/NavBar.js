import React from 'react';
import Link from 'next/link';

const NavBar = () => {
    return (
        <nav className="sidebar-navigation">
            <ul>
                <div className="logo">
                    <span>yaBlo</span>
                </div>

                <div className="logo-image img">
                    <img
                        src="/favicon.svg"
                        alt="Logo"
                    />
                </div>

                <li>
                    <Link href="/">
                        <i className="nav-bar-icon fa fa-newspaper"></i>
                        <span className="tooltip">Blog</span>
                    </Link>
                </li>
                <li>
                    <Link href="/">
                        <i className="nav-bar-icon fa fa-user"></i>
                        <span className="tooltip">User</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
