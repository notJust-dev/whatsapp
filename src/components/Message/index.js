import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { Auth, Storage } from "aws-amplify";
import { useEffect, useState } from "react";
import ImageView from "react-native-image-viewing";
import { Video } from "expo-av";

const Message = ({ message }) => {
  const [isMe, setIsMe] = useState(false);
  const [imageSources, setImageSources] = useState([]);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [downloadAttachements, setDownloadedAttachements] = useState([]);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const isMyMessage = async () => {
      const authUser = await Auth.currentAuthenticatedUser();

      setIsMe(message.userID === authUser.attributes.sub);
    };

    isMyMessage();
  }, []);

  useEffect(() => {
    const downloadAttachements = async () => {
      if (message.Attachements.items) {
        const downloadedAttachments = await Promise.all(
          message.Attachements.items.map((attachment) =>
            Storage.get(attachment.storageKey).then((uri) => ({
              ...attachment,
              uri,
            }))
          )
        );

        setDownloadedAttachements(downloadedAttachments);
      }
    };
    downloadAttachements();
  }, [message.Attachements.items]);

  // console.log(downloadAttachements);
  const maxContainerWidth = width * 0.8 - 30;
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
      {downloadAttachements?.length > 0 && (
        <View style={{ width: maxContainerWidth }}>
          <View style={styles.images}>
            {downloadAttachements.map((attachment) =>
              attachment.type === "IMAGE" ? (
                <Pressable
                  key={attachment.id}
                  onPress={() => setImageViewerVisible(true)}
                  style={[
                    styles.imageContainer,
                    downloadAttachements.length === 1 && { flex: 1 },
                  ]}
                >
                  <Image
                    source={{ uri: attachment.uri }}
                    style={styles.image}
                  />
                </Pressable>
              ) : (
                <Video
                  useNativeControls
                  source={{
                    uri: attachment.uri,
                  }}
                  shouldPlay={false}
                  style={{
                    width: maxContainerWidth,
                    height:
                      (attachment.height * maxContainerWidth) /
                      attachment.width,
                  }}
                  resizeMode="contain"
                />
              )
            )}
          </View>

          <ImageView
            images={imageSources}
            imageIndex={0}
            visible={imageViewerVisible}
            onRequestClose={() => setImageViewerVisible(false)}
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
    width: "45%",
    borderColor: "white",
    margin: 2,
  },
  image: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 5,
  },
});

export default Message;
