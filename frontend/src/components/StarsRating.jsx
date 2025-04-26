function StarsRating({ rating , size}) {
    const fullStars = Math.floor(rating); // Estrellas completas
    const hasHalfStar = rating % 1 >= 0.5; // Si tiene un decimal superior a .5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Estrellas vacías
  
    return (
        <div className={`stars-rating ${size}`}>
            {/* Estrellas llenas */}
            {[...Array(fullStars)].map((_, i) => (
                <span key={`full-${i}`} className={`star filled ${size}`}>&#9733;</span> // Estrella llena (★)
            ))}
            {/* Estrella media */}
            {hasHalfStar && (
                <span className={`star half-filled ${size}`}>&#9733;</span> // Estrella media
            )}
            {/* Estrellas vacías */}
            {[...Array(emptyStars)].map((_, i) => (
                <span key={`empty-${i}`} className={`star empty ${size}`}>&#9734;</span> // Estrella vacía (☆)
            ))}
        </div>
    );
}

export default StarsRating;
