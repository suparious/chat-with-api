# Chat_with_USA_Economy_Data

This app leverages Natural Language Processing (NLP) to provide an interactive interface to various public APIs containing datasets about the US economy. It is aimed at Financial Analysts, Economists, and Journalists seeking accurate and up-to-date information on the US economy for fact-checking and analysis.

## Overview

Chat_with_USA_Economy_Data is built on high-performance Debian Linux servers and integrates with APIs from the Bureau of Economic Analysis, Bureau of Labour Statistics, and US Census Bureau. The application uses the OpenAI API, specifically the GPT-3.5-turbo model, to process natural language queries. The backend is developed with Node.js and MongoDB for data storage, ensuring efficient data management and scalability.

## Features

- **Real-time Economic Data**: Access up-to-date US economic statistics and historical data.
- **NLP Interface**: Utilizes the OpenAI GPT-3.5-turbo model to understand and process complex queries.
- **Data Visualization**: Ability to generate charts and graphs for visual data representation.
- **Downloadable Results**: Users can download query results in CSV, JSON, or plaintext formats.
- **High Performance**: The app is hosted on servers with multiple CPUs and GPUs, capable of handling intensive data processing.

## Getting started

### Requirements

- Node.js
- MongoDB
- OpenAI API Key

### Quickstart

1. Clone the repository to your local machine.
2. Copy `.env.example` to `.env` and fill in the necessary details.
3. Install project dependencies with `npm install`.
4. Start the server using `npm start`.

### License

Copyright (c) 2024.
