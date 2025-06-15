import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import type { ResumeAnalysis } from "@/types/resume"

const resumeAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  sectionScores: z.object({
    structure: z.number().min(0).max(100),
    content: z.number().min(0).max(100),
    keywords: z.number().min(0).max(100),
    formatting: z.number().min(0).max(100),
  }),
  sectionFeedback: z.array(
    z.object({
      section: z.string(),
      score: z.number().min(0).max(100),
      feedback: z.string(),
      suggestions: z.array(z.string()),
    }),
  ),
  recommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      impact: z.enum(["High", "Medium", "Low"]),
    }),
  ),
  jobRelevanceScore: z.number().min(0).max(100).optional(),
  missingKeywords: z.array(z.string()).optional(),
})

// Simulate resume text extraction (in real app, you'd use PDF/DOCX parsers)
function simulateResumeExtraction(filename: string): string {
  return `
JOHN SMITH
Email: john.smith@email.com | Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johnsmith

PROFESSIONAL SUMMARY
Experienced software developer with 5 years in web development. Skilled in JavaScript, React, and Node.js.

WORK EXPERIENCE
Software Developer | Tech Company Inc. | 2020-2024
- Developed web applications using React and Node.js
- Worked with team of 5 developers
- Fixed bugs and implemented new features

Junior Developer | StartupCorp | 2019-2020
- Built websites using HTML, CSS, JavaScript
- Learned new technologies

EDUCATION
Bachelor of Science in Computer Science
State University | 2015-2019

SKILLS
JavaScript, React, Node.js, HTML, CSS, Git
  `.trim()
}

// Fallback mock analysis for when AI is unavailable
function generateFallbackAnalysis(resumeText: string, jobDescription?: string): ResumeAnalysis {
  const hasJobDescription = !!jobDescription?.trim()

  const analysis: ResumeAnalysis = {
    overallScore: 72,
    sectionScores: {
      structure: 85,
      content: 65,
      keywords: 70,
      formatting: 78,
    },
    sectionFeedback: [
      {
        section: "Professional Summary",
        score: 70,
        feedback:
          "Your professional summary provides a good overview but lacks specific achievements and quantifiable results. It's concise but could be more impactful.",
        suggestions: [
          "Add specific metrics (e.g., 'Led development of 15+ web applications')",
          "Include technologies you specialize in beyond the basics",
          "Mention any leadership or mentoring experience",
        ],
      },
      {
        section: "Work Experience",
        score: 65,
        feedback:
          "Your work experience section shows progression but lacks quantifiable achievements. The descriptions are too generic and don't demonstrate impact.",
        suggestions: [
          "Use stronger action verbs (e.g., 'Architected', 'Optimized', 'Delivered')",
          "Add metrics and results (e.g., 'Improved application performance by 40%')",
          "Describe the scope and impact of your projects",
          "Include technologies and methodologies used in each role",
        ],
      },
      {
        section: "Education",
        score: 80,
        feedback:
          "Education section is well-formatted and includes relevant degree. Consider adding any relevant coursework, projects, or academic achievements.",
        suggestions: [
          "Add relevant coursework if space permits",
          "Include GPA if 3.5 or higher",
          "Mention any academic projects or honors",
        ],
      },
      {
        section: "Skills",
        score: 75,
        feedback:
          "Skills section covers the basics but could be more comprehensive and better organized. Consider grouping skills by category.",
        suggestions: [
          "Organize skills into categories (Languages, Frameworks, Tools, etc.)",
          "Add proficiency levels or years of experience",
          "Include more modern technologies and frameworks",
          "Add soft skills relevant to your role",
        ],
      },
    ],
    recommendations: [
      {
        title: "Quantify Your Achievements",
        description:
          "Add specific metrics and numbers to demonstrate the impact of your work. This is the most important improvement you can make.",
        impact: "High",
      },
      {
        title: "Strengthen Action Verbs",
        description:
          "Replace weak verbs like 'worked' and 'learned' with powerful action verbs that show leadership and initiative.",
        impact: "High",
      },
      {
        title: "Expand Technical Skills",
        description:
          "Add more current technologies, frameworks, and tools to show you're up-to-date with industry trends.",
        impact: "Medium",
      },
      {
        title: "Add a Projects Section",
        description:
          "Consider adding a section highlighting key projects with technologies used and outcomes achieved.",
        impact: "Medium",
      },
      {
        title: "Improve Formatting Consistency",
        description: "Ensure consistent formatting throughout, including date formats, bullet points, and spacing.",
        impact: "Low",
      },
    ],
  }

  if (hasJobDescription) {
    analysis.jobRelevanceScore = 68
    analysis.missingKeywords = [
      "Python",
      "AWS",
      "Docker",
      "Kubernetes",
      "Agile",
      "Scrum",
      "CI/CD",
      "REST APIs",
      "Database Design",
      "Team Leadership",
    ]
  }

  return analysis
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const resumeFile = formData.get("resume") as File
    const jobDescription = formData.get("jobDescription") as string | null

    if (!resumeFile) {
      return NextResponse.json({ error: "No resume file provided" }, { status: 400 })
    }

    // Simulate resume text extraction
    const resumeText = simulateResumeExtraction(resumeFile.name)

    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.log("OpenAI API key not found, using fallback analysis")
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const analysis = generateFallbackAnalysis(resumeText, jobDescription || undefined)
      return NextResponse.json({ ...analysis, usingFallback: true })
    }

    // Try AI analysis first
    try {
      // Create analysis prompt
      let prompt = `
Analyze this resume and provide detailed feedback:

RESUME TEXT:
${resumeText}

Please provide:
1. Overall score (0-100) based on structure, content clarity, keyword usage, and formatting
2. Section-wise scores and feedback for: structure, content, keywords, formatting
3. Detailed feedback for each major section (Professional Summary, Work Experience, Education, Skills)
4. Specific, actionable recommendations for improvement
5. Priority level for each recommendation (High/Medium/Low impact)

Focus on:
- Professional presentation and formatting
- Content quality and quantifiable achievements
- Use of action verbs and industry keywords
- Completeness of sections
- Overall readability and ATS compatibility
`

      if (jobDescription?.trim()) {
        prompt += `

JOB DESCRIPTION FOR MATCHING:
${jobDescription}

Additionally provide:
- Job relevance score (0-100) showing how well the resume matches this role
- List of important keywords missing from the resume that appear in the job description
`
      }

      const { object: analysis } = await generateObject({
        model: openai("gpt-4o", {
          apiKey: apiKey,
        }),
        schema: resumeAnalysisSchema,
        prompt,
      })

      return NextResponse.json(analysis)
    } catch (aiError: any) {
      console.error("AI analysis failed, falling back to mock analysis:", aiError)

      // Check if it's a quota/billing error
      const isQuotaError =
        aiError.name === "AI_RetryError" ||
        aiError.name === "AI_APICallError" ||
        aiError.message?.includes("quota") ||
        aiError.message?.includes("insufficient_quota") ||
        aiError.message?.includes("billing") ||
        aiError.lastError?.message?.includes("quota")

      if (isQuotaError) {
        console.log("OpenAI quota exceeded, using fallback analysis")
      }

      // Simulate processing delay for fallback
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const analysis = generateFallbackAnalysis(resumeText, jobDescription || undefined)
      return NextResponse.json({
        ...analysis,
        usingFallback: true,
        fallbackReason: isQuotaError ? "quota_exceeded" : "ai_error",
      })
    }
  } catch (error: any) {
    console.error("Resume analysis error:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze resume. Please try again later.",
      },
      { status: 500 },
    )
  }
}
