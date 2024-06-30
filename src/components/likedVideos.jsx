// src/components/LikedVideos.jsx
import { useQuery } from "@tanstack/react-query";
import { getLikedVideos } from "../HTTP/api";
import styled from "styled-components";
import LikedVideoCard from "./LikedVedeoCard";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
`;

const LikedVideos = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["likedVideos"],
    queryFn: getLikedVideos,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
      {data?.map((likedVideo) => (
        <LikedVideoCard key={likedVideo.video._id} video={likedVideo.video} />
      ))}
    </Container>
  );
};

export default LikedVideos;
