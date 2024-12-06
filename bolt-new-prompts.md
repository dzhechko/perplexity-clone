# Prompt 01
Basic prompt:
Please create a full clone of perplexity ai search engine.
Take a look at screenshot.
Working version can be found here https://www.perplexity.ai/
Please use schadcn ui and lucid icons

Enhanced prompt:
Create a modern search interface and AI-powered search functionality similar to Perplexity AI using Next.js, React, and TypeScript. The implementation should:

Frontend Requirements:
- Build a responsive layout with a centered search bar using shadcn/ui components
- Implement real-time search suggestions with debouncing
- Create mode toggles (Focused/Copilot/Writing) using shadcn/ui ToggleGroup
- Display a loading skeleton during searches
- Show sources with expandable citations
- Include follow-up chips using shadcn/ui Button variants
- Use Lucide icons for visual elements
- Implement smooth animations and transitions

Core Search Features:
- Build an API route for handling search requests
- Integrate with search APIs (specify preferred providers)
- Implement streaming responses for real-time results
- Add source verification and citation extraction
- Enable contextual follow-up generation
- Include error boundaries and fallback states

Technical Implementation:
- Use Next.js 14 with App Router
- Implement React Server Components where beneficial
- Add proper TypeScript types and interfaces
- Use TanStack Query for data fetching
- Implement response caching with Redis/Upstash
- Add error logging and monitoring
- Ensure accessibility compliance

Styling Requirements:
- Use Tailwind CSS for responsive design
- Follow shadcn/ui theming conventions
- Maintain consistent spacing and typography
- Add dark/light mode support
- Ensure mobile-first breakpoints

Please provide the implementation focusing on clean, maintainable code with detailed comments. Include setup instructions and API integration details.


# Prompt 02
Basic:
yes, please continue with implementation step by step, ask for information needed regarding search provider 
also please implement a switch Ligth/Dark mode

Enhanced:
Create a responsive web application with the following features:

1. Search functionality:
- Implement a clean, centered search bar with autocomplete
- Include a search provider selector (Google, Bing, DuckDuckGo)
- Add search history functionality
- Enable keyboard shortcuts for quick searching

2. Theme switching:
- Create a prominent theme toggle button in the header
- Implement smooth transitions between light/dark modes
- Use system color scheme as initial default
- Persist user's theme preference in local storage
- Ensure proper contrast ratios in both themes
- Apply theme colors to all UI elements including:
  * Background
  * Text
  * Search bar
  * Buttons
  * Icons
  * Dropdown menus

3. Technical requirements:
- Use semantic HTML5
- Implement responsive design (mobile-first)
- Ensure WCAG 2.1 accessibility compliance
- Add loading states and error handling
- Include proper meta tags for SEO
- Optimize performance metrics

Please provide your preferred search provider API details for integration.

## Enhanced prompt N2
Create a responsive web search application that prioritizes user experience and accessibility. The implementation should follow these detailed specifications:

Frontend Requirements:
1. Search Interface
- Implement a centered search bar (max-width: 600px) with these features:
  * Floating label animation
  * Minimum height of 48px for touch targets
  * Border radius of 24px
  * Box shadow on focus: 0 0 0 2px primary-color
  * Autocomplete dropdown with max 5 suggestions
  * Clear button (×) when input has text

- Search Provider Selector:
  * Dropdown positioned top-right of search bar
  * Icons for each provider (16x16px SVG)
  * Providers: Google, Bing, DuckDuckGo, exa.ai
  * Keyboard shortcut: Alt + S to focus
  * Remember last selected provider

- Search History:
  * Store last 10 searches in localStorage
  * Display below search bar when input is focused
  * Clear history option
  * Click to search functionality

- Keyboard Shortcuts:
  * "/" to focus search
  * Enter to search
  * Esc to clear
  * Up/Down arrows for history navigation
  * Ctrl/Cmd + K to toggle provider

Theme Implementation:
- CSS Variables for Theme Colors:
```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --accent-color: #2563eb;
  --error-color: #dc2626;
}
```

- Theme Toggle:
  * Position: top-right corner
  * Size: 40x40px
  * Animation duration: 200ms
  * Prefers-color-scheme media query
  * Save preference to localStorage

Technical Specifications:
- HTML Structure:
  * <header> for navigation
  * <main> for search interface
  * <footer> for attribution
  * aria-labels on interactive elements
  * role attributes where necessary

- Responsive Breakpoints:
  * Mobile: 320px - 767px
  * Tablet: 768px - 1023px
  * Desktop: 1024px+

- Performance Targets:
  * First Contentful Paint: < 1.5s
  * Time to Interactive: < 3.0s
  * Lighthouse Performance Score: > 90

- Error Handling:
  * Network status monitoring
  * Graceful degradation
  * Clear error messages
  * Retry mechanisms

exa.ai Integration:
```javascript
const searchWithExa = async (query) => {
  try {
    const exa = new Exa("eabdf593-51d9-47b9-8a8a-b2864c3cf520");
    return await exa.search(query, {
      type: "neural",
      useAutoprompt: true,
      timeout: 5000
    });
  } catch (error) {
    console.error("Exa search failed:", error);
    throw new Error("Search failed. Please try again.");
  }
};
```

Accessibility Requirements:
- ARIA landmarks
- Skip to main content link
- Keyboard focus indicators
- Color contrast ratio: 4.5:1 minimum
- Screen reader announcements for results
- Alternative text for all images

Deliver the application as a single-page application with modular components and comprehensive error handling.


# Promp 03
Basic:
please add extensive logging so when a user triggers search I could see it is working
also a chosen search provider should be triggered

Enhanced:
Add detailed logging for user search actions with the following requirements:

1. Log each search event with:
   - Timestamp
   - User ID/session information
   - Search query terms
   - Search provider name
   - Search parameters used
   - Response time

2. Include debug logs showing:
   - Search provider initialization
   - Query preprocessing steps
   - API calls to search provider
   - Results processing

3. Implement error logging that captures:
   - Failed search attempts
   - Search provider connectivity issues
   - Invalid query handling
   - Rate limiting events

4. Ensure logs are written to:
   - Console for development
   - Appropriate log files in production
   - Monitoring system if available

5. Format logs in a structured way (JSON) including:
   - Log level (INFO/DEBUG/ERROR)
   - Component name
   - Event type
   - Full event context

Please implement comprehensive logging while maintaining existing search provider functionality.
