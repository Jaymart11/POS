import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ConfigProvider, theme } from "antd";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const { darkAlgorithm } = theme;

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          algorithm: darkAlgorithm,
          token: {
            colorPrimary: "rgb(245, 199, 17)",
          },
          components: {
            Segmented: {
              itemSelectedBg: "rgb(245, 199, 17)",
              itemSelectedColor: "black",
            },
            Button: {
              primaryColor: "black",
            },
            Menu: {
              darkItemSelectedColor: "black",
              darkItemBg: "#1d1d1d",
              darkSubMenuItemBg: "#1d1d1d",
            },
            Layout: {
              siderBg: "#1d1d1d",
              triggerBg: "#1d1d1d",
            },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </QueryClientProvider>
  // </React.StrictMode>
);
