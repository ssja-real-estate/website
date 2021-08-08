import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import HomeScreen from "./screens/Home/Home";

function App() {
    return (
        <div className="app">
            <Navbar />
            <HomeScreen />
        </div>
    );
}

export default App;
