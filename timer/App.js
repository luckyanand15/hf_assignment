import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import HomeScreen from "./Screens/HomeScreen";
import History from "./Screens/History";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AddTimer from "./components/AddTimer";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  const [timerData, setTimerData] = useState([]);

  useEffect(() => {
    const loadTimers = async () => {
      try {
        const savedTimers = await AsyncStorage.getItem("timers");
        if (savedTimers) {
          setTimerData(JSON.parse(savedTimers));
        }
      } catch (error) {
        console.error("Failed to load timers:", error);
      }
    };
    loadTimers();
  }, []);

  useEffect(() => {
    const saveTimers = async () => {
      try {
        await AsyncStorage.setItem("timers", JSON.stringify(timerData));
      } catch (error) {
        console.error("Failed to save timers:", error);
      }
    };
    saveTimers();
  }, [timerData]);
  
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" options={{ headerShown: false }}>
        {(props) => (
          <HomeScreen
            {...props}
            timerData={timerData}
            setTimerData={setTimerData}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AddTimer">
        {(props) => (
          <AddTimer
            {...props}
            timerData={timerData}
            setTimerData={setTimerData}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="History" component={History} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
