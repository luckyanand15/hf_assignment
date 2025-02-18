import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddTimer({ navigation, timerData, setTimerData }) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSesconds] = useState(0);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  const handleHoursChange = (hrs) => {
    const numericHrs = Number(hrs);
    setHours(numericHrs);
    if (hrs.length === 2) {
      minuteRef.current.focus();
    }
  };

  const handleMinutesChange = (mins) => {
    const numericMins = Number(mins);
    setMinutes(numericMins);
    if (mins.length === 2) {
      secondRef.current.focus();
    }
  };

  const handleSecondsChange = (secs) => {
    setSesconds(secs);
  };

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleCategoryChange = (text) => {
    setCategory(text);
  };

  const handleButton = async() => {
    console.log(`Button Clicked`);
    if (!name.trim()) {
      alert("Please enter a name!");
      return;
    }
    if (!category.trim()) {
      alert("Please enter a category!");
      return;
    }
    if (seconds == 0) {
      alert("Set Minimum duration of 1 Second");
      return;
    }
    const formData = {
      name,
      category,
      hours,
      minutes,
      seconds,
    };

    const updatedTimers = [...timerData, formData];
    setTimerData(updatedTimers);

    try {
      await AsyncStorage.setItem("timers", JSON.stringify(updatedTimers));
    } catch (error) {
      console.error("Failed to save timer:", error);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Add Timer</Text>

      <View>
        <Text style={styles.subheadingText}>Name:</Text>
        <TextInput
          style={styles.inputName}
          placeholder="Enter Name"
          value={name}
          onChangeText={handleNameChange}
        />
      </View>

      <View>
        <Text style={styles.subheadingText}>Set Duration</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Hours"
            value={hours}
            onChangeText={handleHoursChange}
            maxLength={2}
          />
          <TextInput
            ref={minuteRef}
            style={styles.input}
            keyboardType="numeric"
            placeholder="Minutes"
            value={minutes}
            onChangeText={handleMinutesChange}
            maxLength={2}
          />
          <TextInput
            ref={secondRef}
            style={styles.input}
            keyboardType="numeric"
            placeholder="Seconds"
            value={seconds}
            onChangeText={handleSecondsChange}
            maxLength={2}
          />
        </View>
      </View>

      <View>
        <Text style={styles.subheadingText}>Category</Text>
        <TextInput
          style={styles.inputName}
          placeholder="Enter Category"
          value={category}
          onChangeText={handleCategoryChange}
        />
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={handleButton}>
        <Text style={styles.btnText}>Add Timer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headingText: {
    fontSize: 60,
  },

  subheadingText: {
    fontSize: 20,
  },

  inputContainer: {
    flexDirection: "row",
  },

  input: {
    borderWidth: 1,
    borderRadius: 5,
    width: 80,
    textAlign: "center",
    textAlignVertical: "center",
    marginHorizontal: 5,
  },

  inputName: {
    borderWidth: 1,
    width: 260,
    padding: "3%",
  },
  addBtn: {
    backgroundColor: "blue",
    paddingHorizontal: 99,
    marginTop: 10,
    padding: 10,
  },
  btnText: {
    color: "white",
  },
});
