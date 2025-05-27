// components/layout/BottomNavigationBar.tsx
import Link from 'next/link';
import { useRouter } from 'next/router'; // برای استایل‌دهی لینک فعال (اختیاری)

// آیکون‌ها را از کتابخانه مورد نظر خود وارد کنید، مثلا react-icons
// import { FiHome, FiPlusSquare, FiSearch, FiUser } from 'react-icons/fi';

interface NavItemProps {
  href: string;
  icon?: React.ReactNode; // آیکون اختیاری
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link href={href} legacyBehavior>
      <a
        className={`flex flex-col items-center justify-center text-xs sm:text-sm p-1 flex-1 ${
          isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'
        }`}
      >
        {icon && <span className="mb-0.5">{icon}</span>}
        <span>{label}</span>
      </a>
    </Link>
  );
};

const BottomNavigationBar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full h-16 bg-white border-t border-gray-200 shadow-top flex justify-around items-stretch md:hidden z-50">
      <NavItem
        href="/"
        // icon={<FiHome size={20} />}
        label="خانه"
      />
      <NavItem
        href="/add-estate" // مسیر صفحه ثبت ملک خود را جایگزین کنید
        // icon={<FiPlusSquare size={20} />}
        label="ثبت ملک"
      />
      <NavItem
        href="/search-estate" // مسیر همین صفحه جستجو
        // icon={<FiSearch size={20} />}
        label="جستجو"
      />
      <NavItem
        href="/my-properties" // مسیر صفحه املاک من خود را جایگزین کنید
        // icon={<FiUser size={20} />}
        label="املاک من"
      />
    </nav>
  );
};

export default BottomNavigationBar;