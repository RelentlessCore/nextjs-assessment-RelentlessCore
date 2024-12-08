# Todo List - NextJS 14 Project

This is my implementation of a todo list application using Next.js 14. I built it as part of the technical assessment to demonstrate my understanding of modern web development practices.

## Project Overview

I created a full-stack todo list application where users can manage their tasks. I focused on making it simple to use while implementing all the required features:

- Create new tasks
- View all tasks in a clean interface
- Update task titles and completion status
- Delete tasks when they're done
- Search through tasks quickly

## Why I Chose These Technologies

For this project, I worked with:

- **Next.js 14**: I used the new app router for better page organization
- **TypeScript**: Helps catch errors early and makes the code more maintainable
- **PostgreSQL**: Reliable database that works well with Prisma
- **Prisma**: Makes database operations type-safe and easier to manage
- **tRPC**: Ensures type safety between frontend and backend
- **Zustand**: Simple but powerful state management
- **Tailwind**: Quick way to create a responsive design

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your database:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## What I Learned

Building this project helped me understand:
- How to structure a full-stack Next.js application
- Working with tRPC for type-safe API calls
- Managing client-side state with Zustand
- Using Prisma for database operations
- Creating a responsive UI with Tailwind

## Project Structure

- `src/app`: Pages and components
- `src/server`: Backend logic and API routes
- `src/store`: State management
- `prisma`: Database schema
- `src/types`: TypeScript type definitions
