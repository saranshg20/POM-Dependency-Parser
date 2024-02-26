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
        <div className={`relative mt-4 ${props.width}`}>
            <textarea
                readOnly
                value={props.content}
                ref={textareaRef}
                className={`${props.isSmallScreen ? 'p-8': 'p-4'} rounded-md overflow-auto border border-black`}
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
                className="clipboard icon absolute top-2 right-4"
                onClick={handleButtonClick}
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
