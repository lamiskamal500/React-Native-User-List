import store from "./store/store";
import { Provider } from "react-redux";
import MainScreen from "./components/MainScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <MainScreen />
      </Provider>
    </SafeAreaProvider>
  );
}
