import ApolloClient from 'apollo-boost'

export const client = new ApolloClient({
    uri: 'https://graphql-tod.herokuapp.com/v1/graphql'
  })