import "./App.css";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomeScreen from "./screens/Home/Home";
import LoginScreen from "./screens/Login/Login";
import SignupScreen from "./screens/Signup/Signup";
import NotFoundScreen from "./screens/NotFound/NotFound";
import AddEstateScreen from "./screens/AddEstate/AddEstate";

function App() {
    return (
        <div className="app">
            <Router>
                <Navbar />
                <Switch>
                    <Route path="/" exact component={HomeScreen} />
                    <Redirect from="/home" to="/"></Redirect>
                    <Route path="/login" exact component={LoginScreen} />
                    <Route path="/signup" exact component={SignupScreen} />
                    <Route
                        path="/add-estate"
                        exact
                        component={AddEstateScreen}
                    />
                    <Route path="/" component={NotFoundScreen} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
