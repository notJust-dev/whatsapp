import { Video } from "expo-av";

const VideoAttachments = ({ width, attachments }) => {
  return (
    <>
      {attachments.map((attachment) => (
        <Video
          key={attachment.id}
          useNativeControls
          source={{
            uri: attachment.uri,
          }}
          shouldPlay={false}
          style={{
            width,
            height: (attachment.height * width) / attachment.width,
          }}
          resizeMode="contain"
        />
      ))}
    </>
  );
};

export default VideoAttachments;
