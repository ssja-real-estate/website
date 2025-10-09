import GlobalState, { defaultGlobalState } from "../../global/states/GlobalState";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

// ✅ جلوگیری از تعریف مجدد atom در حالت Hot Reload و SSR
const globalState =
  (typeof window !== "undefined" && (window as any).__globalState__) ||
  atom<GlobalState>({
    key: "globalState",
    default: defaultGlobalState,
    effects_UNSTABLE: [persistAtom],
  });

if (typeof window !== "undefined") {
  (window as any).__globalState__ = globalState;
}

export { globalState };
