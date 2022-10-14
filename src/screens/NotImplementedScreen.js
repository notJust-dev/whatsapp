// src/screens/NotImplementedScreen.js

import { View, Text, Image, StyleSheet } from 'react-native';

const NotImplementedScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Not Implemented!</Text>
      <Image
        source={{
          uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/capybara+copy.png',
        }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    color: 'gray',
  },
  image: {
    width: '80%',
    aspectRatio: 2 / 1,
  },
});

export default NotImplementedScreen;
