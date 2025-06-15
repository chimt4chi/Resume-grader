# 🚀 AI Resume Grader

> **Hackathon Project** - Transform your career with AI-powered resume analysis and professional resume building

![AI Resume Grader](https://img.shields.io/badge/Hackathon-Project-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-orange) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## 📖 Overview

AI Resume Grader is an intelligent platform that provides instant, actionable feedback on resumes using advanced AI analysis. Built for a hackathon, this project demonstrates the power of AI in career development tools.

### ✨ Key Features

- 🤖 **AI-Powered Analysis** - Advanced resume scoring using OpenAI GPT-4
- 📊 **Detailed Scoring** - Comprehensive analysis of structure, content, keywords, and formatting
- 🎯 **Job Matching** - Compare resumes against specific job descriptions
- 📝 **Resume Builder** - Create professional resumes with guided templates
- 📚 **Analysis History** - Track progress and compare improvements over time
- 🌙 **Modern UI** - Beautiful, responsive design with dark mode support

## 🎥 Demo

![Demo GIF](demo.gif)

*Upload your resume → Get instant AI feedback → Build better resumes*

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling with custom design system
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend & AI
- **OpenAI API** - GPT-4 for intelligent resume analysis
- **Vercel AI SDK** - Streamlined AI integration
- **Zod** - Schema validation for AI responses

### Features
- **File Upload** - PDF and DOCX support
- **Local Storage** - Client-side history management
- **Toast Notifications** - User-friendly feedback system
- **Responsive Design** - Mobile-first approach

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- OpenAI API key (optional - falls back to demo mode)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chimt4chi/Resume-grader.git
   cd Resume-grader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your OpenAI API key to `.env.local`:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How It Works

### 1. Upload Resume
- Drag & drop PDF or DOCX files
- Automatic text extraction and parsing
- Optional job description for targeted analysis

### 2. AI Analysis
- **Structure Analysis** - Layout, sections, and organization
- **Content Quality** - Professional language and achievements
- **Keyword Optimization** - Industry-relevant terms and ATS compatibility
- **Formatting** - Visual appeal and readability

### 3. Get Results
- **Overall Score** (0-100) with detailed breakdown
- **Section-by-Section Feedback** with specific suggestions
- **Job Relevance Score** when job description provided
- **Missing Keywords** identification
- **Actionable Recommendations** prioritized by impact

### 4. Build Better Resumes
- **Guided Resume Builder** with professional templates
- **Real-time Preview** of your resume
- **Export Options** - PDF and Word formats
- **History Tracking** to monitor improvements

## 📊 Features Deep Dive

### AI Analysis Engine
```typescript
// Powered by OpenAI GPT-4 with structured output
const analysis = await generateObject({
  model: openai("gpt-4o"),
  schema: resumeAnalysisSchema,
  prompt: `Analyze this resume and provide detailed feedback...`
});
```

### Smart Fallback System
- **Demo Mode** - Realistic analysis when API unavailable
- **Error Handling** - Graceful degradation with user notifications
- **Quota Management** - Automatic fallback when limits exceeded

### Modern UI Components
- **Glass Morphism** - Backdrop blur effects
- **Gradient Design** - Modern color schemes
- **Micro-interactions** - Smooth animations and transitions
- **Toast Notifications** - Real-time user feedback

## 🏗️ Project Structure

```
Resume-grader/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── upload-section.tsx # File upload interface
│   ├── results-display.tsx # Analysis results
│   ├── resume-builder.tsx # Resume creation tool
│   └── analysis-history.tsx # History management
├── types/                # TypeScript definitions
├── hooks/                # Custom React hooks
└── lib/                  # Utility functions
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue to Purple gradients
- **Success**: Emerald tones
- **Warning**: Amber tones  
- **Error**: Red tones
- **Neutral**: Slate grays

### Typography
- **Headings**: Bold, gradient text effects
- **Body**: Readable, well-spaced text
- **Code**: Monospace for technical content

## 🔧 Configuration

### Environment Variables
```env
# Required for AI analysis (optional - has fallback)
OPENAI_API_KEY=your_openai_api_key

# Optional: Custom API endpoints
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-4 API
- **Vercel** for the AI SDK and hosting platform
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for beautiful icons

## 📞 Contact

**Team Members:**
- Rohit Singh - [@https://x.com/iShowCoding](https://x.com/iShowCoding)


**Project Link:** [https://github.com/chimt4chi/Resume-grader](https://github.com/chimt4chi/Resume-grader)

**Live Demo:** [https://resume-grader-gold.vercel.app/](https://resume-grader-gold.vercel.app/)

---

<div align="center">
  <p>Built with ❤️ for Anveshan - Hackathon 2025</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
```
