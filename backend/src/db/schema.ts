import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, serial, text, uuid } from 'drizzle-orm/pg-core';


export const userTable = pgTable( "userTable", {
    userId: uuid('userId').defaultRandom().unique(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    username: text('username').notNull().unique(),
} )


export const userRelations = relations( userTable, ({many}) => ({
    friendee: many(friendsTable, {relationName: 'friendee'}),
    friends: many(friendsTable, {relationName: 'friends'}),
    usersToRooms: many(usersToRoomsTable),
    personalMessages: many(personalMessagesTable),
    roomMessages: many(roomMessagesTable),
}))


export const friendsTable = pgTable( "friendsTable", {
    userId: uuid('userId').notNull().references(() => userTable.userId),
    friendId: uuid('friendId').notNull().references(() => userTable.userId),
}, (t) => ({
    pk: primaryKey({columns: [t.userId, t.friendId]}),
}) )


export const friendsRelations = relations( friendsTable, ({one}) => ({
    friendee: one(userTable, {
        fields: [friendsTable.userId],
        references: [userTable.userId],
        relationName: 'friendee',
    }),
    friends: one(userTable, {
        fields: [friendsTable.friendId],
        references: [userTable.userId],
        relationName: 'friends',
    })
}) )


export const roomsTable = pgTable( "roomsTable", {
    roomId: uuid('roomId').defaultRandom().unique(),
    roomName: text('roomName').notNull(),
} )


export const roomsRelations= relations( roomsTable, ({many}) => ({
    usersToRooms: many(usersToRoomsTable),
    roomMessages: many(roomMessagesTable),
}) )


export const usersToRoomsTable= pgTable( "usersToRoomsTable", {
    userId: uuid('userId').notNull().references(() => userTable.userId),
    roomId: uuid('roomId').notNull().references(() => roomsTable.roomId),
}, (t) => ({
    pk: primaryKey({columns: [t.userId, t.roomId]}),
}) )


export const usersToRoomsRelations= relations( usersToRoomsTable, ({one}) => ({
    user: one(userTable, {
        fields: [usersToRoomsTable.userId],
        references: [userTable.userId],
    }),
    room: one(roomsTable, {
        fields: [usersToRoomsTable.roomId],
        references: [roomsTable.roomId],
    }),
}) )


export const personalMessagesTable= pgTable("personalMessagesTable", {
    messageId: serial('messageId'),
    from: uuid('from'),
    to: uuid('to'),
    message: text('message')
})


export const personalMessagesRelations= relations( personalMessagesTable, ({one}) => ({
    from: one(userTable, {
        fields: [personalMessagesTable.from],
        references: [userTable.userId],
    }),
}))


export const roomMessagesTable= pgTable("roomMessagesTable", {
    messageId: serial('messageId'),
    from: uuid('from'),
    roomId: uuid('roomId'),
    message: text('message')
})


export const roomMessagesRelations= relations( roomMessagesTable, ({one}) => ({
    from: one(userTable, {
        fields: [roomMessagesTable.from],
        references: [userTable.userId]
    }),
    room: one(roomsTable, {
        fields: [roomMessagesTable.roomId],
        references: [roomsTable.roomId]
    })
}))