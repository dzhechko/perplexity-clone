# Perplexity AI Clone

A modern search interface with AI-powered search functionality similar to Perplexity AI, built using Next.js, React, and TypeScript.

## Features

- 🔍 AI-powered search using Exa.ai
- 🤖 GPT-4 result summarization
- 🎯 Multiple search modes (Focused/Copilot/Writing)
- ⚡ Real-time search with debouncing
- 📚 Expandable source citations
- 🎨 Modern UI with dark/light mode
- 📱 Fully responsive design

## Prerequisites

- Node.js 16.x or higher
- npm or yarn
- OpenAI API key
- Exa.ai API key
- Serper.dev API key (optional)

## Setup

1. Clone the repository:

```bash
git clone [repository-url]
cd perplexity-clone
```

2. Install dependencies:

```bash
npm install
```

3. Copy the example environment file:

```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:

```env
# Debug mode for detailed logging
NEXT_PUBLIC_DEBUG=true

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1  # or your custom endpoint
OPENAI_MODEL=gpt-4  # or other available models
OPENAI_TEMPERATURE=0.3
OPENAI_MAX_TOKENS=1000

# Search Providers API Keys
NEXT_PUBLIC_EXA_API_KEY=your_exa_api_key_here
NEXT_PUBLIC_SERPER_API_KEY=your_serper_api_key_here  # optional

# Node Environment
NODE_ENV=development
```

Available OpenAI models:
- For standard OpenAI API: gpt-4, gpt-4-turbo-preview, gpt-3.5-turbo
- For custom endpoints: check with your provider

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Search Modes

The application supports three different search modes:

### Focused Mode
- Concise, fact-based answers
- Uses most recent sources (last 24 hours)
- Returns fewer but more relevant results
- Best for: Quick facts and current information

### Copilot Mode
- Detailed explanations with context
- Balanced source selection
- Includes examples and related information
- Best for: Learning and understanding topics

### Writing Mode
- Well-structured, comprehensive responses
- Uses broader time range for sources
- Includes more context and background
- Best for: Content creation and research

## Production Check

To check the application in production mode locally:

1. Set environment variable:

```env
NODE_ENV=production
```

2. Build the application:

```bash
npm run build
```

3. Start production server:

```bash
npm run start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

What to check:
- ✓ All environment variables load correctly
- ✓ Search works with both providers (Exa.ai and Serper)
- ✓ Summarization works with selected OpenAI model
- ✓ All search modes function properly
- ✓ Dark/light theme switches correctly
- ✓ Sources display properly
- ✓ Follow-up questions work

### Production Debugging

If issues arise:

1. Check build logs:

```bash
npm run build
# Look for errors in the output
```

2. Enable debug mode:

```env
NEXT_PUBLIC_DEBUG=true
```

3. Check server logs:

```bash
npm run start
# Monitor console output
```

4. Check browser console for errors

## Docker Deployment

### Local Docker Setup

1. Create `.env.production` file from `.env.production.example`:

```bash
cp .env.production.example .env.production
```

2. Edit `.env.production` with your environment variables. Make sure to set all required values:
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `NEXT_PUBLIC_EXA_API_KEY` - Your Exa.ai API key
   - `NEXT_PUBLIC_SERPER_API_KEY` - Your Serper API key (optional)
   - Other variables as specified in the example file

3. Build and run the container:

```bash
docker-compose up --build
```

4. Access the application at [http://localhost:3000](http://localhost:3000)

### Server Deployment

1. Prepare the server:

```bash
# Install Docker and docker-compose
sudo apt update
sudo apt install docker.io docker-compose
```

2. Copy files to server:

```bash
# Create project directory
ssh user@your-server "mkdir -p /path/to/app"

# Copy files
scp docker-compose.yml Dockerfile .env.production user@your-server:/path/to/app/
```

3. Connect to server and launch:

```bash
ssh user@your-server
cd /path/to/app
docker-compose up -d
```

### Container Management

- View logs:

```bash
docker-compose logs -f
```

- Restart application:

```bash
docker-compose restart
```

- Stop application:

```bash
docker-compose down
```

- Update to new version:

```bash
git pull  # get new code
docker-compose down  # stop current container
docker-compose up --build -d  # build and start new version
```

### Monitoring

- Check status:

```bash
docker-compose ps
```

- Check resource usage:

```bash
docker stats
```

- Check application logs:

```bash
docker-compose logs -f app
```

### Security Recommendations

1. Environment Variables:
   - Don't store sensitive data in repository
   - Use `.env.production` for production environment
   - Regularly rotate API keys

2. Network:
   - Use HTTPS proxy (e.g., Nginx) in front of container
   - Configure server firewall
   - Restrict port access

3. Updates:
   - Regularly update base Node.js image
   - Monitor dependency updates
   - Use fixed versions in package.json

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - React components
- `/lib` - Utility functions and API integrations
- `/types` - TypeScript type definitions
- `/hooks` - Custom React hooks

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- OpenAI GPT-4
- Exa.ai Search API
- TanStack Query
- Lucide Icons