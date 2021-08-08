import notFound from "../../images/404/404_screen.png";
import "./NotFound.css";

function NotFoundScreen() {
    return (
        <div className="main-container">
            <img src={notFound} alt="404 Not Found!" />
        </div>
    );
}

export default NotFoundScreen;
