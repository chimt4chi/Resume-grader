"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, Trash2, Calendar, FileText, Info } from "lucide-react"
import type { ResumeAnalysis } from "@/types/resume"

interface AnalysisHistoryItem {
  id: string
  fileName: string
  analysisDate: string
  analysis: ResumeAnalysis
}

interface AnalysisHistoryProps {
  onViewAnalysis: (analysis: ResumeAnalysis) => void
}

export default function AnalysisHistory({ onViewAnalysis }: AnalysisHistoryProps) {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([])

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem("resumeAnalysisHistory")
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory)
        setHistory(parsedHistory)
      }
    } catch (error) {
      console.error("Error loading history:", error)
    }
  }

  const deleteHistoryItem = (id: string) => {
    try {
      const updatedHistory = history.filter((item) => item.id !== id)
      setHistory(updatedHistory)
      localStorage.setItem("resumeAnalysisHistory", JSON.stringify(updatedHistory))
    } catch (error) {
      console.error("Error deleting history item:", error)
    }
  }

  const clearAllHistory = () => {
    try {
      setHistory([])
      localStorage.removeItem("resumeAnalysisHistory")
    } catch (error) {
      console.error("Error clearing history:", error)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200"
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Analysis History</h2>
          <p className="text-gray-600 dark:text-gray-300">View and manage your previous resume analyses</p>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            No analysis history found. Upload and analyze a resume to see your history here. Your analysis data is
            stored locally in your browser.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analysis History</h2>
          <p className="text-gray-600 dark:text-gray-300">
            You have {history.length} resume analysis{history.length !== 1 ? "es" : ""} saved
          </p>
        </div>
        {history.length > 0 && (
          <Button onClick={clearAllHistory} variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {history
          .sort((a, b) => new Date(b.analysisDate).getTime() - new Date(a.analysisDate).getTime())
          .map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {item.fileName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Analyzed on {formatDate(item.analysisDate)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full border ${getScoreColor(item.analysis.overallScore)}`}>
                      <span className="font-bold">{item.analysis.overallScore}/100</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Score Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Structure</div>
                      <div className="font-semibold">{item.analysis.sectionScores.structure}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Content</div>
                      <div className="font-semibold">{item.analysis.sectionScores.content}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Keywords</div>
                      <div className="font-semibold">{item.analysis.sectionScores.keywords}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Formatting</div>
                      <div className="font-semibold">{item.analysis.sectionScores.formatting}</div>
                    </div>
                  </div>

                  {/* Key Info */}
                  <div className="flex flex-wrap gap-2">
                    {item.analysis.usingFallback && <Badge variant="secondary">Demo Analysis</Badge>}
                    {item.analysis.jobRelevanceScore && (
                      <Badge variant="outline">Job Match: {item.analysis.jobRelevanceScore}/100</Badge>
                    )}
                    <Badge variant="outline">{item.analysis.recommendations.length} Recommendations</Badge>
                  </div>

                  {/* Top Recommendation */}
                  {item.analysis.recommendations.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-100">Top Recommendation:</div>
                      <div className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                        {item.analysis.recommendations[0].title}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <Button onClick={() => onViewAnalysis(item.analysis)} variant="default" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Analysis
                    </Button>
                    <Button onClick={() => deleteHistoryItem(item.id)} variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
