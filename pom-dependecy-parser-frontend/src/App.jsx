import "./App.css";
import { useEffect, useState } from "react";

function App() {
    const [rerender, setRerender] = useState(false);
    const [userData, setUserData] = useState({});


    const CLIENT_ID = "eaeda082a6cb9bc7e434";
    function loginWithGithub() {
        window.location.assign(
            "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
        );
        setRerender(!rerender);
    }

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const code = urlParams.get("code");

        if (code && localStorage.getItem("accessToken") === null) {
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
                            setRerender(!rerender);
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
            }

            getAccessToken();
        }
    }, []);

    async function getUserData() {
        await fetch("http://localhost:4000/getUserData", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setUserData(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async function getRepositories(){
        await fetch("http://localhost:4000/repositories", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async function getPOMDependencies(){
        await fetch("http://localhost:4000/getPOMFiles", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            body: JSON.stringify({
                user: "saranshg20",
                repo: "TEST",
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function logout() {
        if (localStorage.getItem("accessToken") !== null) {
            localStorage.removeItem("accessToken");
            setRerender(!rerender);
        }
    }

    return (
        <>
            <div className="flex justify-center items-center h-screen">
                {localStorage.getItem("accessToken") ? (
                    <div className="flex">
                        <div
                            className="bg-slate-700 text-white p-3 m-4 rounded-md"
                            onClick={getPOMDependencies}
                        >
                            Repos
                        </div>
                        <div
                            className="bg-slate-700 text-center text-white p-3 m-4 rounded-md"
                            onClick={logout}
                        >
                            Logout
                        </div>
                    </div>
                ) : (
                    <div
                        className="bg-slate-700 text-white p-4 m-4 rounded-md"
                        onClick={loginWithGithub}
                    >
                        Login with Github
                    </div>
                )}
            </div>
        </>
    );
}

export default App;
