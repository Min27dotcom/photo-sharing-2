import { FaComments, FaEllipsisV } from "react-icons/fa";
import { CardContent, Typography, Menu, MenuItem, IconButton } from "@mui/material";
import { getCookie } from "../../helpers/cookie";
import { addComment, getCommentOfPhoto, deleteComment } from "../../services/photoServices";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

function Comments(props) {
  const { comments, photoId } = props;
  const token = getCookie("token");
  const userId = getCookie("userId")
  const [newComment, setNewComment] = useState({});
  const [photoComments, setPhotoComments] = useState(comments);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [hoveredComment, setHoveredComment] = useState(null);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    setNewComment((values) => ({ ...values, [e.target.name]: e.target.value }));
  };

  const handleComment = (photoId) => {
    let options = {
      ...newComment
    }
    const addNewComment = async () => {
      const result = await addComment(photoId, token, options);
      if (result.message === "Success") {
        const newPhotoComments = await getCommentOfPhoto(photoId);
        setPhotoComments(newPhotoComments.comments);
        setNewComment({});
        inputRef.current.value = '';
      }
    }
    addNewComment();
  };

  const handleMenuOpen = (event, comment) => {
    setAnchorEl(event.currentTarget);
    setSelectedComment(comment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedComment(null);
  };

  const handleDeleteComment = async (commentId) => {
    let options = {
      userId: userId,
      photoId: photoId,
      commentId: commentId,
    } 
    const result = await deleteComment( photoId, token, options);
    console.log(result);
    if (result.message === "Success") {
      const newPhotoComments = await getCommentOfPhoto(photoId);
      setPhotoComments(newPhotoComments.comments);
      handleMenuClose();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  return (
    <>
      <CardContent>
        <Typography
          variant="h5"
          style={{
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <FaComments style={{ marginRight: "10px", fontSize: "30px" }} />{" "}
          <div>Comments:</div>
        </Typography>
        {photoComments.length === 0 ? (
          <>This photo has no comments</>
        ) : (
          <>{photoComments.map((comment) => (
            <div
              key={comment._id}
              style={{ borderBottom: "1px solid #444444", position: "relative", paddingBottom: "10px", paddingTop: "10px" }}
              onMouseEnter={() => setHoveredComment(comment._id)}
              onMouseLeave={() => setHoveredComment(null)}
            >
              <Typography variant="body2" style={{ color: "#AAAAAA" }}>
                {formatDate(comment.date_time)}
              </Typography>
              <Typography variant="body1">
                <Link
                  to={`/user/${comment.user._id}`}
                  style={{
                    textDecoration: "none",
                    fontWeight: "550",
                    color: "black",
                  }}
                >
                  {`${comment.user.first_name} ${comment.user.last_name}`}
                </Link>
                : <div style={{display: 'inline-block'}}>{comment.comment}</div>
              </Typography>
              {comment.user._id === userId && hoveredComment === comment._id && (
                <>
                  <IconButton
                    style={{ position: "absolute", right: "15px", top: '25px', display: 'inline-block',fontSize: '15px' }}
                    onClick={(e) => handleMenuOpen(e, comment)}
                  >
                    <FaEllipsisV />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl && selectedComment && selectedComment._id === comment._id)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => handleDeleteComment(comment._id)}>Delete</MenuItem>
                    {/* Add Edit option here if needed */}
                  </Menu>
                </>
              )}
            </div>
          ))}</>
        )}
      </CardContent>
      <CardContent>
        <div style={{ display: "flex", alignItems: "center" }}>
          <textarea
            placeholder="Add your comment...."
            cols={80}
            rows={2}
            name="commentContent"
            onChange={handleChange}
            style={{
              borderRadius: "10px",
              paddingTop: "15px",
              marginRight: "10px",
            }}
            ref={inputRef}
          ></textarea>
          <button
            style={{
              width: "70px",
              height: "40px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
            onClick={() => handleComment(photoId)}
          >
            Add
          </button>
        </div>
      </CardContent>
    </>
  );
}

export default Comments;
