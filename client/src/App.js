import { BrowserRouter as Router, Route, Routes as Switch } from "react-router-dom"
import LandingPage from "./pages/LandingPage";
import CreateOrModifyTestScript from "./pages/TestScriptPages/CreateOrModifyTestScript/CreateOrModifyTestScript";
import RetrieveTestScriptTestingSessions from "./pages/TestScriptPages/RetrieveTestScriptTestingSessions";
import DeleteTestScript from "./pages/TestScriptPages/DeleteTestScript";
import { ValidationErrorProvider } from "./pages/TestScriptPages/Context/ValidationErrorContext";
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
