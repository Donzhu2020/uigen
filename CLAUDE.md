# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Setup
```bash
npm run setup
```
Installs dependencies, generates Prisma client, and runs database migrations. Run this first.

### Development
```bash
npm run dev              # Start dev server with Turbopack
npm run dev:daemon       # Start dev server in background, logs to logs.txt
```

### Testing
```bash
npm test                 # Run all tests with Vitest
```

### Database
```bash
npx prisma generate      # Generate Prisma client after schema changes
npx prisma migrate dev   # Create and apply new migration
npm run db:reset         # Reset database (WARNING: deletes all data)
```

### Linting & Building
```bash
npm run lint             # Run ESLint
npm run build            # Build for production
npm start                # Start production server
```

## Architecture Overview

### AI-Powered Component Generation System

This is a Next.js app that uses Claude AI to generate React components in real-time with live preview. The architecture revolves around a **virtual file system** that operates entirely in-memory.

### Core Systems

#### 1. Virtual File System (`src/lib/file-system.ts`)
- In-memory file system implementation via `VirtualFileSystem` class
- No files are written to disk during component generation
- Supports all standard file operations: create, read, update, delete, rename
- Files are stored as a `Map<string, FileNode>` with tree structure
- Can serialize/deserialize to JSON for persistence in database
- **Important**: All paths must start with `/` and are normalized internally

#### 2. AI Tool System (`src/lib/tools/`)
The AI uses two main tools to manipulate the file system:

**str_replace_editor** (`str-replace.ts`):
- Commands: `view`, `create`, `str_replace`, `insert`, `undo_edit`
- Allows AI to create files and edit them line-by-line or via string replacement
- Used for all code generation

**file_manager** (`file-manager.ts`):
- Commands: `rename`, `delete`
- Allows AI to manage file structure

Both tools receive a `VirtualFileSystem` instance and operate on it directly.

#### 3. Chat API Route (`src/app/api/chat/route.ts`)
- Receives messages and current file system state
- Reconstructs `VirtualFileSystem` from serialized nodes
- Uses Vercel AI SDK with Claude (or mock provider if no API key)
- Tools are registered and execute against the virtual file system
- After completion, saves messages and file system state to database (for authenticated users)

#### 4. JSX Transformation (`src/lib/transform/jsx-transformer.ts`)
Critical for preview rendering:

- **transformJSX()**: Transpiles JSX/TSX to plain JS using Babel standalone
- **createImportMap()**: Builds ES import map for the preview iframe
  - Maps local files to blob URLs
  - Maps React/external packages to esm.sh CDN
  - Handles `@/` import alias (maps to root `/`)
  - Collects CSS imports and inlines them
  - Returns transformation errors for display in preview
- **createPreviewHTML()**: Generates complete HTML with import map, error handling, and React app bootstrap

#### 5. Context Providers (`src/lib/contexts/`)

**FileSystemContext**:
- Wraps `VirtualFileSystem` and provides React hooks
- Manages file selection state
- `handleToolCall()` method synchronizes AI tool calls with UI
- Triggers re-renders when file system changes

**ChatContext**:
- Manages chat messages and streaming
- Coordinates with FileSystemContext to update files as AI streams responses
- Handles project persistence

#### 6. Database Schema (`prisma/schema.prisma`)
- SQLite database with `User` and `Project` models
- Projects store:
  - `messages`: Serialized chat history (JSON string)
  - `data`: Serialized virtual file system (JSON string)
  - `userId`: Optional (supports anonymous users)

### Component Structure Requirements

The AI is instructed via `src/lib/prompts/generation.tsx`:
- **Every project must have `/App.jsx`** as the root component
- Use Tailwind CSS for styling (not inline styles)
- No HTML files (App.jsx is the entrypoint)
- All local imports use `@/` alias (e.g., `import Button from '@/components/Button'`)
- Operating on virtual root `/` (not traditional filesystem)

### Preview Rendering Flow

1. File system serialized to `Map<string, string>`
2. JSX transformed to ES modules via Babel
3. Import map created with blob URLs for each file
4. Preview HTML generated with:
   - Tailwind CDN
   - ES import map
   - Error boundary
   - React bootstrap code
5. HTML loaded in iframe sandbox

### Mock Provider (`src/lib/provider.ts`)

When `ANTHROPIC_API_KEY` is not set:
- `MockLanguageModel` provides static component generation
- Simulates multi-step tool calling
- Generates Counter, Form, or Card components based on prompt
- Useful for demo/testing without API costs

### Testing

- Tests use Vitest with jsdom environment
- React Testing Library for component tests
- Key test files:
  - `src/lib/__tests__/file-system.test.ts` - Virtual FS operations
  - `src/lib/transform/__tests__/jsx-transformer.test.ts` - JSX transformation
  - `src/lib/contexts/__tests__/*.test.tsx` - Context providers

## Development Notes

- The virtual file system is the single source of truth during component generation
- File changes from AI streaming are applied via `FileSystemContext.handleToolCall()`
- Preview updates are triggered by file system changes through context
- All imports in generated code should use `@/` alias for consistency
- Preview iframe is sandboxed - uses blob URLs and import maps for isolation
- Use comments sparingly. Only comment complex code.
- The database schema is defined in the `prisma/schema.prisma` file. Reference it anytime you need to understand the structure of data stored in the database.
