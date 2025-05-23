import { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

function BotonModo() {
    const [modoOscuro, setModoOscuro] = useState(() => {
        return localStorage.getItem('modo') === 'oscuro';
    });

    useEffect(() => {
        if (modoOscuro) {
            document.body.classList.add('modo-oscuro');
            document.documentElement.classList.add('modo-oscuro');
            localStorage.setItem('modo', 'oscuro');
        } else {
            document.body.classList.remove('modo-oscuro');
            document.documentElement.classList.remove('modo-oscuro');
            localStorage.setItem('modo', 'claro');
        }
    }, [modoOscuro]);

    const alternarModo = () => {
        setModoOscuro(!modoOscuro);
    };

    return (
        <div style={{
           
        }}>
            <label style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
            }}>
                <div style={{
                    position: 'relative',
                    width: '60px',
                    height: '30px',
                    backgroundColor: modoOscuro ? '#848484' : '#848484',
                    borderRadius: '999px',
                    transition: 'background-color 0.3s ease'
                }}>
                    <input
                        type="checkbox"
                        checked={modoOscuro}
                        onChange={alternarModo}
                        style={{
                            opacity: 0,
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            cursor: 'pointer',
                            zIndex: 2
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: '4px',
                        left: modoOscuro ? '32px' : '4px',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: modoOscuro ? '#c7c7c7' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'left 0.3s ease, background-color 0.3s ease',
                        zIndex: 1
                    }}>
                        {modoOscuro ? (
                            <FaMoon color="black" size={14} />
                        ) : (
                            <FaSun color="black" size={14} />
                        )}
                    </div>
                </div>
            </label>
        </div>
    );
}

export default BotonModo;
