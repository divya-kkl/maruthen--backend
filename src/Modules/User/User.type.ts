import { gql } from "apollo-server-express"

export const UserType = gql`

enum Gender {
  MALE
  FEMALE
  OTHER
}

type UserAddress {
  id: ID
  firstName: String
  lastName: String
  address: String
  apartment: String
  city: String
  state: String
  pincode: Int
  country: String
  phone: String
  isDefault: Boolean
}

type User {
  id: ID!
  username: String!
  email: String!
  country: String
  state: String
  city: String
  address: String
  phone_number: String
  pincode: Int
  gender: String
  addresses: [UserAddress]
}
  
input RegisterInput {
  username: String!
  email: String!
  password: String!
  country: String
  state: String
  city: String
  address: String
  phone_number: String
  pincode: Int
  gender: String
}

input UserAddressInput {
  id: ID
  firstName: String
  lastName: String
  address: String
  apartment: String
  city: String
  state: String
  pincode: Int
  country: String
  phone: String
  isDefault: Boolean
}

input UpdateUserInput {
  username: String
  email: String
  country: String
  state: String
  city: String
  address: String
  phone_number: String
  pincode: Int
  gender: String
  addresses: [UserAddressInput]
}
  type RegisterResponse {
   user: User
   token: String 
}
   input LoginInput {
    email: String!
    password: String!
}
    type UserResponse {
        users: [User]
        totalCount: Int
    }
    type Query {
    getAllUser(search: String, page: Int, limit: Int): UserResponse

    getUserById(id: ID!): User
    getUser(search: String, page: Int, limit: Int): UserResponse
}
    
    type Mutation {
    registerUser(input: RegisterInput): RegisterResponse!
    loginUser(input: LoginInput): RegisterResponse!
    updateUser(id: ID!, input: UpdateUserInput): User!
    deleteUser(id: ID!): String!
}
`