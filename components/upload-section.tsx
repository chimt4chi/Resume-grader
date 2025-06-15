"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, Loader2, Plus, AlertCircle, Sparkles, Target } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { ResumeAnalysis } from "@/types/resume"

interface UploadSectionProps {
  onAnalysisComplete: (analysis: ResumeAnalysis) => void
  isAnalyzing: boolean
  setIsAnalyzing: (analyzing: boolean) => void
}

export default function UploadSection({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [showJobDescription, setShowJobDescription] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0]
        if (file.type === "application/pdf" || file.name.endsWith(".docx")) {
          setUploadedFile(file)
          setError(null)
          toast({
            title: "File uploaded successfully",
            description: `${file.name} is ready for analysis`,
            variant: "success",
          })
        } else {
          const errorMsg = "Please upload a PDF or DOCX file."
          setError(errorMsg)
          toast({
            title: "Invalid file format",
            description: errorMsg,
            variant: "destructive",
          })
        }
      }
    },
    [toast],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === "application/pdf" || file.name.endsWith(".docx")) {
        setUploadedFile(file)
        setError(null)
        toast({
          title: "File uploaded successfully",
          description: `${file.name} is ready for analysis`,
          variant: "success",
        })
      } else {
        const errorMsg = "Please upload a PDF or DOCX file."
        setError(errorMsg)
        toast({
          title: "Invalid file format",
          description: errorMsg,
          variant: "destructive",
        })
      }
    }
  }

  const saveAnalysisToHistory = (analysis: ResumeAnalysis, fileName: string) => {
    try {
      const historyItem = {
        id: Date.now().toString(),
        fileName: fileName,
        analysisDate: new Date().toISOString(),
        analysis: analysis,
      }

      const existingHistory = localStorage.getItem("resumeAnalysisHistory")
      const history = existingHistory ? JSON.parse(existingHistory) : []

      history.unshift(historyItem)
      const trimmedHistory = history.slice(0, 50)

      localStorage.setItem("resumeAnalysisHistory", JSON.stringify(trimmedHistory))
    } catch (error) {
      console.error("Error saving analysis to history:", error)
      toast({
        title: "Warning",
        description: "Analysis completed but couldn't save to history",
        variant: "warning",
      })
    }
  }

  const analyzeResume = async () => {
    if (!uploadedFile) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("resume", uploadedFile)
      if (jobDescription.trim()) {
        formData.append("jobDescription", jobDescription)
      }

      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 500 && data.error?.includes("API key")) {
          toast({
            title: "Configuration Error",
            description: "OpenAI API key is not configured. Please contact the administrator to set up the API key.",
            variant: "destructive",
          })
        } else if (response.status === 429) {
          toast({
            title: "API Quota Exceeded",
            description: "OpenAI API quota has been exceeded. Using demo analysis instead.",
            variant: "warning",
          })
        } else if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Invalid OpenAI API key. Please check the configuration.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Analysis Error",
            description: data.error || "Failed to analyze resume. Please try again.",
            variant: "destructive",
          })
        }
        throw new Error(data.error || "Analysis failed")
      }

      saveAnalysisToHistory(data, uploadedFile.name)

      if (data.usingFallback) {
        toast({
          title: "Analysis Complete (Demo Mode)",
          description: "Resume analyzed using demo mode. Results show realistic feedback patterns.",
          variant: "warning",
        })
      } else {
        toast({
          title: "Analysis Complete",
          description: "Your resume has been successfully analyzed with AI-powered insights.",
          variant: "success",
        })
      }

      onAnalysisComplete(data)
    } catch (error: any) {
      console.error("Analysis error:", error)
      setError(error.message || "Failed to analyze resume. Please try again.")
      setIsAnalyzing(false)

      if (!error.message?.includes("API key") && !error.message?.includes("quota")) {
        toast({
          title: "Analysis Failed",
          description: error.message || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Modern File Upload */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold">Upload Your Resume</CardTitle>
          </div>
          <CardDescription className="text-base">
            Drag & drop your resume or click to browse • Supports PDF and DOCX files up to 10MB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? "border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 scale-105"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploadedFile ? (
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full blur-lg opacity-30"></div>
                  <div className="relative bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 rounded-full w-fit mx-auto">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-lg text-emerald-700 dark:text-emerald-300">{uploadedFile.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setUploadedFile(null)}
                  className="rounded-full border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Remove File
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-30"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-full w-fit mx-auto">
                    <Upload className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Drop your resume here</p>
                  <p className="text-gray-500 dark:text-gray-400">or click the button below to browse your files</p>
                </div>
                <input type="file" accept=".pdf,.docx" onChange={handleFileInput} className="hidden" id="file-upload" />
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg"
                >
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Choose File
                  </label>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modern Job Description */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Job Description</CardTitle>
                <CardDescription className="text-base mt-1">
                  Add a job description for targeted feedback and relevance scoring
                </CardDescription>
              </div>
            </div>
            {!showJobDescription && (
              <Button
                variant="outline"
                onClick={() => setShowJobDescription(true)}
                className="rounded-full border-2 hover:bg-orange-50 hover:border-orange-200 dark:hover:bg-orange-950/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Job Description
              </Button>
            )}
          </div>
        </CardHeader>
        {showJobDescription && (
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="job-description" className="text-base font-medium">
                Job Description
              </Label>
              <Textarea
                id="job-description"
                placeholder="Paste the job description here to get targeted feedback on how well your resume matches the role..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
                className="mt-3 border-2 rounded-xl resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setShowJobDescription(false)
                setJobDescription("")
              }}
              className="rounded-full border-2"
            >
              Remove Job Description
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Modern Analyze Button */}
      <div className="text-center">
        <Button
          onClick={analyzeResume}
          disabled={!uploadedFile || isAnalyzing}
          size="lg"
          className="px-12 py-4 text-lg rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-6 w-6 mr-3 animate-spin" />
              Analyzing Resume...
            </>
          ) : (
            <>
              <Sparkles className="h-6 w-6 mr-3" />
              Analyze Resume with AI
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
