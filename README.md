# GroupRank

GroupRank is a web application that allows users to create polls with multiple options, submit rankings for those options, and calculate average rankings based on user input. The application consists of a backend API built with ASP.NET Core and Entity Framework Core, and a frontend built with React.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- Create polls with a title and multiple options.
- Submit rankings for poll options.
- Calculate and display average rankings for each option.
- Prevent circular references in JSON responses.
- Handle concurrency and database migrations with Entity Framework Core.

## Technologies Used

- **Backend:**
  - ASP.NET Core
  - Entity Framework Core
  - MySQL (using Pomelo Entity Framework Core provider)
- **Frontend:**
  - React
  - Axios (for HTTP requests)
- **Database:**
  - MySQL (running in a Docker container)

## Prerequisites

- [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
- [Node.js and npm](https://nodejs.org/) (for the frontend)
- [Docker](https://www.docker.com/) (for running MySQL in a container)
- [MySQL Client Tools](https://dev.mysql.com/downloads/mysql/) (optional, for database management)

