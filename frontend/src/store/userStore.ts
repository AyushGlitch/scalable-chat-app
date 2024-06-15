import { create } from 'zustand'


type state= {
    user: {
        userId: string,
        email: string,
        username: string,
    }
}

type userStoreType= {
    user: {
        userId: string,
        email: string,
        username: string,
    },
    setUser: (newUser: state['user']) => void,
}


export const useUserStore= create<userStoreType>( (set) => ({
    user: {
        userId: '',
        email: '',
        username: '',
    },
    setUser: (newUser) => set( () => ({
        user: {
            userId: newUser.userId,
            email: newUser.email,
            username: newUser.username,
        }
    }) )
}) )

