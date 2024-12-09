import React from 'react';
import Link from 'next/link';

const NavBar = () => {
    return (
        <nav className="sidebar-navigation">
            <ul>
                <div className="logo">
                    <span>yab|o</span>
                </div>

                <li className="active">
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
