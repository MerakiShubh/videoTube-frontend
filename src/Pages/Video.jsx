import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/Comments";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Tooltip } from "@mui/material";
// import Card from "../components/Card";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToWatchHistory,
  fetchVideosById,
  incrementViewCount,
  videoLike,
} from "../HTTP/api";
import { Loader } from "lucide-react";
import { format } from "timeago.js";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

// const Recommendation = styled.div`
//   flex: 2;
// `;
const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 720px;
  border: none;
`;

const SpinLoader = styled(Loader)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Video = () => {
  const queryClient = useQueryClient();
  const { videoId } = useParams();
  const videoOwnerInfo = useSelector((state) => state.video.videoOwnerInfo);
  const [liked, setLiked] = useState(false);
  const [localViews, setLocalViews] = useState(0);

  const {
    data: video,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => fetchVideosById(videoId),
    enabled: !!videoId,
    onSuccess: (data) => {
      setLocalViews(data.views);
    },
  });

  useEffect(() => {
    if (videoId) {
      const addWatchHistory = async () => {
        try {
          await incrementViewCount(videoId);
          setLocalViews((prevViews) => prevViews + 1);
          await addToWatchHistory(videoId);
        } catch (error) {
          console.error("Failed to update watch history or view count", error);
        }
      };
      addWatchHistory();
    }
  }, [videoId]);

  const likeMutation = useMutation({
    mutationFn: () => videoLike(videoId),
    onSuccess: () => {
      setLiked((prevLiked) => !prevLiked);
      // Refetch the video data to get the updated like count or status
      queryClient.invalidateQueries(["video", videoId]);
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

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
      <Content>
        <VideoWrapper>
          <StyledIframe
            src={video.videoFile}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></StyledIframe>
        </VideoWrapper>
        <Title>{video.title}</Title>
        <Details>
          <Info>
            {localViews} views • {format(video.createdAt)} ;
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {liked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
              Like
            </Button>
            <Tooltip title={liked ? "Dislike disabled" : ""}>
              <Button disabled={liked}>
                <ThumbDownOffAltOutlinedIcon />
                Dislike
              </Button>
            </Tooltip>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={videoOwnerInfo.avatar} />
            <ChannelDetail>
              <ChannelName>{videoOwnerInfo?.fullName}</ChannelName>
              <ChannelCounter>200K subscribers</ChannelCounter>
              <Description>{video.description}</Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe>SUBSCRIBE</Subscribe>
        </Channel>
        <Hr />
        <Comments />
      </Content>
      {/* <Recommendation>
        <Card type="sm" />
      </Recommendation> */}
    </Container>
  );
};

export default Video;
