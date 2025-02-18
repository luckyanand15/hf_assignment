import {
  StyleSheet,
  View,
  Text,
  Button,
  SectionList,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import FormatTime from "../components/FormatTime";
import ModalComponent from "../components/ModalComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation, timerData, setTimerData }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [timers, setTimers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [completedTimerName, setCompletedTimerName] = useState("");

  useEffect(() => {
    const loadTimers = async () => {
      try {
        const savedTimers = await AsyncStorage.getItem("timers");
        if (savedTimers) {
          setTimers(JSON.parse(savedTimers));
        }
      } catch (error) {
        console.error("Failed to load timers:", error);
      }
    };
    loadTimers();
  }, []);

  useEffect(() => {
    const updatedTimers = timerData.map((timer) => {
      const totalSeconds =
        (parseInt(timer.hours, 10) || 0) * 3600 +
        (parseInt(timer.minutes, 10) || 0) * 60 +
        (parseInt(timer.seconds, 10) || 0);
      return {
        ...timer,
        remainingTime: totalSeconds,
        status: "Paused",
        intervalId: null,
      };
    });
    setTimers(updatedTimers);
  }, [timerData]);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const startTimer = (index) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer, i) => {
        if (i === index && timer.remainingTime > 0 && !timer.intervalId) {
          const intervalId = setInterval(async () => {
            setTimers((prevTimers) =>
              prevTimers.map((t, j) => {
                if (j === index) {
                  const newTime = t.remainingTime - 1;
                  if (newTime <= 0) {
                    clearInterval(t.intervalId);
                    setCompletedTimerName(t.name);
                    setModalVisible(true);
                    moveTimerToHistory(t);
                    return {
                      ...t,
                      remainingTime: 0,
                      status: "Completed",
                      intervalId: null,
                    };
                  }
                  return { ...t, remainingTime: newTime };
                }
                return t;
              })
            );
          }, 1000);
          return { ...timer, status: "Running", intervalId };
        }
        return timer;
      })
    );
  };

  const moveTimerToHistory = async (completedTimer) => {
    try {
      const historyTimers = JSON.parse(await AsyncStorage.getItem("history")) || [];
      const updatedHistory = [...historyTimers, completedTimer];
      await AsyncStorage.setItem("history", JSON.stringify(updatedHistory));
      setTimers((prevTimers) => prevTimers.filter((t) => t.name !== completedTimer.name));
    } catch (error) {
      console.error("Error saving history:", error);
    }
  };

  const pauseTimer = (index) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer, i) => {
        if (i === index && timer.intervalId) {
          clearInterval(timer.intervalId);
          return { ...timer, status: "Paused", intervalId: null };
        }
        return timer;
      })
    );
  };

  const resetTimer = (index) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer, i) => {
        if (i === index) {
          clearInterval(timer.intervalId);
          const totalSeconds =
            (parseInt(timer.hours, 10) || 0) * 3600 +
            (parseInt(timer.minutes, 10) || 0) * 60 +
            (parseInt(timer.seconds, 10) || 0);
          return {
            ...timer,
            remainingTime: totalSeconds,
            status: "Paused",
            intervalId: null,
          };
        }
        return timer;
      })
    );
  };

  const groupedTimers = timers.reduce((acc, timer) => {
    if (!acc[timer.category]) {
      acc[timer.category] = [];
    }
    acc[timer.category].push(timer);
    return acc;
  }, {});

  const sections = Object.keys(groupedTimers).map((category) => ({
    title: category,
    data: groupedTimers[category],
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.headingText}>Timers</Text>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.name + index}
        renderSectionHeader={({ section: { title } }) => (
          <TouchableOpacity
            style={styles.categoryHeader}
            onPress={() => toggleCategory(title)}
          >
            <Text style={styles.categoryText}>{title}</Text>
          </TouchableOpacity>
        )}
        renderItem={({ item, index, section }) =>
          expandedCategories[section.title] ? (
            <View style={styles.timerItem}>
              <Text style={styles.timerText}>Name: {item.name}</Text>
              <Text>
                <FormatTime time={item.remainingTime} />
              </Text>
              <Text style={styles.timerText}>Status: {item.status}</Text>

              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${
                        (item.remainingTime /
                          ((parseInt(item.hours, 10) || 0) * 3600 +
                            (parseInt(item.minutes, 10) || 0) * 60 +
                            (parseInt(item.seconds, 10) || 0))) *
                        100
                      }%`,
                    },
                  ]}
                />
              </View>

              <Text style={styles.timerText}>
                {Math.round(
                  (item.remainingTime /
                    ((parseInt(item.hours, 10) || 0) * 3600 +
                      (parseInt(item.minutes, 10) || 0) * 60 +
                      (parseInt(item.seconds, 10) || 0))) *
                    100
                )}
                % Remaining
              </Text>

              <View style={styles.buttonContainer}>
                <Button
                  title="Start"
                  onPress={() => startTimer(index)}
                  disabled={
                    item.status === "Running" || item.status === "Completed"
                  }
                />
                <Button
                  title="Pause"
                  onPress={() => pauseTimer(index)}
                  disabled={item.status !== "Running"}
                />
                <Button title="Reset" onPress={() => resetTimer(index)} />
              </View>
            </View>
          ) : null
        }
      />

      <View style={styles.btn}>
        <Button
          title="Set New Timer"
          onPress={() => navigation.navigate("AddTimer")}
        />
      </View>
      <ModalComponent
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        timerName={completedTimerName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headingText: {
    fontSize: 30,
  },
  btn: {
    flex: 1,
    justifyContent: "flex-end",
  },
  categoryHeader: {
    padding: 15,
    marginVertical: 5,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 16,
  },
  timerItem: {
    padding: 15,
  },
  timerText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  progressBarContainer: {
    height: 10,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginTop: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "green",
    borderRadius: 5,
  },
});

export default HomeScreen;
