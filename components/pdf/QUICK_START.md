# Quick Start Guide - PDF Download Feature

## For Users

### How to Download Your Assessment Results as PDF

1. **Complete the Assessment**
   - Finish all sections of the Talent Assessment
   - Navigate to the result page

2. **Download PDF**
   - Look for the "Unduh PDF" button at the top of the results page
   - Click the button
   - Wait 1-2 seconds for PDF generation
   - PDF will automatically download to your Downloads folder

3. **File Location**
   - Check your browser's Downloads folder
   - Filename format: `Profil_Talenta_[YourName]_[Timestamp].pdf`
   - Example: `Profil_Talenta_John_Doe_1704067200000.pdf`

### Troubleshooting for Users

**PDF not downloading?**
- Disable browser popup blocker
- Check if browser allows downloads
- Try a different browser (Chrome, Firefox, Edge)

**PDF appears blank?**
- Wait for the page to fully load before clicking download
- Refresh the page and try again
- Clear browser cache and reload

---

## For Developers

### Quick Implementation Overview

**What was done:**
- Installed `@react-pdf/renderer` library
- Created `TalentAssessmentPDF.tsx` component
- Modified `handlePrint` function in result page
- Removed backend dependency for PDF generation

### Key Files

```
components/pdf/
├── TalentAssessmentPDF.tsx  # Main PDF component
├── README.md                 # Full documentation
└── QUICK_START.md           # This file

app/assessment/talenta-mahasiswa/result/page.tsx  # Modified
```

### Installation

Already installed via:
```bash
pnpm add @react-pdf/renderer
```

### Usage in Code

```typescript
import { pdf } from "@react-pdf/renderer";
import TalentAssessmentPDF from "@/components/pdf/TalentAssessmentPDF";

// Generate and download PDF
const pdfDocument = <TalentAssessmentPDF result={assessmentResult} />;
const blob = await pdf(pdfDocument).toBlob();

// Trigger download
const url = URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.download = "filename.pdf";
link.click();
URL.revokeObjectURL(url);
```

### Testing Locally

```bash
# Start development server
pnpm dev

# Navigate to result page (after completing assessment)
http://localhost:3001/assessment/talenta-mahasiswa/result

# Click "Unduh PDF" button
```

### Build for Production

```bash
# Clean build
rm -rf .next

# Build
pnpm build

# Start production server
pnpm start
```

### Customization

**Change PDF styling:**
Edit `components/pdf/TalentAssessmentPDF.tsx` → `styles` object

**Add new sections:**
Add new `<View>` components in the PDF pages

**Modify colors:**
Update color codes in style definitions (e.g., `#1e40af` for blue)

**Change page layout:**
Modify `<Page>` components or add new pages

### Performance Tips

- PDF generation is async, always use `await`
- Clean up URLs with `URL.revokeObjectURL()`
- Show loading state while generating
- Consider caching generated PDFs if data doesn't change

### Common Issues

**Build error:**
```bash
# Clean and rebuild
rm -rf .next node_modules/.cache
pnpm install
pnpm build
```

**Type errors:**
- Ensure `@react-pdf/renderer` is properly installed
- Don't install `@types/react-pdf` (deprecated)

**Large bundle size:**
- This is expected (adds ~500KB)
- `@react-pdf/renderer` includes PDF generation engine
- Consider code splitting if needed

### API Reference

**Component Props:**
```typescript
interface AssessmentResult {
  nama?: string;
  npm?: string;
  email?: string;
  mbtiType: string;
  kesesuaian: string;
  thinkingStyle: string;
  communicationStyle: string;
  workingStyle: string;
  behaviorDimensions: Record<string, { percentage: number; level: string }>;
  karirDominanMBTI: string;
  karirSekunderMBTI: string;
  karirMinat: string;
  // ... additional description fields
  pwbDetails?: Array<{
    key: string;
    level: string;
    info: string;
    levelDesc: string;
    devDesc?: string;
  }>;
}
```

### Next Steps

1. Test PDF generation with various data scenarios
2. Add error boundaries for robustness
3. Consider adding print preview
4. Implement analytics tracking for downloads
5. Add email delivery option (future enhancement)

---

## Support

For issues or questions:
- Check `components/pdf/README.md` for detailed documentation
- Review `PDF_IMPLEMENTATION.md` for technical details
- Check browser console for error messages
- Verify network tab for font loading issues

## Version

- Implementation Date: 2025
- Library: @react-pdf/renderer v4.3.1
- Next.js: v15.5.6
- React: v19.1.1