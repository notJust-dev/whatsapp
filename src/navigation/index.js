import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ChatScreen from "../screens/ChatScreen/ChatScreen";
import ContactsScreen from "../screens/ContactsScreen";
import GroupInfoScreen from "../screens/GroupInfoScreen";
import NewGroupScreen from "../screens/NewGroupScreen";
import AddContactsToGroupScreen from "../screens/AddContactsToGroupScreen";
import MainTabNavigator from "./MainTabNavigator";

const Stack = createNativeStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerStyle: { backgroundColor: "whitesmoke" } }}
      >
        <Stack.Screen
          name="Home"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Group Info" component={GroupInfoScreen} />
        <Stack.Screen name="Contacts" component={ContactsScreen} />
        <Stack.Screen name="New Group" component={NewGroupScreen} />
        <Stack.Screen
          name="Add Contacts"
          component={AddContactsToGroupScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
