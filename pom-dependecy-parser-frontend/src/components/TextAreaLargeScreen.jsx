import { useRef, useState, useEffect } from "react";

function TextArea(props) {
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
        <div className="relative mt-4 w-1/2">
            <textarea
                readOnly
                content={props.content}
                ref={textareaRef}
                className="p-2 rounded-md overflow-auto border border-black"
                placeholder="Select Repository to retrieve POM dependencies"
                style={{
                    resize: "none",
                    maxHeight: "200px",
                    opacity: 1,
                    width: "100%",
                }}
            />
            <div
                id="copyToClipboard-a"
                className="clipboard icon absolute top-2 right-2"
            >
                <img
                    className="cursor-pointer"
                    width="18"
                    height="18"
                    src="https://img.icons8.com/pastel-glyph/64/clipboard--v4.png"
                    alt="clipboard--v4"
                />
            </div>
        </div>
    );
}

export default TextArea;
