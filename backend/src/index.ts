import { ApolloServer } from "apollo-server-express"
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core"
import express from "express"
import http from "http"
import typeDefs from "../src/graphql/typeDefs"
import resolvers from "../src/graphql/resolvers"
import { makeExecutableSchema } from "@graphql-tools/schema"

async function main() {
  const app = express()
  const httpServer = http.createServer(app)

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  })
  await server.start()
  server.applyMiddleware({ app })

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  )
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}ql`)
}

main().catch((err) => console.log(err))
