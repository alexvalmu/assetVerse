import StarsRating from "./StarsRating";

function CommentItem({ comment }) {
  return (
    <div className="comment-item">
      <h4><strong>{comment.username}</strong></h4>
      <StarsRating rating={comment.stars} size="small"></StarsRating>
      <p>{comment.text}</p>
    </div>
  );
}

export default CommentItem;
