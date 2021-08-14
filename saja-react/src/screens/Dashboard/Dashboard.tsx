import "./Dashboard.css";
import { useRecoilValue } from "recoil";
import { userTypeAtom } from "../../global/globalStates";
import AdminDashboard from "./Admin/Admin";
import UserDashboard from "./User/User";

function DashboardScreen() {
    const isAdmin = useRecoilValue(userTypeAtom) === "admin" ? true : false;

    return (
        <div className="dashboard-container">
            {isAdmin ? <AdminDashboard /> : <UserDashboard />}
        </div>
    );
}

export default DashboardScreen;
