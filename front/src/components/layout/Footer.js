import React from 'react';

import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../styles/components/layout/Footer.css';
const Footer = (props) => {
    return (
        <footer>
            <div className="container-fluid bg-dark p-2 text-center">
                <div className="row">
                    <div className="col">
                        <p className="h5 text-white mb-4">Seguinos en nuestras redes</p>
                        <div className="redes-footer d-flex justify-content-center align-items-center gap-4">
                            <span className="h6 text-white">
                                <i className="bi bi-facebook"></i> Facebook
                            </span>
                            <span className="h6 text-white">
                                <a href="https://instagram.com/lucianohernn" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">
                                <i className="bi bi-instagram"></i> Instagram
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;