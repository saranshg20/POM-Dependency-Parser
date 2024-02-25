import { useState, useEffect } from "react";
import Loader from "./Loader";
import HomeSmallScreen from "./HomeSmallScreen";
import { Routes, useNavigate } from "react-router-dom";

function Login() {
    const CLIENT_ID = "eaeda082a6cb9bc7e434";
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
                await fetch(
                    "http://localhost:4000/getAccessToken?code=" + code,
                    {
                        method: "GET",
                    }
                )
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        console.log(data);
                        if (data.access_token) {
                            localStorage.setItem(
                                "accessToken",
                                data.access_token
                            );
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
            getAccessToken();
            setIsLoading(false);
            navigate("/home");
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
                <div className="p-16 font-light">
                    Welcome to our web application, a one-stop solution for all
                    your project object model (POM) related dependencies. This
                    application is designed to simplify and streamline your
                    development process by providing an easy-to-use interface
                    for managing your project's dependencies. 
                    <br />
                    Our application
                    integrates with GitHub for user authentication, ensuring a
                    secure and seamless login experience. By using your GitHub
                    account, you can access and manage your project's
                    dependencies directly from our application.
                </div>
                <div className="text-center">
                    <button className="bg-slate-800 p-3 rounded-md shadow-lg text-white" onClick={loginWithGithub}>
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

export default Login;
