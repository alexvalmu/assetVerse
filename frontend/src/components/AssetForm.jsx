import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAsset, updateAsset } from '../features/assets/assetSlice';
import { fetchCategories } from '../features/categories/categorySlice';
import { useNavigate } from 'react-router-dom';
import '../assetForm.css';
import { FaFile, FaFileArchive } from 'react-icons/fa';

function AssetForm({ mode = 'create', asset = null }) {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [files, setFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]); // NUEVO
    const [selectedCategory, setCategory] = useState('');
    const [mainImage, setMainImage] = useState('');
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [tags, setTags] = useState('');
    const dispatch = useDispatch();

    const { categories } = useSelector((state) => state.categories);
    const navigate = useNavigate();


    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (mode === 'edit' && asset) {

            setTitle(asset.title || '');
            setDesc(asset.desc || '');
            setTags(asset.tags?.map(t => t.name).join(', ') || '');

            if (Array.isArray(asset.mainImage) && asset.mainImage[0]?.url) {
                setMainImage(asset.mainImage[0]);
                setMainImagePreview(asset.mainImage[0].url); 
            }

            if (asset.files && Array.isArray(asset.files)) {
                setExistingFiles(asset.files);
            }
        }
    }, [mode, asset]);

    useEffect(() => {
        if (mode === 'edit' && asset && categories.length > 0) {
            const categoryId =
                typeof asset.category === 'string'
                    ? asset.category
                    : asset.category?._id;

            setCategory(categoryId || '');
        }
    }, [asset, categories, mode]);
    const handleRemoveExistingFile = (index) => {
        setExistingFiles(prev => prev.filter((_, i) => i !== index));
    };

    const getFileNameFromUrl = (url) => {
        try {
            return decodeURIComponent(url.split('/').pop().split('.')[0]);
        } catch (e) {
            return 'unnamed';
        }
    };

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

        existingFiles.forEach(file => {
            formData.append('existingFileIds', file._id);
        });

        existingFiles.forEach(file => {
            formData.append('remainingFileUrls', file.url);
        });

        if (mainImage && mainImage instanceof File) {
            formData.append('mainImage', mainImage);
        } else if (typeof mainImage === 'object' && mainImage.url) {
            formData.append('existingMainImageUrl', mainImage.url); // si tu backend lo necesita
        }

        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            let resultAction;
            if (mode === 'edit' && asset?._id) {
                formData.append('id', asset._id);
                resultAction = await dispatch(updateAsset({ id: asset._id, data: formData }));
            } else {
                resultAction = await dispatch(createAsset(formData));
            }

            const resultAsset = resultAction.payload;
            if (resultAsset && resultAsset._id) {
                navigate(`/assets/${resultAsset._id}`);
            }
        } catch (error) {
            console.error('Error submitting asset:', error);
        }
        setTitle('');
        setDesc('');
        setFiles([]);
        setFilePreviews([]);
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
                    <div className="form-group main-image-group">
                        <label htmlFor="mainImageInput">Main Image</label>
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
                            name="mainImage"
                            accept="image/*"
                            onChange={handleMainImageChange}
                            style={{ display: 'none' }}
                            {...(mode === 'create' ? { required: true } : {})}
                        />
                        <small>Choose a main image for your asset</small>
                    </div>

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
                            <textarea
                                name="desc"
                                id="desc"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                rows="4"
                            />
                        </div>
                    </section>

                </section>

                {/* Files Upload */}
                <div className="form-group">
                    <label htmlFor="fileInput">Files</label>

                    <div className="file-preview-container">
                        {/* Archivos ya existentes */}
                        {existingFiles.map((file, index) => (
                            <div key={`existing-${index}`} className="file-preview">
                                {file.url?.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
                                    <img src={file.url} alt={file.name || 'Asset File'} className="file-thumbnail" />
                                ) : (
                                    <div className="file-fallback">
                                        <FaFile size={20} />
                                        <span className="file-name">{getFileNameFromUrl(file.url)}</span>
                                    </div>
                                )}
                                <button type="button" className="remove-btn" onClick={() => handleRemoveExistingFile(index)}>×</button>
                            </div>
                        ))}

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
                        {mode === 'edit' ? 'Update Asset' : 'Upload Asset'}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default AssetForm;
