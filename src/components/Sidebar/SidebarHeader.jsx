import { FunnelSimple, NotePencil } from "@phosphor-icons/react";
import SpecializedIconButton from "../SpecializedIconButton";
import { useDispatch, useSelector } from "react-redux";
import { openNewChat } from "../../redux/slices/app";

function SidebarHeader() {
  const dispatch = useDispatch();
  const { isNewChatClicked } = useSelector((state) => state.app);

  const newChat = async () => {
    await dispatch(openNewChat(!isNewChatClicked));
  };

  return (
    <div className="Top flex justify-between p-2 items-center">
      <div className="flex items-center">
        <h3 className="text-lg font-semibold">Chats</h3>
      </div>
      <div className="flex min-w-[5vw] items-center justify-between gap-4">
        <SpecializedIconButton onClick={newChat}>
          <NotePencil size={18} color="#030303" weight="thin" />
        </SpecializedIconButton>
        <SpecializedIconButton>
          <FunnelSimple size={18} color="#030303" weight="light" />
        </SpecializedIconButton>
      </div>
    </div>
  );
}

export default SidebarHeader;
