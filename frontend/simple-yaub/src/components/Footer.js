import React from 'react';


const FooterBar = () => {
    return (
        <footer className="footer" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            bottom: 0,
            width: '100%'
        }}>
            <div className="footer-text">
                Right Here Right Now
            </div>
        </footer>
    );
};

export default FooterBar;
