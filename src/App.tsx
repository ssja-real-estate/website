import { globalState } from "global/states/globalStates";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { useRecoilState, useRecoilValue } from "recoil";
import AddEstateScreen from "screens/AddEstate/AddEstate";
import CodeVerification from "screens/CodeVerification/CodeVerification";
import EditEstateScreen from "screens/EditEstate/EditEstate";
import "./App.css";
import AppNavbar from "./components/AppNavbar/Navbar";
import { progressBarAtom } from "./global/states/loadingBar";
import DashboardScreen from "./screens/Dashboard/Dashboard";
import HomeScreen from "./screens/Home/Home";
import LoginScreen from "./screens/Login/Login";
import NotFoundScreen from "./screens/NotFound/NotFound";
import SearchEstateScreen from "./screens/SearchEstate/SearchEstate";
import SignupScreen from "./screens/Signup/Signup";

function App() {
  const [progress, setProgress] = useRecoilState(progressBarAtom);
  const state = useRecoilValue(globalState);

  useEffect(() => {
    setProgress(100);
  });

  return (
    <div className="app">
      <Router>
        <LoadingBar
          className="loading-bar"
          progress={progress}
          color="#4527a0"
          height={5}
        />
        <AppNavbar />
        <Toaster />
        <Switch>
          <Route exact path="/" component={HomeScreen} />
          <Route exact path="/search-estate" component={SearchEstateScreen} />
          {state.loggedIn ? (
            <Route exact path="/add-estate" component={AddEstateScreen} />
          ) : (
            <Redirect exact from="/add-estate" to="/login" />
          )}
          {state.loggedIn ? (
            <Route exact path="/edit-estate" component={EditEstateScreen} />
          ) : (
            <Redirect exact from="/edit-estate" to="/login" />
          )}
          {state.loggedIn ? (
            <Redirect exact from="/login" to="/dashboard" />
          ) : (
            <Route exact path="/login" component={LoginScreen} />
          )}

          {state.loggedIn ? (
            <Redirect exact from="/signup" to="/dashboard" />
          ) : (
            <Route exact path="/signup" component={SignupScreen} />
          )}
          {state.loggedIn ? (
            <Route exact path="/dashboard" component={DashboardScreen} />
          ) : (
            <Redirect exact from="/dashboard" to="/login" />
          )}
          <Redirect exact from="/home" to="/" />
          <Route exact path="/code" component={CodeVerification} />
          <Route path="/" component={NotFoundScreen} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
