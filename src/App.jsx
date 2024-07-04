import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import Video from "./Pages/Video";
import SignIn from "./Pages/Signin";
import SignUP from "./Pages/Signup.jsx";
import LikedVideos from "./components/likedVideos.jsx";
import WatchHistory from "./components/watchHistory.jsx";
import { darkTheme, lightTheme } from "./utils/Theme";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useState } from "react";

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.div`
  padding: 22px 96px;
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
          <Main>
            <Navbar />
            <Wrapper>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:category" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUP />} />
                <Route path="/video/:videoId" element={<Video />} />
                <Route
                  path="/likedVideos"
                  element={
                    <ProtectedRoute>
                      <LikedVideos />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <WatchHistory />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
