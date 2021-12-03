import "./Dashboard.css";
import { useRecoilValue } from "recoil";
import { globalState } from "../../global/states/globalStates";
import OwnerDashboard from "./Owner/Owner";
import AdminDashboard from "./Admin/Admin";
import UserDashboard from "./User/User";
import { Role } from "global/types/User";

function DashboardScreen() {
  const state = useRecoilValue(globalState);

  return (
    <div className="dashboard-container">
      {state.role === Role.OWNER ? (
        <OwnerDashboard />
      ) : state.role === Role.ADMIN ? (
        <AdminDashboard />
      ) : (
        <UserDashboard />
      )}
    </div>
  );
}

export default DashboardScreen;
