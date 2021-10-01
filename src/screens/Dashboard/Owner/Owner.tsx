import { motion } from 'framer-motion';
import { atom, useRecoilValue } from 'recoil';
import OwnerSidebar from './Sidebar';
import ProfileSection from './sections/Profile/Profile';
import EstatesSection from './sections/Estates/Estates';
import TemplatesSection from './sections/Templates/TemplatesSection';
import { elevationEffect } from 'animations/motionVariants';
import UsersSection from './sections/Users/UsersSection';

export const ownerSectionAtom = atom({
  key: 'ownerSidebarState',
  default: 'profile',
});

function OwnerDashboard() {
  const section = useRecoilValue(ownerSectionAtom);

  return (
    <div className="dashboard">
      <OwnerSidebar />
      <motion.div
        variants={elevationEffect}
        initial="first"
        animate="second"
        className="owner-dashboard-section card shadow rounded-3 text-center p-5 me-2 overflow-auto"
      >
        {section === 'profile' ? (
          <ProfileSection />
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

export default OwnerDashboard;
