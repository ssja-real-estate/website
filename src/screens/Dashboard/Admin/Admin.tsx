import { motion } from 'framer-motion';
import { elevationEffect } from '../../../animations/motionVariants';
import { atom, useRecoilValue } from 'recoil';
import AdminSidebar from './Sidebar';
import EstatesSection from './sections/Estates/Estates';
import TemplatesSection from './sections/Templates/Templates';
import UsersSection from './sections/Users/UsersSection';
import Profile from '../../Profile/Profile';

export const adminSectionAtom = atom({
  key: 'adminSidebarState',
  default: 'profile',
});

function AdminDashboard() {
  const section = useRecoilValue(adminSectionAtom);

  return (
    <div className="dashboard">
      <AdminSidebar />
      <motion.div
        variants={elevationEffect}
        initial="first"
        animate="second"
        className="admin-dashboard-section card shadow rounded-3 text-center p-5 me-2 overflow-auto"
      >
        {section === 'profile' ? (
          <Profile />
        ) : section === 'users' ? (
          <UsersSection />
        ) : section === 'estates' ? (
          <EstatesSection />
        ) : (
          section === 'templates' && <TemplatesSection />
        )}
      </motion.div>
    </div>
  );
}

export default AdminDashboard;
