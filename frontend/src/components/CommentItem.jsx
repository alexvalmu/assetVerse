import StarsRating from "./StarsRating";

function CommentItem({ comment }) {
  return (
    <div className="comment-item">
      <p><strong>{comment.username}</strong></p>
      <StarsRating rating={comment.stars} size="small"></StarsRating>
      <p>{comment.text}</p>
    </div>
  );
}

export default CommentItem;
