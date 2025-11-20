# KissFlow Onboarding Hub - Frontend

Frontend application for the KissFlow Onboarding Platform built with Next.js 14, React, and TypeScript.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Environment Setup

1. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── not-found.tsx      # 404 page
│   └── globals.css        # Global styles
├── src/
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utility libraries
│   └── utils/             # Utility functions
└── public/                # Static assets
    └── videos/            # Video files
```

## 🔗 Backend Integration

This frontend requires the backend API to be running. See the [Backend README](../backend/README.md) for setup instructions.

The frontend makes API calls to:
- `/api/agents` - Get ElevenLabs agent IDs
- `/api/videos/:videoId/progress` - Get/update video progress
- `/api/elevenlabs/start-conversation` - Initialize chatbot conversation

## 📦 Key Dependencies

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **@elevenlabs/react** - ElevenLabs chatbot integration
- **@tanstack/react-query** - Data fetching and caching

## 🚧 Development

### Adding New Pages

Create new files in the `app/` directory:
- `app/about/page.tsx` → `/about`
- `app/videos/[id]/page.tsx` → `/videos/:id`

### Adding Components

Add reusable components in `src/components/`.

### Environment Variables

All environment variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

## 📄 License

ISC
