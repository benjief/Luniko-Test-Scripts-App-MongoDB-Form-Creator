import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/LandingPage.css";

function LandingPage() {
    const [rendering, setRendering] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");

    useEffect(() => {
        setRendering(false);
        setTransitionElementOpacity("0%");
        setTransitionElementVisibility("hidden");
    })

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
            </Fragment>
    )
};

export default LandingPage;
