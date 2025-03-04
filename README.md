# Budgeting App

Don't bother, this application is a very rough prototype. I mainly wanted to create a proof of concept. I will likely not continue working on this since I have proven my main idea and have many more ideas I would like to pursue.

This budgeting application helps users manage their finances by automatically parsing transactional data from emails. Instead of relying on paid services or manual data entry, the app monitors a designated email account for transaction notifications from financial institutions and extracts relevant data.

The app uses an off-the-shelf instruct-trained LLM to identify and extract transaction details from emails. While the success rate is mixed, it can be improved with fine-tuning or better prompts, such as well-crafted multi-shot prompts.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have installed [Node.js](https://nodejs.org/) (version 14 or higher).
- You have installed [npm](https://www.npmjs.com/) (version 6 or higher).
- You have a code editor like [Visual Studio Code](https://code.visualstudio.com/).

## Setup

To set up the project locally, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/nathangrove/budgeting-app.git
    ```

2. Navigate to the project directory:
    ```sh
    cd budgeting-app
    ```

3. Install the dependencies:
    ```sh
    npm install
    ```

## Development

To start the development server, run:
```sh
docker compose up -d
```

This will start the application and you can view it in your browser at `http://localhost:3000`.

## Running LLM Model Locally

To run a local LLM model for processing, follow these steps:

1. Ensure you have a compatible environment for running the model.
2. Download the "deepseek-r1-distill-llama-8b" model from the appropriate source.
3. Load and run the model using your preferred framework or library.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
