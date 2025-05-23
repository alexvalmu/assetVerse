import { useEffect, useState } from 'react';
import {FaSun, FaMoon} from 'react-icons/fa';
function BotonModo() {
    const [modoOscuro, setModoOscuro] = useState(() => {
        return localStorage.getItem('modo') === 'oscuro';
    });

   useEffect(() => {
    if (modoOscuro) {
        document.body.classList.add('modo-oscuro');
        document.documentElement.classList.add('modo-oscuro');  // <-- Esto
        localStorage.setItem('modo', 'oscuro');
    } else {
        document.body.classList.remove('modo-oscuro');
        document.documentElement.classList.remove('modo-oscuro');  // <-- Esto
        localStorage.setItem('modo', 'claro');
    }
}, [modoOscuro]);

    const alternarModo = () => {
        setModoOscuro(!modoOscuro);
    };

    return (
        <button
            onClick={alternarModo}
            style={{
                position: 'fixed',
                bottom: '55px',
                right: '20px',
                zIndex: 9999,
                padding: '12px 14px',
                borderRadius: '50%',
                backgroundColor: modoOscuro ? '#fff' : '#222',
                color: modoOscuro ? '#000' : '#fff',
                fontSize: '20px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }}
            title={`Cambiar a modo ${modoOscuro ? 'claro' : 'oscuro'}`}
        >
            {modoOscuro ? <FaSun/> : <FaMoon/>}
        </button>
    );
}

export default BotonModo;
