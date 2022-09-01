import * as React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';

/**
 * Card that contains links to all of the different checklist-related options this application offers.
 * @returns said card.
 */
function LandingPageOptionsCard() {
    const expanded = true;

    return (
        <Card
            sx={{
                minHeight: "303.56px",
                overflowY: "scroll",
                borderRadius: "10px",
                boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                transition: "0.5s",
                backgroundColor: "var(--lunikoMidGrey)",
                marginBottom: "20px",
            }}>
            <div className="card-content">
                <CardHeader
                    titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", textAlign: "center" }}
                    title={<strong>Please choose an option below</strong>} />
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Link to={"/create-or-modify-test-script/create"}>
                            <button
                                className="create-new-test-script-button">
                                Create New Test Script
                            </button>
                        </Link>
                        <Link to={"create-or-modify-test-script/modify"}>
                            <button
                                className="modify-existing-test-script-button">
                                Modify Existing Test Script
                            </button>
                        </Link>
                        <Link to={`/retrieve-test-script-testing-sessions/`}>
                            <button
                                className="retrieve-test-script-testing-sessions-button">
                                Retrieve Test Script Testing Sessions
                            </button>
                        </Link>
                        <Link to={`/delete-test-script/`}>
                            <button
                                className="delete-test-script-button-landing-page">
                                Delete Test Script
                            </button>
                        </Link>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}

export default LandingPageOptionsCard;
