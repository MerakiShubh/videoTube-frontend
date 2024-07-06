import { useState } from "react";
import styled from "styled-components";
import Comment from "./Comment";
import { useSelector } from "react-redux";
import { addComment, fetchComments } from "../HTTP/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Import the icon

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StyledAvatarWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* Ensure child content respects border radius */
  background-color: ${({ theme }) => theme.soft}; /* Fallback background */

  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  & > svg {
    width: 100%;
    height: 100%;
    color: ${({ theme }) => theme.text}; /* Match theme text color */
  }
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const CommentButton = styled.button`
  background-color: #1e90ff;
  color: white;
  cursor: pointer;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: bold;
`;

const CancelButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.textSoft};
  cursor: pointer;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: bold;
`;

const SpinLoader = styled(Loader)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Comments = () => {
  const [comment, setComment] = useState("");
  const videoId = useSelector((state) => state.video.videoInfo?._id);
  const user = useSelector((state) => state.user?.userInfo);
  const queryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => fetchComments(videoId),
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: (newCommentContent) => addComment(videoId, newCommentContent),
    onSuccess: (newCommentData) => {
      const newComment = {
        ...newCommentData,
        owner: {
          _id: user._id,
          avatar: user.avatar,
          username: user.username,
        },
      };

      queryClient.setQueryData(["comments", videoId], (oldComments) => {
        if (!oldComments) return [newComment];
        return [newComment, ...oldComments];
      });
      setComment("");
    },
  });

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      mutation.mutate(comment);
    }
  };

  if (isError) {
    return <div>Comment can not be added: {error.message}</div>;
  }

  return (
    <Container>
      <NewComment>
        <StyledAvatarWrapper>
          {user && user.avatar ? (
            <img src={user.avatar} alt="User Avatar" />
          ) : (
            <AccountCircleIcon />
          )}
        </StyledAvatarWrapper>
        <Input
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <CancelButton onClick={() => setComment("")}>Cancel</CancelButton>
        <CommentButton onClick={handleCommentSubmit}>Comment</CommentButton>
      </NewComment>
      {isLoading ? (
        <div>
          <SpinLoader />
        </div>
      ) : (
        comments?.map((comment) => (
          <Comment key={comment._id} comment={comment} videoId={videoId} />
        ))
      )}
    </Container>
  );
};

export default Comments;
