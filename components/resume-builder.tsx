import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Download,
  Plus,
  Trash2,
  User,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Info,
  Eye,
} from "lucide-react";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa: string;
  location: string;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
}

export default function EnhancedResumeBuilder() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
  });

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      location: "",
    },
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      id: "1",
      institution: "",
      degree: "",
      field: "",
      graduationDate: "",
      gpa: "",
      location: "",
    },
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    { id: "1", name: "", category: "Technical", level: "Proficient" },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      location: "",
    };
    setExperiences([...experiences, newExp]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const updateExperience = (
    id: string,
    field: keyof Experience,
    value: string
  ) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      graduationDate: "",
      gpa: "",
      location: "",
    };
    setEducation([...education, newEdu]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter((edu) => edu.id !== id));
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string
  ) => {
    setEducation(
      education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      category: "Technical",
      level: "Proficient",
    };
    setSkills([...skills, newSkill]);
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setSkills(
      skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    );
  };

  const generateResumeHTML = () => {
    const skillsByCategory = skills
      .filter((skill) => skill.name)
      .reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      }, {} as Record<string, Skill[]>);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #2c3e50;
            background: white;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
        }
        
        .resume-container {
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            min-height: 11in;
        }
        
        .header { 
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #34495e;
            margin-bottom: 25px;
        }
        
        .name { 
            font-size: 24pt;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 8px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 15px;
            font-size: 10pt;
            color: #7f8c8d;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
        }
        
        .section { 
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        
        .section-title { 
            font-size: 14pt;
            font-weight: 700;
            color: #2c3e50;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 1px solid #bdc3c7;
        }
        
        .summary { 
            font-size: 11pt;
            line-height: 1.6;
            text-align: justify;
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-left: 4px solid #3498db;
            border-radius: 3px;
        }
        
        .experience-item, .education-item { 
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
        }
        
        .item-title { 
            font-weight: 700;
            font-size: 12pt;
            color: #2c3e50;
            line-height: 1.2;
        }
        
        .item-subtitle { 
            font-weight: 600;
            font-size: 11pt;
            color: #34495e;
            margin-top: 2px;
        }
        
        .item-meta {
            text-align: right;
            font-size: 10pt;
            color: #7f8c8d;
            line-height: 1.2;
        }
        
        .date-range {
            font-weight: 600;
            color: #2980b9;
        }
        
        .location {
            font-style: italic;
            margin-top: 2px;
        }
        
        .description { 
            margin-top: 10px;
            line-height: 1.5;
            font-size: 10.5pt;
        }
        
        .description ul {
            margin: 8px 0;
            padding-left: 18px;
        }
        
        .description li {
            margin-bottom: 4px;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        
        .skill-category {
            margin-bottom: 15px;
        }
        
        .skill-category-title {
            font-weight: 700;
            font-size: 11pt;
            color: #2c3e50;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .skill-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .skill-item {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 6px 12px;
            border-radius: 15px;
            font-size: 9pt;
            font-weight: 500;
            white-space: nowrap;
        }
        
        .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 0.5in;
                box-shadow: none;
            }
            
            .resume-container {
                box-shadow: none;
            }
            
            .section {
                page-break-inside: avoid;
            }
            
            .experience-item, .education-item {
                page-break-inside: avoid;
            }
        }
        
        @page {
            margin: 0.75in;
            size: letter;
        }
    </style>
