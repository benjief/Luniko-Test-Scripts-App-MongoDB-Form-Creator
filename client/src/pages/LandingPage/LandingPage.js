import React, { Fragment, useEffect, useState } from "react";
import LoadingWrapper from "../test_script_pages/wrappers/LoadingWrapper/LoadingWrapper";
import LandingPageOptionsCard from "../../components/LandingPageOptionsCard";
import { useValidationErrorUpdate } from "../test_script_pages/Context/ValidationErrorContext";
import "../../styles/InputComponents.css"
import "../../styles/LandingPage.css";

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
    }, [invalidTestScriptNameError, rendering, setTransitionElementOpacity, setTransitionElementVisibility]);

    return (
        <Fragment>
            <div
                className="transition-element"
                style={{
                    opacity: transitionElementOpacity,
                    visibility: transitionElementVisibility
                }}>
            </div>
            <LoadingWrapper
                rendering={rendering}
                transitionElementOpacity={transitionElementOpacity}
                transitionElementVisibility={transitionElementVisibility}>
            </LoadingWrapper>
            {/* <NavBar>
                </NavBar> */}
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
