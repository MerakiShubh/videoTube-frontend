import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./utils/store.js";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Provider>
);
