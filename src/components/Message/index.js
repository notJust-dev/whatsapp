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

const Message = ({ message }) => {
  const [isMe, setIsMe] = useState(false);
  const [imageSources, setImageSources] = useState([]);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const isMyMessage = async () => {
      const authUser = await Auth.currentAuthenticatedUser();

      setIsMe(message.userID === authUser.attributes.sub);
    };

    isMyMessage();
  }, []);

  useEffect(() => {
    const downloadImages = async () => {
      if (message.images) {
        const imageUrls = await Promise.all(message.images.map(Storage.get));

        setImageSources(imageUrls.map((uri) => ({ uri })));
      }
    };
    downloadImages();
  }, [message.images]);

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
      {imageSources?.length > 0 && (
        <View style={{ width: width * 0.8 - 30 }}>
          <View style={styles.images}>
            {imageSources.map((imgSource) => (
              <Pressable
                onPress={() => setImageViewerVisible(true)}
                style={[
                  styles.imageContainer,
                  imageSources.length === 1 && { flex: 1 },
                ]}
              >
                <Image source={imgSource} style={styles.image} />
              </Pressable>
            ))}
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
