import React from "react";

function Error() {
    return (
        <div className="flex flex-col justify-center items-center">
            <img
                width="48"
                height="48"
                src="https://img.icons8.com/plumpy/24/no-data-availible.png"
                alt="no-data-availible"
            />
            <div className="font-light">
                No Repos Found..
            </div>
        </div>
    );
}

export default Error;
