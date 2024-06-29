CSV Viewer and Analyzer

This is a Next.js application for uploading, viewing, and analyzing CSV files. It provides features for data visualization and analysis.

## Getting Started

To create a new project with this setup, you can use the following command:

```bash
npx create-next-app csv-viewer
After creating the project, navigate to the project directory:
bashCopycd csv-viewer
Installation
Install the required dependencies:
npm install
Running the Project
To run the development server:
npm run dev
Open http://localhost:3000 with your browser to see the result.
Build for Production
To build the application for production:
npm run build
To start the production server:
npm start
Project Description
This application allows users to:

Upload CSV files
View CSV data in a tabular format
Visualize data using charts (Chord Diagram and Bubble Chart)
Search and sort CSV data
Analyze CSV data with various tools

Database
This project uses MongoDB as its database. Make sure to set up your MongoDB connection string in the .env.local file:
CopyMONGODB_URI=your_mongodb_connection_string
Dependencies

Next.js: React framework for production
React: JavaScript library for building user interfaces
MongoDB: Database for storing file information
Mongoose: MongoDB object modeling for Node.js
csv-parse: CSV parsing library
d3: Data visualization library
multer: Middleware for handling multipart/form-data
dotenv: Loads environment variables from .env file
typewriter-effect: Creates a typewriter effect for text

Dev Dependencies

ESLint: Linting utility for JavaScript and JSX
Tailwind CSS: Utility-first CSS framework
PostCSS: Tool for transforming CSS with JavaScript

Scripts

dev: Runs the development server
build: Builds the application for production
start: Starts the production server
lint: Runs the linter

Version
Current version: 0.1.0
License
This project is private and not licensed for public use.
