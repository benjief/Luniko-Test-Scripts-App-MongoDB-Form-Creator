import * as React from 'react';
import { useNavigate, use } from 'react-router-dom';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
// import MaterialSingleSelect from './MaterialSingleSelect';
// import MaterialSingleSelectFreeSolo from './MaterialSingleSelectFreeSolo';
// import MaterialTextField from './MaterialTextField';
// import MaterialRadioButton from './MaterialRadioButton';
// import MaterialMultiSelect from './MaterialMultiSelect';
// import MaterialMultiSelectFreeSolo from './MaterialMultiSelectFreeSolo';
// import MaterialCheckBox from './MaterialCheckBox';
// import FadingBalls from "react-cssfx-loading/lib/FadingBalls";

// const ExpandMore = styled((props) => {
//     const { expand, ...other } = props;
//     return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//     transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//     marginLeft: 'auto',
//     transition: theme.transitions.create('transform', {
//         duration: theme.transitions.duration.shortest,
//     }),
// }));

function TestingSessionCard({
    testScriptName,
    testingSessionID,
    submitter,
    result,
    submissionDate,
}) {
    // React.useEffect(() => {
    //     console.log(testScriptName);
    // }, [testScriptName]);

    const navigate = useNavigate();

    const handleOnClickViewDetails = () => {
        navigate(`/view-test-script-testing-session-details/${testScriptName}/${testingSessionID}`);
    }

    return (
        <Card
            sx={{
                // minWidth: 1,
                // maxWidth: 1,
                maxHeight: "calc(100vh - 166.52px)",
                overflowY: "scroll",
                borderRadius: "10px",
                boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                transition: "0.5s",
                backgroundColor: "var(--lunikoDarkGrey)",
                marginBottom: "20px"
            }}>
            <div className="card-content">
                <CardHeader
                    titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
                    title={<strong>Testing Session {testingSessionID}</strong>}
                />
                <Collapse in={true} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph className="testing-session-submitter">
                            <strong>Submitter</strong><br />
                            {submitter.firstName + " " + submitter.lastName}
                        </Typography>
                        <Typography paragraph className="testing-session-result">
                            <strong>Result</strong><br />
                            <span id="testing-session-result-contents">
                                {result ? "pass" : "fail"}
                                <img src={result ? require("../img/checkmark_icon_green.png") : require("../img/x_icon_red.png")} alt={result ? "pass" : "fail"} />
                            </span>
                        </Typography>
                        <Typography paragraph className="testing-session-submission-date">
                            <strong>Submitted</strong><br />
                            {submissionDate.toString()}
                        </Typography>
                        <button
                            className="view-testing-session-details-button"
                            onClick={handleOnClickViewDetails}>
                            View Testing Session Details
                        </button>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}

TestingSessionCard.propTypes = {
    testingScriptID: PropTypes.string,
    testingSessionID: PropTypes.string,
    submitter: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        _id: PropTypes.string
    }),
    result: PropTypes.bool,
    submissionDate: PropTypes.instanceOf(Date),
}

TestingSessionCard.defaultProps = {
    testingScriptID: "",
    testingSessionID: "",
    submitter: {
        firstName: "",
        lastName: "",
        _id: ""
    },
    result: false,
    submissionDate: new Date(),

}

export default TestingSessionCard;
