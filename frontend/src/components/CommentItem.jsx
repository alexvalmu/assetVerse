import StarsRating from "./StarsRating";

function CommentItem({ comment }) {
  return (
    <div className="comment-item">
      <p><strong>{comment.username}</strong></p>
      <p>{comment.text}</p>
      <StarsRating rating={comment.stars}></StarsRating>
    </div>
  );
}

export default CommentItem;
