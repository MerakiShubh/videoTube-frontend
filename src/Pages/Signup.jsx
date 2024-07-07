import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { register } from "../HTTP/api";
import { Loader, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../utils/userSlice";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
  width: 320px;
`;

const Title = styled.h1`
  font-size: 24px;
`;
const Text = styled.h1`
  font-size: 15px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Tags = styled.span`
  margin-left: 30px;
`;

const CustomFileLabel = styled.label`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.textSoft};
  display: block;
  cursor: pointer;
  text-align: left;
  padding-left: 10px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;
const Error = styled.div`
  font-size: 20px;
  font-weight: 300;
  color: red;
`;

const SignIn = styled.div`
  padding: 10px 20px;
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

const SpinLoader = styled(Loader)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const SignUP = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [avatarLabel, setAvatarLabel] = useState("avatar");
  const [coverImageLabel, setCoverImageLabel] = useState("coverImage");
  const fullNameRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const avatarInputRef = useRef(null);
  const coverImageInputRef = useRef(null);
  const mutation = useMutation({
    mutationFn: register,
    onSuccess(response) {
      const { createdUser, accessToken } = response.data.data;
      dispatch(setUserInfo({ userInfo: createdUser, accessToken }));
      navigate("/");
    },
  });

  const handleRegisterSubmit = () => {
    const fullName = fullNameRef.current?.value;
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const avatar = avatarInputRef.current?.files[0];
    const coverImage = coverImageInputRef.current?.files[0];
    if (!username || !email || !password || !avatar || !coverImage) {
      return alert("some fields are missing");
    }
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    formData.append("coverImage", coverImage);
    mutation.mutate(formData);
  };
  return (
    <Container>
      <Wrapper>
        <Title>Sign up</Title>
        {mutation.isError ? (
          <span>
            <User /> <Error>Account is already exists</Error>
          </span>
        ) : (
          <SubTitle>to continue to VideoTube</SubTitle>
        )}

        <Input placeholder="fullname" ref={fullNameRef} />
        <Input placeholder="username" ref={usernameRef} />
        <Input placeholder="email" ref={emailRef} />
        <Input type="password" placeholder="password" ref={passwordRef} />

        <CustomFileLabel htmlFor="avatar">{avatarLabel}</CustomFileLabel>
        <HiddenFileInput
          id="avatar"
          type="file"
          ref={avatarInputRef}
          onChange={(e) => setAvatarLabel(e.target.files[0]?.name)}
        />

        <CustomFileLabel htmlFor="coverImage">
          {coverImageLabel}
        </CustomFileLabel>
        <HiddenFileInput
          id="coverImage"
          type="file"
          ref={coverImageInputRef}
          onChange={(e) => setCoverImageLabel(e.target.files[0]?.name)}
        />
        {mutation.isPending ? (
          <SpinLoader />
        ) : (
          <Button type="submit" onClick={handleRegisterSubmit}>
            Sign up
          </Button>
        )}
        <Text>Already have an account</Text>
        <Link to={"/signin"} style={{ textDecoration: "none" }}>
          <SignIn>Signin</SignIn>
        </Link>
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Tags>Help</Tags>
          <Tags>Privacy</Tags>
          <Tags>Terms</Tags>
        </Links>
      </More>
    </Container>
  );
};

export default SignUP;
