# 10x-cards

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Project Description

10x-cards is an AI-driven flashcard generation and management platform. Originally conceptualized as "Fiszki AI", this web application streamlines the creation and management of educational flashcards. Users can automatically generate flashcards by providing text input, or manually create and edit flashcards, all while benefiting from an integrated spaced repetition algorithm to enhance learning efficiency.

## Tech Stack

- **Frontend:** Astro 5, React 19, TypeScript 5
- **Styling:** Tailwind CSS 4, shadcn/ui
- **Backend:** Supabase (PostgreSQL, authentication)
- **AI Integration:** Openrouter.ai for accessing models (OpenAI, Anthropic, Google, etc.) with cost control
- **CI/CD & Hosting:** GitHub Actions, DigitalOcean

## Getting Started Locally

1. Ensure you have [Node.js](https://nodejs.org/) (version specified in `.nvmrc`: **22.14.0**) installed. You can use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions:

   ```bash
   nvm use
   ```

2. Clone the repository:

   ```bash
   git clone https://github.com/Element7/10x-cards.git
   cd 10x-cards
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

## Available Scripts

- **dev:** Starts the Astro development server (`npm run dev`)
- **build:** Builds the project for production (`npm run build`)
- **preview:** Previews the production build locally (`npm run preview`)
- **lint:** Runs ESLint to analyze code quality (`npm run lint`)
- **lint:fix:** Automatically fixes linting errors (`npm run lint:fix`)
- **format:** Formats code using Prettier (`npm run format`)

## Project Scope

This project aims to simplify flashcard creation and learning by leveraging AI. Key features include:

- **AI-Generated Flashcards:** Automatically generate bidirectional flashcards from provided text input with validation.
- **Manual Flashcard Creation:** Edit and create flashcards manually with robust validation.
- **Flashcard Management:** Browse, edit, or delete flashcards with secure user access.
- **Spaced Repetition Integration:** Enhance learning efficiency with a built-in spaced repetition algorithm.
- **User Authentication:** Secure registration and login to protect user data.

## Project Status

This project is currently in active development and is at an early MVP stage. Feedback and contributions are welcome as we continue to refine and expand its features.

## License

This project is licensed under the MIT License.
