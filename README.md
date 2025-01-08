
# Next.js LinkedIn Integration Example

This project demonstrates how to integrate LinkedIn data fetching into a Next.js application using the `LI_AT_COOKIE` for authentication. Follow these instructions to set up and run the project locally.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (LTS version recommended)
- npm (Node Package Manager)

## Getting Started

### Step 1: Clone the Repository

First, clone this repository to your local machine using Git:

```bash
git clone https://github.com/Vk2401/linkedin-profile-scrapper.git
cd linkedin-profile-scrapper 
```

### Step 2: Install Dependencies

Navigate to the project directory and install the required npm packages:

```bash
npm install
```

### Step 3: Set Up Environment Variables

You will need to create a `.env.local` file in the root directory of the project to store your environment variables. This file should not be tracked by Git for security reasons.

```bash
touch .env.local
```

Add the following environment variable to the `.env.local` file:

```plaintext
LI_AT_COOKIE=your_linked_in_li_at_cookie_here
```

To obtain your `LI_AT_COOKIE`, follow these steps:
1. Log in to your LinkedIn account via a web browser.
2. Open the browser's developer tools (usually F12 or right-click and select "Inspect").
3. Navigate to the "Application" tab, then find the "Cookies" section in the sidebar.
4. Look for the `li_at` cookie and copy its value.

### Step 4: Running the Project

With your environment set up and dependencies installed, you can now run the project:

```bash
npm run dev
```

This command starts the Next.js development server on `http://localhost:3000`. Open this URL in your browser to view the application.

## Contributing

Contributions to this project are welcome! Please fork the repository and submit a pull request with your proposed changes.

## License

This project is open source and available under the [MIT License](LICENSE).
