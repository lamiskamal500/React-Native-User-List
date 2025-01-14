import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  setUsers,
  addUsers,
  initializeUsers,
} from "../store/slices/usersSlice";
import Axios from "axios";
import UserCard from "./UserCard";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MainScreen = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.data);
  const [loadingState, setLoadingState] = useState("idle"); // Can be 'idle', 'loading', 'loadMoreLoading'
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 4;

  const loadData = async (isLoadMore = false) => {
    setLoadingState(isLoadMore ? "loadMoreLoading" : "loading");
    try {
      const start = isLoadMore ? page * limit : 0;
      const response = await Axios.get(
        `https://jsonplaceholder.typicode.com/users?_start=${start}&_limit=${limit}`
      );
      const newUsers = response.data;

      if (isLoadMore) {
        dispatch(addUsers(newUsers));
        setPage(page + 1);
      } else {
        dispatch(setUsers(newUsers));
        await AsyncStorage.setItem("users", JSON.stringify(newUsers));
      }
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoadingState("idle");
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const cachedUsers = await AsyncStorage.getItem("users");
      if (cachedUsers) {
        dispatch(initializeUsers(JSON.parse(cachedUsers)));
      } else {
        loadData();
      }
    };

    fetchInitialData();
  }, [dispatch]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {loadingState === "loading" ? (
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
            ListFooterComponent={
              loadingState === "loadMoreLoading" ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : filteredUsers.length >= limit * page ? (
                <TouchableOpacity
                  style={styles.loadMoreButton}
                  onPress={() => loadData(true)}
                >
                  <Text style={styles.loadMoreText}>Load More</Text>
                </TouchableOpacity>
              ) : null
            }
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
  loadMoreButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
