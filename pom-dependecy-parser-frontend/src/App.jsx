import "./App.css";
import { useEffect, useState } from "react";

function App() {
    const [rerender, setRerender] = useState(false);

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
                    });
            }

            getAccessToken();
        }
    }, []);

    async function getUserData() {
        await fetch("http://localhost:4000/getUserData", {
            method: "GET",
            credentials: 'include',
            headers: {
                Authorization: "Bearer " + localStorage.getItem('accessToken')
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
            });
    }

    function logout() {
      if(localStorage.getItem("accessToken")!==null){
        localStorage.removeItem("accessToken");
        setRerender(!rerender);
      }
    }

    return (
        <>
            <div className="flex justify-center items-center h-screen">
                {localStorage.getItem("accessToken") ? (
                  <div>

                    <div
                        className="bg-slate-700 text-white p-4 m-4 rounded-md"
                        onClick={getUserData}
                        >
                        Get user data
                    </div>
                    <div
                        className="bg-slate-700 text-white p-4 text-center rounded-md"
                        onClick={logout}
                        >Logout</div>
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
