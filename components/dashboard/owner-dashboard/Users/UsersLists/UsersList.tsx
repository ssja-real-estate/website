import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { globalState } from "../../../../../global/states/globalStates";
import User, {
  defaultUser,
  Role,
  roleMap,
} from "../../../../../global/types/User";
import UserService from "../../../../../services/api/UserService/UserService";
import * as TbIcon from "react-icons/tb";
import * as FaIcon from "react-icons/fa";
import { TabList, Tabs } from "react-tabs";
import Spiner from "../../../../spinner/Spiner";
import Strings from "../../../../../data/strings";

function UsersList() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>(defaultUser);

  const state = useRecoilValue(globalState);
  const userService = useRef(new UserService());
  const mounted = useRef(true);

  useEffect(() => {
    userService.current.setToken(state.token);
    loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  const loadData = async () => {
    if (!loading) {
      setLoading(true);
    }
    const users = await userService.current.getAllUsers();
    if (mounted.current) {
      setUsers(users);
      setLoading(false);
    }
  };

  const changeRole = async () => {
    if (selectedUser.id === "") return;
    const userId = selectedUser.id;
    const role = selectedUser.role;
    setLoading(true);
    await userService.current.changeUserRole(userId, role);
    await loadData();
  };

  return (
    <>
      {loading ? (
        // <Spinner animation="border" variant="primary" className="my-5" />
        <Spiner />
      ) : (
        <div className="users-section">
          <div>
            <div className="flex flex-row gap-3 w-full">
              <div className="flex-1">
                <div className="flex flex-row gap-2 items-center justify-center">
                  <h3 className="text-xl">{Strings.userInfo}</h3>
                  <button
                    className="shadow-md w-8 h-8 rounded-full flex items-center justify-center"
                    onClick={async () => {
                      await loadData();
                    }}
                  >
                    <TbIcon.TbRefresh />
                    {/* <i className="bi-arrow-counterclockwise">firstButton</i> */}
                  </button>
                </div>
                <input
                  type="text"
                  className="my-2 inputDecoration"
                  placeholder={Strings.searchUsers}
                  value={searchValue}
                  onChange={(event) => {
                    setSearchValue(event.target.value);
                  }}
                />
                {/* <ul> */}
                <Tabs className="flex flex-col gap-[2px] mt-5">
                  {users
                    .filter((user) => {
                      const value = searchValue.trim();
                      if (value === "") return true;

                      let result = user.mobile.includes(value);

                      return result;
                    })
                    .map((user, index) => {
                      return (
                        <TabList
                          onClick={() => {
                            setSelectedUser({
                              id: user.id,
                              mobile: user.mobile,
                              role: user.role,
                              name: user.name,
                            });
                          }}
                          key={index}
                          className={`${
                            selectedUser.id === user.id &&
                            "text-white bg-[#0ba]"
                          } border p-2 rounded-md flex items-center justify-center cursor-pointer select-none overflow-hidden`}
                        >
                          <span>{user.mobile}</span>
                        </TabList>

                        // <li
                        //   key={index}
                        //   // action
                        //   // href={`#user${user.id}`}
                        //   onClick={() => {
                        //     setSelectedOwner({
                        //       id: user.id,
                        //       mobile: user.mobile,
                        //       role: user.role,
                        //       name: user.name,
                        //     });
                        //   }}
                        // >
                        //   <div className="d-flex justify-content-center">
                        //     <span className="user-phone" style={{ width: 150 }}>
                        //       {user.mobile}
                        //     </span>
                        //   </div>
                        // </li>
                      );
                    })}
                </Tabs>
                {/* </ul> */}
              </div>

              <div className="flex-1">
                {selectedUser.id && (
                  <div className="sticky top-20">
                    <h3 className="mb-4 text-xl text-center">
                      {Strings.userInfo}
                    </h3>
                    {/* {owners.map((user, index) => {
                    return (
                      <div
                        key={index}
                        className=""
                        //  eventKey={`#user${user.id}`}
                      >
                   
                      </div>
                    );
                  })} */}
                    <div className="w-full shadow-md my-2 rounded-xl p-3 flex flex-col items-center justify-center border">
                      <div className="flex flex-row item-cnter justify-center font-bold gap-1 py-2">
                        <span className="">{selectedUser.mobile}</span>
                        <FaIcon.FaPhoneAlt />
                      </div>
                      <div className="flex flex-row w-full gap-1">
                        <select
                          value={selectedUser.role}
                          className="selectbox"
                          onChange={(e) => {
                            const roleString = e.currentTarget.value;
                            if (roleString) {
                              const role = Number(roleString) as Role;
                              setSelectedUser({
                                ...selectedUser,
                                role,
                              });
                            }
                          }}
                        >
                          {roleMap.map((role, index) => {
                            return (
                              <option key={index} value={role.role}>
                                {role.roleName}
                              </option>
                            );
                          })}
                        </select>
                        <button
                          className="border border-[#0ba] p-1 hover:bg-[#0ba] hover:text-white"
                          // variant="purple"
                          onClick={async () => {
                            await changeRole();
                          }}
                        >
                          {Strings.save}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UsersList;
