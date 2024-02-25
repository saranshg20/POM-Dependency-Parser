import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";

function ProtectedRoute({ component: Component, ...rest }) {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (localStorage.getItem("accessToken")) {
                setIsLoading(false);
            }
        }, 5000); // Wait for 5 seconds
        
        // Clear the timeout when the component unmounts
        return () => clearTimeout(timeoutId);
    }, []);

    if (isLoading) {
        console.log("E");
        return <Loader /> // Replace this with your loading component
    }

    if (!localStorage.getItem("accessToken")) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return <Component {...rest} />;
}

export default ProtectedRoute;
