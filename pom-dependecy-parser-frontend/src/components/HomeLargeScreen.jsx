import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import DialogBox from "./DialogBox";
import Card from "./Card";
import { useNavigate } from "react-router-dom";
import CardLg from "./CardLg";
import Error from "./Error";
import TextArea from "./TextAreaLargeScreen";

function HomeLargeScreen(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const [dialogBox, setDialogBox] = useState(false);
    const [rerender, setRerender] = useState(false);
    const [repoData, setRepoData] = useState();
    const navigate = useNavigate();
    const backend_url = "http://localhost:4000";

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
                data.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
                console.log(data);
                setRepoData(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function getDependencies(){

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
        getUserData();
        getRepositories();
        setRerender(!rerender);
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
                        Logout
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
                        <TextArea/>
                </div>
                <div className="flex-col">
                    {repoData !== undefined && repoData !== null ? (
                        Object.values(repoData).map((value, index) => (
                            <div key={index} className='flex justify-center'>
                                <CardLg RepoId={value.id} RepoName={value.name} RepoURL={value.html_url} getDependencies={getDependencies}/>
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
