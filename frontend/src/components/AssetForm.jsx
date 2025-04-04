import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createAsset } from '../features/assets/assetSlice'

function AssetForm() {
    const [text, setText] = useState('');
    const [files, setFiles] = useState([]);
    const dispatch = useDispatch();

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const onSubmit = e => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('text', text);
        
        // Agregar cada archivo al FormData
        files.forEach(file => {
            formData.append('files', file);
        });

        dispatch(createAsset(formData));
        setText('');
        setFiles([]);
        // Limpiar el input de archivos
        document.getElementById('fileInput').value = '';
    }

    return (
        <section className="form"> 
            <form onSubmit={onSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label htmlFor="text">Asset</label>
                    <input 
                        type="text" 
                        name="text" 
                        id="text" 
                        value={text} 
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="files">Archivos</label>
                    <input 
                        type="file" 
                        id="fileInput"
                        name="files" 
                        multiple 
                        onChange={handleFileChange}
                    />
                    <small>Puedes seleccionar múltiples archivos (max 5)</small>
                </div>

                <div className="form-group">
                    <button className="btn btn-block" type="submit"> 
                        Add Asset
                    </button>
                </div>
            </form>
        </section>
    )
}

export default AssetForm