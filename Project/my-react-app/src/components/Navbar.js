import React from 'react';

function Navbar() {
    const styles = {
        navbar: {
            backgroundColor: "#FF5F05",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 40px",
            color: "white",
            fontWeight: "bold",
        },
        logo: {
            height: "40px",
        },
        user: {
            fontSize: "14px",
        },
    };

    return (
        <div style={styles.navbar}>
            <img src='/images/logo.png' alt='Schedullini Logo' style={styles.logo}/>
            <div style={styles.user}>Hello Floppa</div>
        </div>
    );
}

export default Navbar;