import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster 
        theme="dark" 
        toastOptions={{
          style: {
            background: "#141414",
            border: "1px solid #262626",
            color: "#e5e5e5",
          },
        }}
      />
    </>
  );
}