</head>
<body>
    <div class="resume-container">
        <div class="header">
            <div class="name">${personalInfo.fullName}</div>
            <div class="contact-info">
                ${
                  personalInfo.email
                    ? `<span class="contact-item">${personalInfo.email}</span>`
                    : ""
                }
                ${
                  personalInfo.phone
                    ? `<span class="contact-item">${personalInfo.phone}</span>`
                    : ""
                }
                ${
                  personalInfo.location
                    ? `<span class="contact-item">${personalInfo.location}</span>`
                    : ""
                }
                ${
                  personalInfo.linkedin
                    ? `<span class="contact-item">${personalInfo.linkedin}</span>`
                    : ""
                }
                ${
                  personalInfo.website
                    ? `<span class="contact-item">${personalInfo.website}</span>`
                    : ""
                }
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

        ${
          experiences.filter((exp) => exp.company && exp.position).length > 0
            ? `
        <div class="section">
            <div class="section-title">Professional Experience</div>
            ${experiences
              .filter((exp) => exp.company && exp.position)
              .map(
                (exp) => `
            <div class="experience-item">
                <div class="item-header">
                    <div>
                        <div class="item-title">${exp.position}</div>
                        <div class="item-subtitle">${exp.company}</div>
                    </div>
                    <div class="item-meta">
                        <div class="date-range">${exp.startDate}${
                  exp.endDate ? ` - ${exp.endDate}` : " - Present"
                }</div>
                        ${
                          exp.location
                            ? `<div class="location">${exp.location}</div>`
                            : ""
                        }
                    </div>
                </div>
                ${
                  exp.description
                    ? `<div class="description">${exp.description.replace(
                        /\n/g,
                        "<br>"
                      )}</div>`
                    : ""
                }
            </div>
            `
              )
              .join("")}
        </div>
        `
            : ""
        }

        ${
          education.filter((edu) => edu.institution && edu.degree).length > 0
            ? `
        <div class="section">
            <div class="section-title">Education</div>
            ${education
              .filter((edu) => edu.institution && edu.degree)
              .map(
                (edu) => `
            <div class="education-item">
                <div class="item-header">
                    <div>
                        <div class="item-title">${edu.degree}${
                  edu.field ? ` in ${edu.field}` : ""
                }</div>
                        <div class="item-subtitle">${edu.institution}</div>
                    </div>
                    <div class="item-meta">
                        <div class="date-range">${edu.graduationDate}</div>
                        ${
                          edu.location
                            ? `<div class="location">${edu.location}</div>`
                            : ""
                        }
                        ${
                          edu.gpa
                            ? `<div style="margin-top: 2px;">GPA: ${edu.gpa}</div>`
                            : ""
                        }
                    </div>
                </div>
            </div>
            `
              )
              .join("")}
        </div>
        `
            : ""
        }

        ${
          Object.keys(skillsByCategory).length > 0
            ? `
        <div class="section">
            <div class="section-title">Core Competencies</div>
            <div class="skills-grid">
                ${Object.entries(skillsByCategory)
                  .map(
                    ([category, categorySkills]) => `
                <div class="skill-category">
                    <div class="skill-category-title">${category}</div>
                    <div class="skill-list">
                        ${categorySkills
                          .map(
                            (skill) => `
                        <span class="skill-item">${skill.name}</span>
                        `
                          )
                          .join("")}
                    </div>
                </div>
                `
                  )
                  .join("")}
            </div>
        </div>
        `
            : ""
        }
    </div>
