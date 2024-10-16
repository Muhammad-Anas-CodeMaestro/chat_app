"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Chat from "./Chat";
import List from "./list/List";
import { auth, onAuthStateChanged } from "@/database/fireBaseConfique";
import UserStore from "@/database/userStore";
import useChatStore from "@/database/chatStore";

const MainChatPage = () => {
  const route = useRouter();

  const { currentUser, isLoading, fetchUserInfo } = UserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid)
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);


  if (isLoading)
    return (
      <div className="py-12 px-6 text-2xl md:text-4xl rounded-md bg-[rgba(17,25,40,0.9)]">
        Loading...
      </div>
    );

    const HandleLogOut = () =>{
      route.push("signin")
    }

  return (
    <>
      <div className="w-11/12 lg:w-4/5 h-5/6 bg-[rgba(17,25,40,0.75)] backdrop-blur-lg saturate-150 rounded-lg border border-[rgba(255,255,255,0.125)] flex">
        {currentUser ? (
          <>
              <List />
              {chatId && <Chat />}
          </>
        ) : (
          route.push("/signin")
        )}
      </div>
      <div className="absolute top-12 right-10 bg-[rgba(17,25,40,0.75)] backdrop-blur-lg saturate-150 rounded-lg border border-[rgba(255,255,255,0.125)] p-3 cursor-pointer" onClick={HandleLogOut}>Log out</div>
    </>
  );
};

export default MainChatPage;
