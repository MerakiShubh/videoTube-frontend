import { Link } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import { format } from "timeago.js";
import { useDispatch } from "react-redux";
import { setVideoInfo, setVideoOwnerInfo } from "../utils/videoSlice";

const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "360px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  cursor: pointer;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 10px;
`;

const Image = styled.img`
  width: 100%;
  height: ${(props) => (props.type === "sm" ? "120px" : "202px")};
  background-color: #999;
  flex: 1;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "16px"};
  gap: 12px;
  flex: 1;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 9px 0px;
`;

const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

const LikedVideoCard = ({ video }) => {
  const dispatch = useDispatch();
  console.log("video data", video);

  const handleClick = () => {
    dispatch(setVideoOwnerInfo(video.ownerInfo));
    dispatch(setVideoInfo(video));
  };

  return (
    <Link
      to={`/video/${video._id}`}
      style={{ textDecoration: "none" }}
      onClick={handleClick}
    >
      <Container>
        <Image src={video.thumbnail} />
        <Details>
          {video.ownerInfo && <ChannelImage src={video.ownerInfo.avatar} />}
          <Texts>
            <Title>{video.title}</Title>
            {video.ownerInfo && (
              <ChannelName>{video.ownerInfo.fullName}</ChannelName>
            )}
            <Info>
              {video.views} views • {format(video.createdAt)}
            </Info>
          </Texts>
        </Details>
      </Container>
    </Link>
  );
};

LikedVideoCard.propTypes = {
  video: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    ownerInfo: PropTypes.shape({
      avatar: PropTypes.string,
      fullName: PropTypes.string,
    }),
    views: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default LikedVideoCard;