# HTTP UI

A modern, lightweight HTTP client for testing and debugging APIs. Built with Next.js and designed to be fast, intuitive, and self-hosted.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Features

- **Request Builder** - Support for GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS methods
- **Collections** - Organize requests into collections and folders
- **Environment Variables** - Use `{{variables}}` in URLs, headers, and body with support for global variables
- **Authentication** - Built-in support for Bearer tokens, Basic auth, and API keys
- **Request History** - Automatically tracks all executed requests
- **Import/Export** - Share collections as JSON files
- **Keyboard Shortcuts** - Save with `Cmd+S` / `Ctrl+S`
- **Dark Mode** - Easy on the eyes
- **Self-Hosted** - Your data stays on your machine

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn (recommended) or npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/http-ui.git
   cd http-ui
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up the database:

   ```bash
   yarn prisma generate
   yarn prisma db push
   ```

4. Start the development server:

   ```bash
   yarn dev
   ```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Keyboard Shortcuts

| Action       | macOS                  | Windows/Linux          |
| ------------ | ---------------------- | ---------------------- |
| Save Request | `Cmd+S`                | `Ctrl+S`               |
| Send Request | `Enter` (in URL field) | `Enter` (in URL field) |

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/)
- **State**: [Zustand](https://zustand-demo.pmnd.rs/) (client), [TanStack Query](https://tanstack.com/query) (server)
- **Database**: [SQLite](https://www.sqlite.org/) with [Prisma](https://www.prisma.io/)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes for CRUD operations
│   └── page.tsx       # Main application page
├── components/
│   ├── collections/   # Collection tree sidebar
│   ├── request-builder/  # URL bar, headers, body editors
│   ├── response-viewer/  # Response display
│   └── ui/            # Reusable UI components
├── hooks/             # React Query hooks
├── store/             # Zustand store
└── types/             # TypeScript types
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License
