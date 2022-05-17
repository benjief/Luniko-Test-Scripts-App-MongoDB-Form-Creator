import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import LandingPageOptionsCard from "../components/LandingPageOptionsCard";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/InputComponents.css"
import "../styles/LandingPage.css";

function LandingPage() {
    const [rendering, setRendering] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");

    useEffect(() => {
        if (rendering) {
            setTimeout(() => {
                setRendering(false);
            }, 10);
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
        }
    });

    return (
        rendering
            ? <div className="loading-spinner">
                <Hypnosis
                    className="spinner"
                    color="var(--lunikoOrange)"
                    width="100px"
                    height="100px"
                    duration="1.5s" />
            </div>
            : <Fragment>
                <div
                    className="transition-element"
                    style={{
                        opacity: transitionElementOpacity,
                        visibility: transtitionElementVisibility
                    }}>
                </div>
                <NavBar>
                </NavBar>
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