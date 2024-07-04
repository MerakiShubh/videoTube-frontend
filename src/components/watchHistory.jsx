import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { fetchWatchHistory } from "../HTTP/api";
import { Loader } from "lucide-react";
import Card from "../components/Card"; // Ensure the correct path

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

const WatchHistory = () => {
  const {
    isLoading,
    isError,
    data: watchHistory,
    error,
  } = useQuery({
    queryKey: ["watchHistory"],
    queryFn: fetchWatchHistory,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
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

  // Transform watchHistory data to fit Card component's expected props
  const transformedVideos = watchHistory.map((video) => ({
    _id: video._id,
    thumbnail: video.thumbnail,
    title: video.title,
    ownerInfo: {
      avatar: video.ownerAvatar,
      fullName: video.ownerFullName,
    },
    views: video.views,
    createdAt: video.createdAt,
  }));

  return (
    <Container>
      {transformedVideos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default WatchHistory;
