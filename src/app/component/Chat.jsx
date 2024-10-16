"use client";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faFaceSmile,
  faImage,
  faInfo,
  faMicrophone,
  faPhone,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  db,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "@/database/fireBaseConfique";
import useChatStore from "@/database/chatStore";
import UserStore from "@/database/userStore";
import upload from "@/database/upload";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState();
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { currentUser } = UserStore();
  const { chatId, user } = useChatStore();

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const HandleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const endRef = useRef(null);
  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      const chatData = res.data();
      if (chatData) {
        setChat(chatData);
      } else {
        console.log("NO DATA ARE FOUND");
        setChat(null);
      }
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const HandleSend = async () => {
    if (text == " ") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.userId,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIds = [currentUser.userId, user.userId];

      userIds.forEach(async (id) => {
        const userChatsRef = doc(db, "userchat", id);
        const userChatsSnapshot = getDoc(userChatsRef);

        if ((await userChatsSnapshot).exists) {
          const userChatsData = (await userChatsSnapshot).data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.userId ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }

    setImg({
      file: null,
      url: "",
    });

    setText("");
  };

  return (
    <>
      <div className="flex-[2] border-l border-r border-[#dddddd35] h-full flex flex-col">
        {/* Top Section */}
        <div className="px-5 py-4 pb-2 flex items-center justify-between border-b border-[#dddddd35]">
          <div className="flex items-center gap-5">
            <img
              src={user?.avatar || "/avatar.png"}
              alt="userImage"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex flex-col gap-1">
              <span className="text-lg font-bold">{user?.name}</span>
              <p className="text-sm font-light text-gray-400">
                Lorem ipsum dolor sit amet.
              </p>
            </div>
          </div>
          <div className="flex gap-5">
            <FontAwesomeIcon icon={faPhone} className="size-5 w-5 h-5" />
            <FontAwesomeIcon icon={faVideo} className="size-5 w-5 h-5" />
            <FontAwesomeIcon icon={faInfo} className="size-5 w-5 h-5" />
          </div>
        </div>
        {/* Center Section */}
        <div className="px-5 py-4 flex-1 overflow-y-scroll flex flex-col gap-5">
          {chat?.messages?.map((message) => (
            <div
              className={
                message.senderId === currentUser?.userId
                  ? "max-w-[80%] flex gap-5 self-end"
                  : "max-w-[80%] flex gap-5 self-start"
              }
              key={message.senderId}
            >
              { message.senderId === currentUser?.userId ? <></> : <img src={user?.avatar || "avatar.png"} className="w-8 h-8 rounded-full object-cover"/>}
              <div className="flex-1 flex flex-col gap-1">
                {message.img && (
                  <img
                    src={message.img}
                    alt="sender Message"
                    className="w-full h-auto rounded-xl object-cover"
                  />
                )}
                <p className={
                    message.senderId === currentUser?.userId
                      ? "px-5 py-4 rounded-lg bg-blue-300"
                      : "px-5 py-4 rounded-lg bg-[rgba(17,25,40,0.3)]"
                  }
                >
                  {message.text}
                </p>
                {/* <span className="text-xs">1 min ago</span> */}
              </div>
            </div>
          ))}
          {img.url && (
            <div className="max-w-[80%] flex gap-5 self-end">
              <div className="flex-1 flex flex-col gap-1">
                <img src={img.url} alt="" />
              </div>
            </div>
          )}
          <div ref={endRef}></div>
        </div>
        {/* bottom Section */}
        <div className="px-5 py-4 flex items-center justify-between border-t border-[#dddddd35] gap-5 mt-auto">
          <div className="flex gap-5">
            <label htmlFor="file">
              <FontAwesomeIcon
                icon={faImage}
                className="size-5 w-5 h-5 cursor-pointer"
              />
            <input
              type="file"
              id="file"
              className="hidden"
              onChange={HandleImg}
            />
            </label>
            <FontAwesomeIcon
              icon={faCamera}
              className="size-5 w-5 h-5 cursor-pointer"
            />
            <FontAwesomeIcon
              icon={faMicrophone}
              className="size-5 w-5 h-5 cursor-pointer"
            />
          </div>
          <input
            type="text"
            value={text}
            placeholder="Type a Message"
            onChange={handleChange}
            className="flex-1 bg-[rgba(17,25,40,0.5)] border-none outline-none text-white px-5 py-4 rounded-lg text-base"
          />
          <div className="relative">
            <FontAwesomeIcon
              icon={faFaceSmile}
              className="size-5 w-5 h-5 cursor-pointer"
              onClick={() => {
                setOpen((prev) => !prev);
              }}
            />
            <div className="absolute bottom-12 right-0">
              <EmojiPicker open={open} onEmojiClick={handleEmoji} />
            </div>
          </div>
          <button
            className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed"
            onClick={HandleSend}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Chat;
