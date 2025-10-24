// @/utils/calculateResults.ts
import questionsPart1 from "@/data/CareerPath.json";
import questionsPart2 from "@/data/BehaviorPattern.json";

interface Answers {
  [key: string]: string | number;
}

interface Result {
  career: {
    topCategory: keyof typeof CAREER_CATEGORIES;
    categoryScores: Record<keyof typeof CAREER_CATEGORIES, number>;
    mbtiType: string;
    mbtiScores: Record<
      keyof typeof MBTI_DIMENSIONS,
      { dominant: "A" | "B"; score: number }
    >;
    idealCareer: string;
    description: string;
  };
  behavior: {
    dimensions: Array<{
      name: string;
      avgScore: number;
      interpretation: string;
      recommendation: string;
    }>;
    overallWellbeing: string;
  };
  summary: string;
  recommendations: string[];
}

/* ===================== KONSTANTA ===================== */
export const CAREER_CATEGORIES = {
  Praktisi: {
    name: "Praktisi (Praktis & Terstruktur)",
    description:
      "Cocok untuk yang suka bekerja secara langsung dan melihat hasil nyata, seperti teknik, agribisnis, atau kesehatan.",
    majors: ["Teknik Sipil", "Pertanian", "Kedokteran", "Teknik Mesin"],
  },
  Akademisi: {
    name: "Akademisi (Peneliti & Analitis)",
    description:
      "Cocok untuk yang menyukai penelitian dan analisis dalam bidang sains, hukum, ekonomi, atau IT.",
    majors: ["Ilmu Komputer", "Hukum", "Ekonomi", "Biologi"],
  },
  Kreatif: {
    name: "Kreatif (Inovatif & Artistik)",
    description:
      "Cocok untuk yang ekspresif dan imajinatif, seperti desain, media, sastra, atau arsitektur.",
    majors: [
      "Desain Komunikasi Visual",
      "Arsitektur",
      "Sastra Inggris",
      "Film & Televisi",
    ],
  },
  Wirausaha: {
    name: "Wirausaha (Pemimpin & Strategis)",
    description:
      "Cocok untuk yang suka berinovasi, memimpin, dan berorientasi pada pencapaian dalam bisnis dan manajemen.",
    majors: ["Manajemen", "Akuntansi", "Hubungan Internasional", "Pemasaran"],
  },
} as const;

export const MBTI_DIMENSIONS = {
  EI: {
    name: "Extraversion (E) vs Introversion (I)",
    description: "E: Energik sosial; I: Reflektif mandiri.",
  },
  SN: {
    name: "Sensing (S) vs Intuition (N)",
    description: "S: Fokus fakta praktis; N: Fokus ide besar.",
  },
  TF: {
    name: "Thinking (T) vs Feeling (F)",
    description: "T: Logis & objektif; F: Empati & harmonis.",
  },
  JP: {
    name: "Judging (J) vs Perceiving (P)",
    description: "J: Terstruktur & terencana; P: Fleksibel & adaptif.",
  },
} as const;

export const WELLBEING_THRESHOLDS = { low: 2.5, medium: 3.5 };
export const WELLBEING_INTERPRETATIONS = {
  low: "Rendah – Area ini perlu perhatian dan pengembangan.",
  medium: "Sedang – Sudah baik, namun masih bisa ditingkatkan.",
  high: "Tinggi – Ini kekuatan utama Anda, terus pertahankan.",
};

/* ===================== HELPER FUNCTION ===================== */
const getMBTIType = (
  scores: Record<
    keyof typeof MBTI_DIMENSIONS,
    { dominant: "A" | "B"; score: number }
  >,
) =>
  Object.entries(scores)
    .map(([dim, { dominant }]) =>
      dominant === "A" ? dim.charAt(0) : dim.charAt(1),
    )
    .join("");

