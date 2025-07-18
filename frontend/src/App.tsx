 import React, { type JSX } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import './App.css';


function App(): JSX.Element {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <div className="container">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/" element={<h1>Welcome to Task Manager!</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
