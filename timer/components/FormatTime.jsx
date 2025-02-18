import React from "react";
import { View, Text, StyleSheet } from "react-native";

const FormatTime = ({ time }) => {
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View>
      <Text style={styles.timerText}>Remaining Time: {formatTime(time)}s</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timerText: {
    fontSize: 16,
  },
});

export default FormatTime;
