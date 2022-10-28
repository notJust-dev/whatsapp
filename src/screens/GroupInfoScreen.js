import { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";

import { API, graphqlOperation } from "aws-amplify";
import { onUpdateChatRoom } from "../graphql/subscriptions";
import ContactListItem from "../components/ContactListItem";

const ChatRoomInfo = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const route = useRoute();

  const chatroomID = route.params.id;

  useEffect(() => {
    API.graphql(graphqlOperation(getChatRoom, { id: chatroomID })).then(
      (result) => {
        setChatRoom(result.data?.getChatRoom);
      }
    );
    // Subscribe to onUpdateChatRoom
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, {
        filter: { id: { eq: chatroomID } },
      })
    ).subscribe({
      next: ({ value }) => {
        setChatRoom((cr) => ({
          ...(cr || {}),
          ...value.data.onUpdateChatRoom,
        }));
      },
      error: (error) => console.warn(error),
    });

    // Stop receiving data updates from the subscription
    return () => subscription.unsubscribe();
  }, [chatroomID]);

  const onContactPress = (userChatRoom) => {
    Alert.alert(
      "Removing from group",
      `Are you sure you want to remove ${userChatRoom.user.name} from this group?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            console.log("deleted");
          },
        },
      ]
    );
  };

  if (!chatRoom) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Group name</Text>

      <Text style={styles.sectionTitle}>
        {chatRoom.users.items.length} Participants
      </Text>
      <View style={styles.section}>
        <FlatList
          data={chatRoom.users.items}
          renderItem={({ item }) => (
            <ContactListItem
              user={item.user}
              onPress={() => onContactPress(item)}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 5,
    marginVertical: 10,
  },
});

export const getChatRoom = /* GraphQL */ `
  query GetChatRoom($id: ID!) {
    getChatRoom(id: $id) {
      id
      updatedAt
      users {
        items {
          id
          chatRoomID
          userID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          user {
            id
            name
            status
            image
          }
        }
        nextToken
        startedAt
      }
      createdAt
      _version
      _deleted
      _lastChangedAt
      chatRoomLastMessageId
    }
  }
`;

export default ChatRoomInfo;
