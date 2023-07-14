// Import necessary dependencies
const express = require("express"); // Express.js for server creation
const path = require("path"); // Node.js path module for handling and transforming file paths
const { ApolloServer } = require("apollo-server-express"); // ApolloServer, GraphQL server for Express.js
const { typeDefs, resolvers } = require("./schemas"); // GraphQL schema - typeDefs and resolvers
const { authMiddleware } = require("./utils/auth"); // Middleware for authentication

// Database connection configuration
const db = require("./config/connection");

// Initialize Express.js server
const app = express();
// Use environment defined port or 3001 if not defined
const PORT = process.env.PORT || 3001;

// Create an instance of ApolloServer
const server = new ApolloServer({
  typeDefs, // GraphQL schema to use
  resolvers, // Resolver functions to handle GraphQL queries
  context: authMiddleware, // Middleware function to authenticate users
});

// Apply Apollo middleware to Express.js server
server.applyMiddleware({ app });

// Express.js middleware for parsing request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define the path to the build directory
const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../client/build");
// Use Express.js middleware to serve static files from the build directory
app.use(express.static(buildPath));

// In a production environment, serve static assets from the build directory
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// Define a catch-all route handler for any requests not handled by other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html")); // Always return the main index.html
});

// Connect to the database and start the server
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
