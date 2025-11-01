"use client";

import { useState } from "react";

// =============================
// 🧩 A. KONFIGURASI DASAR DATA
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
  ISTJ: "Structured Solo",
  ISFJ: "Structured Team",
  INFJ: "Structured Solo",
  INTJ: "Structured Solo",
  ISTP: "Structured Solo",
  ISFP: "Flexible Solo",
  INFP: "Flexible Solo",
  INTP: "Flexible Solo",
  ESTP: "Flexible Team",
  ESFP: "Flexible Team",
  ENFP: "Flexible Team",
  ENTP: "Flexible Team",
  ESTJ: "Structured Team",
  ESFJ: "Structured Team",
  ENFJ: "Structured Team",
  ENTJ: "Structured Team",
};

// =============================
// ⚙️ B. CUSTOM HOOK UTAMA
// =============================

export function useAssessmentLogic() {
  const [careerAnswers, setCareerAnswers] = useState([]); // subPartA
  const [mbtiAnswers, setMbtiAnswers] = useState([]); // subPartB
  const [behaviorAnswers, setBehaviorAnswers] = useState([]); // part2

  // -----------------------------
  // SUBPART A: MINAT KARIR
  // -----------------------------
  function calculateCareerField() {
    const score = { Praktisi: 0, Akademisi: 0, Kreatif: 0, Wirausaha: 0 };
    careerAnswers.forEach((ans) => {
      if (ans.id >= 1 && ans.id <= 11 && ans.category) {
        score[ans.category] += 1;
      }
    });

    const bidang = Object.keys(score).reduce((a, b) =>
      score[a] > score[b] ? a : b,
    );

    return bidang;
  }

  // -----------------------------
  // SUBPART B: MBTI
  // -----------------------------
  function calculateMBTI() {
    const dim = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    mbtiAnswers.forEach((ans, idx) => {
      const id = idx + 1;
      if (id >= 1 && id <= 7) dim[ans.dimension] += 1;
      if (id >= 8 && id <= 14) dim[ans.dimension] += 1;
      if (id >= 15 && id <= 21) dim[ans.dimension] += 1;
      if (id >= 22 && id <= 28) dim[ans.dimension] += 1;
    });

    const EI = dim.E >= dim.I ? "E" : "I";
    const SN = dim.S >= dim.N ? "S" : "N";
    const TF = dim.T >= dim.F ? "T" : "F";
    const JP = dim.J >= dim.P ? "J" : "P";

    return EI + SN + TF + JP;
  }

  // -----------------------------
  // KORELASI BIDANG & MBTI
  // -----------------------------
  function analyzeCareerCompatibility(careerField, mbtiType) {
    const map = MBTI_MAPPING[mbtiType];
    if (!map) return "Tidak Diketahui";

    if (careerField === map.dominan) return "Sangat Sesuai";
    if (careerField === map.sekunder) return "Cukup Sesuai";
    return "Kurang Sesuai";
  }

  // -----------------------------
  // PART 2: POLA PERILAKU
  // -----------------------------
  function calculateBehaviorScores() {
    const result = {};
    const grouped = {};

    // kelompokkan per dimensi
    behaviorAnswers.forEach((ans) => {
      if (!grouped[ans.dimension]) grouped[ans.dimension] = [];
      grouped[ans.dimension].push(ans);
    });

    for (const dim in grouped) {
      const adjusted = grouped[dim].map((q) =>
        q.type === "unfavorable" ? 6 - q.value : q.value,
      );
      const avg = adjusted.reduce((a, b) => a + b, 0) / adjusted.length;

      let level = "Sedang";
      if (avg < 2.4) level = "Rendah";
      else if (avg > 3.6) level = "Tinggi";

      result[dim] = level;
    }

    return result;
  }

  // -----------------------------
  // HASIL AKHIR
  // -----------------------------
  function getFinalResult() {
    const bidang = calculateCareerField();
    const chosen12 =
      careerAnswers.find((item) => item.id === 12)?.category || null;

    const kesesuaianKarir = chosen12
      ? chosen12 === bidang
        ? "Sesuai"
        : "Tidak Sesuai"
      : "Belum Memilih";

    const mbti = calculateMBTI();
    const kesesuaian = analyzeCareerCompatibility(bidang, mbti);
    const behavior = calculateBehaviorScores();

    return {
      bidangKarir: bidang,
      mbtiType: mbti,
      kesesuaian,
      kesesuaianKarir,
      thinkingStyle: THINKING_STYLE[mbti],
      communicationStyle: COMMUNICATION_STYLE[mbti],
      workingStyle: WORKING_STYLE[mbti],
      behaviorDimensions: behavior,
    };
  }

  return {
    // states
    careerAnswers,
    mbtiAnswers,
    behaviorAnswers,
    // setters
    setCareerAnswers,
    setMbtiAnswers,
    setBehaviorAnswers,
    // functions
    calculateCareerField,
    calculateMBTI,
    analyzeCareerCompatibility,
    calculateBehaviorScores,
    getFinalResult,
  };
}
