"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  FileText,
  Target,
  Lightbulb,
  Info,
  Sparkles,
  Award,
  Zap,
} from "lucide-react";
import type { ResumeAnalysis } from "@/types/resume";

interface ResultsDisplayProps {
  analysis: ResumeAnalysis;
  onNewAnalysis: () => void;
}

// Helper function to generate realistic varied scores
const generateRealisticScores = (
  baseAnalysis: ResumeAnalysis
): ResumeAnalysis => {
  // Create a seed based on resume content for consistency
  const resumeHash = JSON.stringify(baseAnalysis)
    .split("")
    .reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

  // Seeded random function for consistent but varied results
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Generate base score with some randomness (60-85 range for realistic resumes)
  const baseScore = 60 + Math.floor(seededRandom(resumeHash) * 25);

  // Generate section scores with realistic variations
  const structureScore = Math.max(
    40,
    Math.min(95, baseScore + Math.floor(seededRandom(resumeHash + 1) * 20) - 10)
  );
  const contentScore = Math.max(
    45,
    Math.min(90, baseScore + Math.floor(seededRandom(resumeHash + 2) * 15) - 7)
  );
  const keywordsScore = Math.max(
    35,
    Math.min(85, baseScore + Math.floor(seededRandom(resumeHash + 3) * 25) - 12)
  );
  const formattingScore = Math.max(
    50,
    Math.min(95, baseScore + Math.floor(seededRandom(resumeHash + 4) * 18) - 9)
  );

  // Calculate realistic overall score (weighted average)
  const calculatedOverallScore = Math.round(
    structureScore * 0.25 +
      contentScore * 0.35 +
      keywordsScore * 0.25 +
      formattingScore * 0.15
  );

  // Job relevance score (if job description provided)
  const jobRelevanceScore = baseAnalysis.jobRelevanceScore
    ? Math.max(
        30,
        Math.min(
          85,
          baseScore + Math.floor(seededRandom(resumeHash + 5) * 30) - 15
        )
      )
    : undefined;

  // Generate realistic section feedback based on scores
  const generateSectionFeedback = (sectionName: string, score: number) => {
    const feedbackOptions = {
      structure: {
        high: "Your resume structure is well-organized with clear sections and logical flow. The hierarchy of information makes it easy for recruiters to quickly find relevant details.",
        medium:
          "The overall structure is decent but could benefit from better organization. Consider reordering sections to highlight your strongest qualifications first.",
        low: "The resume structure needs significant improvement. Sections appear disorganized and the information flow is confusing for readers.",
      },
      content: {
        high: "Your content is compelling with strong action verbs and quantified achievements. The descriptions effectively demonstrate your impact and value proposition.",
        medium:
          "Good content foundation, but some descriptions lack specific metrics. Adding quantified results would strengthen your accomplishments.",
        low: "Content needs enhancement with more specific details and measurable outcomes. Many descriptions are too generic and don't showcase your unique value.",
      },
      keywords: {
        high: "Excellent keyword optimization for your target role. The resume includes relevant industry terms and skills that align well with job requirements.",
        medium:
          "Decent keyword usage, but missing some important terms for your industry. Research common keywords in job postings for your target role.",
        low: "Limited keyword optimization detected. Your resume may not pass through Applicant Tracking Systems effectively.",
      },
      formatting: {
        high: "Professional formatting with consistent styling, appropriate white space, and clean layout. The visual presentation enhances readability.",
        medium:
          "Generally good formatting with minor inconsistencies. Some spacing and alignment adjustments would improve the overall appearance.",
        low: "Formatting issues detract from the content. Inconsistent styling, poor spacing, or layout problems make the resume difficult to read.",
      },
    };

    const level = score >= 75 ? "high" : score >= 55 ? "medium" : "low";
    return (
      feedbackOptions[
        sectionName.toLowerCase() as keyof typeof feedbackOptions
      ]?.[level] ||
      "This section shows room for improvement with targeted enhancements."
    );
  };

  // Generate realistic suggestions based on scores
  const generateSuggestions = (sectionName: string, score: number) => {
    const suggestionOptions = {
      structure: [
        "Move your most relevant experience to the top of your work history",
        "Add a professional summary section to introduce your key qualifications",
        "Ensure consistent formatting across all sections",
        "Consider using a skills section to highlight technical competencies",
      ],
      content: [
        "Quantify achievements with specific numbers, percentages, or dollar amounts",
        "Use stronger action verbs to begin each bullet point",
        "Focus on results and impact rather than just job responsibilities",
        "Tailor content to match the specific job requirements",
      ],
      keywords: [
        "Research industry-specific keywords from job postings",
        "Include relevant technical skills and certifications",
        "Use variations of important terms throughout the resume",
        "Incorporate soft skills that are valued in your field",
      ],
      formatting: [
        "Ensure consistent font sizing and styling throughout",
        "Improve white space and margins for better readability",
        "Use bullet points effectively to break up dense text",
        "Consider a more modern, professional template",
      ],
    };

    const suggestions =
      suggestionOptions[
        sectionName.toLowerCase() as keyof typeof suggestionOptions
      ] || [];
    const numSuggestions = score >= 75 ? 1 : score >= 55 ? 2 : 3;

    return suggestions
      .sort(() => seededRandom(resumeHash + sectionName.length) - 0.5)
      .slice(0, numSuggestions);
  };

  // Generate realistic recommendations
  const generateRecommendations = (overallScore: number) => {
    const allRecommendations = [
      {
        title: "Quantify Your Achievements",
        description:
          "Add specific numbers, percentages, and metrics to demonstrate the impact of your work. Recruiters love seeing measurable results.",
        impact: "High" as const,
      },
      {
        title: "Optimize for Keywords",
        description:
          "Research job postings in your field and incorporate relevant keywords naturally throughout your resume to improve ATS compatibility.",
        impact: "High" as const,
      },
      {
        title: "Strengthen Your Professional Summary",
        description:
          "Create a compelling 2-3 line summary that immediately communicates your value proposition and career focus.",
        impact: "Medium" as const,
      },
      {
        title: "Improve Action Verbs",
        description:
          "Replace weak verbs with strong action words that better convey your contributions and leadership abilities.",
        impact: "Medium" as const,
      },
      {
        title: "Update Skills Section",
        description:
          "Ensure your skills section reflects current industry demands and includes both technical and soft skills relevant to your target role.",
        impact: "Medium" as const,
      },
      {
        title: "Enhance Formatting Consistency",
        description:
          "Review formatting for consistency in fonts, spacing, and bullet point styles to create a more professional appearance.",
        impact: "Low" as const,
      },
      {
        title: "Tailor for Each Application",
        description:
          "Customize your resume for each job application by emphasizing the most relevant experiences and skills.",
        impact: "High" as const,
      },
      {
        title: "Add Relevant Certifications",
        description:
          "Include any professional certifications, licenses, or training that add credibility to your qualifications.",
        impact: "Medium" as const,
      },
    ];

    const numRecommendations =
      overallScore >= 75 ? 3 : overallScore >= 60 ? 4 : 5;

    return allRecommendations
      .sort(() => seededRandom(resumeHash + 100) - 0.5)
      .slice(0, numRecommendations);
  };

  return {
    ...baseAnalysis,
    overallScore: calculatedOverallScore,
    sectionScores: {
      structure: structureScore,
      content: contentScore,
      keywords: keywordsScore,
      formatting: formattingScore,
    },
    jobRelevanceScore,
    sectionFeedback: [
      {
        section: "Structure & Organization",
        score: structureScore,
        feedback: generateSectionFeedback("structure", structureScore),
        suggestions: generateSuggestions("structure", structureScore),
      },
      {
        section: "Content Quality",
        score: contentScore,
        feedback: generateSectionFeedback("content", contentScore),
        suggestions: generateSuggestions("content", contentScore),
      },
      {
        section: "Keyword Optimization",
        score: keywordsScore,
        feedback: generateSectionFeedback("keywords", keywordsScore),
        suggestions: generateSuggestions("keywords", keywordsScore),
      },
      {
        section: "Formatting & Design",
        score: formattingScore,
        feedback: generateSectionFeedback("formatting", formattingScore),
        suggestions: generateSuggestions("formatting", formattingScore),
      },
    ],
    recommendations: generateRecommendations(calculatedOverallScore),
    missingKeywords: jobRelevanceScore
      ? [
          "project management",
          "data analysis",
          "leadership",
          "stakeholder communication",
          "process improvement",
        ].slice(0, Math.floor(seededRandom(resumeHash + 200) * 3) + 2)
      : [],
  };
};

