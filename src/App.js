import { Routes, Route } from "react-router-dom";
import Home from "./pages/public/home";
import Login from "./pages/public/login";
import SignUp from "./pages/public/signup";
import DashBoard from "./pages/user/dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup/:encodedData?" element={<SignUp />} />
      <Route path="/auth/dashboard" element={<DashBoard />} />
    </Routes>
  );
}

export default App;
