import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import TextArea from "./TextArea";
import CardLg from "./CardLg";
import { useNavigate } from "react-router-dom";

function HomeSmallScreen(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const [textareaText, setTextArea] = useState("");
    const [repoData, setRepoData] = useState();
    const [rerender, setRerender] = useState(false);
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
        setIsLoading(true);
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
        setIsLoading(false);
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
        const isAuthenticated = localStorage.getItem('accessToken') !== null;
        if(!isAuthenticated){
            alert("Please authenticate to get access!");
            navigate('/login');
        }
        setIsLoading(true);
        getUserData();
        getRepositories();
        // setRerender(!rerender);
        setIsLoading(false);
    }, []);


    return (
        <>
        {isLoading ? <Loader /> : null}

        <div className="flex-col p-4">
            <div className="flex justify-between items-center">
                <div className="text-2xl font-light">
                    POM Dependency Parser
                </div>
                <div className="relative p-4">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="focus:outline-none"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    ></path>
                                </svg>
                            </button>

                            {isOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg">
                                    <ul className="py-1">
                                        <li>
                                            <a
                                                onClick={logoutUser}
                                                href=""
                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                            >
                                                Logout
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
            </div>
            <div>
                <hr />
            </div>
            <div className="p-4 text-xl text-center mt-4 mb-4 font-light">
                {userData.name !== undefined
                    ? `Welcome ${userData.name}!!`
                    : null}
            </div>
            <div className="flex justify-center">
                <TextArea isSmallScreen={true} width="w-4/5" content={textareaText} />
            </div>
            <div className="flex-col">
                {repoData !== undefined && repoData !== null ? (
                    Object.values(repoData).map((value, index) => (
                        <div key={index} className="flex justify-center">
                            <CardLg
                                isSmallScreen={true}
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

export default HomeSmallScreen;

