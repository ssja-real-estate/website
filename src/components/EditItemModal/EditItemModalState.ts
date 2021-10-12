import { atom } from 'recoil';

interface EditItemModalState {
  id: string;
  value: string;
  displayModal: boolean;
  editDelegationType?: boolean;
  editEstateType?: boolean;
  editProvince?: boolean;
  editCity?: boolean;
  editUnit?: boolean;
}

const defaultEditItemModalState: EditItemModalState = {
  id: '',
  value: '',
  displayModal: false,
  editDelegationType: false,
  editEstateType: false,
  editProvince: false,
  editCity: false,
  editUnit: false,
};

const editItemModalState = atom<EditItemModalState>({
  key: 'editItemModalState',
  default: defaultEditItemModalState,
});

export default editItemModalState;
export type { EditItemModalState };
export { defaultEditItemModalState };
