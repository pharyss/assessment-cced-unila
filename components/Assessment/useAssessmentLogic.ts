"use client";

import { useMemo } from "react";
import careerPathData from "@/data/CareerPath.json";
import behaviorPatternData from "@/data/BehaviorPattern.json";

// =============================
// KONFIGURASI DASAR DATA
// =============================

// Mapping MBTI → Bidang Karir Dominan & Sekunder
const MBTI_MAPPING = {
  ISTJ: { dominan: "Praktisi", sekunder: "Akademisi" },
  ISFJ: { dominan: "Praktisi", sekunder: "Kreatif" },
  INFJ: { dominan: "Akademisi", sekunder: "Kreatif" },
  INTJ: { dominan: "Akademisi", sekunder: "Wirausaha" },
  ISTP: { dominan: "Praktisi", sekunder: "Wirausaha" },
  ISFP: { dominan: "Kreatif", sekunder: "Praktisi" },
  INFP: { dominan: "Kreatif", sekunder: "Akademisi" },
  INTP: { dominan: "Akademisi", sekunder: "Kreatif" },
  ESTP: { dominan: "Wirausaha", sekunder: "Praktisi" },
  ESFP: { dominan: "Kreatif", sekunder: "Wirausaha" },
  ENFP: { dominan: "Kreatif", sekunder: "Wirausaha" },
  ENTP: { dominan: "Wirausaha", sekunder: "Kreatif" },
  ESTJ: { dominan: "Praktisi", sekunder: "Wirausaha" },
  ESFJ: { dominan: "Praktisi", sekunder: "Kreatif" },
  ENFJ: { dominan: "Wirausaha", sekunder: "Akademisi" },
  ENTJ: { dominan: "Wirausaha", sekunder: "Akademisi" },
};

// Thinking, Communication, Working Style
const THINKING_STYLE = {
  ISTJ: "Analytical",
  ISFJ: "Practical",
  INFJ: "Creative",
  INTJ: "Analytical",
  ISTP: "Practical",
  ISFP: "Empathetic",
  INFP: "Creative",
  INTP: "Analytical",
  ESTP: "Empathetic",
  ESFP: "Empathetic",
  ENFP: "Creative",
  ENTP: "Creative",
  ESTJ: "Practical",
  ESFJ: "Practical",
  ENFJ: "Empathetic",
  ENTJ: "Analytical",
};

const COMMUNICATION_STYLE = {
  ISTJ: "Direct",
  ISFJ: "Harmonious",
  INFJ: "Innovative",
  INTJ: "Direct",
  ISTP: "Pragmatic",
  ISFP: "Pragmatic",
  INFP: "Harmonious",
  INTP: "Harmonious",
  ESTP: "Pragmatic",
  ESFP: "Pragmatic",
  ENFP: "Innovative",
  ENTP: "Innovative",
  ESTJ: "Direct",
  ESFJ: "Harmonious",
  ENFJ: "Harmonious",
  ENTJ: "Direct",
};

const WORKING_STYLE = {
  ISTJ: "StructuredSolo",
  ISFJ: "StructuredTeam",
  INFJ: "StructuredSolo",
  INTJ: "StructuredSolo",
  ISTP: "StructuredSolo",
  ISFP: "FlexibleSolo",
  INFP: "FlexibleSolo",
  INTP: "FlexibleSolo",
  ESTP: "FlexibleTeam",
  ESFP: "FlexibleTeam",
  ENFP: "FlexibleTeam",
  ENTP: "FlexibleTeam",
  ESTJ: "StructuredTeam",
  ESFJ: "StructuredTeam",
  ENFJ: "StructuredTeam",
  ENTJ: "StructuredTeam",
};

// =============================
// B. CUSTOM HOOK UTAMA
// =============================

