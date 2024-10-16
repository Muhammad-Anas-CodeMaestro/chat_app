import { useState } from "react";
import { arrayUnion, collection, db, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "@/database/fireBaseConfique";
import useUserStore from "@/database/userStore";

const AddUser = () => {
  const [ name, setName ] = useState("");
  const [ user, setUser ] = useState(null);
  const { currentUser } = useUserStore();

  const HandleSearch = async (e) => {
    e.preventDefault();
    try {
    //   const userRef = collection(db, "user");
      const userQuery = query(collection(db,"user"), where("name", "==", name));
      const querySnapShot = await getDocs(userQuery);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }

    } catch (err) {
      console.log(err);
    }
  };

  const HandleAdd = async () => {
    const chatRef = collection(db, "chats")
    const userChatsRef = collection(db, "userchat")

    try {
        const newChatRef = doc(chatRef)

        await setDoc(newChatRef , {
            createdAt: serverTimestamp(),
            message: [],
        })

        await updateDoc(doc(userChatsRef, user.userId), {
            chats: arrayUnion({
                chatId: newChatRef.id,
                lastMessage: "",
                receiverId: currentUser.userId,
                updatedAt: Date.now()
            })
        })

        await updateDoc(doc(userChatsRef, currentUser.userId), {
            chats: arrayUnion({
                chatId: newChatRef.id,
                lastMessage: "",
                receiverId: user.userId,
                updatedAt: Date.now()
            })
        })
        
    } catch (err) {
        console.log(err)
    }
  }

  return (
    <>
      <div className="w-max h-max p-8 bg-[rgba(17,25,40,0.781)] rounded-lg absolute top-0 bottom-0 left-0 right-0 m-auto">
        <form className="flex gap-5" onSubmit={HandleSearch}>
          <input
            type="text"
            placeholder="User Name"
            value={name}
            className="p-5 rounded-lg border-none outline-none text-black"
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="p-5 rounded-lg bg-[#1a73e8] text-white border-none cursor-pointer"
            type="submit"
          >
            Search
          </button>
        </form>
        {user && (
          <div className="mt-12 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <img
                src={user.avatar || "./avatar.png"}
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="text-white">{user.name}</span>
            </div>
            <button
              className="p-2 rounded-lg bg-[#1a73e8] text-white border-none cursor-pointer"
              onClick={HandleAdd}
            >
              Add User
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AddUser;
