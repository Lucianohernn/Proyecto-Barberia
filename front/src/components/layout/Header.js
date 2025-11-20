import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; 
import '../../styles/components/layout/Header.css';

const Header = ({ authTrigger, onReservarClick }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [username, setUsername] = useState(''); 
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const [roleState, setRoleState] = useState("");

    const navigate = useNavigate();

    const isAdmin = roleState === "admin";

    // --------------------------
    //     VERIFICAR LOGIN
    // --------------------------
    const checkLogin = () => {
        const loggedIn = localStorage.getItem("isLoggedIn") === "true"; 
        const user = localStorage.getItem("username") || ''; 
        const role = localStorage.getItem("role") || "";   // ←🔥 ACÁ TOMAMOS EL ROL

        setIsLoggedIn(loggedIn);
        setUsername(user);
        setRoleState(role);   // ←🔥 GUARDAMOS EL ROL EN EL ESTADO

        if (!loggedIn) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        checkLogin();
        window.addEventListener("storage", checkLogin);
        return () => window.removeEventListener("storage", checkLogin);
    }, [authTrigger]);

    const handleLogout = async () => {

        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        localStorage.removeItem("role");   // ←🔥 LIMPIAMOS ROLE

        setIsLoggedIn(false);
        setUsername('');
        setRoleState("");
        setIsMenuOpen(false);

        navigate("/login"); 
        window.dispatchEvent(new Event("storage")); 
    };

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const handleReservarClick = () => {
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";

        if (!loggedIn) {
            alert("Debes iniciar sesión para reservar un turno");
            navigate("/login");
            return;
        }
        if (onReservarClick) {
            onReservarClick();
        }
    };

    return (
        <header>
            <div className="container">
                <div className="holder d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <img src="/images/logo1.jpg" width="100" alt="Barberia" />
                        <h1 className="ms-3">Barberia</h1>
                    </div>

                    <div className="d-flex align-items-center">
                        <button
                            className="btn btn-success me-3"
                            onClick={handleReservarClick}
                        >
                            Reservar Turno  
                        </button>

                        {/* 🔥 SI SOS ADMIN, MUESTRA EDITAR WEB */}
                        {isAdmin && (
                            <button 
                                className="dropdown-item"
                                onClick={() => navigate("/admin/novedades")}
                            >
                                ✏ Editar Web
                            </button>
                        )}

                        {isLoggedIn ? (
                            <div className="dropdown">
                                <button onClick={toggleMenu} className="btn btn-secondary dropdown-toggle">
                                    <FontAwesomeIcon icon={faUser} /> Hola, {username}
                                </button>
                                    
                                {isMenuOpen && (
                                    <div className="dropdown-menu show" style={{ position: 'absolute', zIndex: 1000, right: 0 }}>
                                        <button onClick={handleLogout} className="dropdown-item">
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-secondary">
                                <FontAwesomeIcon icon={faUser} /> Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
