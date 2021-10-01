import './Dashboard.css';
import { useRecoilValue } from 'recoil';
import { UserRole, userTypeAtom } from '../../global/states/globalStates';
import OwnerDashboard from './Owner/Owner';
import AdminDashboard from './Admin/Admin';
import UserDashboard from './User/User';

function DashboardScreen() {
  const userRole = useRecoilValue(userTypeAtom);

  return (
    <div className="dashboard-container">
      {userRole === UserRole.Owner ? (
        <OwnerDashboard />
      ) : userRole === UserRole.Admin ? (
        <AdminDashboard />
      ) : (
        <UserDashboard />
      )}
    </div>
  );
}

export default DashboardScreen;
