import { relations } from 'drizzle-orm';
import { boolean, pgEnum, pgTable, primaryKey, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';


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
    requestFriendee: many(friendsRequestTable, {relationName: 'friendee'}),
    requestFriends: many(friendsRequestTable, {relationName: 'friends'}),
    roomRequestUser: many(roomRequestTable, {relationName: 'owner'}),
    roomRequestFriend: many(roomRequestTable, {relationName: 'friends'}),
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


export const statusEnum= pgEnum("statusEnum", ["pending", "accepted", "rejected"])


export const friendsRequestTable = pgTable( "friendsRequestTable", {
    userId: uuid('userId').notNull().references(() => userTable.userId),
    friendId: uuid('friendId').notNull().references(() => userTable.userId),
    status: statusEnum('status').notNull().default('pending')
}, (t) => ({
    pk: primaryKey({columns: [t.userId, t.friendId]}),
}))


export const friendsRequestTableRelations= relations( friendsRequestTable, ({one}) => ({
    friendee: one(userTable, {
        fields: [friendsRequestTable.userId],
        references: [userTable.userId],
        relationName: 'friendee',
    }),
    friends: one(userTable, {
        fields: [friendsRequestTable.friendId],
        references: [userTable.userId],
        relationName: 'friends',
    })
}))


export const roomsTable = pgTable( "roomsTable", {
    roomId: uuid('roomId').defaultRandom().unique().primaryKey(),
    roomName: text('roomName').notNull(),
} )


export const roomsRelations= relations( roomsTable, ({many}) => ({
    usersToRooms: many(usersToRoomsTable),
    roomMessages: many(roomMessagesTable),
    roomRequests: many(roomRequestTable),
}) )


export const usersToRoomsTable= pgTable( "usersToRoomsTable", {
    userId: uuid('userId').notNull().references(() => userTable.userId),
    roomId: uuid('roomId').notNull().references(() => roomsTable.roomId),
    isAdmin: boolean('isAdmin').notNull().default(false)
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
    fromId: uuid('fromId'),
    toId: uuid('toId'),
    perMessage: text('perMessage'),
    sentAt: text('sendAt'),
    createdAt: timestamp('createdAt', {mode: 'string'}).notNull().defaultNow()
})


export const personalMessagesRelations= relations( personalMessagesTable, ({one}) => ({
    fromId: one(userTable, {
        fields: [personalMessagesTable.fromId],
        references: [userTable.userId],
    }),
}))


export const roomMessagesTable= pgTable("roomMessagesTable", {
    messageId: serial('messageId'),
    fromId: uuid('fromId'),
    roomId: uuid('roomId'),
    roomMessage: text('roomMessage'),
    sentAt: text('sendAt'),
    createdAt: timestamp('createdAt', {mode: 'string'}).notNull().defaultNow()
})


export const roomMessagesRelations= relations( roomMessagesTable, ({one}) => ({
    from: one(userTable, {
        fields: [roomMessagesTable.fromId],
        references: [userTable.userId]
    }),
    room: one(roomsTable, {
        fields: [roomMessagesTable.roomId],
        references: [roomsTable.roomId]
    })
}))


export const roomRequestTable= pgTable("roomRequestTable", {
    userId: uuid('userId').notNull().references(() => userTable.userId),
    roomId: uuid('roomId').notNull().references(() => roomsTable.roomId),
    friendId: uuid('friendId').notNull().references(() => userTable.userId),
}, (t) => ({
    pk: primaryKey({columns: [t.userId, t.roomId, t.friendId]}),
}))


export const roomRequestRelations= relations( roomRequestTable, ({one}) => ({
    user: one(userTable, {
        fields: [roomRequestTable.userId],
        references: [userTable.userId],
        relationName: 'owner',
    }),
    room: one(roomsTable, {
        fields: [roomRequestTable.roomId],
        references: [roomsTable.roomId]
    }),
    friend: one(userTable, {
        fields: [roomRequestTable.friendId],
        references: [userTable.userId],
        relationName: 'friends',
    })
}))