import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import AssetItem from "../components/AssetItem"
import Spinner from '../components/Spinner'
import { getAsset, reset } from "../features/assets/assetSlice"

function SingleAsset() {
    const { id: assetId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { asset, isLoading, isError, message } = useSelector((state) => state.assets);

    useEffect(() => {
        if (isError) {
            console.error(message);
        }

        if (assetId) {
            dispatch(getAsset(assetId));
        }

        return () => {
            dispatch(reset());
        };
    }, [dispatch, assetId, isError, message]);

    if (isLoading) {
        return <Spinner />
    }

    return (
        <div className="single-asset">
            <h2>{asset?.text}</h2>
            <p><strong>Descripción:</strong> {asset?.desc}</p>
            <p><strong>Fecha de creación:</strong> {new Date(asset?.createdAt).toLocaleString()}</p>
            {asset.mainImage?.[0]?.filename && (
                <div className="main-image-preview">
                    <h4>Imagen principal:</h4>
                    <img
                        src={`http://localhost:5000/uploads/${asset.mainImage[0].filename}`}
                        alt="Imagen principal"
                        style={{ maxWidth: '300px', maxHeight: '300px', marginBottom: '1rem' }}
                    />
                </div>
            )}
            {/* Mostrar archivos adjuntos */}
            {asset.files && asset.files.length > 0 && (
                <div className="files-container">
                    <h4>Archivos adjuntos:</h4>
                    <ul>
                        {asset.files.map((file, index) => (
                            <li key={index}>
                                {file.mimetype.startsWith('image/') ? (
                                    <img
                                        src={`http://localhost:5000/uploads/${file.filename}`}
                                        alt={file.filename}
                                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                                    />
                                ) : (
                                    <span>
                                        {file.filename} ({Math.round(file.size / 1024)} KB)
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );

}

export default SingleAsset;
