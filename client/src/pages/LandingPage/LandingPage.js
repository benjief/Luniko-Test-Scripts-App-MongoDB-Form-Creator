import React, { Fragment, useEffect, useState } from "react";
import LoadingWrapper from "../TestScriptPages/wrappers/LoadingWrapper/LoadingWrapper";
import LandingPageOptionsCard from "../../components/LandingPageOptionsCard";
import { useValidationErrorUpdate } from "../TestScriptPages/Context/ValidationErrorContext";
import "../../styles/InputComponents.css"
import "../../styles/LandingPage.css";

/**
 * The application's landing page.
 * @returns said landing page.
 */
function LandingPage() {
    const [rendering, setRendering] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const invalidTestScriptNameError = useValidationErrorUpdate();

    useEffect(() => {
        if (rendering) {
            setTimeout(() => {
                setRendering(false);
            }, 10);
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            invalidTestScriptNameError("");
        }
    }, [invalidTestScriptNameError, rendering]);

    return (
        <Fragment>
            {/* <div
                className="transition-element"
                style={{
                    opacity: transitionElementOpacity,
                    visibility: transitionElementVisibility
                }}>
            </div> */}
            <LoadingWrapper
                rendering={rendering}
                transitionElementOpacity={transitionElementOpacity}
                transitionElementVisibility={transitionElementVisibility}>
            </LoadingWrapper>
            <div className="landing-page-options">
                <div className="page-message">
                    Welcome!
                </div>
                <div className="landing-page-options-container">
                    <div className="landing-page-options-card">
                        <LandingPageOptionsCard>
                        </LandingPageOptionsCard>
                    </div>
                </div>
            </div>
        </Fragment>
    )
};

export default LandingPage;
