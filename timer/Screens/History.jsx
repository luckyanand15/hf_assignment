import React, { useEffect, useState } from "react";
import { View, Text, SectionList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormatTime from "../components/FormatTime";

const History = () => {
  const [historyTimers, setHistoryTimers] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const history = JSON.parse(await AsyncStorage.getItem("history")) || [];
      setHistoryTimers(history);
    };

    fetchHistory();
  }, []);

  const groupedHistory = historyTimers.reduce((acc, timer) => {
    if (!acc[timer.category]) {
      acc[timer.category] = [];
    }
    acc[timer.category].push(timer);
    return acc;
  }, {});

  const sections = Object.keys(groupedHistory).map((category) => ({
    title: category,
    data: groupedHistory[category],
  }));

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.name + index}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.categoryText}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.timerItem}>
            <Text>Name: {item.name}</Text>
            <Text>
              Duration:{" "}
              <FormatTime
                time={item.hours * 3600 + item.minutes * 60 + item.seconds}
              />
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryText: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginVertical: 5,
    padding:10
   },
  timerItem: { 
    padding: 10, 
    borderBottomWidth: 1 
  },
});

export default History;
