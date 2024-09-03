import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import AdminLogin from "./components/AdminLogin";
import StudentSignup from "./components/StudentSignup";
import StudentLogin from "./components/StudentLogin";
import MyProfile from "./components/MyProfile";
import MyPerformance from "./components/MyPerformance";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/student-signup" element={<StudentSignup />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-performance" element={<MyPerformance />} />
      </Routes>
    </Router>
  );
}

export default App;
