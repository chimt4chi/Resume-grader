"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Plus, Trash2, User, Briefcase, GraduationCap, Award, FileText, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  summary: string
}

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  graduationDate: string
}

interface Skill {
  id: string
  name: string
  category: string
}

export default function ResumeBuilder() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    summary: "",
  })

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ])

  const [education, setEducation] = useState<Education[]>([
    {
      id: "1",
      institution: "",
      degree: "",
      field: "",
      graduationDate: "",
    },
  ])

  const [skills, setSkills] = useState<Skill[]>([{ id: "1", name: "", category: "Technical" }])
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    }
    setExperiences([...experiences, newExp])
    toast({
      title: "Experience Added",
      description: "New work experience section added",
      variant: "success",
    })
  }

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id))
    toast({
      title: "Experience Removed",
      description: "Work experience section removed",
      variant: "success",
    })
  }

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)))
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      graduationDate: "",
    }
    setEducation([...education, newEdu])
    toast({
      title: "Education Added",
      description: "New education section added",
      variant: "success",
    })
  }

  const removeEducation = (id: string) => {
    setEducation(education.filter((edu) => edu.id !== id))
    toast({
      title: "Education Removed",
      description: "Education section removed",
      variant: "success",
    })
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)))
  }

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      category: "Technical",
    }
    setSkills([...skills, newSkill])
    toast({
      title: "Skill Added",
      description: "New skill field added",
      variant: "success",
    })
  }

  const removeSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.id !== id))
    toast({
      title: "Skill Removed",
      description: "Skill field removed",
      variant: "success",
    })
  }

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setSkills(skills.map((skill) => (skill.id === id ? { ...skill, [field]: value } : skill)))
  }

  const generateResumeHTML = () => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${personalInfo.fullName} - Resume</title>
    <style>
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            margin: 0; 
            padding: 40px; 
            color: #333; 
            background: white;
        }
        .header { 
            text-align: center; 
            margin-bottom: 40px; 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 20px; 
        }
        .name { 
            font-size: 32px; 
            font-weight: bold; 
            color: #2563eb; 
            margin-bottom: 10px; 
            letter-spacing: 1px;
        }
        .contact { 
            font-size: 14px; 
            color: #666; 
            line-height: 1.4;
        }
        .section { 
            margin-bottom: 35px; 
            page-break-inside: avoid;
        }
        .section-title { 
            font-size: 20px; 
            font-weight: bold; 
            color: #2563eb; 
            margin-bottom: 20px; 
            border-bottom: 2px solid #e5e7eb; 
            padding-bottom: 8px; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .summary { 
            font-style: italic; 
            margin-bottom: 20px; 
            padding: 15px;
            background: #f8fafc;
            border-left: 4px solid #2563eb;
            border-radius: 4px;
        }
        .experience-item, .education-item { 
            margin-bottom: 25px; 
            page-break-inside: avoid;
        }
        .job-title { 
            font-weight: bold; 
            font-size: 16px; 
            color: #1f2937;
            margin-bottom: 5px;
        }
        .company { 
            color: #666; 
            font-size: 14px; 
            margin-bottom: 8px;
            font-weight: 500;
        }
        .date { 
            color: #888; 
            font-size: 12px; 
            float: right; 
            background: #f3f4f6;
            padding: 2px 8px;
            border-radius: 12px;
        }
        .description { 
            margin-top: 10px; 
            line-height: 1.7;
        }
        .skills { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 12px; 
        }
        .skill { 
            background: linear-gradient(135deg, #3b82f6, #2563eb); 
            color: white;
            padding: 8px 16px; 
            border-radius: 20px; 
            font-size: 13px; 
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
        }
        @media print { 
            body { margin: 0; padding: 20px; } 
            .section { page-break-inside: avoid; }
        }
        @page {
            margin: 1in;
            size: letter;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${personalInfo.fullName}</div>
        <div class="contact">
            ${personalInfo.email}${personalInfo.phone ? ` • ${personalInfo.phone}` : ""}${
              personalInfo.location ? ` • ${personalInfo.location}` : ""
            }
            ${personalInfo.linkedin ? `<br>${personalInfo.linkedin}` : ""}
        </div>
    </div>

    ${
      personalInfo.summary
        ? `
    <div class="section">
        <div class="section-title">Professional Summary</div>
        <div class="summary">${personalInfo.summary}</div>
    </div>
    `
        : ""
    }

    <div class="section">
        <div class="section-title">Work Experience</div>
        ${experiences
          .filter((exp) => exp.company && exp.position)
          .map(
            (exp) => `
        <div class="experience-item">
            <div class="job-title">${exp.position}</div>
            <div class="company">${exp.company} <span class="date">${exp.startDate} - ${exp.endDate || "Present"}</span></div>
            ${exp.description ? `<div class="description">${exp.description.replace(/\n/g, "<br>")}</div>` : ""}
        </div>
        `,
          )
          .join("")}
    </div>

    <div class="section">
        <div class="section-title">Education</div>
        ${education
          .filter((edu) => edu.institution && edu.degree)
          .map(
            (edu) => `
        <div class="education-item">
            <div class="job-title">${edu.degree}${edu.field ? ` in ${edu.field}` : ""}</div>
            <div class="company">${edu.institution} <span class="date">${edu.graduationDate}</span></div>
        </div>
        `,
          )
          .join("")}
    </div>

    <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills">
            ${skills
              .filter((skill) => skill.name)
              .map((skill) => `<span class="skill">${skill.name}</span>`)
              .join("")}
        </div>
    </div>
</body>
</html>
    `
  }

  const downloadResume = async (format: "pdf" | "docx") => {
    if (!personalInfo.fullName) {
      toast({
        title: "Missing Information",
        description: "Please fill in your full name before downloading",
        variant: "destructive",
      })
      return
    }

    if (!personalInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your email address before downloading",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const resumeData = {
        personalInfo,
        experiences: experiences.filter((exp) => exp.company && exp.position),
        education: education.filter((edu) => edu.institution && edu.degree),
        skills: skills.filter((skill) => skill.name),
        html: generateResumeHTML(),
      }

      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData,
          format,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate resume")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url

      if (format === "pdf") {
        a.download = `${personalInfo.fullName.replace(/\s+/g, "_")}_Resume.html`
        toast({
          title: "Resume Downloaded",
          description: "HTML file downloaded. Open it and use 'Print to PDF' to create a PDF.",
          variant: "success",
        })
      } else {
        a.download = `${personalInfo.fullName.replace(/\s+/g, "_")}_Resume.rtf`
        toast({
          title: "Resume Downloaded",
          description: "RTF file downloaded. It will open in Microsoft Word for editing.",
          variant: "success",
        })
      }

      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating resume:", error)
      toast({
        title: "Download Failed",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Resume Builder</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Create a professional resume and download it in print-ready formats
        </p>
      </div>

      {/* Download Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Download Instructions:</strong> PDF downloads as HTML (use browser's "Print to PDF" feature). Word
          downloads as RTF format (opens in Microsoft Word).
        </AlertDescription>
      </Alert>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                    placeholder="City, State"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn (Optional)</Label>
                <Input
                  id="linkedin"
                  value={personalInfo.linkedin}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>
              <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  value={personalInfo.summary}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                  placeholder="Brief professional summary highlighting your key skills and experience..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Work Experience */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Work Experience
                </CardTitle>
                <Button onClick={addExperience} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="space-y-4">
                  {index > 0 && <Separator />}
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Experience {index + 1}</h4>
                    {experiences.length > 1 && (
                      <Button onClick={() => removeExperience(exp.id)} size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <Label>Position</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                        placeholder="Job Title"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                        placeholder="Jan 2020"
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                        placeholder="Present"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      placeholder="• Describe your responsibilities and achievements&#10;• Use bullet points for better readability&#10;• Include quantifiable results when possible"
                      rows={4}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
                <Button onClick={addEducation} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {education.map((edu, index) => (
                <div key={edu.id} className="space-y-4">
                  {index > 0 && <Separator />}
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Education {index + 1}</h4>
                    {education.length > 1 && (
                      <Button onClick={() => removeEducation(edu.id)} size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                        placeholder="University Name"
                      />
                    </div>
                    <div>
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                        placeholder="Bachelor of Science"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Field of Study</Label>
                      <Input
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                        placeholder="Computer Science"
                      />
                    </div>
                    <div>
                      <Label>Graduation Date</Label>
                      <Input
                        value={edu.graduationDate}
                        onChange={(e) => updateEducation(edu.id, "graduationDate", e.target.value)}
                        placeholder="May 2020"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Skills
                </CardTitle>
                <Button onClick={addSkill} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map((skill, index) => (
                <div key={skill.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                      placeholder="Skill name"
                    />
                  </div>
                  <div className="w-32">
                    <Select value={skill.category} onValueChange={(value) => updateSkill(skill.id, "category", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                        <SelectItem value="Languages">Languages</SelectItem>
                        <SelectItem value="Tools">Tools</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {skills.length > 1 && (
                    <Button onClick={() => removeSkill(skill.id)} size="sm" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Preview and Download Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Download Resume</CardTitle>
              <CardDescription>Choose your preferred format to download your professional resume</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => downloadResume("pdf")}
                  disabled={!personalInfo.fullName || !personalInfo.email || isGenerating}
                  className="h-12"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </div>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => downloadResume("docx")}
                  disabled={!personalInfo.fullName || !personalInfo.email || isGenerating}
                  variant="outline"
                  className="h-12"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      Generating...
                    </div>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download Word
                    </>
                  )}
                </Button>
              </div>
              {(!personalInfo.fullName || !personalInfo.email) && (
                <p className="text-sm text-gray-500 text-center">
                  Please fill in your name and email to enable downloads
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resume Preview</CardTitle>
              <CardDescription>Preview how your resume will look when downloaded</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border rounded-lg p-6 bg-white text-black min-h-[600px] text-sm overflow-auto max-h-[800px]"
                dangerouslySetInnerHTML={{
                  __html: generateResumeHTML()
                    .replace(/<html>.*?<body>/s, "")
                    .replace(/<\/body>.*?<\/html>/s, ""),
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
