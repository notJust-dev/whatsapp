import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { Auth, JS, Storage } from "aws-amplify";
import { useEffect, useState } from "react";
import ImageAttachments from "./ImageAttachments";
import VideoAttachments from "./VideoAttachments";

const Message = ({ message }) => {
  const [isMe, setIsMe] = useState(false);
  const [downloadAttachments, setDownloadedAttachments] = useState([]);

  const { width } = useWindowDimensions();

  useEffect(() => {
    const isMyMessage = async () => {
      const authUser = await Auth.currentAuthenticatedUser();

      setIsMe(message.userID === authUser.attributes.sub);
    };

    isMyMessage();
  }, []);

  useEffect(() => {
    const downloadAttachments = async () => {
      if (message.Attachments.items) {
        const downloadedAttachments = await Promise.all(
          message.Attachments.items.map((attachment) =>
            Storage.get(attachment.storageKey).then((uri) => ({
              ...attachment,
              uri,
            }))
          )
        );

        setDownloadedAttachments(downloadedAttachments);
      }
    };
    downloadAttachments();
  }, [JSON.stringify(message.Attachments.items)]);

  const imageContainerWidth = width * 0.8 - 30;

  const imageAttachments = downloadAttachments.filter(
    (at) => at.type === "IMAGE"
  );
  const videoAttachments = downloadAttachments.filter(
    (at) => at.type === "VIDEO"
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isMe ? "#DCF8C5" : "white",
          alignSelf: isMe ? "flex-end" : "flex-start",
        },
      ]}
    >
      {downloadAttachments.length > 0 && (
        <View style={[{ width: imageContainerWidth }, styles.images]}>
          <ImageAttachments attachments={imageAttachments} />

          <VideoAttachments
            attachments={videoAttachments}
            width={imageContainerWidth}
          />
        </View>
      )}
      <Text>{message.text}</Text>
      <Text style={styles.time}>{dayjs(message.createdAt).fromNow(true)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",

    // Shadows
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  time: {
    color: "gray",
    alignSelf: "flex-end",
  },
  images: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageContainer: {
    width: "50%",
    aspectRatio: 1,
    padding: 3,
  },
  image: {
    flex: 1,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default Message;
