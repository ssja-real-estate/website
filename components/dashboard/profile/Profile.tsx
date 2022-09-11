import Image from "next/image";
import React, { useState } from "react";
import EditProfile from "./EditProfile";
import ProfileHome from "./ProfileHome";

const Profile: React.FC<{ children?: JSX.Element }> = (props) => {
  const [isEdit, setEdit] = useState(false);
  const editProfile = (): void => {
    setEdit(true);
  };
  const exitEdit = (): void => {
    setEdit(false);
  };
  return (
    <>
      {!isEdit ? (
        <ProfileHome onEdit={editProfile} />
      ) : (
        <EditProfile onExitEdit={exitEdit} />
      )}
    </>
  );
};

export default Profile;
