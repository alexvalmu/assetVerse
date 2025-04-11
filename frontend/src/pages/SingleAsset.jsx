import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { useSelector , useDispatch } from "react-redux"
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
    
    {asset?.files?.length > 0 && (
      <div className="files">
        <h4>Archivos subidos:</h4>
        <ul>
          {asset.files.map((file, index) => (
            <li key={index}>
              <p><strong>Nombre:</strong> {file.filename}</p>
              <p><strong>Tamaño:</strong> {Math.round(file.size / 1024)} KB</p>
              <p><strong>Tipo:</strong> {file.mimetype}</p>
              <a href={`/${file.path}`} target="_blank" rel="noopener noreferrer">Ver archivo</a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

}

export default SingleAsset;
