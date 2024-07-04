import styled from "styled-components";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { clearUserInfo } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Wrapper = styled.div`
  width: 400px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 24px;
  color: ${({ theme }) => theme.text};
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #999;
  margin: 0 auto;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
  align-self: center;
`;

const UserInfoForm = ({ onClose }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUserInfo());
    navigate("/");
    onClose();
  };

  if (!userInfo) return null;

  return (
    <Container>
      <Wrapper>
        <Close onClick={onClose}>&times;</Close>
        <Avatar src={userInfo.avatar} alt="User Avatar" />
        <Info>
          <p>Email: {userInfo.email}</p>
          <p>Username: {userInfo.username}</p>
          <p>Fullname: {userInfo.fullName}</p>
        </Info>
        <Button onClick={handleLogout}>Logout</Button>
      </Wrapper>
    </Container>
  );
};

UserInfoForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default UserInfoForm;
