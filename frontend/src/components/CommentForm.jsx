import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '../features/comments/commentSlice';
import { getAsset } from '../features/assets/assetSlice';
function CommentForm() {
    const [comment, setComment] = useState('');
    const [stars, setStars] = useState(0); // Valor inicial 5 estrellas
    const dispatch = useDispatch();

    const { asset } = useSelector((state) => state.assets);
    const { user } = useSelector((state) => state.auth);

    const onSubmit = (e) => {
        e.preventDefault();

        const commentData = {
            asset: asset._id,
            user: user._id,
            username: user.name, 
            stars,
            text: comment
        };

        dispatch(createComment(commentData));
       dispatch(getAsset(asset._id));  
        setComment('');
        setStars(0);
    }

    return (
        <div className="comment-form">
            <h2>Deja un comentario</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="stars">Puntuación:</label>
                    <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => setStars(star)}
                            style={{
                                cursor: 'pointer',
                                fontSize: '24px',
                                color: star <= stars ? 'black' : 'gray'
                            }}
                        >
                            &#9733;
                        </span>
                    ))}
                </div>
                </div>

                <div className="form-group">
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Escribe tu comentario aquí..."
                        rows="8"
                    ></textarea>
                </div>

                <button type="submit">Enviar</button>
            </form>
        </div>
    )
}

export default CommentForm;
