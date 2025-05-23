function StarsRating({ rating = 0, size }) {
    // Validar que rating sea un número entre 0 y 5
    const safeRating = typeof rating === 'number' && rating >= 0 && rating <= 5 ? rating : 0;

    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className={`stars-rating ${size}`}>
            {/* Estrellas llenas */}
            {[...Array(fullStars)].map((_, i) => (
                <span key={`full-${i}`} className={`star filled ${size}`}>&#9733;</span>
            ))}
            {/* Estrella media */}
            {hasHalfStar && (
                <span className={`star half-filled ${size}`}>&#9733;</span>
            )}
            {/* Estrellas vacías */}
            {[...Array(emptyStars)].map((_, i) => (
                <span key={`empty-${i}`} className={`star empty ${size}`}>&#9734;</span>
            ))}
        </div>
    );
}

export default StarsRating;
