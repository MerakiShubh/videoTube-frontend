import { useState } from "react";
import styled from "styled-components";
import Comment from "./Comment";
import { useSelector } from "react-redux";
import { addComment, fetchComments } from "../HTTP/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
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
  border-radius: 10;
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
        ...newCommentData, // Ensure new comment contains all the required data
        owner: {
          _id: user._id,
          avatar: user.avatar,
          username: user.username,
        },
      };

      queryClient.setQueryData(["comments", videoId], (oldComments) => {
        if (!oldComments) return [newComment]; // Handle initial case
        return [newComment, ...oldComments]; // Prepend the new comment
      });
      setComment(""); // Clear input after adding comment
    },
  });

  const handleCommentSubmit = () => {
    if (comment.trim) {
      mutation.mutate(comment);
    }
  };
  if (isError) {
    <div>Comment can not be added {error.message}</div>;
  }
  return (
    <Container>
      <NewComment>
        <Avatar src={user.avatar} />
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
          {" "}
          <SpinLoader />{" "}
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
