import { atom } from 'recoil';

const progressBarAtom = atom({
  key: 'prograssBarAtom',
  default: Math.round(Math.random() * 30),
});

export { progressBarAtom };
