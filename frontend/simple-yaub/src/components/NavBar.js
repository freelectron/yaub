import React, { useState } from 'react';

// Define MobileMenu component
const MobileMenu = () => {
    return (
        <div className={'mobile-menu'}>
            <a href='/'>Login</a>
        </div>
    );
};

const DesktopMenu = () => {
    return (
        <div className={'menu'}>
            <a href='/'>Login</a>
        </div>
    );
};


const NavigationBar = () => {
    const [isShown, setIsShown] = useState(false);

    const toggleMobileMenu = () => {
        setIsShown(!isShown);
    };

    return (
        <>
            {/* Navigation Bar */}
            <div className='topnav'>

                {/* Your Logo/Brand here */}
                <div className='logo'>
                    Yet Another Useless Blog
                </div>
                {/* Desktop Menu, which only appears on large screens */}
                <DesktopMenu/>

                {/* This button only shows up on small screens. It is used to open the mobile menu */}
                <button className='show-mobile-menu-button' onClick={toggleMobileMenu}>
                    &#8801;
                </button>
            </div>

            {/* The mobile menu and the close button */}
            {isShown && <MobileMenu/>}
            {isShown && (
                <button className='close-mobile-menu-button' onClick={toggleMobileMenu}>
                    &times;
                </button>
            )}
        </>
    );
};

export default NavigationBar;
