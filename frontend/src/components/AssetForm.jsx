import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAsset } from '../features/assets/assetSlice';
import { fetchCategories } from '../features/categories/categorySlice';
import '../assetForm.css';
import { FaFile, FaFileArchive } from 'react-icons/fa';

function AssetForm() {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [files, setFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]); // NUEVO
    const [selectedCategory, setCategory] = useState('');
    const [mainImage, setMainImage] = useState('');
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [tags, setTags] = useState('');
    const dispatch = useDispatch();

    const { categories } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const totalFiles = [...files, ...selectedFiles];
    
        if (totalFiles.length > 5) {
            alert('You can only upload up to 5 files.');
            return;
        }
    
        selectedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreviews(prev => [...prev, { file, preview: reader.result, name: file.name }]);
            };
            reader.readAsDataURL(file);
        });
    
        setFiles(totalFiles); // SOLO AQUÍ
    };
    
    const handleRemoveFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setFilePreviews(prev => prev.filter((_, i) => i !== index));
    };

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
        files.forEach(file => {
            formData.append('files', file);
        });

        dispatch(createAsset(formData));

        setTitle('');
        setDesc('');
        setFiles([]);
        setFilePreviews([]);
        setCategory('');
        setMainImage('');
        setMainImagePreview(null);
        setTags('');
        document.getElementById('fileInput').value = '';
        document.getElementById('mainImageInput').value = '';
    }

    return (
        <section>
            <form className="upload-form" onSubmit={onSubmit} encType="multipart/form-data">
                <section className="form-section">
                    {/* Main Image Upload */}
                    <div className="form-group">
                        <label htmlFor="mainImage">Main Image</label>
                        <div className="main-image-upload" onClick={() => document.getElementById('mainImageInput').click()}>
                            {mainImagePreview ? (
                                <img src={mainImagePreview} alt="Preview" className="main-image-preview" />
                            ) : (
                                <img src="/upload.png" alt="upload-icon" className='upload-icon'></img>
                            )}
                        </div>
                        <input
                            type="file"
                            name="mainImage"
                            id="mainImageInput"
                            accept="image/*"
                            onChange={handleMainImageChange}
                            style={{ display: 'none' }}
                        />
                        <small>Choose a main image for your asset</small>
                    </div>

                    {/* Other fields */}
                    <section>
                        <div className="form-group">
                            <label htmlFor="title">Name</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="tags">Tags</label>
                            <input
                                type="text"
                                name="tags"
                                id="tags"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="Ej: render, blender, lowpoly"
                            />
                        </div>
                    </section>

                    <section>
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={selectedCategory}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="desc">Description</label>
                            <input
                                type="text"
                                name="desc"
                                id="desc"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                            />
                        </div>
                    </section>

                </section>

                {/* Files Upload */}
                <div className="form-group">
                    <label htmlFor="files">Files</label>

                    <div className="file-preview-container">
                        {filePreviews.map((file, index) => (
                            <div key={index} className="file-preview">
                                <img src={file.preview} alt={file.name} className="file-thumbnail" />
                                <button type="button" className="remove-btn" onClick={() => handleRemoveFile(index)}>×</button>
                            </div>
                        ))}
                        <div className="upload-more" onClick={() => document.getElementById('fileInput').click()}>
                            <img src="/upload.png" alt="upload-icon" className='upload-icon'></img>
                        </div>
                    </div>

                    <input
                        type="file"
                        id="fileInput"
                        name="files"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />

                    <small>You can upload up to 5 files per asset</small>
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

export default AssetForm;
