import { Section } from 'global/types/EstateForm';
import { atom } from 'recoil';

interface ModalSection extends Section {
  id: number;
}

const modalSectionAtom = atom<ModalSection>({
  key: 'ownerModalSectionState',
  default: {
    id: 0,
    title: '',
    name: '',
    fields: [],
  },
});

export { modalSectionAtom };
