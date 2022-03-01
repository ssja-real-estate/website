import { useRecoilValue } from "recoil";
import { estateInfoModalAtom } from "./EstateInfoModalState";

const EstateInfoModal = () => {
  const estateInfo = useRecoilValue(estateInfoModalAtom);
  return (
    <div>
      <div>{estateInfo.estate.dataForm.title}</div>
    </div>
  );
};

export default EstateInfoModal;
