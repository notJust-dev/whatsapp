import { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Message from "../../components/Message";
import InputBox from "../../components/InputBox";

import bg from "../../../assets/images/BG.png";
import { API, graphqlOperation } from "aws-amplify";
import { getChatRoom } from "../../graphql/queries";
import { listMessagesByChatRoom } from "./ChatScreenQueries";
import {
  onCreateAttachment,
  onCreateMessage,
  onUpdateChatRoom,
} from "../../graphql/subscriptions";
import { Feather } from "@expo/vector-icons";

const ChatScreen = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  const route = useRoute();
  const navigation = useNavigation();

  const chatroomID = route.params.id;

  // fetch Chat Room
  useEffect(() => {
    API.graphql(graphqlOperation(getChatRoom, { id: chatroomID })).then(
      (result) => setChatRoom(result.data?.getChatRoom)
    );

    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, { filter: { id: { eq: chatroomID } } })
    ).subscribe({
      next: ({ value }) => {
        setChatRoom((cr) => ({
          ...(cr || {}),
          ...value.data.onUpdateChatRoom,
        }));
      },
      error: (err) => console.warn(err),
    });

    return () => subscription.unsubscribe();
  }, [chatroomID]);

  // fetch Messages
  useEffect(() => {
    API.graphql(
      graphqlOperation(listMessagesByChatRoom, {
        chatroomID,
        sortDirection: "DESC",
      })
    ).then((result) => {
      setMessages(result.data?.listMessagesByChatRoom?.items);
    });

    // Subscribe to new messages
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage, {
        filter: { chatroomID: { eq: chatroomID } },
      })
    ).subscribe({
      next: ({ value }) => {
        setMessages((m) => [value.data.onCreateMessage, ...m]);
      },
      error: (err) => console.warn(err),
    });

    // Subscribe to new attachments
    const subscriptionAttachments = API.graphql(
      graphqlOperation(onCreateAttachment, {
        filter: { chatroomID: { eq: chatroomID } },
      })
    ).subscribe({
      next: ({ value }) => {
        const newAttachment = value.data.onCreateAttachment;
        setMessages((existingMessages) => {
          const messageToUpdate = existingMessages.find(
            (em) => em.id === newAttachment.messageID
          );
          if (!messageToUpdate) {
            return existingMessages;
          }
          if (!messageToUpdate?.Attachments?.items) {
            messageToUpdate.Attachments.items = [];
          }
          messageToUpdate.Attachments.items.push(newAttachment);

          return existingMessages.map((m) =>
            m.id === messageToUpdate.id ? messageToUpdate : m
          );
        });
      },
      error: (err) => console.warn(err),
    });

    return () => {
      subscription.unsubscribe();
      subscriptionAttachments.unsubscribe();
    };
  }, [chatroomID]);

  useEffect(() => {
    navigation.setOptions({
      title: route.params.name,
      headerRight: () => (
        <Feather
          onPress={() => navigation.navigate("Group Info", { id: chatroomID })}
          name="more-vertical"
          size={24}
          color="gray"
        />
      ),
    });
  }, [route.params.name, chatroomID]);

  if (!chatRoom) {
    return <ActivityIndicator />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 90}
      style={styles.bg}
    >
      <ImageBackground source={bg} style={styles.bg}>
        <FlatList
          data={messages}
          renderItem={({ item }) => <Message message={item} />}
          style={styles.list}
          inverted
        />
        <InputBox chatroom={chatRoom} />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  list: {
    padding: 10,
  },
});

export default ChatScreen;
