import React, { useState } from "react";
import Loader from "./Loader";
import DialogBox from "./DialogBox";
import Card from "./Card";
import { useNavigate } from "react-router-dom";

function HomeSmallScreen(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const [dialogBox, setDialogBox] = useState(false);
    let repo_data = null;
    const navigate = useNavigate();
    const backend_url = "http://localhost:4000";

    function popUpDialogBox() {
        try {
            setDialogBox(true);
        } catch (error) {
            console.log(error);
        }
    }

    async function getUserData() {
        setIsLoading(true);
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
                console.log(data);
                setUserData(data);
            })
            .catch((error) => {
                console.log(error);
            });
        setIsLoading(false);
    }

    async function getRepositories() {
        setIsLoading(true);
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
                console.log(data);
                repo_data = data;
            })
            .catch((error) => {
                console.log(error);
            });
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

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                null
            )}
                <div className="flex-col">
                    <div className="flex justify-between items-center">
                        <div className="text-xl font-bold p-6 text-slate-800">
                            POM-Dependency Parser
                        </div>
                        <div className="relative p-6">
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
                </div>
            {dialogBox ? (
                <div className="">
                    <DialogBox setDialogBox={setDialogBox} />
                </div>
            ) : null}
            <div>
                <div onClick={() => popUpDialogBox()}>
                    <Card />
                </div>
                <div onClick={() => popUpDialogBox()}>
                    <Card />
                </div>
                <div onClick={() => popUpDialogBox()}>
                    <Card />
                </div>
            </div>
        </>
    );
}

export default HomeSmallScreen;
