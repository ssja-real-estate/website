import Section from 'global/types/Section';
import { atom } from 'recoil';

interface ModalSection extends Section {
  id: string;
}

const modalSectionAtom = atom<ModalSection>({
  key: 'ownerModalSectionState',
  default: {
    id: '',
    title: '',
    fields: [],
  },
});

export { modalSectionAtom };
