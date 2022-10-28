import React, { useState, useEffect } from "react";
import { FlatList, View, Text, Pressable } from "react-native";
import ContactListItem from "../components/ContactListItem";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listUsers } from "../graphql/queries";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createChatRoom, createUserChatRoom } from "../graphql/mutations";
import { getCommonChatRoomWithUser } from "../services/chatRoomService";

const ContactsScreen = () => {
  const [users, setUsers] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    API.graphql(graphqlOperation(listUsers)).then((result) => {
      setUsers(result.data?.listUsers?.items);
    });
  }, []);

  const onPress = async (user) => {
    // Check if we already have a ChatRoom with user
    const existingChatRoom = await getCommonChatRoomWithUser(user.id);
    if (existingChatRoom) {
      navigation.navigate("Chat", { id: existingChatRoom.id });
      return;
    }

    // Create a new Chatroom
    const newChatRoomData = await API.graphql(
      graphqlOperation(createChatRoom, { input: {} })
    );
    console.log(newChatRoomData);
    if (!newChatRoomData.data?.createChatRoom) {
      console.log("Error creating the chat error");
    }
    const newChatRoom = newChatRoomData.data?.createChatRoom;

    // Add the clicked user to the ChatRoom
    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: { chatRoomID: newChatRoom.id, userID: user.id },
      })
    );

    // Add the auth user to the ChatRoom
    const authUser = await Auth.currentAuthenticatedUser();
    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: { chatRoomID: newChatRoom.id, userID: authUser.attributes.sub },
      })
    );

    // navigate to the newly created ChatRoom
    navigation.navigate("Chat", { id: newChatRoom.id });
  };

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => (
        <ContactListItem user={item} onPress={() => onPress(item)} />
      )}
      style={{ backgroundColor: "white" }}
      ListHeaderComponent={() => (
        <Pressable
          onPress={() => navigation.navigate("New Group")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 15,
            paddingHorizontal: 20,
          }}
        >
          <MaterialIcons
            name="group"
            size={24}
            color="royalblue"
            style={{
              marginRight: 20,
              backgroundColor: "gainsboro",
              padding: 7,
              borderRadius: 20,
              overflow: "hidden",
            }}
          />
          <Text style={{ color: "royalblue", fontSize: 16 }}>New Group</Text>
        </Pressable>
      )}
    />
  );
};

export default ContactsScreen;
