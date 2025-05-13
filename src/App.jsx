import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/navbar";
import ThemeSelector from "./Pages/ThemeSelector";
import PeopleLayout from "./Layout/PeopleLayout";
import Home from "./Pages/People/Home";
import TimeTracker from "./Pages/People/TimeTracker";
import Files from "./Pages/People/files/Files";
import Profile from "./Pages/People/profile";
import Login from "./Pages/People/login/Login";
import ForgotPass from "./Pages/People/login/ForgotPass";
import EditProfile from "./Pages/People/EditProfile";
import ResetPassword from "./Pages/People/login/Resetpassword";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPass />} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/theme-selector" element={<ThemeSelector />} />
        <Route path="/people/*" element={<PeopleLayout />}>
          <Route index element={<Home />} />
          <Route path="timetracker" element={<TimeTracker />} />
          <Route path="files" element={<Files />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
