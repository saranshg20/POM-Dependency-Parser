import React from "react";

function Loader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
            <div className="flex flex-col justify-center h-full w-full items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="5em"
                    height="5em"
                    viewBox="0 0 24 24"
                >
                    <circle cx="12" cy="12" r="0" fill="currentColor">
                        <animate
                            attributeName="r"
                            calcMode="spline"
                            dur="1.2s"
                            keySplines=".52,.6,.25,.99"
                            repeatCount="indefinite"
                            values="0;11"
                        />
                        <animate
                            attributeName="opacity"
                            calcMode="spline"
                            dur="1.2s"
                            keySplines=".52,.6,.25,.99"
                            repeatCount="indefinite"
                            values="1;0"
                        />
                    </circle>
                </svg>
            </div>
        </div>
    );
}

export default Loader;