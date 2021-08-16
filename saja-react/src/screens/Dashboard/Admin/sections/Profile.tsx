import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoggedInAtom } from "../../../../global/globalStates";

function ProfileSection() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loggedIn, setLoggedIn] = useRecoilState(isLoggedInAtom);
    const history = useHistory();

    return (
        <div className="profile-section">
            <h1 className="user-name pb-4 fw-light">
                رحمان رحیمی
                <i className="bi-star-fill text-warning me-3"></i>
            </h1>
            <h4 className="user-phone">
                09123456789
                <i className="bi-telephone-fill me-3"></i>
            </h4>
            <div className="d-flex flex-column justify-content-center align-items-center">
                <Button
                    variant="outline-secondary"
                    className="rounded-3 px-4 my-4"
                    id="edit"
                    name="edit"
                    type="button"
                >
                    ویرایش حساب کاربری
                </Button>
                <Button
                    variant="outline-danger"
                    className="rounded-3 px-4"
                    id="logout"
                    name="logout"
                    type="button"
                    onClick={() => {
                        setLoggedIn(false);
                        history.push("/");
                    }}
                >
                    خروج از حساب کاربری
                </Button>
            </div>
        </div>
    );
}

export default ProfileSection;
