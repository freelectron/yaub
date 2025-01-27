import React from 'react';
import Link from 'next/link';

const NavBar = () => {
    return (
        <nav className="sidebar-navigation">
            <ul>
                <div className="logo">
                    <span>Yablo</span>
                </div>

                <div className="logo-image img">
                    <img
                        src="/favicon.svg"
                        alt="Logo"
                    />
                </div>

                <li>
                    <Link href="/">
                        <i className="fa fa-newspaper"></i>
                        <span className="tooltip">Blog</span>
                    </Link>
                </li>
                <li>
                    <Link href="/">
                        <i className="fa fa-user"></i>
                        <span className="tooltip">User</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