export function useAssessmentLogic(answers: Record<string, any>) {
  // -----------------------------
  // SUBPART A: MINAT KARIR
  // -----------------------------
  const calculateCareerField = useMemo(() => {
    const score = { Praktisi: 0, Akademisi: 0, Kreatif: 0, Wirausaha: 0 };

    for (let i = 1; i <= 12; i++) {
      const key = `A-${i}`;
      const value = answers[key];
      if (!value) continue;

      const question = careerPathData.part1.subPartA.questions.find(
        (q) => q.id === i,
      );
      const option = question?.options.find((opt) => opt.label === value);
      if (option?.category) score[option.category] += 1;
    }

    return Object.keys(score).reduce((a, b) => (score[a] > score[b] ? a : b));
  }, [answers]);

  // -----------------------------
  // SUBPART B: MBTI
  // -----------------------------
  const calculateMBTI = useMemo(() => {
    const dim = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    for (let i = 1; i <= 28; i++) {
      const key = `B-${i}`;
      const value = answers[key];
      if (!value) continue;

      const question = careerPathData.part1.subPartB.questions.find(
        (q) => q.id === i,
      );
      const option = question?.options.find((opt) => opt.label === value);
      if (option?.dimension) dim[option.dimension] += 1;
    }

    const EI = dim.E >= dim.I ? "E" : "I";
    const SN = dim.S >= dim.N ? "S" : "N";
    const TF = dim.T >= dim.F ? "T" : "F";
    const JP = dim.J >= dim.P ? "J" : "P";

    return EI + SN + TF + JP;
  }, [answers]);

  // -----------------------------
  // KORELASI BIDANG & MBTI
  // -----------------------------
  const analyzeCareerCompatibility = useMemo(() => {
    const map = MBTI_MAPPING[calculateMBTI];
    if (!map) return "Tidak Diketahui";

    if (calculateCareerField === map.dominan) return "Sangat Sesuai";
    if (calculateCareerField === map.sekunder) return "Cukup Sesuai";
    return "Tidak Sesuai";
  }, [calculateCareerField, calculateMBTI]);

  // -----------------------------
// PART 2: POLA PERILAKU
// -----------------------------
const calculateBehaviorScores = useMemo(() => {
  const result: Record<string, { percentage: number; level: string }> = {};
  const dimensions = Object.entries(behaviorPatternData.part2.dimensions);

  dimensions.forEach(([dimKey, dimValue], dimIndex) => {
    const baseId = 40 + dimIndex * 6;
    const scores: number[] = [];

    dimValue.questions.forEach((q, idx) => {
      const id = baseId + idx;
      const value = answers[id];
      if (value === undefined) return;

      const adjusted = q.type === "unfavorable" ? 6 - value : value;
      scores.push(adjusted);
    });

    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      const percentage = ((avg - 1) / 4) * 100;

      let level = "Sedang";
      if (percentage < 40) level = "Rendah";
      else if (percentage > 70) level = "Tinggi";

      result[dimKey] = {
        percentage: Math.round(percentage),
        level,
      };
    }
  });

  return result;
}, [answers]);


  // -----------------------------
  // HASIL AKHIR
  // -----------------------------
  const getFinalResult = useMemo(() => {
    const mbti = calculateMBTI;
    const kesesuaian = analyzeCareerCompatibility;
    const behavior = calculateBehaviorScores;

    const mbtiMap = MBTI_MAPPING[mbti] || { dominan: "N/A", sekunder: "N/A" };

    return {
      mbtiType: mbti,
      kesesuaian,
      thinkingStyle: THINKING_STYLE[mbti],
      communicationStyle: COMMUNICATION_STYLE[mbti],
      workingStyle: WORKING_STYLE[mbti],
      behaviorDimensions: behavior,
      karirDominanMBTI: mbtiMap.dominan,
      karirSekunderMBTI: mbtiMap.sekunder,
      karirMinat: calculateCareerField,
    };
  }, [
    calculateCareerField,
    calculateMBTI,
    analyzeCareerCompatibility,
    calculateBehaviorScores,
  ]);

  return { getFinalResult };
}
