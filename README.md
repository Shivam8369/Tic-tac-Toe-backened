# Tic-Tac-Toe Backend

A RESTful backend for a Tic-Tac-Toe game with user management and game history tracking.

## Features

- User registration and authentication
- Create and play Tic-Tac-Toe games
- Game history tracking
- User timeLine

## Prerequisites

- Node.js (v18 or higher)
- MongoDB campus installed
- Postman for testing

## Setup

1. Clone the repository on local
2. Install dependencies: npm install

3. Create a `.env` file with the following variables:

   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/tic-tac-toe
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=24h

4. Start the server: npm run dev

## Assumption I made
I assume that the tic-tac-toe game is played by two users, with one user creating the game and adding the player 2 ID. Both players are playing in two separate tabs, and all game validations are handled on the backend only.

## Approach
creating 3 model user, game and move 
creating 2 controller authentication and games
user one will create a game and add other user to it 
both will play the game in separate tab in on every click a backened  call is made for validation


## Design Decisions

1. **Authentication**: JWT-based authentication for secure API access
2. **Database Schema**:
   - Users: Store user credentials and game statistics
   - Games: Track game state, moves, and results
   - Move: Track the move made by the user and adding the reference to Game model
3. **Game Logic**: Server-side validation of moves and win conditions
4. **Error Handling**: Comprehensive error handling with meaningful messages

## Security Features

- Password hashing using bcrypt
- JWT token authentication
- Input validation
- Error handling middleware


github Link : https://github.com/Shivam8369/Tic-tac-Toe-backened
