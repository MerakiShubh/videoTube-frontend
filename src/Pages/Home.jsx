import styled from "styled-components";
import Card from "../components/Card";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchVideos, fetchVideosByCategory } from "../HTTP/api";
import { Loader } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

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
  const [searchParams] = useSearchParams();
  const { category } = useParams();
  const query = searchParams.get("query") || "";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["videos", { query, category }],
    queryFn: ({ pageParam = 1 }) =>
      category
        ? fetchVideosByCategory({ category, page: pageParam })
        : fetchVideos({ query, page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length ? pages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

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
      {data.pages.map((page) =>
        page.map((video) => <Card key={video._id} video={video} />)
      )}
      <div ref={ref} />
      {isFetchingNextPage && <SpinLoader />}
    </Container>
  );
};

export default Home;
