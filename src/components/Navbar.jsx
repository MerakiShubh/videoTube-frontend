import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import Upload from "./Upload";
import { useQueryClient } from "@tanstack/react-query";
import UserInfoForm from "../Pages/UserInfoForm";
const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 56px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
  position: relative;
`;

const Search = styled.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
  flex: 1;
  padding: 0 5px;
`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
`;

const Navbar = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const handleSearch = () => {
    queryClient.invalidateQueries(["videos"], {
      refetchInactive: true,
    });
    queryClient.setQueryData(["videos"], (oldData) => ({
      ...oldData,
      searchQuery, // Store the search query in cache
    }));
    navigate(`/?query=${searchQuery}`); // Adjust navigation as needed
  };

  const handleUploadIconClick = () => {
    setIsUploadOpen(true); // Only set the upload form to open
    setIsUserInfoOpen(false); // Ensure the user info form is closed
  };

  const handleAvatarClick = () => {
    setIsUserInfoOpen(!isUserInfoOpen); // Toggle the User Info Form
    setIsUploadOpen(false); // Ensure the upload form is closed
  };

  return (
    <Container>
      <Wrapper>
        <Search>
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <SearchOutlinedIcon onClick={handleSearch} />
        </Search>
        {userInfo ? (
          <User>
            <VideoCallOutlinedIcon onClick={handleUploadIconClick} />
            <Avatar
              src={userInfo.avatar}
              alt="User Avatar"
              onClick={handleAvatarClick}
            />
            {userInfo.username}
          </User>
        ) : (
          <Link to="signin" style={{ textDecoration: "none" }}>
            <Button>
              <AccountCircleOutlinedIcon />
              SIGN IN
            </Button>
          </Link>
        )}
        {isUploadOpen && <Upload onClose={() => setIsUploadOpen(false)} />}
        {isUserInfoOpen && (
          <UserInfoForm onClose={() => setIsUserInfoOpen(false)} />
        )}
      </Wrapper>
    </Container>
  );
};

export default Navbar;
