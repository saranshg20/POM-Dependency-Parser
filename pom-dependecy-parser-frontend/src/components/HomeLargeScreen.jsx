import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import CardLg from "./CardLg";
import TextArea from "./TextArea";

function HomeLargeScreen(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const [rerender, setRerender] = useState(false);
    const [repoData, setRepoData] = useState();
    const [textareaText, setTextArea] = useState("");
    const navigate = useNavigate();
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    async function getUserData() {
        await fetch(backend_url + "/getUserData", {
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
                setUserData(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async function getRepositories() {
        await fetch(backend_url + "/repositories", {
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
                const values = Object.values(data);
                values.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );

                setRepoData(values);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async function getDependencies(repoIdx) {
        try {
            const repoName = repoData[repoIdx].name;
            const user = userData.login;
    
            if (
                localStorage.getItem("accessToken") === undefined ||
                localStorage.getItem("accessToken") === null
            ) {
                logoutUser();
            }
    
            await fetch(backend_url + "/getPOMDependencies", {
                method: "POST",
                credentials: "include",
                headers: {
                    'Authorization': "Bearer " + localStorage.getItem("accessToken"),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'user':user, 'repo': repoName })
            })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setTextArea(JSON.stringify(data));
            })
            .catch((error) => {
                console.log(error);
            });
    
        } catch (error) {
            console.log(error);
        }
    }

    function logoutUser() {
        try {
            if (localStorage.getItem("accessToken") != null) {
                localStorage.clear();
            }
            navigate("/login");
        } catch (error) {
            console.error("Error while logging-out. Please retry.", error);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        getUserData();
        getRepositories();
        // setRerender(!rerender);
        setIsLoading(false);
    }, []);

    return (
        <>
            {isLoading ? <Loader /> : null}

            <div className="flex-col p-8">
                <div className="flex justify-between mb-4">
                    <div className="text-3xl font-light">
                        POM Dependency Parser
                    </div>
                    <div
                        className="cursor-pointer text-center pr-16 text-gray-600"
                        onClick={logoutUser}
                    >
                        <span className="hover:underline">Logout</span>
                    </div>
                </div>
                <div>
                    <hr />
                </div>
                <div className="p-4 text-2xl text-center mt-4 mb-4 font-light">
                    {userData.name !== undefined
                        ? `Welcome ${userData.name}!!`
                        : null}
                </div>
                <div className="flex justify-center">
                    <TextArea isSmallScreen={false} width="w-1/2" content={textareaText} />
                    {console.log("TextArea updated")}
                </div>
                <div className="flex-col">
                    {repoData !== undefined && repoData !== null ? (
                        Object.values(repoData).map((value, index) => (
                            <div key={index} className="flex justify-center">
                                <CardLg
                                    isSmallScreen={false}
                                    RepoId={index}
                                    RepoName={value.name}
                                    RepoURL={value.html_url}
                                    getDependencies={getDependencies}
                                />
                            </div>
                        ))
                    ) : (
                        <Loader />
                    )}
                </div>
            </div>
        </>
    );
}

export default HomeLargeScreen;
