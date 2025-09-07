import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Requests from "./pages/Requests";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/requests" element={<Requests />} />
    </Routes>
  );
};

export default App;
