import React from "react";

function CardLg(props) {
    return (
        <div className="bg-blue-200 hover:bg-blue-100 p-4 m-4 rounded-md shadow-lg w-4/5">
            <div className="flex items-center justify-between">
                <div className="text-xl w-1/2 font-light overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {props.RepoName}
                </div>
                <div className="flex items-center justify-normal">
                    <div onClick={() => props.getDependencies(props.RepoId)}>
                        <img
                            className="mr-6 cursor-pointer"
                            width="40"
                            height="40"
                            src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-dependencies-computer-programming-flaticons-lineal-color-flat-icons.png"
                            alt="external-dependencies-computer-programming-flaticons-lineal-color-flat-icons"
                        />
                    </div>
                    <a href={props.RepoURL} target="_blank">
                        <img
                            className="cursor-pointer"
                            width="50"
                            height="50"
                            src="https://img.icons8.com/plasticine/100/github.png"
                            alt="github"
                        />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default CardLg;
