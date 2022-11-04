import { useState } from "react";
import { View, StyleSheet, TextInput, Image, FlatList } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { API, graphqlOperation, Auth, Storage } from "aws-amplify";
import {
  createMessage,
  updateChatRoom,
  createAttachement,
} from "../../graphql/mutations";
import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const InputBox = ({ chatroom }) => {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);

  const onSend = async () => {
    const authUser = await Auth.currentAuthenticatedUser();

    const newMessage = {
      chatroomID: chatroom.id,
      text,
      userID: authUser.attributes.sub,
    };

    const newMessageData = await API.graphql(
      graphqlOperation(createMessage, { input: newMessage })
    );

    setText("");

    // add attachments
    await Promise.all(
      files.map((file) =>
        addAttachment(file, newMessageData.data.createMessage.id)
      )
    );
    setFiles([]);

    // set the new message as LastMessage of the ChatRoom
    await API.graphql(
      graphqlOperation(updateChatRoom, {
        input: {
          _version: chatroom._version,
          chatRoomLastMessageId: newMessageData.data.createMessage.id,
          id: chatroom.id,
        },
      })
    );
  };

  const addAttachment = async (file, messageID) => {
    const types = {
      image: "IMAGE",
      video: "VIDEO",
    };
    const newAttachment = {
      storageKey: await uploadFile(file),
      type: types[file.type],
      width: file.width,
      height: file.height,
      duration: file.duration,
      messageID,
    };
    return API.graphql(
      graphqlOperation(createAttachement, { input: newAttachment })
    );
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.cancelled) {
      if (result.selected) {
        setFiles(result.selected);
      } else {
        setFiles([result]);
      }
    }
  };

  const uploadFile = async ({ uri, type }) => {
    const exts = {
      image: "png",
      video: "mp4",
    };
    const contentTypes = {
      image: "image/png",
      video: "video/mp4",
    };
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const key = `${uuidv4()}.${exts[type]}`;
      await Storage.put(key, blob, {
        contentType: contentTypes[type], // contentType is optional
      });
      return key;
    } catch (err) {
      console.log("Error uploading file:", err);
    }
  };

  return (
    <>
      {files.length > 0 && (
        <View style={styles.attachmentsContainer}>
          <FlatList
            data={files}
            renderItem={({ item }) => (
              <>
                <Image
                  source={{ uri: item.uri }}
                  style={styles.selectedImage}
                  resizeMode="contain"
                />
                <MaterialIcons
                  name="highlight-remove"
                  onPress={() =>
                    setFiles((existingFiles) =>
                      [...existingFiles].filter((file) => file !== item)
                    )
                  }
                  size={20}
                  color="gray"
                  style={styles.removeSelectedImage}
                />
              </>
            )}
            horizontal
          />
        </View>
      )}
      <SafeAreaView edges={["bottom"]} style={styles.container}>
        {/* Icon */}
        <AntDesign
          onPress={pickImage}
          name="plus"
          size={20}
          color="royalblue"
        />

        {/* Text Input */}
        <TextInput
          value={text}
          onChangeText={setText}
          style={styles.input}
          placeholder="Type your message..."
        />

        {/* Icon */}
        <MaterialIcons
          onPress={onSend}
          style={styles.send}
          name="send"
          size={16}
          color="white"
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    padding: 5,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,

    borderRadius: 50,
    borderColor: "lightgray",
    borderWidth: StyleSheet.hairlineWidth,
  },
  send: {
    backgroundColor: "royalblue",
    padding: 7,
    borderRadius: 15,
    overflow: "hidden",
  },
  attachmentsContainer: {
    alignItems: "flex-end",
  },
  selectedImage: {
    height: 100,
    width: 200,
    margin: 5,
  },
  removeSelectedImage: {
    position: "absolute",
    right: 10,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default InputBox;
