import { BrowserRouter as Router, Route, Routes as Switch } from "react-router-dom"
import CreateOrEditTestScript from "./pages/CreateOrEditTestScript";
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" element={<CreateOrEditTestScript />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
