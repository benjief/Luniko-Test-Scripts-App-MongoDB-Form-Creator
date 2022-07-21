import { BrowserRouter as Router, Route, Routes as Switch } from "react-router-dom"
import LandingPage from "./pages/LandingPage";
import CreateOrModifyTestScript from "./pages/test_script_pages/CreateOrModifyTestScript/CreateOrModifyTestScript";
import RetrieveTestScriptTestingSessions from "./pages/test_script_pages/RetrieveTestScriptTestingSessions";
import DeleteTestScript from "./pages/test_script_pages/DeleteTestScript";
import { ValidationErrorProvider } from "./pages/test_script_pages/Context/ValidationErrorContext";
import './App.css';

function App() {
  return (
    <div className="App">
      <ValidationErrorProvider>
          <Router>
            <Switch>
              <Route exact path="/" element={<LandingPage />} />
              <Route exact path="/create-or-modify-test-script/:pageFunctionality" element={<CreateOrModifyTestScript />} />
              <Route exact path="/retrieve-test-script-testing-sessions/" element={<RetrieveTestScriptTestingSessions />} />
              <Route exact path="/delete-test-script/" element={<DeleteTestScript />} />
            </Switch>
          </Router>
      </ValidationErrorProvider >
    </div>
  );
}

export default App;
