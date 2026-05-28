# Chatbot Frontend

This is a frontend for a chatbot using ReactJS and TypeScript. It connects to the FastAPI backend.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool
- **TanStack Router v1** — file-based routing with auth guards
- **TanStack Query v5** — server state (sessions, messages)
- **Tailwind CSS v3** + **shadcn/ui** — styling and components
- **Vitest** + **React Testing Library** — unit tests

## Getting Started

```bash
npm install
npm run dev       # starts at http://localhost:5173
```

The backend must be running at `http://localhost:8000` (or set `VITE_API_URL`).

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Backend base URL. Also used to derive the WebSocket URL (`http` → `ws`, `https` → `wss`). |

Create a `.env.local` to override:
```
VITE_API_URL=https://api.example.com
```

## Scripts

```bash
npm run dev        # dev server with HMR
npm run build      # production build → dist/
npm run test       # watch mode
npm run test:run   # single run (17 tests)
```

## Project Structure

```
src/
├── features/
│   ├── auth/
│   │   ├── LoginForm.tsx       # POST /auth/login → JWT → /chat
│   │   └── RegisterForm.tsx    # POST /auth/register → JWT → /chat
│   └── chat/
│       ├── queries.ts          # useSessions, useMessages (TanStack Query)
│       ├── useWebSocket.ts     # WS connection, streaming, query invalidation
│       ├── MessageBubble.tsx   # Single message (user / assistant)
│       ├── MessageList.tsx     # Scrollable history + live streaming bubble
│       ├── ChatInput.tsx       # Textarea + send button
│       ├── ChatWindow.tsx      # Composes list + input, owns WS lifecycle
│       └── SessionSidebar.tsx  # Session list, new chat, sign out
├── lib/
│   ├── authStore.ts            # getToken / setToken / clearToken (localStorage)
│   ├── fetchClient.ts          # fetch wrapper: JWT header, 401 redirect, ApiError
│   └── queryClient.ts          # TanStack Query client instance
└── routes/
    ├── __root.tsx
    ├── index.tsx               # Redirects / → /chat or /login
    ├── login.tsx
    ├── register.tsx
    ├── chat.tsx                # Auth guard + sidebar layout
    ├── chat.index.tsx          # Empty state
    └── chat.$sessionId.tsx     # Active chat session
```

## WebSocket Protocol

The backend streams AI responses over WebSocket.

**Connect:** `ws://<host>/ws/chat?token=<jwt>&session_id=<uuid>`

| Direction | Message |
|---|---|
| Client → Server | `{"content": "Hello", "model": "llama3.2"}` |
| Server → Client | `{"type": "chunk", "content": "..."}` (streaming) |
| Server → Client | `{"type": "done", "session_id": "...", "message_id": "..."}` |
| Server → Client | `{"type": "error", "message": "..."}` |

## Authentication

JWT is stored in `localStorage`. It is injected as `Authorization: Bearer <token>` on every API request. A 401 response clears the token and redirects to `/login`. Protected routes (`/chat/*`) redirect unauthenticated users to `/login`.
