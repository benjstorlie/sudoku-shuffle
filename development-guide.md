# Collaborative Sudoku App Project Development Guide

## Overview

*(some generated text)*
The Collaborative Sudoku App is a MERN-stack single-page application designed to provide a user-focused platform for playing and managing Sudoku games collaboratively. The app combines a scalable MongoDB back end, a GraphQL API, and an Express.js and Node.js server with a React front end. This guide outlines the essential steps and best practices for developing and contributing to the project.

## Inspiration

1. [Sudoku Slam](https://www.sudokuslam.com/)
2. [Cracking the Cryptic / Sudoku Pad](https://app.crackingthecryptic.com/)

## Getting Started



## Front End (Client)

### Rendering the Sudoku Game

- Implement a responsive Sudoku grid using CSS Grid layout.
- Create React components to represent the Sudoku grid, boxes, and cells.
- Display digits and candidates within cells.
- Implement user interactions to input digits and candidates.
- Highlight cells based on user interactions and game rules.

### User Authentication

- Set up user registration and login forms.
- Implement JWT-based authentication using the `jsonwebtoken` library.
- Manage user authentication state using React Context and the `useContext` hook.
- Redirect users based on their authentication status.

### User Stats

- Create a user profile page to display personal statistics.
- Fetch and display user-specific data such as games solved, completion time, etc.
- Implement graphical representations of user progress and achievements.

## Back End (Server)

### Data Models and Schema

- Design MongoDB schemas for users, games, moves, and statistics.
- Implement GraphQL schema using the `graphql` and `graphql-tools` libraries.

### GraphQL API

- Set up an Express.js server to handle GraphQL queries and mutations.
- Implement resolvers to handle various CRUD operations.
- Define queries and mutations for user authentication, game state, and user statistics.
- Use `apollo-server-express` for integrating GraphQL with Express.

### User Authentication

- Implement user registration and login routes using `express-validator`.
- Hash and salt passwords using the `bcrypt` library.
- Generate and verify JWT tokens for secure user authentication.

## Database (MongoDB)

### Database Configuration

- Set up MongoDB database and collections for users, games, moves, and statistics.
- Establish database connections using the `mongoose` library.

### Data Management

- Create MongoDB models for users, games, moves, and statistics.
- Implement functions to create, read, update, and delete data.

## Collaboration Workflow

- Utilize version control (e.g., Git) to manage codebase changes and collaborate with other developers.
- Create feature branches for new functionality and merge changes via pull requests.
- Use issue tracking tools (e.g., GitHub Issues) to manage tasks, bugs, and enhancements.

## Deployment

### Deploying Front End to GitHub Pages

1. Build the React app for production:
```cd collaborative-sudoku-app/client
npm run build
```

2. Deploy to GitHub Pages:
```npm run deploy```

### Heroku Deployment (Server)

1. Set up a Heroku app and configure environment variables.
2. Deploy the server to Heroku:

## Folder Structure

* [client](./client/): This directory contains the React front end code.
  * [public/](./client/public/): Static assets and the main HTML file.
    * [index.html](./client/public/index.html)
    * ...
  * [src/](./client/src/): React application source code.
    * [components/](./client/src/components/): Reusable React components.
      * [auth/](./client/src/components/auth/): Authentication-related components.
        * [Login.js](./client/src/components/auth/Login.js)
        * [Register.js](./client/src/components/auth/Register.js)
      * [game/](./client/src/components/game/): Components related to rendering the Sudoku game.
        * SudokuGrid.js
        * Cell.js
      * [profile/](./client/src/components/profile/): Components related to user profiles and statistics.
        * [Profile.js](./client/src/components/profile/Profile.js)
      * [nav/](./client/src/components/profile/nav/)
        * [Nav.js](./client/src/components/profile/nav/Nav.js)
        * [NewGameForm.js](./client/src/components/profile/nav/NewGameForm.js)
        * [Header.js](./client/src/components/profile/nav/Header.js)
        * [Footer.js](./client/src/components/profile/nav/Footer.js)
    * [contexts/](./client/src/contexts/)
      * [GameContext.js](./client/src/contexts/GameContext.js)
    * [utils/](./client/src/utils/)
      * [api.js](./client/src/utils/api.js)
      * [gameUtils.js](./client/src/utils/gameUtils.js): Handles functions that change the game data, imported into [GameContext.js](./client/src/contexts/GameContext.js).
    * [App.js](./client/src/App.js): Main React component.
    * [index.js](./client/src/index.js): Entry point for the React app.
  * [package.json](./client/package.json)
* [server/](./server/): This directory contains the Node.js back end code.
  * [models/](./server/models/): MongoDB schema definitions.
  * [resolvers/](./server/resolvers/)
  * [routes/](./server/routes/): Express routes for different parts of the application.
  * [utils/](./server/utils/): Utility functions (e.g., JWT handling).
  * [server.js](./server/server.js): Entry point for the Express server.
  * [package.json](./server/package.json)
* [.gitignore](./.gitignore): List of files and directories to be ignored by Git.
* [README.md](./README.md): Documentation for the project.
* [package.json](./package.json)