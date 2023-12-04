import { GraphQLObjectType, 
         GraphQLString, 
         GraphQLID, 
         GraphQLSchema, 
         GraphQLList, 
         GraphQLBoolean,
         GraphQLNonNull
        
        } from 'graphql'

import { deleteOne, find, findOne, update} from '../service/user.service'
import { create, login } from '../service/auth.service'



const UserType = new GraphQLObjectType({
    name:'User',
    fields: () => ({
        id: {type : GraphQLID},
        firstName: { type: GraphQLString},
        lastName: { type: GraphQLString},
        email : { type: GraphQLString},
        password: { type: GraphQLString},
        isLock: {type: GraphQLBoolean}
    })
})


const LoginType = new GraphQLObjectType({
    name: 'Login',
    fields: () => ({
        token: { type: GraphQLString },  
        user: { type: UserType }        
    })
});



const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields: {
        users: {
            type: new GraphQLList(UserType),
            async resolve(parent, args){
                return await find()
            }
        },
        user :{
            type: UserType,
            args: {id: {type:GraphQLID}},
            async resolve(parent, args){
                return  await findOne(args.id);
            }
        }
    }
})

// Mutation
const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields: {
        // Add new user
        addUser:{
            type: UserType,
            args:{
                firstName: {type: new GraphQLNonNull(GraphQLString) },
                lastName: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)}
            },
            async resolve(parent, args){

                const { firstName, lastName, email, password } = args
                const myUser = { firstName, lastName, email, password }
                return await create(myUser)
            }
        },
        // Update Mutation
        updateUser:{
            type: UserType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLID) },
                firstName: {type: GraphQLString },
                lastName: {type: GraphQLString},
                email: {type: GraphQLString},
                isLock: {type: GraphQLBoolean}
            },
            async resolve(parent, args){

                const { firstName, lastName, email, password } = args
                const updateData = { firstName, lastName, email, password }
                return await update(args.id, updateData)
            }
        },
        // Delete User
        deleteUser:{
            type: UserType,
            args: { id : {type : new GraphQLNonNull(GraphQLString)}},
            async resolve(parent, args){
                return await deleteOne(args.id)
            }
        },
        LoginUser: {
            type: LoginType,
            args: {
                email: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)}
            },
            async resolve(parent, args){
                const { email, password} = args
                const authData = { email, password}
                try {
                    const result = await login(authData);
                    return result;
                  } catch (error) {
                    // Handle authentication errors, for example, throw a specific GraphQL error
                    throw new Error('Invalid credentials');
                  }
            }
        }
    }
})
const schema = new GraphQLSchema({
    query: RootQuery,
    mutation
  });
  
  export default schema;