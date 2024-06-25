import { useRef } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../HTTP/api";
import { Loader, User } from "lucide-react";
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
const Error = styled.div`
  font-size: 20px;
  font-weight: 300;
  color: red;
`;

const SignUp = styled.div`
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
const SignIn = () => {
  const navigate = useNavigate();
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      navigate("/");
    },
  });

  const handleSubmit = () => {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    if (!password) {
      alert("Password is required");
      return;
    }

    if (!username && !email) {
      alert("Username or Email is required");
      return;
    }
    const data = { username, email, password };
    mutation.mutate(data);
  };
  return (
    <Container>
      <Wrapper>
        <Title>Sign in</Title>
        {mutation.isError ? (
          <span>
            <User /> <Error>Account is already exists</Error>
          </span>
        ) : (
          <SubTitle>to continue to VideoTube</SubTitle>
        )}
        <Input placeholder="username" ref={usernameRef} />
        <Input placeholder="email" ref={emailRef} />
        <Input type="password" placeholder="password" ref={passwordRef} />
        {mutation.isPending ? (
          <SpinLoader />
        ) : (
          <Button onClick={handleSubmit}>Sign in</Button>
        )}
        <Text> Don&apos;t have an account?</Text>

        <Link to={"/signup"} style={{ textDecoration: "none" }}>
          <SignUp>Create account</SignUp>
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

export default SignIn;
