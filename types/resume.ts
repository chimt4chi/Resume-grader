export interface SectionFeedback {
  section: string
  score: number
  feedback: string
  suggestions: string[]
}

export interface Recommendation {
  title: string
  description: string
  impact: "High" | "Medium" | "Low"
}

export interface ResumeAnalysis {
  overallScore: number
  sectionScores: {
    structure: number
    content: number
    keywords: number
    formatting: number
  }
  sectionFeedback: SectionFeedback[]
  recommendations: Recommendation[]
  jobRelevanceScore?: number
  missingKeywords?: string[]
  usingFallback?: boolean
  fallbackReason?: "quota_exceeded" | "ai_error" | "no_api_key"
}
