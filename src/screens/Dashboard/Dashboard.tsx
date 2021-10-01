import './Dashboard.css';
import { useRecoilValue } from 'recoil';
import { userTypeAtom } from '../../global/states/globalStates';
import OwnerDashboard from './Owner/Owner';
import AdminDashboard from './Admin/Admin';
import UserDashboard from './User/User';
import { Role } from 'global/types/User';

function DashboardScreen() {
  const userRole = useRecoilValue(userTypeAtom);

  return (
    <div className="dashboard-container">
      {userRole === Role.OWNER ? (
        <OwnerDashboard />
      ) : userRole === Role.ADMIN ? (
        <AdminDashboard />
      ) : (
        <UserDashboard />
      )}
    </div>
  );
}

export default DashboardScreen;