</body>
</html>`;
  };

  const downloadAsPDF = () => {
    if (!personalInfo.fullName || !personalInfo.email) {
      alert("Please fill in your name and email before downloading");
      return;
    }

    setIsGenerating(true);

    // Create the HTML content
    const htmlContent = generateResumeHTML();

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load, then trigger print dialog
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          setIsGenerating(false);
        }, 500);
      };
    } else {
      // Fallback: download as HTML file with print instructions
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${personalInfo.fullName.replace(/\s+/g, "_")}_Resume.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert(
        "HTML file downloaded. Open it in your browser and use Ctrl+P (Cmd+P on Mac) to print as PDF."
      );
      setIsGenerating(false);
    }
  };

  const downloadAsWord = () => {
    if (!personalInfo.fullName || !personalInfo.email) {
      alert("Please fill in your name and email before downloading");
      return;
    }

    setIsGenerating(true);

    // Create Word-compatible HTML content
    const wordContent = `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
    <meta charset="utf-8">
    <title>${personalInfo.fullName} - Resume</title>
    <!--[if gte mso 9]>
    <xml>
        <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>90</w:Zoom>
            <w:DoNotPromptForConvert/>
            <w:DoNotShowInsertionsAndDeletions/>
        </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
        body {
            font-family: 'Calibri', sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            margin: 1in;
            color: #000;
        }
        .header {
            text-align: center;
            margin-bottom: 20pt;
            border-bottom: 2pt solid #000;
            padding-bottom: 12pt;
        }
        .name {
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 6pt;
            text-transform: uppercase;
        }
        .contact {
            font-size: 10pt;
            line-height: 1.2;
        }
        .section-title {
            font-size: 12pt;
            font-weight: bold;
            text-transform: uppercase;
            margin: 16pt 0 8pt 0;
            border-bottom: 1pt solid #000;
            padding-bottom: 2pt;
        }
        .item-header {
            margin-bottom: 4pt;
        }
        .item-title {
            font-weight: bold;
            font-size: 11pt;
        }
        .item-subtitle {
            font-weight: bold;
            font-size: 10pt;
            margin-top: 2pt;
        }
        .date-location {
            float: right;
            font-size: 10pt;
            font-style: italic;
        }
        .description {
            margin: 6pt 0 12pt 0;
            font-size: 10pt;
        }
        .skills {
            font-size: 10pt;
            line-height: 1.6;
        }
        .skill-category {
            margin-bottom: 8pt;
        }
        .skill-category-title {
            font-weight: bold;
            margin-bottom: 2pt;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${personalInfo.fullName}</div>
        <div class="contact">
            ${personalInfo.email}${
      personalInfo.phone ? ` • ${personalInfo.phone}` : ""
    }${personalInfo.location ? ` • ${personalInfo.location}` : ""}
            ${personalInfo.linkedin ? `<br/>${personalInfo.linkedin}` : ""}
            ${personalInfo.website ? `<br/>${personalInfo.website}` : ""}
        </div>
    </div>

    ${
      personalInfo.summary
        ? `
    <div class="section-title">Professional Summary</div>
    <p>${personalInfo.summary}</p>
    `
        : ""
    }

    ${
      experiences.filter((exp) => exp.company && exp.position).length > 0
        ? `
    <div class="section-title">Professional Experience</div>
    ${experiences
      .filter((exp) => exp.company && exp.position)
      .map(
        (exp) => `
    <div class="item-header">
        <div class="item-title">${exp.position}</div>
        <div class="date-location">${exp.startDate}${
          exp.endDate ? ` - ${exp.endDate}` : " - Present"
        }${exp.location ? ` • ${exp.location}` : ""}</div>
        <div class="item-subtitle">${exp.company}</div>
    </div>
    ${
      exp.description
        ? `<div class="description">${exp.description.replace(
            /\n/g,
            "<br/>"
          )}</div>`
        : ""
    }
    `
      )
      .join("")}
    `
        : ""
    }

    ${
      education.filter((edu) => edu.institution && edu.degree).length > 0
        ? `
    <div class="section-title">Education</div>
    ${education
      .filter((edu) => edu.institution && edu.degree)
      .map(
        (edu) => `
    <div class="item-header">
        <div class="item-title">${edu.degree}${
          edu.field ? ` in ${edu.field}` : ""
        }</div>
        <div class="date-location">${edu.graduationDate}${
          edu.location ? ` • ${edu.location}` : ""
        }${edu.gpa ? ` • GPA: ${edu.gpa}` : ""}</div>
        <div class="item-subtitle">${edu.institution}</div>
    </div>
    `
      )
      .join("")}
    `
        : ""
    }

    ${
      skills.filter((skill) => skill.name).length > 0
        ? `
    <div class="section-title">Core Competencies</div>
    <div class="skills">
    ${Object.entries(
      skills
        .filter((skill) => skill.name)
        .reduce((acc, skill) => {
          if (!acc[skill.category]) acc[skill.category] = [];
          acc[skill.category].push(skill.name);
          return acc;
        }, {} as Record<string, string[]>)
    )
      .map(
        ([category, skillNames]) => `
        <div class="skill-category">
            <div class="skill-category-title">${category}:</div>
            ${skillNames.join(" • ")}
        </div>
    `
      )
      .join("")}
    </div>
    `
        : ""
    }
</body>
</html>`;

    const blob = new Blob([wordContent], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${personalInfo.fullName.replace(/\s+/g, "_")}_Resume.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsGenerating(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Professional Resume Builder
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Create a stunning, ATS-friendly resume in minutes
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Download Options:</strong> PDF opens print dialog for
          save-as-PDF. Word downloads as .doc file that opens in Microsoft Word
          or Google Docs.
        </AlertDescription>
      </Alert>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={personalInfo.fullName}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        fullName: e.target.value,
                      })
                    }
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        email: e.target.value,
                      })
                    }
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={personalInfo.phone}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        phone: e.target.value,
                      })
                    }
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={personalInfo.location}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        location: e.target.value,
                      })
                    }
                    placeholder="City, State"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  <Input
                    id="linkedin"
                    value={personalInfo.linkedin}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        linkedin: e.target.value,
                      })
                    }
                    placeholder="linkedin.com/in/johndoe"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website/Portfolio</Label>
                  <Input
                    id="website"
                    value={personalInfo.website}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        website: e.target.value,
                      })
                    }
                    placeholder="www.johndoe.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  value={personalInfo.summary}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      summary: e.target.value,
                    })
                  }
                  placeholder="Write a compelling 2-3 sentence summary highlighting your key achievements, skills, and career objectives..."
                  rows={4}
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
                  Professional Experience
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
                      <Button
                        onClick={() => removeExperience(exp.id)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Job Title</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) =>
                          updateExperience(exp.id, "position", e.target.value)
                        }
                        placeholder="Senior Software Engineer"
                      />
                    </div>
                    <div>
                      <Label>Company Name</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(exp.id, "company", e.target.value)
                        }
                        placeholder="TechCorp Inc."
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        value={exp.startDate}
                        onChange={(e) =>
                          updateExperience(exp.id, "startDate", e.target.value)
                        }
                        placeholder="Jan 2020"
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        value={exp.endDate}
                        onChange={(e) =>
                          updateExperience(exp.id, "endDate", e.target.value)
                        }
                        placeholder="Present"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={exp.location}
                      onChange={(e) =>
                        updateExperience(exp.id, "location", e.target.value)
                      }
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  <div>
                    <Label>Job Description & Achievements</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) =>
                        updateExperience(exp.id, "description", e.target.value)
                      }
                      placeholder="• Led a team of 5 developers in building scalable web applications
• Improved system performance by 40% through code optimization
• Implemented new features that increased user engagement by 25%"
                      rows={5}
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
                      <Button
                        onClick={() => removeEducation(edu.id)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(edu.id, "institution", e.target.value)
                        }
                        placeholder="University of California"
                      />
                    </div>
                    <div>
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(edu.id, "degree", e.target.value)
                        }
                        placeholder="Bachelor of Science"
                      />
                    </div>
                    <div>
                      <Label>Field of Study</Label>
                      <Input
                        value={edu.field}
                        onChange={(e) =>
                          updateEducation(edu.id, "field", e.target.value)
                        }
                        placeholder="Computer Science"
                      />
                    </div>
                    <div>
                      <Label>Graduation Date</Label>
                      <Input
                        value={edu.graduationDate}
                        onChange={(e) =>
                          updateEducation(
                            edu.id,
                            "graduationDate",
                            e.target.value
                          )
                        }
                        placeholder="May 2020"
                      />
                    </div>
                    <div>
                      <Label>GPA (Optional)</Label>
                      <Input
                        value={edu.gpa}
                        onChange={(e) =>
                          updateEducation(edu.id, "gpa", e.target.value)
                        }
                        placeholder="3.8/4.0"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) =>
                          updateEducation(edu.id, "location", e.target.value)
                        }
                        placeholder="Berkeley, CA"
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
                  Skills & Competencies
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
                      onChange={(e) =>
                        updateSkill(skill.id, "name", e.target.value)
                      }
                      placeholder="JavaScript, Python, Project Management..."
                    />
                  </div>
                  <div className="w-32">
                    <Select
                      value={skill.category}
                      onValueChange={(value) =>
                        updateSkill(skill.id, "category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Programming">Programming</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Management">Management</SelectItem>
                        <SelectItem value="Languages">Languages</SelectItem>
                        <SelectItem value="Tools">Tools</SelectItem>
                        <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-28">
                    <Select
                      value={skill.level}
                      onValueChange={(value) =>
                        updateSkill(skill.id, "level", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Proficient">Proficient</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {skills.length > 1 && (
                    <Button
                      onClick={() => removeSkill(skill.id)}
                      size="sm"
                      variant="ghost"
                    >
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
              <CardDescription>
                Generate your professional resume in PDF or Word format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button
                  onClick={downloadAsPDF}
                  disabled={
                    !personalInfo.fullName ||
                    !personalInfo.email ||
                    isGenerating
                  }
                  className="w-full h-12"
                  size="lg"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating PDF...
                    </div>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Download as PDF
                    </>
                  )}
                </Button>

                <Button
                  onClick={downloadAsWord}
                  disabled={
                    !personalInfo.fullName ||
                    !personalInfo.email ||
                    isGenerating
                  }
                  variant="outline"
                  className="w-full h-12"
                  size="lg"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      Generating Word...
                    </div>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download as Word
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
              <CardDescription>
                See how your resume will look when downloaded
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-white text-black min-h-[600px] text-sm overflow-auto max-h-[800px]">
                {showPreview ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: generateResumeHTML()
                        .replace(/<html[\s\S]*?<body[^>]*>/, "")
                        .replace(/<\/body>[\s\S]*?<\/html>/, ""),
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500 mb-4">
                        Click "Show Preview" to see your resume
                      </p>
                      <Button
                        onClick={() => setShowPreview(true)}
                        variant="outline"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Show Preview
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
