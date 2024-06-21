import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Message = {
    from: string,
    message: string,
    time: string,
}

type RoomMessage = {
    from: string,
    fromName: string,
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
    }))
}), {
    name: 'userStore',
    // Uncomment and configure the following line if you want to use a specific storage method
    // storage: sessionStorage
}));
