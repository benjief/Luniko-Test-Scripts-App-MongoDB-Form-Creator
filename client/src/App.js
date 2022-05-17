import { BrowserRouter as Router, Route, Routes as Switch } from "react-router-dom"
import LandingPage from "./pages/LandingPage";
import CreateNewTestScript from "./pages/CreateNewTestScript";
import ModifyExistingTestScript from "./pages/ModifyExistingTestScript";
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/create-new-test-script" element={<CreateNewTestScript />} />
          <Route exact path="/modify-existing-test-script" element={<ModifyExistingTestScript />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
