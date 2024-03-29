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
                    <div className="text-3xl font-light">
                        POM Dependency Parser
                    </div>
                </div>
                <hr />
                <div className="p-16 font-light">
                    <span className="font-normal">Welcome</span> to our web
                    application, a comprehensive solution for parsing Project
                    Object Model (POM) dependencies. This tool is designed to
                    enhance and simplify your development workflow by offering a
                    user-friendly interface for handling your project's
                    dependencies.
                    <br />
                    To ensure a secure and seamless login experience, our
                    application seamlessly integrates with GitHub for user
                    authentication through OAuth 2.0. Once authenticated, users
                    are directed to the home page where they can explore all
                    their public repositories. From there, they can easily
                    select the repository of interest to retrieve and manage all
                    the POM dependencies associated with it.
                </div>
                <div className="text-center mb-8">
                    <button
                        className="bg-slate-800 p-2 hover:bg-slate-600 rounded-md shadow-lg text-white"
                        onClick={loginWithGithub}
                    >
                        <div className="flex items-center">
                            <div className="mr-0">Connect with Github</div>
                            <img
                                width="50"
                                height="50"
                                src="https://img.icons8.com/plasticine/100/github.png"
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