/* ===================== FUNGSI UTAMA ===================== */
export function calculateResults(answers: Answers): Result {
  /* ---------- PART 1A: Career Interest ---------- */
  const categoryScores = Object.keys(CAREER_CATEGORIES).reduce(
    (acc, key) => ({ ...acc, [key]: 0 }),
    {},
  ) as Record<keyof typeof CAREER_CATEGORIES, number>;

  questionsPart1.part1.subPartA.questions.forEach((q) => {
    const ans = answers[q.id.toString()];
    const opt = q.options.find((o: any) => o.label === ans);
    if (opt?.category)
      categoryScores[opt.category as keyof typeof CAREER_CATEGORIES]++;
  });

  const topCategory = Object.entries(categoryScores).reduce((a, b) =>
    b[1] > a[1] ? b : a,
  )[0] as keyof typeof CAREER_CATEGORIES;

  /* ---------- PART 1B: MBTI ---------- */
  const mbtiScores: Record<
    keyof typeof MBTI_DIMENSIONS,
    { dominant: "A" | "B"; score: number }
  > = {
    EI: { dominant: "B", score: 0 },
    SN: { dominant: "B", score: 0 },
    TF: { dominant: "B", score: 0 },
    JP: { dominant: "B", score: 0 },
  };

  const groups = [
    questionsPart1.part1.subPartB.questions.slice(0, 7),
    questionsPart1.part1.subPartB.questions.slice(7, 14),
    questionsPart1.part1.subPartB.questions.slice(14, 21),
    questionsPart1.part1.subPartB.questions.slice(21, 28),
  ];

  (["EI", "SN", "TF", "JP"] as const).forEach((key, i) => {
    const aCount = groups[i].filter(
      (q) => answers[q.id.toString()] === "A",
    ).length;
    mbtiScores[key] = { dominant: aCount >= 4 ? "A" : "B", score: aCount };
  });

  const mbtiType = getMBTIType(mbtiScores);
  const idealCareer = `${topCategory} - ${mbtiType}: ${CAREER_CATEGORIES[topCategory].majors[0]} atau bidang serupa.`;
  const careerDescription = `
    Minat Dominan: ${CAREER_CATEGORIES[topCategory].name} (Skor ${categoryScores[topCategory]}).
    Tipe Kepribadian: ${mbtiType}.
    ${CAREER_CATEGORIES[topCategory].description}
  `.trim();

  /* ---------- PART 2: Well-being ---------- */
  const behaviorDimensions: Result["behavior"]["dimensions"] = [];
  const highDims: string[] = [],
    lowDims: string[] = [];

  Object.values(questionsPart2.part2.dimensions).forEach((dim: any) => {
    const scores = dim.questions.map((q: any) => {
      const score = Number(answers[q.id.toString()] ?? 0);
      return q.type === "unfavorable" ? 6 - score : score;
    });

    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const interpretation =
      avg <= WELLBEING_THRESHOLDS.low
        ? WELLBEING_INTERPRETATIONS.low
        : avg <= WELLBEING_THRESHOLDS.medium
        ? WELLBEING_INTERPRETATIONS.medium
        : WELLBEING_INTERPRETATIONS.high;

    if (avg > WELLBEING_THRESHOLDS.medium) highDims.push(dim.title);
    if (avg <= WELLBEING_THRESHOLDS.low) lowDims.push(dim.title);

    behaviorDimensions.push({
      name: dim.title,
      avgScore: Math.round(avg * 10) / 10,
      interpretation,
      recommendation: `Untuk sukses di bidang ${
        CAREER_CATEGORIES[topCategory].name
      }, tingkatkan aspek ${dim.title.toLowerCase()}.`,
    });
  });

  const overallWellbeing =
    highDims.length > lowDims.length
      ? `Tinggi pada ${highDims.join(", ")}`
      : lowDims.length
      ? `Rendah pada ${lowDims.join(", ")}`
      : "Seimbang secara keseluruhan";

  /* ---------- RINGKASAN & REKOMENDASI ---------- */
  const summary = `Bidang karir ideal Anda: ${idealCareer}. Pola perilaku: ${overallWellbeing}. Gunakan ini sebagai acuan pengembangan diri di Unila.`;

  const recommendations = [
    `Pilih jurusan sesuai minat dominan: ${CAREER_CATEGORIES[
      topCategory
    ].majors.join(" atau ")}.`,
    `Kembangkan potensi MBTI ${mbtiType} dengan aktivitas kampus yang sesuai.`,
    `Fokus pada aspek ${
      lowDims[0] || "tertentu"
    } untuk peningkatan kesejahteraan.`,
    `Evaluasi ulang hasil asesmen ini secara berkala.`,
  ];

  return {
    career: {
      topCategory,
      categoryScores,
      mbtiType,
      mbtiScores,
      idealCareer,
      description: careerDescription,
    },
    behavior: { dimensions: behaviorDimensions, overallWellbeing },
    summary,
    recommendations,
  };
}
