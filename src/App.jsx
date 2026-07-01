import { HashRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./Components/MainLayout/MainLayout"

import NotFound from "./Components/Notfound/Notfound";

import "./App.css"

import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup"
import Dashboard from "./Components/Dashboard/Dashboard";
import AdminDashboard from "./Components/Admindashboard/Admindashboard";
import ScrollToTop from "./Components/ScrollToTop"
import Capabilities from "./Components/Capabilities/Capabilities";
import Contact from "./Components/Contact/Contact";
import Sequence from "./Components/Sequence/Sequence";
import Network from "./Components/Network/Network";


function App() {
  return (
    <HashRouter>
      <ScrollToTop/>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/capabilities" element={<Capabilities />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sequence" element={<Sequence />} />
          <Route path="/network" element={<Network />} />



          
        </Route>
       

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup/>} />
        <Route path="/user-dashboard" element={<Dashboard/>} />
        <Route path="/admin-dashboard" element={<AdminDashboard/>} />



        {/* Any route not defined above will show 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

export default App;