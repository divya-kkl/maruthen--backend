import { UserService } from "./User.services.js";

export const UserResolver = {
    Query: {
        getAllUser: async (_: any, __: any, context: any) => {
            return UserService.getAllUsers(__.search, __.page, __.limit);
        },

        getUserById: async (_: any, __: any, context: any) => {
            return UserService.getUserById(__.id);
        },
        getUser: async (_: any, __: any, context: any) => {
            return UserService.getAllUsers(__.search, __.page, __.limit);
        }
    },
    Mutation: {
        registerUser: async (_: any, __: any, context: any) => {
            return UserService.register(__.input);
        },
        loginUser: async (_: any, __: any, context: any) => {
            return UserService.loginUser(__.input);
        },
        updateUser: async (_: any, __: any, context: any) => {
            return UserService.updateUser(__.id, __.input);
        },
        deleteUser: async (_: any, __: any, context: any) => {
            return UserService.deleteUser(__.id);
        },
    }
};
