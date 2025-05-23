import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getAsset, updateAsset } from '../features/assets/assetSlice';
import { fetchCategories } from '../features/categories/categorySlice';
import '../assetForm.css';
import { FaFile } from 'react-icons/fa';

function EditAsset() {
    const { assetId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { asset } = useSelector(state => state.assets);
    const { categories } = useSelector(state => state.categories);

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [files, setFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [selectedCategory, setCategory] = useState('');
    const [mainImage, setMainImage] = useState('');
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [tags, setTags] = useState('');

    useEffect(() => {
        dispatch(getAsset(assetId));
        dispatch(fetchCategories());
    }, [dispatch, assetId]);

    useEffect(() => {
        if (asset && asset._id === assetId) {
            setTitle(asset.title || '');
            setDesc(asset.desc || '');
            setCategory(asset.category?._id || '');
            setMainImagePreview(asset.mainImage?.url || '');
            setTags(asset.tagNames?.join(', ') || '');
            // No precargamos archivos secundarios existentes para simplificar
        }
    }, [asset, assetId]);

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

        setFiles(totalFiles);
    };

    const handleRemoveFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setFilePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('desc', desc);
        formData.append('category', selectedCategory);
        if (mainImage) formData.append('mainImage', mainImage);
        tags.split(',').map(tag => tag.trim()).forEach(tag => {
            formData.append('tagNames', tag);
        });
        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            const result = await dispatch(updateAsset({ id: assetId, data: formData }));
            if (result.payload && result.payload._id) {
                navigate(`/assets/${result.payload._id}`);
            }
        } catch (error) {
            console.error('Error updating asset:', error);
        }
    };

    return (
        <section>
            <form className="upload-form" onSubmit={onSubmit} encType="multipart/form-data">
                <h2>Edit Asset</h2>
                <section className="form-section">
                    <div className="form-group main-image-group">
                        <label>Main Image</label>
                        <div className="main-image-upload" onClick={() => document.getElementById('mainImageInput').click()}>
                            {mainImagePreview ? (
                                <img src={mainImagePreview} alt="Preview" className="main-image-preview" />
                            ) : (
                                <img src="/upload.png" alt="upload-icon" className='upload-icon' />
                            )}
                        </div>
                        <input
                            type="file"
                            id="mainImageInput"
                            accept="image/*"
                            onChange={handleMainImageChange}
                            style={{ display: 'none' }}
                        />
                        <small>Choose a new main image (optional)</small>
                    </div>

                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Tags</label>
                        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select value={selectedCategory} onChange={(e) => setCategory(e.target.value)} required>
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea rows="4" value={desc} onChange={(e) => setDesc(e.target.value)} />
                    </div>
                </section>

                <div className="form-group">
                    <label>Files (optional)</label>
                    <div className="file-preview-container">
                        {filePreviews.map((file, index) => (
                            <div key={index} className="file-preview">
                                {file.preview.startsWith("data:image") ? (
                                    <img src={file.preview} alt={file.name} className="file-thumbnail" />
                                ) : (
                                    <div className="file-fallback">
                                        <FaFile size={20} />
                                        <span className="file-name">{file.name}</span>
                                    </div>
                                )}
                                <button type="button" className="remove-btn" onClick={() => handleRemoveFile(index)}>×</button>
                            </div>
                        ))}
                        <div className="upload-more" onClick={() => document.getElementById('fileInput').click()}>
                            <img src="/upload.png" alt="upload-icon" className="upload-icon" />
                        </div>
                    </div>
                    <input
                        type="file"
                        id="fileInput"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <small>You can upload up to 5 new files</small>
                </div>

                <div className="form-group">
                    <button className="btn btn-block" type="submit">Save Changes</button>
                </div>
            </form>
        </section>
    );
}

export default EditAsset;
