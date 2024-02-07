import "./App.css";
import Login from "./Components/Login";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./Components/Signup";
import AdminPage from "./Components/AdminPage";
import UserDetails from "./Components/UserDetails";


function App() {

  return (
    <div className="body">

      {
       <BrowserRouter> 
          <Routes>
            <Route path = "/" element={<Signup />} />
            <Route path="/Login" element={<Login />} />
            <Route path = "/AdminPage" element = {<AdminPage />} />
            <Route path = "/AdminPage/:id" element = {<AdminPage />} />
            {<Route path = "/UserDetails" element = { <UserDetails /> } />}
            <Route path = "/UserDetails/:user_ID" element = { <UserDetails /> } />
            
          </Routes>
        </BrowserRouter>
      }
     
    </div>
  );
}
export default App;
