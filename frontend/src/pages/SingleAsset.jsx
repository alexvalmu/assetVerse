import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Spinner from '../components/Spinner';
import { getAsset, reset } from "../features/assets/assetSlice";
import { getUserById } from "../features/users/userSlice";

function SingleAsset() {
    const { id: assetId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { asset, isLoading, isError, message } = useSelector((state) => state.assets);
    const { viewedUser, isLoading: userLoading } = useSelector((state) => state.users);

    const [mainPreview, setMainPreview] = useState('');
    const [userName, setUserName] = useState('');

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

    useEffect(() => {
        if (asset && asset.mainImage?.[0]?.filename) {
            setMainPreview(`http://localhost:5000/uploads/${asset.mainImage[0].filename}`);
        }

        if (asset?.user) {
            dispatch(getUserById(asset.user));
        }
    }, [asset, dispatch]);

   

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="single-asset">
            {/* Imagen principal */}
            <div className="mostrando">
                {mainPreview && (
                    <img
                        src={mainPreview}
                        className="mainImage"
                        alt="Imagen principal"
                    />
                )}
            </div>

            {/* Miniaturas */}
            <div className="miniaturas">
                {asset.mainImage && asset.mainImage.map((img, index) => (
                    <img
                        key={`main-${index}`}
                        src={`http://localhost:5000/uploads/${img.filename}`}
                        alt={`Miniatura ${index}`}
                        className="miniatura"
                        style={{ border: mainPreview.includes(img.filename) ? '2px solid #007bff' : '1px solid #ccc' }}
                        onClick={() => setMainPreview(`http://localhost:5000/uploads/${img.filename}`)}
                    />
                ))}

                {asset.files && asset.files.map((file, index) => (
                    file.mimetype.startsWith('image/') && (
                        <img
                            key={`file-${index}`}
                            src={`http://localhost:5000/uploads/${file.filename}`}
                            alt={file.filename}
                            className="miniatura"
                            style={{ border: mainPreview.includes(file.filename) ? '2px solid #007bff' : '1px solid #ccc' }}
                            onClick={() => setMainPreview(`http://localhost:5000/uploads/${file.filename}`)}
                        />
                    )
                ))}
            </div>

            {/* Detalles del asset */}
            <div className="asset-details">
                <h2>{asset?.title}</h2>
                <p>{asset?.desc}</p>
                <p><strong>Publicado por:</strong> {viewedUser?.name}</p>

            </div>
        </div>
    );
}

export default SingleAsset;
