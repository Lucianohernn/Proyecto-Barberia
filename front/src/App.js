import React, { useState } from 'react'; // 💡 IMPORTAMOS useState
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/layout/Header';
import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import AdminLogin from './components/admin/AdminLogin';

import Contacto from "./pages/Contacto";
import Galeria from "./pages/Galeria";
import HomePage from './pages/HomePage';
import NosotrosPage from './pages/NosotrosPage';
import NovedadesPage from './pages/NovedadesPage';
import ReservaModal from './components/ReservaModal';
import Reservas from './pages/Reservas';
import AdminNovedades from "./pages/AdminNovedades";


function App() {
    // ESTADO PARA FORZAR LA ACTUALIZACIÓN DEL HEADER
    const [authChangeTrigger, setAuthChangeTrigger] = useState(0);

    const [showReserva, setShowReserva] = useState(false);

    const [formData, setFormData] = useState({ nombre: "", dia: "", horario: "" });

    const [reservas, setReservas] = useState([]);

    // FUNCIÓN PARA ACTUALIZAR EL ESTADO (Se pasa a LoginPage)
    const refreshAuthStatus = () => {
        // Incrementamos el estado, lo cual fuerza el re-renderizado
        setAuthChangeTrigger(prev => prev + 1);
    };

    const toggleReserva = () => setShowReserva (prev => !prev);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Reserva enviada:", formData);
        setReservas(prev => [...prev, formData]);
        setFormData({ nombre: "", dia: "", horario: "" });
        toggleReserva();
    };

    const estaReservado = (dia, hora) => reservas.some(r => r.dia === dia && r.horario === hora);

    return (
        <BrowserRouter>
            <div className="App">
                {/* PASAMOS EL ESTADO AL HEADER COMO UNA PROP */}
                <Header authTrigger={authChangeTrigger} onReservarClick={toggleReserva}/> 
                <Nav />

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/nosotros" element={<NosotrosPage />} />
                    <Route path="/novedades" element={<NovedadesPage />} />
                    <Route path="/galeria" element={<Galeria />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/reservas" element={<Reservas />} />
                    <Route path="/admin/novedades" element={<AdminNovedades />} />

                    
                    {/* PASAMOS LA FUNCIÓN AL COMPONENTE DE LOGIN */}
                    <Route 
                        path="/login" 
                        element={<AdminLogin onLoginSuccess={refreshAuthStatus} />} 
                    /> 
                    
                </Routes>

                {showReserva && (
                    <ReservaModal
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    estaReservado={estaReservado}
                    onClose={toggleReserva}
                    />
                )}

                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;