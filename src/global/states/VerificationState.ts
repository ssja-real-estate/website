import { atom } from "recoil";

enum PreviousScreen {
  Signup,
  ForgotPassword,
}

interface VerificationState {
  mobile: string;
  password: string;
  previousScreen: PreviousScreen;
}

const verificationState = atom<VerificationState>({
  key: "verificationState",
  default: {
    mobile: "",
    password: "",
    previousScreen: PreviousScreen.Signup,
  },
});

export default VerificationState;
export { verificationState, PreviousScreen };
