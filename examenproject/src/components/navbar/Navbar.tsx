// src/components/Navbar.tsx
import React from 'react';
import { useAuth } from "../../context/useAuth";
import './Navbar.scss';

const Navbar: React.FC = () => {
    const { user, loginAsUser, loginAsAdmin, logout, isLoggedIn } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <h2>SmartNest</h2>
                </div>

                <div className="navbar-right">
                    {isLoggedIn() ? (

                        <div className="user-info">
                            <span className="user-name">
                                {user?.username}
                                <span className={`role-badge ${user?.role}`}>
                                    {user?.role === 'admin' ? 'Admin' : 'Gebruiker'}
                                </span>
                            </span>
                            <button className="btn btn-logout" onClick={logout}>
                                Uitloggen
                            </button>
                        </div>
                    ) : (

                        <div className="login-buttons">
                            <button className="btn btn-user" onClick={loginAsUser}>
                                Log in als Gebruiker
                            </button>
                            <button className="btn btn-admin" onClick={loginAsAdmin}>
                                Log in als Admin
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;