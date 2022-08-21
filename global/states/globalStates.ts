import GlobalState, {
  defaultGlobalState,
} from "../../global/states/GlobalState";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const globalState = atom<GlobalState>({
  key: "globalState",
  default: defaultGlobalState,
  effects_UNSTABLE: [persistAtom],
});

export { globalState };
