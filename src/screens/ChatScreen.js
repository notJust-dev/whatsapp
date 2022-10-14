import { ImageBackground, StyleSheet, FlatList, KeyboardAvoidingView } from 'react-native';
import Message from '../components/Message';
import InputBox from '../components/InputBox';

import bg from '../../assets/images/BG.png';
import messages from '../../assets/data/messages.json';

const ChatScreen = () => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.bg}>
      <ImageBackground source={bg} style={styles.bg}>
        <FlatList
          data={messages}
          renderItem={({ item }) => <Message message={item} />}
          style={styles.list}
          inverted
        />
        <InputBox />
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
