import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createAsset, setCategory } from '../features/assets/assetSlice'
import { fetchCategories } from '../features/assets/assetSlice';
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { reset } from 'colors';


function AssetForm() {
    const [text, setText] = useState('');
    const [desc, setDesc] = useState('');
    const [files, setFiles] = useState([]);
    const [selectedCategory, setCategory] = useState('');
    const dispatch = useDispatch();

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
        setCategory([...e.target.selectedCategory]);
    };

    const { categories } = useSelector((state) => state.categories);
    useEffect(() => {
        dispatch(fetchCategories());

    }, [dispatch]);

    const onSubmit = e => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('text', text);
        formData.append('desc', desc);
        formData.append('category', selectedCategory);
        
        // Agregar cada archivo al FormData
        files.forEach(file => {
            formData.append('files', file);
        });

        dispatch(createAsset(formData));
        setText('');
        setDesc('');
        setFiles([]);
        setCategory([]);
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
                    <label htmlFor="desc">Asset Desc:</label>
                    <input 
                        type="desc" 
                        name="desc" 
                        id="desc" 
                        value={desc} 
                        onChange={(e) =>setDesc(e.target.value)}
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
                    <label htmlFor="category">Categoría</label>
                    <select
                        id="category"
                        name="category"
                        value={selectedCategory}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
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