import "./App.css";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginLargeScreen from "./components/LoginLargeScreen";
import LoginSmallScreen from "./components/LoginSmallScreen";
import HomeSmallScreen from "./components/HomeSmallScreen";
import { useMediaQuery } from "react-responsive";
import ProtectedRoute from "./hoc/Protected_Route";
import HomeLargeScreen from "./components/HomeLargeScreen";

function App() {
    const isSmallScreen = useMediaQuery({ maxWidth: 576 });

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isSmallScreen ? <LoginSmallScreen /> : <LoginLargeScreen />
                }
            />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route
                path="/home"
                element={
                    isSmallScreen ? <HomeSmallScreen /> : <HomeLargeScreen />
                }
            />
        </Routes>
    );
}

export default App;
