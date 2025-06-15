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
   git clone https://github.com/yourusername/ai-resume-grader.git
   cd ai-resume-grader
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
ai-resume-grader/
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

### Customization
- **Themes**: Modify `tailwind.config.ts` for custom colors
- **AI Prompts**: Update prompts in `app/api/analyze-resume/route.ts`
- **Scoring Logic**: Adjust scoring algorithms in the analysis engine

## 🚧 Hackathon Limitations & Future Improvements

### Current Limitations
- **File Parsing**: Simulated text extraction (would need PDF/DOCX parsers in production)
- **AI Costs**: OpenAI API usage costs (demo mode available)
- **Storage**: Local storage only (would need database for production)
- **Authentication**: No user accounts (would add in production)

### Future Enhancements
- [ ] Real PDF/DOCX parsing with libraries like `pdf-parse` or `mammoth`
- [ ] User authentication and cloud storage
- [ ] Multiple resume templates
- [ ] ATS compatibility testing
- [ ] Resume comparison features
- [ ] Integration with job boards
- [ ] Advanced analytics and insights
- [ ] Team collaboration features

## 🏆 Hackathon Achievements

### What We Built
- ✅ **Full-stack Application** - Complete resume analysis platform
- ✅ **AI Integration** - OpenAI GPT-4 for intelligent analysis
- ✅ **Modern UI/UX** - Professional, responsive design
- ✅ **Real-time Feedback** - Instant analysis and notifications
- ✅ **Resume Builder** - Complete resume creation tool
- ✅ **Error Handling** - Robust fallback systems

### Technical Highlights
- **AI-Powered Analysis** with structured output validation
- **Modern React Patterns** with TypeScript and Next.js 15
- **Responsive Design** with Tailwind CSS and custom components
- **Error Resilience** with graceful fallbacks and user feedback
- **Performance Optimized** with efficient state management

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-4 API
- **Vercel** for the AI SDK and hosting platform
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for beautiful icons

## 📞 Contact

**Team Members:**
- Your Name - [@yourhandle](https://twitter.com/yourhandle)
- Team Member 2 - [@handle2](https://twitter.com/handle2)

**Project Link:** [https://github.com/yourusername/ai-resume-grader](https://github.com/yourusername/ai-resume-grader)

**Live Demo:** [https://ai-resume-grader.vercel.app](https://ai-resume-grader.vercel.app)

---

<div align="center">
  <p>Built with ❤️ for [Hackathon Name] 2024</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
```

This README file is specifically tailored for a hackathon project and includes:

## 🎯 **Hackathon-Specific Elements:**

**Project Positioning:**
- Clear hackathon project badge and context
- Emphasis on rapid development and innovation
- Realistic scope and limitations acknowledgment

**Technical Showcase:**
- Comprehensive tech stack highlighting modern tools
- Code snippets showing AI integration
- Architecture overview demonstrating complexity

**Demo-Friendly:**
- Quick start guide for judges/reviewers
- Clear feature explanations with benefits
- Visual hierarchy with emojis and formatting

## 📋 **Key Sections:**

**Overview & Features:**
- Compelling project description
- Clear value proposition
- Feature highlights with icons

**Technical Details:**
- Complete tech stack
- Installation instructions
- Project structure

**Hackathon Context:**
- Current limitations (honest assessment)
- Future improvements (showing vision)
- Achievements and technical highlights

**Professional Touch:**
- Contributing guidelines
- License information
- Contact details and team info

The README positions your project as a sophisticated, well-architected solution while being honest about hackathon constraints and future potential!