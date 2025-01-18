# Nuxt 3 Kanban Board

This is a Kanban board application built with Nuxt 3.

## Table of Contents
- [Nuxt 3 Kanban Board](#nuxt-3-kanban-board)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Configuration](#configuration)
  - [Docker](#docker)
    - [Build and Run with Docker Compose](#build-and-run-with-docker-compose)
  - [License](#license)

## Features
- Drag and drop tasks between columns (To Do, In Progress, Done).
- Add, edit, and delete tasks.
- Responsive design.
- Utilizes Font Awesome icons and Google Fonts.

## Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/nuxt-kanban-board.git
    cd nuxt-kanban-board
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:
    ```env
    BASE_URL=http://localhost:3000
    ```

4. Run the development server:
    ```sh
    npm run dev
    ```

## Usage
- Access the application in your browser at `http://localhost:3000`.

## Configuration
- The application uses the following environment variables:
    - `BASE_URL`: The base URL of the server side.

## Docker
### Build and Run with Docker Compose
1. Build the Docker image and start the container using Docker Compose:
    ```sh
    docker-compose up --build
    ```

2. The application will be available at `http://localhost:3000`.

## License
This project is licensed under the MIT License.
