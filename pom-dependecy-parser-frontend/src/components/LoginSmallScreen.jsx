import { useState, useEffect } from "react";
import Loader from "./Loader";
import HomeSmallScreen from "./HomeSmallScreen";
import { Routes, useNavigate } from "react-router-dom";

function LoginLargeScreen() {
    const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    async function loginWithGithub() {
        window.location.assign(
            "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
        );
    }

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const code = urlParams.get("code");

        if (localStorage.getItem("accessToken") !== null) {
            console.log("Navigating to /home");
            navigate("/home");
        } else if (code && localStorage.getItem("accessToken") === null) {
            setIsLoading(true);
            async function getAccessToken() {
                try {
                    const response = await fetch(
                        import.meta.env.VITE_BACKEND_URL +
                            "getAccessToken?code=" +
                            code,
                        {
                            method: "GET",
                        }
                    );

                    const data = await response.json();
                    console.log(data);

                    if (data.access_token) {
                        localStorage.setItem("accessToken", data.access_token);
                    }
                    navigate("/home");
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            }

            // Call the async function
            getAccessToken();
        }
    }, []);

    return (
        <>
            {isLoading ? <Loader /> : null}
            <div className="flex-col">
                <div className="flex justify-between p-8">
                    <div className="text-2xl font-light">
                        POM Dependency Parser
                    </div>
                </div>
                <hr />
                <div className="p-16 font-light">
                    <span className="text-lg font-medium">Welcome</span> to our
                    web application, a one-stop solution for all your project
                    object model (POM) related dependencies. This application is
                    designed to simplify and streamline your development process
                    by providing an easy-to-use interface for managing your
                    project's dependencies.
                    <br />
                    Our application integrates with GitHub for user
                    authentication, ensuring a secure and seamless login
                    experience. By using your GitHub account, you can access and
                    manage your project's dependencies directly from our
                    application.
                </div>
                <div className="text-center mb-8">
                    <button
                        className="bg-slate-800 p-3 rounded-md shadow-lg text-white"
                        onClick={loginWithGithub}
                    >
                        <div className="flex">
                            <div className="mr-2">Connect with Github</div>
                            <img
                                width="30"
                                height="30"
                                src="https://img.icons8.com/ios-filled/50/FFFFFF/github.png"
                                alt="github"
                            />
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
}

export default LoginLargeScreen;
