import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { deleteComment, updateComment } from "../HTTP/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCommentRedux, updateCommentRedux } from "../utils/commentSlice";
import { format } from "timeago.js";
import { useDispatch, useSelector } from "react-redux";
import { MoreVertical } from "lucide-react";
import PropTypes from "prop-types";
import { Pencil, Save, Trash2 } from "lucide-react";

const Container = styled.div`
  display: flex;
  gap: 5px;
  margin: 30px 0px;
  position: relative;
  padding-right: 40px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text};
`;

const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;

const EditInput = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const ActionMenu = styled.div`
  position: absolute;
  top: 25px;
  right: 5px; /* Adjusted to prevent overlap */
  display: flex;
  flex-direction: column;
  gap: 0px;
  background: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 5px;
  padding: 5px;
  z-index: 10; /* Ensure the action menu appears in front */
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  text-align: left;
  width: 100%;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  line-height: 1;
`;

const MoreButton = styled.div`
  position: absolute;
  top: 25px;
  right: -25px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  padding: 5px;
  z-index: 1;
`;

const Comment = ({ comment, videoId }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment?.content);
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((state) => state.user?.userInfo) || {};
  const isCommentOwner = comment?.owner?._id === user._id;

  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const updateMutation = useMutation({
    mutationFn: (updatedContent) => updateComment(comment._id, updatedContent),
    onSuccess: (data) => {
      dispatch(updateCommentRedux(data));
      queryClient.invalidateQueries(["comments", videoId]);
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteComment(comment._id),
    onSuccess: () => {
      dispatch(deleteCommentRedux(comment._id));
      queryClient.invalidateQueries(["comments", videoId]);
    },
  });

  const handleEdit = () => {
    if (isEditing) {
      updateMutation.mutate(editedComment);
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleEdit();
    }
  };

  if (!comment) {
    return <div>Loading comment...</div>;
  }

  return (
    <Container>
      <Avatar src={comment.owner.avatar} />
      <Details>
        <Name>
          {comment.owner.username} <Date>{format(comment.createdAt)}</Date>
        </Name>
        {isEditing ? (
          <EditInput
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <Text>{comment.content}</Text>
        )}
      </Details>
      {isCommentOwner && (
        <>
          <MoreButton onClick={() => setShowMenu(!showMenu)}>
            <MoreVertical size={20} />
          </MoreButton>
          {showMenu && (
            <ActionMenu ref={menuRef}>
              <ActionButton onClick={handleEdit}>
                {isEditing ? (
                  <span>
                    <Save size={16} /> Save
                  </span>
                ) : (
                  <span>
                    <Pencil size={16} /> Edit
                  </span>
                )}
              </ActionButton>
              <ActionButton onClick={handleDelete}>
                <span>
                  <Trash2 size={16} /> Delete
                </span>
              </ActionButton>
            </ActionMenu>
          )}
        </>
      )}
    </Container>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  videoId: PropTypes.string.isRequired,
};

export default Comment;
