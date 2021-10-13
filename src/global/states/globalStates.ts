import GlobalState, { defaultGlobalState } from 'global/states/GlobalState';
import { atom } from 'recoil';

const globalState = atom<GlobalState>({
  key: 'globalState',
  default: defaultGlobalState,
});

export { globalState };
