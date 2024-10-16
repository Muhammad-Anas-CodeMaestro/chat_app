import { create } from 'zustand'
import UserStore from './userStore';

const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    changeChat: (chatId, user) => {
        const currentUser = UserStore.getState().currentUser
        return set({
            chatId,
            user,
        })
    }
}));

export default useChatStore