export default function ResultsDisplay({
  analysis,
  onNewAnalysis,
}: ResultsDisplayProps) {
  // Generate realistic scores if using fallback data
  const realisticAnalysis = analysis.usingFallback
    ? generateRealisticScores(analysis)
    : analysis;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-red-500 dark:text-red-400";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80)
      return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-amber-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-emerald-600";
    if (score >= 60) return "from-amber-500 to-amber-600";
    return "from-red-500 to-red-600";
  };

  const getFallbackMessage = () => {
    if (!realisticAnalysis.usingFallback) return null;

    switch (realisticAnalysis.fallbackReason) {
      case "quota_exceeded":
        return "AI analysis temporarily unavailable due to quota limits. Showing demo analysis with realistic feedback patterns.";
      case "ai_error":
        return "AI service temporarily unavailable. Showing demo analysis with realistic feedback patterns.";
      case "no_api_key":
        return "AI analysis requires OpenAI API key configuration. Showing demo analysis with realistic feedback patterns.";
      default:
        return "Using demo analysis with realistic feedback patterns.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Modern Header */}
        <div className="flex items-center justify-between mb-12">
          <Button
            variant="outline"
            onClick={onNewAnalysis}
            className="rounded-full border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Analyze New Resume
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-purple-200">
              Resume Analysis Results
            </h1>
          </div>
          <div></div>
        </div>

        {/* Fallback Notice */}
        {realisticAnalysis.usingFallback && (
          <Alert className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              {getFallbackMessage()}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Modern Overall Score */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="relative mb-6">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${getScoreBg(
                      realisticAnalysis.overallScore
                    )} rounded-full blur-xl opacity-30`}
                  ></div>
                  <div
                    className={`relative bg-gradient-to-r ${getScoreBg(
                      realisticAnalysis.overallScore
                    )} p-8 rounded-full w-32 h-32 mx-auto flex items-center justify-center`}
                  >
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white">
                        {realisticAnalysis.overallScore}
                      </div>
                      <div className="text-white/80 text-sm">out of 100</div>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">
                  Overall Score
                </CardTitle>
                {realisticAnalysis.usingFallback && (
                  <Badge variant="secondary" className="mt-3 rounded-full">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Demo Analysis
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <Progress
                  value={realisticAnalysis.overallScore}
                  className="h-3 rounded-full"
                />

                {/* Modern Quick Stats */}
                <div className="space-y-4">
                  {[
                    {
                      label: "Structure",
                      score: realisticAnalysis.sectionScores.structure,
                    },
                    {
                      label: "Content",
                      score: realisticAnalysis.sectionScores.content,
                    },
                    {
                      label: "Keywords",
                      score: realisticAnalysis.sectionScores.keywords,
                    },
                    {
                      label: "Formatting",
                      score: realisticAnalysis.sectionScores.formatting,
                    },
                    ...(realisticAnalysis.jobRelevanceScore
                      ? [
                          {
                            label: "Job Match",
                            score: realisticAnalysis.jobRelevanceScore,
                          },
                        ]
                      : []),
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50"
                    >
                      <span className="font-medium">{item.label}</span>
                      <div className="flex items-center gap-3">
                        {getScoreIcon(item.score)}
                        <span
                          className={`font-bold text-lg ${getScoreColor(
                            item.score
                          )}`}
                        >
                          {item.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modern Detailed Analysis */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section Analysis */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-semibold">
                      Section Analysis
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                      Detailed feedback on each section of your resume
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {realisticAnalysis.sectionFeedback.map((section, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700/50 dark:to-slate-600/50">
                      <h4 className="font-semibold text-lg">
                        {section.section}
                      </h4>
                      <div className="flex items-center gap-3">
                        {getScoreIcon(section.score)}
                        <span
                          className={`font-bold text-xl ${getScoreColor(
                            section.score
                          )}`}
                        >
                          {section.score}/100
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {section.feedback}
                    </p>
                    {section.suggestions.length > 0 && (
                      <div className="space-y-3">
                        <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-amber-500" />
                          Suggestions for improvement:
                        </p>
                        <ul className="space-y-2">
                          {section.suggestions.map((suggestion, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20"
                            >
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700 dark:text-gray-300">
                                {suggestion}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {index < realisticAnalysis.sectionFeedback.length - 1 && (
                      <Separator className="my-6" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Job Relevance */}
            {realisticAnalysis.jobRelevanceScore && (
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-semibold">
                        Job Relevance Analysis
                      </CardTitle>
                      <CardDescription className="text-base mt-1">
                        How well your resume matches the job description
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
                    <span className="font-semibold text-lg">Match Score</span>
                    <div className="flex items-center gap-3">
                      {getScoreIcon(realisticAnalysis.jobRelevanceScore)}
                      <span
                        className={`font-bold text-2xl ${getScoreColor(
                          realisticAnalysis.jobRelevanceScore
                        )}`}
                      >
                        {realisticAnalysis.jobRelevanceScore}/100
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={realisticAnalysis.jobRelevanceScore}
                    className="h-3 rounded-full"
                  />

                  {realisticAnalysis.missingKeywords &&
                    realisticAnalysis.missingKeywords.length > 0 && (
                      <div className="space-y-4">
                        <p className="font-semibold text-lg flex items-center gap-2">
                          <Zap className="h-5 w-5 text-red-500" />
                          Missing Keywords:
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {realisticAnalysis.missingKeywords.map(
                            (keyword, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-red-600 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400 px-3 py-1 rounded-full"
                              >
                                {keyword}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}

            {/* Key Recommendations */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-semibold">
                      Key Recommendations
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                      Priority improvements to boost your resume score
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {realisticAnalysis.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl border border-blue-100 dark:border-blue-800/30"
                    >
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex-shrink-0">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg text-blue-900 dark:text-blue-100 mb-2">
                          {rec.title}
                        </p>
                        <p className="text-blue-700 dark:text-blue-200 leading-relaxed mb-3">
                          {rec.description}
                        </p>
                        <Badge
                          variant="secondary"
                          className={`rounded-full ${
                            rec.impact === "High"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                              : rec.impact === "Medium"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                          }`}
                        >
                          {rec.impact} Impact
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
