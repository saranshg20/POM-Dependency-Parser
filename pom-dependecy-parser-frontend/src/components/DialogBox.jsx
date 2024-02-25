import { useRef, useState, useEffect } from "react";

function DialogBox(props) {
    const textareaRef = useRef();
    const handleButtonClick = () => {
        navigator.clipboard
            .writeText(textareaRef.current.value)
            .then(() => {
                console.log("Text copied to clipboard");
            })
            .catch((err) => {
                console.error("Could not copy text: ", err);
            });
    };

    return (
        <div className="">
            <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={() => props.setDialogBox(false)}
            />
            <div className="fixed top-1/3 rounded-md z-0 flex flex-col p-4 min-w-full h-48 bg-opacity-95 bg-slate-900">
                <div className="flex flex-col items-center justify-center">
                    <div className="text-white">Dependencies</div>
                    <textarea
                        readOnly
                        ref={textareaRef}
                        className="mt-4 w-full p-2 rounded-md overflow-auto"
                        placeholder="No dependencies associated with selected Repository"
                        style={{
                            resize: "none",
                            maxHeight: "200px",
                            opacity: 1,
                        }}
                    />
                    <div className="p-3 m-2 rounded-md text-white bg-slate-600" onClick={handleButtonClick}>
                        Copy
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DialogBox;
