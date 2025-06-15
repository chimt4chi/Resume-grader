import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { resumeData, format } = await request.json();

    if (format === "pdf") {
      return await generatePDFResponse(resumeData);
    } else if (format === "docx") {
      return await generateDOCXResponse(resumeData);
    } else {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }
  } catch (error) {
    console.error("Resume generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}

async function generatePDFResponse(resumeData: any) {
  try {
    // Import jsPDF for client-side PDF generation
    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const { personalInfo, experiences, education, skills } = resumeData;

    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // Helper function to add text with word wrapping
    const addWrappedText = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      fontSize = 10
    ) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + lines.length * (fontSize * 0.35);
    };

    // Header - Name
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(44, 62, 80);
    doc.text(personalInfo.fullName, pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 10;

    // Contact Information
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(127, 140, 141);
    const contactInfo = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedin,
    ]
      .filter(Boolean)
      .join(" • ");
    doc.text(contactInfo, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    // Separator line
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Professional Summary
    if (personalInfo.summary) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(44, 62, 80);
      doc.text("PROFESSIONAL SUMMARY", margin, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      yPosition = addWrappedText(
        personalInfo.summary,
        margin,
        yPosition,
        contentWidth,
        10
      );
      yPosition += 10;
    }

    // Work Experience
    if (experiences.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(44, 62, 80);
      doc.text("WORK EXPERIENCE", margin, yPosition);
      yPosition += 8;

      experiences.forEach((exp: any) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        // Job Title
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(exp.position, margin, yPosition);
        yPosition += 6;

        // Company and Date
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(127, 140, 141);
        doc.text(`${exp.company}`, margin, yPosition);
        doc.text(
          `${exp.startDate} - ${exp.endDate || "Present"}`,
          pageWidth - margin,
          yPosition,
          { align: "right" }
        );
        yPosition += 8;

        // Description
        if (exp.description) {
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          const descriptionLines = exp.description
            .split("\n")
            .filter((line: string) => line.trim());
          descriptionLines.forEach((line: string) => {
            const bulletPoint = line.trim().startsWith("•")
              ? line
              : `• ${line}`;
            yPosition = addWrappedText(
              bulletPoint,
              margin + 5,
              yPosition,
              contentWidth - 5,
              10
            );
            yPosition += 2;
          });
        }
        yPosition += 8;
      });
    }

    // Education
    if (education.length > 0) {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(44, 62, 80);
      doc.text("EDUCATION", margin, yPosition);
      yPosition += 8;

      education.forEach((edu: any) => {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(
          `${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`,
          margin,
          yPosition
        );
        yPosition += 6;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(127, 140, 141);
        doc.text(edu.institution, margin, yPosition);
        doc.text(edu.graduationDate, pageWidth - margin, yPosition, {
          align: "right",
        });
        yPosition += 10;
      });
    }

    // Skills
    if (skills.length > 0) {
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(44, 62, 80);
      doc.text("SKILLS", margin, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      const skillsText = skills.map((skill: any) => skill.name).join(" • ");
      yPosition = addWrappedText(
        skillsText,
        margin,
        yPosition,
        contentWidth,
        10
      );
    }

    // Generate PDF buffer
    const pdfBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${personalInfo.fullName.replace(
          /\s+/g,
          "_"
        )}_Resume.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF. Please try again." },
      { status: 500 }
    );
  }
}

async function generateDOCXResponse(resumeData: any) {
  try {
    const {
      Document,
      Packer,
      Paragraph,
      TextRun,
      HeadingLevel,
      AlignmentType,
      BorderStyle,
      UnderlineType,
    } = await import("docx");

    const { personalInfo, experiences, education, skills } = resumeData;

    const docSections = [];

    // Header with name
    docSections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: personalInfo.fullName,
            bold: true,
            size: 32,
            color: "2c3e50",
            font: "Arial",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    // Contact information
    const contactInfo = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedin,
    ]
      .filter(Boolean)
      .join(" • ");

    docSections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactInfo,
            size: 20,
            color: "7f8c8d",
            font: "Arial",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        border: {
          bottom: {
            color: "3498db",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );

    // Professional Summary
    if (personalInfo.summary) {
      docSections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "PROFESSIONAL SUMMARY",
              bold: true,
              size: 24,
              color: "2c3e50",
              font: "Arial",
            }),
          ],
          spacing: { before: 200, after: 150 },
        })
      );

      docSections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: personalInfo.summary,
              size: 22,
              font: "Times New Roman",
            }),
          ],
          spacing: { after: 300 },
          indent: { left: 200, right: 200 },
        })
      );
    }

    // Work Experience
    if (experiences.length > 0) {
      docSections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "WORK EXPERIENCE",
              bold: true,
              size: 24,
              color: "2c3e50",
              font: "Arial",
            }),
          ],
          spacing: { before: 200, after: 150 },
        })
      );

      experiences.forEach((exp: any) => {
        docSections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.position,
                bold: true,
                size: 22,
                font: "Times New Roman",
              }),
            ],
            spacing: { before: 150, after: 50 },
          })
        );

        docSections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${exp.company} | ${exp.startDate} - ${
                  exp.endDate || "Present"
                }`,
                color: "7f8c8d",
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 100 },
          })
        );

        if (exp.description) {
          const descriptionLines = exp.description
            .split("\n")
            .filter((line: string) => line.trim());
          descriptionLines.forEach((line: string) => {
            const bulletText = line.trim().startsWith("•") ? line : `• ${line}`;
            docSections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: bulletText,
                    size: 20,
                    font: "Times New Roman",
                  }),
                ],
                spacing: { after: 50 },
                indent: { left: 300 },
              })
            );
          });
        }

        docSections.push(
          new Paragraph({
            children: [new TextRun({ text: "" })],
            spacing: { after: 150 },
          })
        );
      });
    }

    // Education
    if (education.length > 0) {
      docSections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "EDUCATION",
              bold: true,
              size: 24,
              color: "2c3e50",
              font: "Arial",
            }),
          ],
          spacing: { before: 200, after: 150 },
        })
      );

      education.forEach((edu: any) => {
        docSections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`,
                bold: true,
                size: 22,
                font: "Times New Roman",
              }),
            ],
            spacing: { before: 100, after: 50 },
          })
        );

        docSections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.institution} | ${edu.graduationDate}`,
                color: "7f8c8d",
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 150 },
          })
        );
      });
    }

    // Skills
    if (skills.length > 0) {
      docSections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "SKILLS",
              bold: true,
              size: 24,
              color: "2c3e50",
              font: "Arial",
            }),
          ],
          spacing: { before: 200, after: 150 },
        })
      );

      const skillsText = skills.map((skill: any) => skill.name).join(" • ");
      docSections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: skillsText,
              size: 20,
              font: "Times New Roman",
            }),
          ],
          spacing: { after: 100 },
        })
      );
    }

    // Create the document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720,
                right: 720,
                bottom: 720,
                left: 720,
              },
            },
          },
          children: docSections,
        },
      ],
    });

    // Generate buffer
    const buffer = await Packer.toBuffer(doc);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${personalInfo.fullName.replace(
          /\s+/g,
          "_"
        )}_Resume.docx"`,
      },
    });
  } catch (error) {
    console.error("DOCX generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate DOCX. Please try again." },
      { status: 500 }
    );
  }
}
