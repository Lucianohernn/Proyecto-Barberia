import React, { useState, useEffect } from 'react';

const Reservas = () => {
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [servicio, setServicio] = useState('');
    const [reservas, setReservas] = useState([]);
    const usuario = localStorage.getItem('username');

    // Cargar reservas del usuario
    useEffect(() => {
        fetch(`http://localhost:3001/api/reservas/${usuario}`)
            .then(res => res.json())
            .then(data => setReservas(data))
            .catch(err => console.error(err));
    }, [usuario]);

    const reservar = async () => {
        const res = await fetch('http://localhost:3001/api/reservas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, fecha, hora, servicio }),
        });
        const data = await res.json();
        alert(data.message);
        if (data.success) {
            setReservas([...reservas, { usuario, fecha, hora, servicio, estado: 'reservado' }]);
        }
    };

    const cancelar = async (id) => {
        const res = await fetch(`http://localhost:3001/api/reservas/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        alert(data.message);
        if (data.success) {
            setReservas(reservas.filter(r => r.id !== id));
        }
    };

    return (
        <div>
            <h2>Reservar turno</h2>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
            <input type="text" placeholder="Servicio (opcional)" value={servicio} onChange={(e) => setServicio(e.target.value)} />
            <button onClick={reservar}>Reservar</button>

            <h3>Mis reservas</h3>
            <ul>
                {reservas.map(r => (
                    <li key={r.id}>
                        {r.fecha} {r.hora} - {r.servicio || 'Sin servicio'} 
                        <button onClick={() => cancelar(r.id)}>Cancelar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Reservas;
