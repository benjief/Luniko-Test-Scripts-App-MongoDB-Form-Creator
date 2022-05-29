import { BrowserRouter as Router, Route, Routes as Switch } from "react-router-dom"
import LandingPage from "./pages/LandingPage";
import CreateNewTestScript from "./pages/test_script_pages/CreateNewTestScript/CreateNewTestScript";
import ModifyExistingTestScript from "./pages/test_script_pages/ModifyExistingTestScript/ModifyExistingTestScript";
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
          </Switch>
        </Router>
      </ValidationErrorProvider >
    </div>
  );
}

export default App;
