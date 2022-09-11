import { NextPage } from "next";
import { useRecoilValue } from "recoil";
import { globalState } from "../../global/states/globalStates";
import AdminDashboard from "../../components/dashboard/admin-dshboard/AdminDashboard";
import OwnerDashboard from "../../components/dashboard/owner-dashboard/OwnerDashboard";
import UserDashboard from "../../components/dashboard/user-dashboard/UserDashboard";
import { Role } from "../../global/types/User";
const Dashboard: NextPage = () => {
  const state = useRecoilValue(globalState);
  console.log(state.role);
  return (
    <div className="container">
      {state.role === Role.OWNER ? (
        <OwnerDashboard />
      ) : state.role === Role.ADMIN ? (
        <AdminDashboard />
      ) : state.role === Role.AGENT ? null : (
        <UserDashboard />
      )}
    </div>
  );
};

export default Dashboard;
