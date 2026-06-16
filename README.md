# XMLorph — Drop Any Theme. Get Blogger-Ready XML.

Convert any HTML, CSS, or XML theme into a valid Blogger v2 XML template using Gemini 2.0 Flash.

## Features

- 🎨 Beautiful dark UI with Three.js hero animation
- ⚡ Powered by Google Gemini 2.0 Flash
- 📁 Accepts .html, .css, .xml, .json theme files (up to 500KB)
- ✅ Outputs valid Blogger v2 XML with all required sections
- 📋 One-click download or copy to clipboard
- 🚀 Deployable on Vercel free tier

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS, custom glassmorphism design system
- **3D**: Three.js hero animation with parallax
- **AI**: Google Gemini 2.0 Flash API
- **Deployment**: Vercel (free tier)

## Local Development

### Prerequisites

- Node.js 18+
- A free Gemini API key from [aistudio.google.com](https://aistudio.google.com) (no credit card required)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/xmlorph.git
   cd xmlorph
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Deployment on Vercel

1. Push your project to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **Add New → Project** and import your GitHub repo
4. In the **Environment Variables** section, add:
   - Key: `GEMINI_API_KEY`
   - Value: your Gemini API key
5. Click **Deploy**

Your site will be live in ~2 minutes on a free Vercel URL.

## Getting a Free Gemini API Key

1. Visit [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **Get API Key** → **Create API Key**
4. Copy the key — no credit card required

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | ✅ Yes |

## How the Conversion Works

1. You upload a theme file (.html, .css, .xml, or .json)
2. XMLorph sends the content to Gemini 2.0 Flash with a strict system prompt
3. Gemini rebuilds the theme as a valid Blogger v2 XML template with:
   - Correct `b:template` root element and namespaces
   - CSS wrapped in `b:skin` CDATA tags
   - Required sections (header, main, sidebar, footer)
   - Required widgets (Header1, Blog1, Attribution1)
4. The XML is returned, previewed, and available for download

## File Structure

```
xmlorph/
├── app/
│   ├── api/
│   │   └── convert/
│   │       └── route.ts          # Gemini API route
│   ├── globals.css               # Design system + animations
│   ├── layout.tsx                # Root layout + fonts
│   └── page.tsx                  # Main page (all sections)
├── components/
│   ├── HeroCanvas.tsx            # Three.js hero animation
│   ├── XMLBracketCanvas.tsx      # Small 3D upload zone canvas
│   ├── UploadZone.tsx            # Drag-and-drop file upload
│   ├── LoadingState.tsx          # Conversion progress UI
│   ├── ResultPanel.tsx           # XML preview + download
│   └── ConvertButton.tsx         # Convert action button
├── .env.example
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## License

MIT — free to use and modify.
