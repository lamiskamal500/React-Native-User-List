import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

const UserCard = ({ name, email, address }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Ionicons name="at-outline" size={18} color="#5c5c5c" />
        <Text style={styles.info}>{email}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Ionicons name="location-outline" size={18} color="#5c5c5c" />
        <Text style={styles.info}>{address}</Text>
      </View>
    </View>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  container: {
    gap: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e2e2e",
  },
  info: {
    fontSize: 12.5,
    color: "#5c5c5c",
  },
});
