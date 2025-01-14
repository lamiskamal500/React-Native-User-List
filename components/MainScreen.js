import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Axios from "axios";
import UserCard from "./UserCard";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUsers, initializeUsers } from "../store/slices/usersSlice";

const MainScreen = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.data);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const cachedUsers = await AsyncStorage.getItem("users");
        if (cachedUsers) {
          dispatch(initializeUsers(JSON.parse(cachedUsers)));
        } else {
          const response = await Axios.get(
            "https://jsonplaceholder.typicode.com/users"
          );
          const data = response.data;
          dispatch(setUsers(data));
          await AsyncStorage.setItem("users", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Users List</Text>
          <TextInput
            style={styles.searchBar}
            placeholder="Search by name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <UserCard
                key={item.id}
                name={item.name}
                email={item.email}
                address={`${item.address.street}, ${item.address.city}, ${item.address.zipcode}`}
              />
            )}
          />
        </View>
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginBottom: 8,
  },
  userText: {
    fontSize: 18,
    marginVertical: 4,
  },
});
