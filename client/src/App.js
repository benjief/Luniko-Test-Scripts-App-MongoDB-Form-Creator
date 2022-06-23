import { BrowserRouter as Router, Route, Routes as Switch } from "react-router-dom"
import LandingPage from "./pages/LandingPage";
import CreateNewTestScript from "./pages/test_script_pages/CreateNewTestScript/CreateNewTestScript";
import ModifyExistingTestScript from "./pages/test_script_pages/ModifyExistingTestScript/ModifyExistingTestScript";
import RetrieveTestScriptTestingSessions from "./pages/test_script_pages/RetrieveTestScriptTestingSessions";
import ViewTestScriptTestingSessionDetails from "./pages/test_script_pages/ViewTestScriptTestingSessionDetails/ViewTestScriptTestingSessionDetails";
import { ValidationErrorProvider } from "./pages/test_script_pages/Context/ValidationErrorContext";
import './App.css';

function App() {
  return (
    <div className="App">
      <ValidationErrorProvider>
          <Router>
            <Switch>
              <Route exact path="/" element={<LandingPage />} />
              <Route exact path="/create-new-test-script" element={<CreateNewTestScript />} />
              <Route exact path="/modify-existing-test-script" element={<ModifyExistingTestScript />} />
              <Route exact path="/retrieve-test-script-testing-sessions/" element={<RetrieveTestScriptTestingSessions />} />
              {/* <Route exact path="/view-test-script-testing-session-details/:testScriptName/:testingSessionID" element={<ViewTestScriptTestingSessionDetails />} /> */}
            </Switch>
          </Router>
      </ValidationErrorProvider >
    </div>
  );
}

export default App;
