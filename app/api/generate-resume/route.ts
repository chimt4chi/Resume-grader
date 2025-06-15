import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { resumeData, format } = await request.json()

    if (format === "pdf") {
      return await generatePDFResponse(resumeData)
    } else if (format === "docx") {
      return await generateDOCXResponse(resumeData)
    } else {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 })
    }
  } catch (error) {
    console.error("Resume generation error:", error)
    return NextResponse.json({ error: "Failed to generate resume" }, { status: 500 })
  }
}

async function generatePDFResponse(resumeData: any) {
  try {
    // For PDF, we'll return the HTML and let the client handle PDF generation
    const html = generatePrintOptimizedHTML(resumeData)

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${resumeData.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.html"`,
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    throw error
  }
}

async function generateDOCXResponse(resumeData: any) {
  try {
    // Generate RTF format which can be opened by Word
    const rtf = generateRTF(resumeData)

    return new NextResponse(rtf, {
      headers: {
        "Content-Type": "application/rtf",
        "Content-Disposition": `attachment; filename="${resumeData.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.rtf"`,
      },
    })
  } catch (error) {
    console.error("DOCX generation error:", error)
    throw error
  }
}

function generatePrintOptimizedHTML(resumeData: any) {
  const { personalInfo, experiences, education, skills } = resumeData

  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${personalInfo.fullName} - Resume</title>
    <style>
        @page {
            size: A4;
            margin: 0.5in;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body { 
            font-family: 'Arial', 'Helvetica', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background: white;
            font-size: 11pt;
        }
        .container {
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 15px; 
        }
        .name { 
            font-size: 24pt; 
            font-weight: bold; 
            color: #2563eb; 
            margin-bottom: 8px; 
            letter-spacing: 1px;
        }
        .contact { 
            font-size: 10pt; 
            color: #666; 
            line-height: 1.4;
        }
        .section { 
            margin-bottom: 25px; 
            page-break-inside: avoid;
        }
        .section-title { 
            font-size: 14pt; 
            font-weight: bold; 
            color: #2563eb; 
            margin-bottom: 12px; 
            border-bottom: 1px solid #ddd; 
            padding-bottom: 4px; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .summary { 
            font-style: italic; 
            margin-bottom: 15px; 
            padding: 12px;
            background: #f8fafc;
            border-left: 4px solid #2563eb;
            border-radius: 4px;
        }
        .experience-item, .education-item { 
            margin-bottom: 18px; 
            page-break-inside: avoid;
        }
        .job-title { 
            font-weight: bold; 
            font-size: 12pt; 
            color: #1f2937;
            margin-bottom: 4px;
        }
        .company { 
            color: #666; 
            font-size: 10pt; 
            margin-bottom: 6px;
            font-weight: 500;
        }
        .date { 
            color: #888; 
            font-size: 9pt; 
            float: right; 
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 8px;
        }
        .description { 
            margin-top: 8px; 
            line-height: 1.5;
            font-size: 10pt;
        }
        .skills { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 8px; 
        }
        .skill { 
            background: #3b82f6; 
            color: white;
            padding: 4px 10px; 
            border-radius: 12px; 
            font-size: 9pt; 
            font-weight: 500;
        }
        @media print { 
            body { 
                margin: 0; 
                padding: 0; 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .container {
                padding: 0;
            }
            .section { 
                page-break-inside: avoid; 
            }
        }
    </style>
    <script>
        window.onload = function() {
            // Auto-print when opened
            setTimeout(function() {
                window.print();
            }, 500);
        }
    </script>
</head>
<body>
    <div class="container">
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
              .map(
                (exp: any) => `
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
              .map(
                (edu: any) => `
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
                ${skills.map((skill: any) => `<span class="skill">${skill.name}</span>`).join("")}
            </div>
        </div>
    </div>
</body>
</html>`
}

function generateRTF(resumeData: any) {
  const { personalInfo, experiences, education, skills } = resumeData

  // RTF header
  let rtf = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}{\\f1 Arial;}}
{\\colortbl;\\red37\\green99\\blue235;\\red102\\green102\\blue102;\\red0\\green0\\blue0;}
\\f1\\fs22`

  // Name (centered, large, blue)
  rtf += `\\qc\\fs32\\cf1\\b ${personalInfo.fullName}\\b0\\fs22\\cf3\\par\\par`

  // Contact info (centered)
  const contactInfo = [personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin]
    .filter(Boolean)
    .join(" • ")
  rtf += `\\qc\\fs20\\cf2 ${contactInfo}\\cf3\\fs22\\par`

  // Line separator
  rtf += `\\par\\ql\\brdrb\\brdrs\\brdrw15\\brsp20\\par\\par`

  // Professional Summary
  if (personalInfo.summary) {
    rtf += `\\fs24\\cf1\\b PROFESSIONAL SUMMARY\\b0\\cf3\\fs22\\par`
    rtf += `\\i ${personalInfo.summary}\\i0\\par\\par`
  }

  // Work Experience
  if (experiences.length > 0) {
    rtf += `\\fs24\\cf1\\b WORK EXPERIENCE\\b0\\cf3\\fs22\\par`
    experiences.forEach((exp: any) => {
      rtf += `\\b ${exp.position}\\b0\\par`
      rtf += `\\cf2 ${exp.company} | ${exp.startDate} - ${exp.endDate || "Present"}\\cf3\\par`
      if (exp.description) {
        rtf += `${exp.description.replace(/\n/g, "\\par")}\\par`
      }
      rtf += `\\par`
    })
  }

  // Education
  if (education.length > 0) {
    rtf += `\\fs24\\cf1\\b EDUCATION\\b0\\cf3\\fs22\\par`
    education.forEach((edu: any) => {
      rtf += `\\b ${edu.degree}${edu.field ? ` in ${edu.field}` : ""}\\b0\\par`
      rtf += `\\cf2 ${edu.institution} | ${edu.graduationDate}\\cf3\\par\\par`
    })
  }

  // Skills
  if (skills.length > 0) {
    rtf += `\\fs24\\cf1\\b SKILLS\\b0\\cf3\\fs22\\par`
    const skillsText = skills.map((skill: any) => skill.name).join(" • ")
    rtf += `${skillsText}\\par`
  }

  rtf += "}"
  return rtf
}
