import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoggedInAtom } from "../../../../global/globalStates";

function ProfileSection() {
    const setLoggedIn = useRecoilState(isLoggedInAtom)[1];
    const history = useHistory();

    return (
        <div className="profile-section">
            <h1 className="user-name pb-4 fw-light">
                محمد احمدی
                <i className="bi-star-fill text-warning me-3"></i>
            </h1>
            <h4 className="user-phone">
                09123456789
                <i className="bi-telephone-fill me-3"></i>
            </h4>
            <Button
                variant="outline-danger"
                className="rounded-3 px-4 mt-4"
                id="edit"
                name="edit"
                type="button"
                onClick={() => {
                    setLoggedIn(false);
                    history.push("/");
                }}
            >
                خروج از حساب کاربری
            </Button>
        </div>
    );
}

export default ProfileSection;
