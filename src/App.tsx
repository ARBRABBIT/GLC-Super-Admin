import { Provider } from "react-redux";
import { store } from "./app/store/store";
import { AppRouter } from "./app/router/AppRouter";
import { NotificationHandler } from "./core/firebase/NotificationHandler";
import { Toaster } from "sonner";
function App() {
  return (
    <Provider store={store}>
      {" "}
      <NotificationHandler /> <AppRouter />
      <Toaster richColors position="top-right" />
    </Provider>
  );
}

export default App;
