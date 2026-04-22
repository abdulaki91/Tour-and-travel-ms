import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <div className="App">
              <AppRoutes />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  className: "toast-custom",
                  style: {
                    borderRadius: "1rem",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  },
                  success: {
                    duration: 3000,
                    style: {
                      background:
                        "linear-gradient(135deg, rgba(34, 197, 94, 0.95) 0%, rgba(22, 163, 74, 0.95) 100%)",
                      color: "#fff",
                    },
                    iconTheme: {
                      primary: "#fff",
                      secondary: "#22c55e",
                    },
                  },
                  error: {
                    duration: 5000,
                    style: {
                      background:
                        "linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)",
                      color: "#fff",
                    },
                    iconTheme: {
                      primary: "#fff",
                      secondary: "#ef4444",
                    },
                  },
                  loading: {
                    style: {
                      background:
                        "linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%)",
                      color: "#fff",
                    },
                    iconTheme: {
                      primary: "#fff",
                      secondary: "#3b82f6",
                    },
                  },
                }}
              />
            </div>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
