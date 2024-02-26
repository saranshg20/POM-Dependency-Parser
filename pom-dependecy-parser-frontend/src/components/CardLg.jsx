import React from "react";

function CardLg(props) {
    return (
        <div className="bg-blue-200 hover:bg-blue-100 p-6 m-4 rounded-md shadow-lg w-4/5">
            <div className="flex justify-between">
                <div className="text-xl w-1/2 font-light overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {props.RepoName}
                </div>
                <div className="flex justify-normal">
                    <div onClick={() => props.getDependencies(props.RepoId)}>
                        <img
                            className="mr-6 cursor-pointer"
                            width="30"
                            height="30"
                            src="https://img.icons8.com/external-tal-revivo-bold-tal-revivo/24/external-search-document-from-company-digital-file-system-work-bold-tal-revivo.png"
                            alt="external-search-document-from-company-digital-file-system-work-bold-tal-revivo"
                        />
                    </div>
                    <a href={props.RepoURL} target="_blank">
                        <img
                            className="cursor-pointer"
                            width="30"
                            height="30"
                            src="https://img.icons8.com/ios-filled/50/github.png"
                            alt="github"
                        />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default CardLg;
