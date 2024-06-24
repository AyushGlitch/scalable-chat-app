import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type Message = {
    from: string,
    message: string,
    time: string,
}

type RoomMessage = {
    from: string,
    message: string,
    time: string,
}

type state = {
    user: {
        userId: string,
        email: string,
        username: string,
    },
    perChatMessages: {
        [key: string]: Message[]
    },
    roomChatMessage: {
        [key: string]: RoomMessage[]
    },
}

type userStoreType = {
    user: {
        userId: string,
        email: string,
        username: string,
    },
    perChatMessages: {
        [key: string]: Message[]
    },
    roomChatMessage: {
        [key: string]: RoomMessage[]
    },
    setUser: (newUser: state['user']) => void,
    setPerChatMessages: (newMessage: Message, selected: string) => void,
    setRoomChatMessage: (newMessage: RoomMessage, selected: string) => void,
    setSavedPerChats: (Messages: Message[], selected: string) => void,
    setSavedRoomChats: (Messages: RoomMessage[], selected: string) => void,
}

export const useUserStore = create<userStoreType>()(persist((set) => ({
    user: {
        userId: '',
        email: '',
        username: '',
    },
    perChatMessages: {},
    roomChatMessage: {},
    setUser: (newUser) => set(() => ({
        user: newUser
    })),
    setPerChatMessages: (newMessage, selected) => set((state) => ({
        perChatMessages: {
            ...state.perChatMessages,
            [selected]: state.perChatMessages[selected]
                ? [newMessage, ...state.perChatMessages[selected]]
                : [newMessage]
        }
    })),
    setRoomChatMessage: (newMessage, selected) => set((state) => ({
        roomChatMessage: {
            ...state.roomChatMessage,
            [selected]: state.roomChatMessage[selected]
                ? [newMessage, ...state.roomChatMessage[selected]]
                : [newMessage]
        }
    })),
    setSavedPerChats: (Messages, selected) => set( (state) => ({
        perChatMessages: {
            ...state.perChatMessages,
            [selected]: Messages
        }
    }) ),
    setSavedRoomChats: (Messages, selected) => set( (state) =>({
        roomChatMessage: {
            ...state.roomChatMessage,
            [selected]: Messages
        }
    }) )
}), {
    name: 'userStore',
    storage: createJSONStorage(() => sessionStorage)
    
}));
