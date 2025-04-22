import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createAsset, reset } from '../features/assets/assetSlice'
import { fetchCategories } from '../features/categories/categorySlice';
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { set } from 'mongoose';


function AssetForm() {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [files, setFiles] = useState([]);
    const [selectedCategory, setCategory] = useState('');
    const [mainImage, setMainImage] = useState('');
    const [tags, setTags] = useState('');
    const dispatch = useDispatch();

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const { categories } = useSelector((state) => state.categories);
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const onSubmit = e => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('desc', desc);
        formData.append('category', selectedCategory);
        formData.append('mainImage', mainImage);
        tags.split(',').map(tag => tag.trim()).forEach(tag => {
            formData.append('tagNames', tag);
          });
          

        // Agregar cada archivo al FormData
        files.forEach(file => {
            formData.append('files', file);
        });

        dispatch(createAsset(formData));
        setTitle('');
        setDesc('');
        setFiles([]);
        setCategory('');
        setMainImage('');
        setTags('');
        // Limpiar el input de archivos
        document.getElementById('fileInput').value = '';
    }

    return (
        <section className="form"> 
            <form onSubmit={onSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label htmlFor="title">Asset</label>
                    <input 
                        type="title" 
                        name="title" 
                        id="title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
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
                    <label htmlFor="mainImage">Imagen Principal</label>
                    <input
                        type="file" 
                        name="mainImage" 
                        id="mainImage" 
                        accept="image/*" 
                        onChange={(e) => setMainImage(e.target.files[0])}
                    />
                    <small>Selecciona una imagen principal</small>
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
                    <label htmlFor="tags">Tags (separados por comas)</label>
                    <input
                        type="text"
                        name="tags"
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Ej: render, blender, lowpoly"
                    />
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