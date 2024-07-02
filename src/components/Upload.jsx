import { useState } from "react";
import styled from "styled-components";
import { uploadVideo } from "../HTTP/api";
import PropTypes from "prop-types";
import { Loader } from "lucide-react";

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
  z-index: 1000; /* Ensure the upload form is on top */
`;

const Wrapper = styled.div`
  width: 600px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  border-radius: 10px; /* Rounded corners for a nicer look */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Add shadow for better visibility */
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 24px;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
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

const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  resize: none; /* Make the text area not resizable */
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
  margin: 20px auto 0;
  display: block;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  padding-top: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Spindiv = styled.div`
  width: 40px;
  height: 40px;
  color: ${({ theme }) => theme.text};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  background-color: transparent;
  pointer-events: none;
`;

const SpinLoader = styled(Loader)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Upload = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFileLabel, setVideoFileLabel] = useState("Upload Video File");
  const [thumbnailLabel, setThumbnailLabel] = useState("Upload Thumbnail File");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "videoFile") {
      setVideoFileLabel(files[0]?.name || "Upload Video File");
    } else if (name === "thumbnail") {
      setThumbnailLabel(files[0]?.name || "Upload Thumbnail File");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const videoFile = document.querySelector('input[name="videoFile"]')
      .files[0];
    const thumbnail = document.querySelector('input[name="thumbnail"]')
      .files[0];

    if (!videoFile || !thumbnail) {
      alert("Please select both video and thumbnail files.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);

    try {
      const response = await uploadVideo(formData);
      console.log("Video uploaded successfully", response);
      onClose(); // Close the upload form after successful upload
    } catch (error) {
      console.error("Error uploading video", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      {isLoading && (
        <Spindiv>
          {" "}
          <SpinLoader />
        </Spindiv>
      )}
      <Wrapper>
        <Close onClick={onClose}>&times;</Close>
        <Title>Upload a New Video</Title>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Video:</Label>
            <CustomFileLabel htmlFor="videoFile">
              {videoFileLabel}
            </CustomFileLabel>
            <HiddenFileInput
              id="videoFile"
              type="file"
              accept="video/*"
              name="videoFile"
              onChange={handleFileChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Title:</Label>
            <Input
              type="text"
              placeholder="Title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Description:</Label>
            <Desc
              placeholder="Description"
              name="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Thumbnail:</Label>
            <CustomFileLabel htmlFor="thumbnail">
              {thumbnailLabel}
            </CustomFileLabel>
            <HiddenFileInput
              id="thumbnail"
              type="file"
              accept="image/*"
              name="thumbnail"
              onChange={handleFileChange}
              required
            />
          </FormGroup>
          <Button type="submit">Upload</Button>
        </form>
      </Wrapper>
    </Container>
  );
};

Upload.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Upload;
