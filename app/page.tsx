"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Target, BarChart3, PlusCircle, History, Sparkles, Zap, Shield, Clock } from "lucide-react"
import UploadSection from "@/components/upload-section"
import ResultsDisplay from "@/components/results-display"
import ResumeBuilder from "@/components/resume-builder"
import AnalysisHistory from "@/components/analysis-history"
import type { ResumeAnalysis } from "@/types/resume"

export default function HomePage() {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState("analyze")

  const handleAnalysisComplete = (result: ResumeAnalysis) => {
    setAnalysis(result)
    setIsAnalyzing(false)
  }

  const handleNewAnalysis = () => {
    setAnalysis(null)
    setIsAnalyzing(false)
    setActiveTab("analyze")
  }

  const handleViewAnalysis = (analysisData: ResumeAnalysis) => {
    setAnalysis(analysisData)
    setActiveTab("analyze")
  }

  if (analysis && activeTab === "analyze") {
    return <ResultsDisplay analysis={analysis} onNewAnalysis={handleNewAnalysis} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* Modern Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-purple-200 mb-6">
            AI Resume Grader
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform your career with AI-powered resume analysis. Get instant feedback, create professional resumes,
            and track your progress with our intelligent platform.
          </p>
        </div>

        {/* Modern Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold">Smart Upload</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-center text-gray-600 dark:text-gray-300">
                Drag & drop PDF or DOCX files. Our AI instantly extracts and analyzes every detail.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl group-hover:from-emerald-600 group-hover:to-emerald-700 transition-all duration-300">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold">Detailed Scoring</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-center text-gray-600 dark:text-gray-300">
                Comprehensive analysis with scores for structure, content, keywords, and ATS compatibility.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-300">
                <PlusCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold">Resume Builder</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-center text-gray-600 dark:text-gray-300">
                Create stunning resumes with our guided builder. Export as PDF or Word instantly.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-300">
                <History className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold">Smart History</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-center text-gray-600 dark:text-gray-300">
                Track your progress with saved analyses and compare improvements over time.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Modern Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-2 mb-8">
            <TabsTrigger
              value="analyze"
              className="flex items-center gap-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
            >
              <Target className="h-5 w-5" />
              <span className="font-medium">Analyze Resume</span>
            </TabsTrigger>
            <TabsTrigger
              value="builder"
              className="flex items-center gap-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
            >
              <PlusCircle className="h-5 w-5" />
              <span className="font-medium">Resume Builder</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex items-center gap-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
            >
              <History className="h-5 w-5" />
              <span className="font-medium">Analysis History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="mt-8">
            <UploadSection
              onAnalysisComplete={handleAnalysisComplete}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
            />
          </TabsContent>

          <TabsContent value="builder" className="mt-8">
            <ResumeBuilder />
          </TabsContent>

          <TabsContent value="history" className="mt-8">
            <AnalysisHistory onViewAnalysis={handleViewAnalysis} />
          </TabsContent>
        </Tabs>

        {/* Modern Footer */}
        <div className="text-center mt-16">
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span>Powered by AI</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>Secure Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
