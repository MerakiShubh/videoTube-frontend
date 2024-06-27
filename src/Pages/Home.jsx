import styled from "styled-components";
import Card from "../components/Card";
import { useQuery } from "@tanstack/react-query";
import { fetchVideos } from "../HTTP/api";
import { Loader } from "lucide-react";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const SpinLoader = styled(Loader)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Home = () => {
  const {
    isLoading,
    isError,
    data: videos,
    error,
  } = useQuery({
    queryKey: ["videos"],
    queryFn: fetchVideos,
  });
  if (isLoading) {
    return (
      <div>
        <SpinLoader />
      </div>
    );
  }

  if (isError) {
    return <div>Some Error occurred: {error.message}</div>;
  }

  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Home;
