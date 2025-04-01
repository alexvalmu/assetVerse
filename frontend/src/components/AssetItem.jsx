
function AssetItem({asset}) {
  return (
    <div className="goal">
        <div>
            {new Date(asset.createdAt).toLocaleString('es-ES', )}
        </div>
        <h2>{asset.text}</h2>
    </div>
  )
}

export default AssetItem