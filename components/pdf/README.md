# PDF Generation Component

This directory contains the PDF generation implementation using `@react-pdf/renderer` for the Talent Assessment results.

## Overview

The PDF generation system creates a professional, multi-page PDF document containing the complete talent assessment results for students.

## Components

### `TalentAssessmentPDF.tsx`

Main PDF document component that renders the assessment results into a downloadable PDF file.

**Features:**
- Multi-page layout (4 pages)
- Custom styling with Inter font family
- Structured sections for all assessment data
- Progress bars for psychological skills
- Color-coded levels and categories

**Pages Structure:**

1. **Page 1: Overview & Identity**
   - Student identity information (name, NPM, email)
   - Welcome message
   - MBTI type and career fields overview
   - Thinking, communication, and working styles
   - Psychological skills overview with progress bars

2. **Page 2: Career Talent**
   - Ideal career field description
   - Secondary career field description
   - Talent & interest compatibility analysis
   - Thinking style details
   - Communication style details

3. **Page 3: Working Style & Skills Details**
   - Working style description
   - Detailed psychological skills breakdown
   - Individual dimension descriptions and levels

4. **Page 4: Development Suggestions**
   - Learning strategy recommendations
   - Psychological skills improvement suggestions
   - Footer with disclaimer and university branding

## Usage

The PDF component is integrated into the result page at:
`app/assessment/talenta-mahasiswa/result/page.tsx`

### Implementation Example:

```typescript
import { pdf } from "@react-pdf/renderer";
import TalentAssessmentPDF from "@/components/pdf/TalentAssessmentPDF";

// Generate PDF
const pdfDocument = <TalentAssessmentPDF result={assessmentResult} />;
const blob = await pdf(pdfDocument).toBlob();

// Download PDF
const url = URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.download = "Profil_Talenta.pdf";
link.click();
```

## Props

### `TalentAssessmentPDF` Component Props

```typescript
interface AssessmentResult {
  nama?: string;                    // Student name
  npm?: string;                     // Student ID
  email?: string;                   // Student email
  mbtiType: string;                 // MBTI personality type
  kesesuaian: string;               // Compatibility status
  thinkingStyle: string;            // Thinking style
  communicationStyle: string;       // Communication style
  workingStyle: string;             // Working style
  behaviorDimensions: Record<       // Psychological dimensions
    string, 
    { percentage: number; level: string }
  >;
  karirDominanMBTI: string;         // Dominant career field
  karirSekunderMBTI: string;        // Secondary career field
  karirMinat: string;               // Interest career field
  dominantCareerDesc?: string;      // Dominant career description
  secondaryCareerDesc?: string;     // Secondary career description
  kesesuaianDesc?: string;          // Compatibility description
  thinkingStyleDesc?: string;       // Thinking style description
  communicationStyleDesc?: string;  // Communication style description
  workingStyleDesc?: string;        // Working style description
  learningStrategyDesc?: string;    // Learning strategy description
  pwbDetails?: Array<{              // PWB dimension details
    key: string;
    level: string;
    info: string;
    levelDesc: string;
    devDesc?: string;
  }>;
}
```

## Styling

The PDF uses a custom stylesheet with:
- **Font:** Inter (400, 600, 700 weights) from Google Fonts
- **Colors:** Tailwind-inspired color palette
- **Layout:** Responsive boxes, cards, and sections
- **Typography:** Hierarchical font sizes for readability

### Key Style Classes:
- `section`: Main content sections with background
- `card`: Card-style containers
- `progressBar`: Visual progress indicators
- `statsGrid`: Grid layout for statistics
- `styleBox`: Individual style indicators

## Dependencies

- `@react-pdf/renderer`: ^4.3.1 - Core PDF generation library
- `react`: ^19.1.1

## Color Coding

- **Success (Green):** High levels, very suitable
- **Warning (Orange):** Medium levels, moderately suitable  
- **Danger (Red):** Low levels, not suitable
- **Primary (Blue):** Main branding and highlights

## Performance

- PDF generation is done client-side
- Typical generation time: 1-2 seconds
- File size: ~50-100KB depending on content

## Future Improvements

- [ ] Add charts and visualizations
- [ ] Include university logo/branding
- [ ] Multi-language support
- [ ] Custom theming options
- [ ] Email delivery integration