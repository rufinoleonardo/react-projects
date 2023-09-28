import { BrowserRouter } from "react-router-dom";
import RouterApp from "./routes/index.jsx";
import "./app.css";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import AuthProvider from "./contexts/auth.jsx";

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <ToastContainer autoClose={3000} />
          <RouterApp />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
