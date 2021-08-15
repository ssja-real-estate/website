import "./App.css";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomeScreen from "./screens/Home/Home";
import SearchEstateScreen from "./screens/SearchEstate/SearchEstate";
import AddEstateScreen from "./screens/AddEstate/AddEstate";
import LoginScreen from "./screens/Login/Login";
import SignupScreen from "./screens/Signup/Signup";
import DashboardScreen from "./screens/Dashboard/Dashboard";
import NotFoundScreen from "./screens/NotFound/NotFound";
import { isLoggedInAtom } from "./global/globalStates";
import { useRecoilValue } from "recoil";

function App() {
    const loggedIn = useRecoilValue(isLoggedInAtom);

    return (
        <div className="app">
            <Router>
                <Navbar />
                <Switch>
                    <Route exact path="/" component={HomeScreen} />
                    <Route
                        exact
                        path="/search-estate"
                        component={SearchEstateScreen}
                    />
                    {loggedIn ? (
                        <Route
                            exact
                            path="/add-estate"
                            component={AddEstateScreen}
                        />
                    ) : (
                        <Redirect exact from="/add-estate" to="/login" />
                    )}
                    {loggedIn ? (
                        <Redirect exact from="/login" to="/dashboard" />
                    ) : (
                        <Route exact path="/login" component={LoginScreen} />
                    )}
                    {loggedIn ? (
                        <Redirect exact from="/signup" to="/dashboard" />
                    ) : (
                        <Route exact path="/signup" component={SignupScreen} />
                    )}
                    {loggedIn ? (
                        <Route
                            exact
                            path="/dashboard"
                            component={DashboardScreen}
                        />
                    ) : (
                        <Redirect exact from="/dashboard" to="/login" />
                    )}
                    <Redirect exact from="/home" to="/" />

                    <Route path="/" component={NotFoundScreen} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
