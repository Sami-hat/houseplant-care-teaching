# Bloomwise - Learn Houseplant Care

A personalised houseplant care learning app built with Next.js and the Vercel AI SDK.

## What I Built

An interactive web app that teaches houseplant care through AI-powered lessons tailored to the plants you actually own. The app tracks your knowledge across 10 concepts organised into 3 tiers, adapting content to your specific plants and home environment.

### Features

- **Personalised onboarding** - Captures your home environment (light, humidity, climate) and current plant collection
- **Adaptive learning** - AI lessons reference your specific plants and environment when teaching concepts
- **Knowledge tracking** - Mastery system (0-100%) for each concept with tier unlocking more complex concepts
- **Plant doctor** - AI-powered diagnosis chat for troubleshooting plant problems
- **Plant management** - Add, nickname, and remove plants from your collection

## Setup

### Prerequisites

- Node.js 18+
- A [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) database
- A [GitHub OAuth App](https://github.com/settings/developers)
- A [Google AI API key](https://aistudio.google.com/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/Sami-hat/houseplant-care-teaching.git
cd houseplant-care-teaching

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (from Vercel Postgres dashboard)
POSTGRES_URL="postgres://..."

# GitHub OAuth (create at github.com/settings/developers)
GITHUB_ID="your_client_id"
GITHUB_SECRET="your_client_secret"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate_with_openssl_rand_base64_32"

# Google AI (from aistudio.google.com/apikey)
GOOGLE_GENERATIVE_AI_API_KEY="your_api_key"
```

**Generating NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**GitHub OAuth Setup:**
1. Go to GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. Set Homepage URL to `http://localhost:3000`
3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env.local`

### Database Setup

```bash
# Push the schema to your database
npm run db:push
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add the same environment variables in Vercel's dashboard (change `NEXTAUTH_URL` to your production URL)
4. Deploy

---

## Key Decisions

**1. Concept-based curriculum over free-form chat**
Rather than an open-ended plant chatbot, I structured learning around specific concepts with clear objectives. This enables meaningful progress tracking and ensures learners build foundational knowledge before advanced topics.

**2. JSON-based assessment in AI responses**
The AI includes a structured JSON block (`{"understood": true, "mastery_delta": X}`) at the end of responses after the learner answers a question. This is parsed server-side to update mastery scores, keeping assessment consistent while maintaining natural conversation flow.

**3. Environment-aware personalisation**
Storing light level, humidity, and climate allows the AI to give genuinely relevant advice. Someone with low light and dry air gets different guidance than someone in a bright, humid space.

**4. Tier unlocking as motivation**
Requiring 60% mastery across all concepts in a tier before unlocking the next creates clear goals and prevents learners from jumping to advanced topics without fundamentals.

**5. Streaming responses**
Used Vercel AI SDK's streaming to provide immediate feedback rather than waiting for complete responses. This makes the chat feel responsive and natural.

## Tech Stack

- **Next.js 14** - App Router for server components and API routes
- **Vercel AI SDK** - Streaming chat with Google Gemini
- **Drizzle ORM** - Type-safe database queries with Vercel Postgres
- **NextAuth.js** - GitHub OAuth authentication
- **CSS Modules** - Scoped styling without additional dependencies


## What I'd Add With More Time

- **Spaced repetition** - Schedule concept reviews based on forgetting curves to improve long-term retention
- **Plant photo identification** - Use vision models to identify plants from photos during onboarding
- **Watering reminders** - Push notifications based on plant type and last watered date
- **Care sheets** - Generate printable care guides for each plant in the collection
- **Multi-language support** - Internationalisation for broader accessibility
- **Offline mode** - Service worker caching for core functionality without internet

## Challenges

**Parsing structured data from AI responses**
Getting the AI to reliably output the assessment JSON required careful prompt engineering. The model sometimes included the JSON in the first message (before any question was asked) or formatted it inconsistently. Solved this with explicit instructions and a regex pattern that handles whitespace variations.

**Balancing personalisation with onboarding friction**
Collecting environment details and plant selections adds value but also adds steps before users see the core experience. I kept onboarding to 3 focused steps that can be completed in under 2 minutes.

**Keeping AI responses focused**
Without constraints, the AI tended toward lengthy explanations. The 200-word limit in the system prompt, combined with explicit instructions to ask only one question at a time, keeps lessons digestible.

**Session state with streaming**
Updating mastery scores after a streaming response completes required using the `onFinish` callback in the Vercel AI SDK, which runs server-side after the full response is generated.

## Project Structure

```
app/
    page.js                    # Landing page
    onboarding/page.js         # 3-step onboarding
    dashboard/page.js          # Main hub
    lesson/[conceptId]/page.js # AI lesson chat
    diagnose/page.js           # Plant doctor
    plants/page.js             # Manage collection
    api/                       # API routes

components/
    chat-interface.js          # Reusable AI chat
    onboarding-form.js         # Multi-step form
    plants-manager.js          # Plant CRUD
    ...                        # UI components

lib/
    auth.js                    # NextAuth config
    concepts.js                # Curriculum & tier logic
    plants.js                  # Common plant types
    prompts.js                 # AI system prompts

db/
    schema.js                  # Drizzle table definitions
    index.js                   # Database client
```

## License

MIT
