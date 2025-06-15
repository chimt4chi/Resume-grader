import { type NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import type { ResumeAnalysis } from "@/types/resume";

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
    })
  ),
  recommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      impact: z.enum(["High", "Medium", "Low"]),
    })
  ),
  jobRelevanceScore: z.number().min(0).max(100).optional(),
  missingKeywords: z.array(z.string()).optional(),
});

// Cache for processed resumes to avoid repeated analysis
const analysisCache = new Map<
  string,
  { analysis: ResumeAnalysis; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Extract text from different file types
async function extractResumeText(file: File): Promise<string> {
  try {
    if (file.type === "application/pdf") {
      // In production, use pdf-parse or similar library
      console.log("PDF parsing would be implemented here");
      return await file.text(); // Fallback for now
    } else if (file.type.includes("word") || file.name.endsWith(".docx")) {
      // In production, use mammoth.js or similar library
      console.log("DOCX parsing would be implemented here");
      return await file.text(); // Fallback for now
    } else {
      // Plain text or other formats
      return await file.text();
    }
  } catch (error) {
    console.error("Error extracting text from file:", error);
    throw new Error("Failed to extract text from resume file");
  }
}

// Generate cache key for deduplication
function generateCacheKey(resumeText: string, jobDescription?: string): string {
  const content = resumeText + (jobDescription || "");
  // Simple hash function for cache key
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString();
}

// Dynamic fallback analysis generator
function generateDynamicAnalysis(
  resumeText: string,
  jobDescription?: string
): ResumeAnalysis {
  const hasJobDescription = !!jobDescription?.trim();
  const textLength = resumeText.length;
  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(
    resumeText
  );
  const hasPhone = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(resumeText);
  const hasLinkedIn = /linkedin\.com/i.test(resumeText);
  const skillsCount = (
    resumeText.match(
      /\b(JavaScript|Python|Java|React|Node\.js|HTML|CSS|SQL|AWS|Docker|Kubernetes)\b/gi
    ) || []
  ).length;
  const experienceMatches =
    resumeText.match(/\d+\s*(years?|yrs?)\s*(of\s*)?(experience|exp)/gi) || [];
  const hasQuantifiableResults =
    /\d+%|\$\d+|increase|improve|reduce|save|optimize/i.test(resumeText);

  // Dynamic scoring based on actual content
  const contactScore =
    (hasEmail ? 25 : 0) + (hasPhone ? 25 : 0) + (hasLinkedIn ? 25 : 0) + 25;
  const contentScore = Math.min(100, Math.max(30, textLength / 20));
  const skillsScore = Math.min(100, skillsCount * 10 + 40);
  const achievementBonus = hasQuantifiableResults ? 20 : 0;

  const baseScore = Math.round(
    (contactScore + contentScore + skillsScore + achievementBonus) / 4
  );

  // Generate dynamic feedback based on analysis
  const generateSectionFeedback = () => {
    const sections = [];

    // Professional Summary Analysis
    const summaryMatch = resumeText.match(
      /(professional summary|summary|profile|objective)([\s\S]*?)(?=\n[A-Z\s]+\n|\n\n|$)/i
    );
    if (summaryMatch) {
      const summaryText = summaryMatch[2];
      const summaryScore = Math.min(
        100,
        Math.max(40, summaryText.length / 5 + (hasQuantifiableResults ? 20 : 0))
      );
      sections.push({
        section: "Professional Summary",
        score: Math.round(summaryScore),
        feedback:
          summaryText.length < 100
            ? "Your professional summary is too brief. Expand it to better showcase your expertise and value proposition."
            : hasQuantifiableResults
            ? "Good professional summary with some quantifiable achievements. Consider adding more specific metrics."
            : "Your professional summary provides good overview but lacks specific achievements and quantifiable results.",
        suggestions: [
          "Add specific metrics and quantifiable achievements",
          "Include 2-3 key technologies you specialize in",
          "Mention years of experience and expertise level",
          "Highlight your unique value proposition",
        ],
      });
    }

    // Experience Analysis
    const expMatches = resumeText.match(/experience|employment|work history/i);
    if (expMatches) {
      const expScore = Math.min(
        100,
        Math.max(
          50,
          experienceMatches.length * 20 + (hasQuantifiableResults ? 30 : 0)
        )
      );
      sections.push({
        section: "Work Experience",
        score: Math.round(expScore),
        feedback: hasQuantifiableResults
          ? "Your work experience shows good use of metrics. Consider adding more specific achievements and impact statements."
          : "Work experience section needs more quantifiable achievements and specific impact statements.",
        suggestions: [
          "Use strong action verbs (Led, Implemented, Optimized, Delivered)",
          "Add specific metrics (percentages, dollar amounts, time saved)",
          "Describe the scope and scale of your projects",
          "Include technologies and methodologies used",
        ],
      });
    }

    // Skills Analysis
    const skillsScore = Math.min(100, Math.max(60, skillsCount * 8 + 40));
    sections.push({
      section: "Technical Skills",
      score: Math.round(skillsScore),
      feedback:
        skillsCount > 8
          ? "Good range of technical skills listed. Consider organizing them by category for better readability."
          : "Skills section could be expanded with more relevant technologies and tools.",
      suggestions: [
        "Organize skills into categories (Languages, Frameworks, Tools, Databases)",
        "Add proficiency levels where appropriate",
        "Include both technical and soft skills",
        "Keep skills relevant to your target roles",
      ],
    });

    return sections;
  };

  // Generate dynamic recommendations
  const generateRecommendations = () => {
    const recommendations = [];

    if (!hasQuantifiableResults) {
      recommendations.push({
        title: "Add Quantifiable Achievements",
        description:
          "Include specific metrics, percentages, and numbers to demonstrate the impact of your work.",
        impact: "High" as const,
      });
    }

    if (skillsCount < 8) {
      recommendations.push({
        title: "Expand Technical Skills",
        description:
          "Add more relevant technologies, frameworks, and tools to show comprehensive expertise.",
        impact: "High" as const,
      });
    }

    if (!hasLinkedIn) {
      recommendations.push({
        title: "Add LinkedIn Profile",
        description:
          "Include your LinkedIn profile URL to provide additional professional context.",
        impact: "Medium" as const,
      });
    }

    if (textLength < 1000) {
      recommendations.push({
        title: "Expand Content Detail",
        description:
          "Provide more detailed descriptions of your role responsibilities and achievements.",
        impact: "Medium" as const,
      });
    }

    recommendations.push({
      title: "Optimize for ATS",
      description:
        "Ensure your resume is ATS-friendly with proper formatting and keyword optimization.",
      impact: "Medium" as const,
    });

    return recommendations;
  };

  const analysis: ResumeAnalysis = {
    overallScore: baseScore,
    sectionScores: {
      structure: Math.round(contactScore),
      content: Math.round(contentScore),
      keywords: Math.round(skillsScore),
      formatting: 75 + (textLength > 500 ? 10 : 0),
    },
    sectionFeedback: generateSectionFeedback(),
    recommendations: generateRecommendations(),
  };

  // Add job-specific analysis if job description provided
  if (hasJobDescription && jobDescription) {
    const jobKeywords = jobDescription.toLowerCase().match(/\b[a-z]+\b/g) || [];
    const resumeKeywords = resumeText.toLowerCase().match(/\b[a-z]+\b/g) || [];
    const commonKeywords = jobKeywords.filter((keyword) =>
      resumeKeywords.includes(keyword)
    );
    const relevanceScore = Math.min(
      100,
      (commonKeywords.length / Math.max(jobKeywords.length, 1)) * 100
    );

    analysis.jobRelevanceScore = Math.round(relevanceScore);

    // Find missing important keywords
    const importantJobKeywords = [
      "python",
      "javascript",
      "react",
      "node",
      "aws",
      "docker",
      "kubernetes",
      "agile",
      "scrum",
      "leadership",
      "management",
      "api",
      "database",
      "sql",
    ].filter(
      (keyword) =>
        jobDescription.toLowerCase().includes(keyword) &&
        !resumeText.toLowerCase().includes(keyword)
    );

    analysis.missingKeywords = importantJobKeywords.slice(0, 8);
  }

  return analysis;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const resumeFile = formData.get("resume") as File;
    const jobDescription = formData.get("jobDescription") as string | null;

    if (!resumeFile) {
      return NextResponse.json(
        { error: "No resume file provided" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (resumeFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size too large. Maximum 5MB allowed." },
        { status: 400 }
      );
    }

    // Extract text from resume
    const resumeText = await extractResumeText(resumeFile);

    if (!resumeText.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from resume file" },
        { status: 400 }
      );
    }

    // Generate cache key for deduplication
    const cacheKey = generateCacheKey(resumeText, jobDescription || undefined);

    // Check cache first
    const cached = analysisCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("Returning cached analysis");
      return NextResponse.json({ ...cached.analysis, fromCache: true });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.log("OpenAI API key not found, using dynamic fallback analysis");
      const analysis = generateDynamicAnalysis(
        resumeText,
        jobDescription || undefined
      );

      // Cache the result
      analysisCache.set(cacheKey, { analysis, timestamp: Date.now() });

      return NextResponse.json({ ...analysis, usingFallback: true });
    }

    // Try AI analysis with retry logic
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount < maxRetries) {
      try {
        let prompt = `
Analyze this resume comprehensively and provide detailed, specific feedback:

RESUME CONTENT:
${resumeText}

Provide a thorough analysis including:
1. Overall score (0-100) considering all aspects
2. Individual section scores for structure, content, keywords, and formatting
3. Detailed feedback for each identifiable section
4. Specific, actionable recommendations prioritized by impact
5. ATS compatibility assessment

Focus on:
- Quantifiable achievements and metrics usage
- Professional language and action verbs
- Industry-relevant keywords and skills
- Content depth and clarity
- Overall presentation and readability
- Missing critical elements
`;

        if (jobDescription?.trim()) {
          prompt += `

TARGET JOB DESCRIPTION:
${jobDescription}

Additionally analyze:
- How well the resume aligns with this specific role
- Job relevance score (0-100)
- Key missing keywords that should be incorporated
- Specific improvements for this role
`;
        }
        const openai = createOpenAI({
          apiKey: apiKey, // API key goes here
        });
        const { object: analysis } = await generateObject({
          model: openai("gpt-4o"),
          schema: resumeAnalysisSchema,
          prompt,
          temperature: 0.7, // Add some variation in responses
        });

        // Cache the successful result
        analysisCache.set(cacheKey, { analysis, timestamp: Date.now() });

        return NextResponse.json(analysis);
      } catch (aiError: any) {
        console.error(`AI analysis attempt ${retryCount + 1} failed:`, aiError);
        retryCount++;

        const isQuotaError =
          aiError.name === "AI_RetryError" ||
          aiError.name === "AI_APICallError" ||
          aiError.message?.includes("quota") ||
          aiError.message?.includes("insufficient_quota") ||
          aiError.message?.includes("billing");

        if (isQuotaError || retryCount >= maxRetries) {
          console.log("Falling back to dynamic analysis");
          const analysis = generateDynamicAnalysis(
            resumeText,
            jobDescription || undefined
          );

          // Cache the fallback result
          analysisCache.set(cacheKey, { analysis, timestamp: Date.now() });

          return NextResponse.json({
            ...analysis,
            usingFallback: true,
            fallbackReason: isQuotaError ? "quota_exceeded" : "ai_error",
          });
        }

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  } catch (error: any) {
    console.error("Resume analysis error:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze resume. Please try again later.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
