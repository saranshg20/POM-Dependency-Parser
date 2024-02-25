import "./App.css";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import HomeSmallScreen from "./components/HomeSmallScreen";
import { useMediaQuery } from "react-responsive";
import ProtectedRoute from "./hoc/Protected_Route";
import HomeLargeScreen from "./components/HomeLargeScreen";

function App() {
    const isSmallScreen = useMediaQuery({ maxWidth: 576 });

    return (
        <Routes>
            <Route path="/login/*" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route
                path="/home"
                element={
                    isSmallScreen?
                        <HomeSmallScreen />: <HomeLargeScreen />
                }
            />
            {/* <Route
                path="/home"
                element={
                        <ProtectedRoute component={HomeSmallScreen} />
                }
            /> */}
        </Routes>
    );
}

export default App;
