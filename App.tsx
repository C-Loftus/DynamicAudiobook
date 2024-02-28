import { useRef, useState } from "react";
import { View, StyleSheet, Button, Platform, PanResponder } from "react-native";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import WikiSearch from "./wiki";

export default function App() {
  const [textToSpeak, setTextToSpeak] = useState("");
  const [speechRate, setSpeechRate] = useState(1.0);
  const [paused, setPaused] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          setSpeechRate((prevRate) => Math.max(0.5, prevRate - 0.1));
        } else if (gestureState.dy < 0) {
          setSpeechRate((prevRate) => Math.min(2.0, prevRate + 0.1));
        }
      },
    })
  ).current;

  const speak = async () => {
    if (Platform.OS === "ios") {
      Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    }

    if ((await Speech.isSpeakingAsync()) && !paused) {
      Speech.pause();
      setPaused(true);
    } else if ((await Speech.isSpeakingAsync()) && paused) {
      Speech.resume();
      setPaused(false);
    } else {
      Speech.speak(textToSpeak, { rate: speechRate });
    }
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Button title="Press to hear some words" onPress={speak} />
      <WikiSearch onResult={setTextToSpeak} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
    padding: 8,
  },
  // make the text white
  text: {
    color: "white",
  },
  // make textinput white
  input: {
    color: "white",
  },
});
