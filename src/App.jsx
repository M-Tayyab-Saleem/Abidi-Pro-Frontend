import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/navbar";
import ThemeSelector from "./Pages/ThemeSelector";
import PeopleLayout from "./layout/PeopleLayout";
import Home from "./Pages/People/Home";
import TimeTracker from "./Pages/People/TimeTracker";
import Files from "./Pages/People/Files";
import Profile from "./Pages/People/profile";
import Login from "./Pages/login/Login";
import ForgotPass from "./Pages/login/ForgotPass";
import LeaveTracker from "./Pages/People/LeaveTracker";
import LeaveTrackerAdmin from "./Pages/People/LeaveTrackerAdmin";
import AuthLayout from "./layout/AuthLayout";

function App() {
  return (
<>
      <Routes>
        <Route path="/theme-selector" element={<ThemeSelector />} />
        <Route path="/auth" element={<AuthLayout/>}>
          <Route index path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPass/>} />
        </Route>
        <Route path="/people/*" element={<PeopleLayout />}>
          <Route index element={<Home />} />
          <Route path="timetracker" element={<TimeTracker />} />
          <Route path="files" element={<Files />} />
          <Route path ="profile" element={<Profile/>}/>
          <Route path ="leaveTracker" element={<LeaveTracker/>}/>
          <Route path ="leaveTrackerAdmin" element={<LeaveTrackerAdmin/>}/>
        </Route>
      </Routes>
      </>

  );
}

export default App;
