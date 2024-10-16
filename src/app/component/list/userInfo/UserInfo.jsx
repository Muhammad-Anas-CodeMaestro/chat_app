import useUserStore from "@/database/userStore";
import { faEdit, faEllipsis, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserInfo = () => {

  const { currentUser } = useUserStore();

  return (
    <>
      <div className="userInfo p-3 flex items-center justify-between">
        <div className="user flex items-center gap-5">
          <img src={currentUser.avatar || "/avatar.png"} alt="User-Image" className="w-12 h-12 rounded-full object-cover"/>
          <h2 className="text-white font-semibold">{currentUser.name}</h2>
        </div>
        <div className="flex gap-5">
          <FontAwesomeIcon icon={faEllipsis} className ="size-5 w-5 h-5 cursor-pointer" />
          <FontAwesomeIcon icon={faVideo} className ="size-5 w-5 h-5 cursor-pointer" />
          <FontAwesomeIcon icon={faEdit} className ="size-5 w-5 h-5 cursor-pointer" />
        </div>
      </div>
    </>
  );
};

export default UserInfo;
