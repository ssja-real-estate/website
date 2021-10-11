import { atom } from 'recoil';

const profileModalState = atom({
  key: 'profileModalState',
  default: {
    showEditProfile: false,
    showChangePassword: false,
    reloadScreen: false,
  },
});

export { profileModalState };
