"use client";
import { faAdd, faMinus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import AddUser from "./adduser/AddUser";
import UserStore from "@/database/userStore";
import {
  db,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "@/database/fireBaseConfique";
import useChatStore from "@/database/chatStore";

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");

  const { currentUser } = UserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchat", currentUser.userId),

      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "user", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });
        const chatData = await Promise.all(promises);
        setChats(
          chatData.sort((a, b) => {
            b.updatedAt - a.updatedAt;
          })
        );
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.userId]);

  const handleSelect = async (chat) => {
    const userChat = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChat.findIndex((item) => item.chatId === chat.chatId);

    userChat[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchat", currentUser.userId);

    try {
      await updateDoc(userChatsRef, {
        chats: userChat,
      });

      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.name.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <>
      <div className="flex-1 overflow-auto">
        <div className="flex items-center gap-5 p-3 pt-0">
          <div className="flex items-center gap-5 bg-[rgba(17,25,40,0.5)] rounded-lg p-2 flex-1">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-white flex-1"
              onChange={(e) => setInput(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="size-5 w-5 h-5 cursor-pointer"
            />
          </div>
          <div className="w-9 h-9 bg-[rgba(17,25,40,0.5)] p-2 rounded-lg cursor-pointer">
            <FontAwesomeIcon
              icon={addMode ? faMinus : faAdd}
              className="size-5 w-5 h-5 cursor-pointer"
              onClick={() => {
                setAddMode((prev) => !prev);
              }}
            />
          </div>
        </div>
        {filteredChats.map((chat) => (
          <div
            className="flex items-center gap-5 p-5 cursor-pointer border-b border-[#dddddd35]"
            onClick={() => {
              handleSelect(chat);
            }}
            style={{
              backgroundColor: chat.isSeen ? "transparent" : "#5183fe",
            }}
            key={chat.chatId}
          >
            <img
              src={chat.user.avatar || "/avatar.png"}
              alt="User"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-col gap-2">
              <span className="font-medium text-white">{chat.user.name}</span>
              <p className="text-sm font-light text-gray-300">
                {chat.lastMessage}
              </p>
            </div>
          </div>
        ))}
     
        {addMode && <AddUser />}
      </div>
    </>
  );
};

export default ChatList;