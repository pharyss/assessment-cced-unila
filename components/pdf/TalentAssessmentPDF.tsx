import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Svg,
  Path,
} from "@react-pdf/renderer";
import { Brain } from "lucide-react";

// Register Poppins font using Google Fonts CDN with TTF format
Font.register({
  family: "Poppins",
  fonts: [
    {
      src: "https://raw.githubusercontent.com/pharyss/assessment-cced-unila/refs/heads/dev/public/font/Poppins-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "https://raw.githubusercontent.com/pharyss/assessment-cced-unila/refs/heads/dev/public/font/Poppins-SemiBold.ttf",
      fontWeight: 600,
    },
    {
      src: "https://raw.githubusercontent.com/pharyss/assessment-cced-unila/refs/heads/dev/public/font/Poppins-Bold.ttf",
      fontWeight: 700,
    },
  ],
});

// Create styles matching the web page design
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Poppins",
    fontSize: 10,
    backgroundColor: "#FFFFFF",
  },

  // Header section
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: "2px solid #085EA8",
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#085EA8",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 9,
    color: "#788293",
    textAlign: "center",
  },

  // Section containers matching web design
  section: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
    border: "1px solid #E3E8EF",
    borderRadius: 8,
  },
  sectionWithBg: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#F0F2F9",
    borderRadius: 8,
  },
  identitySection: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
    border: "1px solid #E3E8EF",
    borderRadius: 8,
  },

  // Typography
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#1D2430",
    marginBottom: 8,
  },
  sectionTitleWithIcon: {
    fontSize: 13,
    fontWeight: 700,
    color: "#1D2430",
    marginBottom: 8,
    paddingLeft: 3,
  },
  sectionSubtitle: {
    fontSize: 8,
    color: "#788293",
    marginBottom: 3,
    fontWeight: 400,
  },
  text: {
    fontSize: 9,
    color: "#1D2430",
    lineHeight: 1.6,
    marginBottom: 3,
  },
  textSmall: {
    fontSize: 8,
    color: "#788293",
    lineHeight: 1.5,
  },
  boldText: {
    fontWeight: 700,
    color: "#121723",
  },
  emphasizedText: {
    fontSize: 9,
    color: "#1D2430",
    lineHeight: 1.7,
  },

  // Stats grid (3 columns)
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },
  statBox: {
    flex: 1,
    padding: 12,
    backgroundColor: "#FFFFFF",
    border: "1px solid #E3E8EF",
    borderRadius: 8,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 8,
    color: "#788293",
    marginBottom: 4,
    textAlign: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: 700,
    color: "#085EA8",
    textAlign: "center",
  },

  // Styles grid (thinking, communication, working)
  stylesContainer: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  styleBox: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F0F2F9",
    borderRadius: 8,
    alignItems: "center",
  },
  styleLabel: {
    fontSize: 8,
    color: "#788293",
    marginBottom: 3,
    textAlign: "center",
  },
  styleValueDanger: {
    fontSize: 11,
    fontWeight: 700,
    color: "#EF4444",
    textAlign: "center",
  },
  styleValueWarning: {
    fontSize: 11,
    fontWeight: 700,
    color: "#F59E0B",
    textAlign: "center",
  },
  styleValueSuccess: {
    fontSize: 11,
    fontWeight: 700,
    color: "#108981",
    textAlign: "center",
  },

  // Progress bars for PWB
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  progressBarLabel: {
    fontSize: 9,
    color: "#1D2430",
  },
  progressBarValue: {
    fontSize: 9,
    fontWeight: 700,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: "#E3E8EF",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  levelHigh: {
    color: "#108981",
  },
  levelMedium: {
    color: "#F59E0B",
  },
  levelLow: {
    color: "#EF4444",
  },

  // Career sections
  careerTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#085EA8",
    marginBottom: 6,
  },
  careerTitleSecondary: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0B5EA8",
    marginBottom: 6,
    marginTop: 10,
  },

  // Compatibility grid
  compatibilityGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginVertical: 8,
    padding: 10,
    backgroundColor: "#F0F2F9",
    borderRadius: 8,
  },
  compatibilityBox: {
    flex: 1,
    alignItems: "center",
  },
  compatibilityLabel: {
    fontSize: 8,
    color: "#788293",
    marginBottom: 3,
    textAlign: "center",
  },
  compatibilityValue: {
    fontSize: 11,
    fontWeight: 700,
    color: "#085EA8",
    textAlign: "center",
  },

  // PWB detailed items
  pwbDetailItem: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: "1px solid #E3E8EF",
  },
  pwbDetailTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#121723",
    marginBottom: 3,
  },
  pwbDetailInfo: {
    fontSize: 9,
    color: "#788293",
    marginBottom: 5,
    lineHeight: 1.5,
  },
  pwbLevelBox: {
    marginTop: 5,
    padding: 8,
    backgroundColor: "#F0F2F9",
    borderRadius: 6,
  },
  pwbLevelText: {
    fontSize: 9,
    color: "#788293",
    marginBottom: 2,
  },
  pwbLevelDesc: {
    fontSize: 9,
    color: "#1D2430",
    lineHeight: 1.5,
  },

  // Development suggestions
  devBox: {
    backgroundColor: "#F0F2F9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  devTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#121723",
    marginBottom: 3,
  },
  devText: {
    fontSize: 9,
    color: "#1D2430",
    lineHeight: 1.5,
  },

  // Footer
  footer: {
    marginTop: 20,
    paddingTop: 12,
    borderTop: "1px solid #E3E8EF",
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#788293",
    textAlign: "center",
    marginBottom: 3,
    lineHeight: 1.4,
  },
  footerBrand: {
    fontSize: 8,
    fontWeight: 700,
    color: "#085EA8",
    marginTop: 8,
  },

  // Page number
  pageNumber: {
    position: "absolute",
    fontSize: 8,
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#788293",
  },

  // Kesesuaian status colors
  kesesuaianSangatSesuai: {
    color: "#108981",
  },
  kesesuaianCukupSesuai: {
    color: "#F59E0B",
  },
  kesesuaianKurangSesuai: {
    color: "#EF4444",
  },

  // Welcome message
  welcomeBox: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
    border: "1px solid #E3E8EF",
    borderRadius: 8,
  },
});

const PWB_TITLES: Record<string, string> = {
  self_acceptance: "Penerimaan Diri",
  autonomy: "Kemandirian",
  purpose_in_life: "Tujuan Hidup",
  positive_relationships: "Hubungan Positif",
  environmental_mastery: "Pengelolaan Lingkungan",
  personal_growth: "Pertumbuhan Pribadi",
};

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
  dominantCareerDesc?: string;
  secondaryCareerDesc?: string;
  kesesuaianDesc?: string;
  thinkingStyleDesc?: string;
  communicationStyleDesc?: string;
  workingStyleDesc?: string;
  learningStrategyDesc?: string;
  pwbDetails?: Array<{
    key: string;
    level: string;
    info: string;
    levelDesc: string;
    devDesc?: string;
  }>;
}

interface TalentAssessmentPDFProps {
  result: AssessmentResult;
}

const TalentAssessmentPDF: React.FC<TalentAssessmentPDFProps> = ({
  result,
}) => {
  const {
    nama,
    npm,
    email,
    mbtiType,
    kesesuaian,
    thinkingStyle,
    communicationStyle,
    workingStyle,
    behaviorDimensions,
    karirDominanMBTI,
    karirSekunderMBTI,
    karirMinat,
    dominantCareerDesc,
    secondaryCareerDesc,
    kesesuaianDesc,
    thinkingStyleDesc,
    communicationStyleDesc,
    workingStyleDesc,
    learningStrategyDesc,
    pwbDetails,
  } = result;

  const pwbDimensions = Object.entries(behaviorDimensions);

  const getProgressBarColor = (level: string) => {
    if (level === "Tinggi") return "#108981";
    if (level === "Rendah") return "#EF4444";
    return "#F59E0B";
  };

  const getLevelStyle = (level: string) => {
    if (level === "Tinggi") return styles.levelHigh;
    if (level === "Rendah") return styles.levelLow;
    return styles.levelMedium;
  };

  const getKesesuaianStyle = (kesesuaian: string) => {
    if (kesesuaian === "Sangat Sesuai") return styles.kesesuaianSangatSesuai;
    if (kesesuaian === "Cukup Sesuai") return styles.kesesuaianCukupSesuai;
    return styles.kesesuaianKurangSesuai;
  };

  return (
    <Document>
      {/* Page 1: Overview & Identity */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.mainTitle}>Profil Talenta Mahasiswa</Text>
          <Text style={styles.subtitle}>
            Hasil Asesmen Talenta - Universitas Lampung
          </Text>
        </View>

        {/* Identity Section */}
        {(nama || npm || email) && (
          <View style={styles.identitySection}>
            <Text style={styles.sectionSubtitle}>Data Identitas</Text>
            <View style={{ marginTop: 5 }}>
              {nama && (
                <Text style={styles.text}>
                  <Text style={styles.boldText}>Nama : </Text>
                  {nama}
                </Text>
              )}
              {npm && (
                <Text style={styles.text}>
                  <Text style={styles.boldText}>NPM : </Text>
                  {npm}
                </Text>
              )}
              {email && (
                <Text style={styles.text}>
                  <Text style={styles.boldText}>Email : </Text>
                  {email}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Welcome Message */}
        {nama && (
          <View style={styles.welcomeBox}>
            <Text style={styles.emphasizedText}>
              Halo <Text style={styles.boldText}>{nama}</Text>! Terima kasih
              sudah mengisi instrumen ini dengan baik dan seksama. Jadi gini, di
              bawah ini merupakan penjelasan talenta yang kamu miliki
              berdasarkan asesmen talenta yang telah dikerjakan. Kami sudah
              rangkum menjadi satu rangkaian. Silakan kamu cermati, soalnya
              profil ini bisa digunakan sebagai sarana untuk pengembangan diri
              kamu. Baca pelan-pelan saja ya, semoga relate!
            </Text>
          </View>
        )}

        {/* Stats Grid - 3 columns */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Tipe Kepribadian</Text>
            <Text style={styles.statValue}>{mbtiType.toUpperCase()}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Bidang Karir Dominan</Text>
            <Text style={styles.statValue}>{karirDominanMBTI}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Bidang Karir Sekunder</Text>
            <Text style={styles.statValue}>{karirSekunderMBTI}</Text>
          </View>
        </View>

        {/* Styles Section */}
        <View style={styles.section}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              style={{ marginRight: 6 }}
            >
              <Path
                d="M12 18V5"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <Path
                d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <Path
                d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <Path
                d="M17.997 5.125a4 4 0 0 1 2.526 5.77"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <Path
                d="M18 18a4 4 0 0 0 2-7.464"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <Path
                d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <Path
                d="M6 18a4 4 0 0 1-2-7.464"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <Path
                d="M6.003 5.125a4 4 0 0 0-2.526 5.77"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
            <Text style={styles.sectionTitleWithIcon}>
              Gaya Berpikir, Komunikasi, dan Kerja
            </Text>
          </View>
          <View style={styles.stylesContainer}>
            <View style={styles.styleBox}>
              <Text style={styles.styleLabel}>Gaya Berpikir</Text>
              <Text style={styles.styleValueDanger}>{thinkingStyle}</Text>
            </View>
            <View style={styles.styleBox}>
              <Text style={styles.styleLabel}>Gaya Komunikasi</Text>
              <Text style={styles.styleValueWarning}>{communicationStyle}</Text>
            </View>
            <View style={styles.styleBox}>
              <Text style={styles.styleLabel}>Pola Kerja</Text>
              <Text style={styles.styleValueSuccess}>{workingStyle}</Text>
            </View>
          </View>
        </View>

        {/* PWB Overview with Progress Bars */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleWithIcon}>
            ✓ Overview Keterampilan Psikologis
          </Text>
          {pwbDimensions.map(([key, data]) => {
            const { percentage, level } = data;
            const barColor = getProgressBarColor(level);
            const levelStyle = getLevelStyle(level);

            return (
              <View key={key} style={styles.progressBarContainer}>
                <View style={styles.progressBarHeader}>
                  <Text style={styles.progressBarLabel}>
                    {PWB_TITLES[key] || key}
                  </Text>
                  <Text style={[styles.progressBarValue, levelStyle]}>
                    {level} ({percentage}%)
                  </Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${percentage}%`, backgroundColor: barColor },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Halaman ${pageNumber} dari ${totalPages}`
          }
          fixed
        />
      </Page>

      {/* Page 2: Career Talent */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitleWithIcon}>💼 Bakat Bidang Karir</Text>

          <Text style={styles.sectionSubtitle}>Bidang Karir Ideal</Text>
          <Text style={styles.careerTitle}>{karirDominanMBTI}</Text>
          <Text style={styles.emphasizedText}>{dominantCareerDesc}</Text>

          <Text style={[styles.sectionSubtitle, { marginTop: 12 }]}>
            Alternatif Bidang Karir Sekunder
          </Text>
          <Text style={styles.careerTitleSecondary}>{karirSekunderMBTI}</Text>
          <Text style={styles.emphasizedText}>{secondaryCareerDesc}</Text>
        </View>

        {/* Compatibility Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleWithIcon}>
            🎯 Kesesuaian Bakat & Minat
          </Text>
          <Text style={styles.text}>
            Status Kesesuaian:{" "}
            <Text style={[styles.boldText, getKesesuaianStyle(kesesuaian)]}>
              {kesesuaian}
            </Text>
          </Text>

          <View style={styles.compatibilityGrid}>
            <View style={styles.compatibilityBox}>
              <Text style={styles.compatibilityLabel}>Minat Kamu</Text>
              <Text style={styles.compatibilityValue}>{karirMinat}</Text>
            </View>
            <View style={styles.compatibilityBox}>
              <Text style={styles.compatibilityLabel}>Bakat Dominan</Text>
              <Text style={styles.compatibilityValue}>{karirDominanMBTI}</Text>
            </View>
            <View style={styles.compatibilityBox}>
              <Text style={styles.compatibilityLabel}>Bakat Sekunder</Text>
              <Text style={styles.compatibilityValue}>{karirSekunderMBTI}</Text>
            </View>
          </View>

          <Text style={styles.emphasizedText}>{kesesuaianDesc}</Text>
        </View>

        {/* Thinking Style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleWithIcon}>
            ⚡ Kecenderungan Gaya Berpikir
          </Text>
          <Text style={styles.careerTitle}>{thinkingStyle}</Text>
          <Text style={styles.emphasizedText}>{thinkingStyleDesc}</Text>
        </View>

        {/* Communication Style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleWithIcon}>
            💬 Kecenderungan Gaya Komunikasi
          </Text>
          <Text style={styles.careerTitle}>{communicationStyle}</Text>
          <Text style={styles.emphasizedText}>{communicationStyleDesc}</Text>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Halaman ${pageNumber} dari ${totalPages}`
          }
          fixed
        />
      </Page>

      {/* Page 3: Working Style & PWB Details */}
      <Page size="A4" style={styles.page}>
        {/* Working Style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleWithIcon}>
            💼 Kecenderungan Pola Kerja
          </Text>
          <Text style={[styles.careerTitle, { color: "#108981" }]}>
            {workingStyle}
          </Text>
          <Text style={styles.emphasizedText}>{workingStyleDesc}</Text>
        </View>

        {/* PWB Detailed Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleWithIcon}>
            ✓ Keterampilan Psikologis - Rincian
          </Text>
          {pwbDetails &&
            pwbDetails.map((detail, index) => (
              <View
                key={detail.key}
                style={
                  index === pwbDetails.length - 1
                    ? [styles.pwbDetailItem, { borderBottom: "none" }]
                    : styles.pwbDetailItem
                }
              >
                <Text style={styles.pwbDetailTitle}>
                  {PWB_TITLES[detail.key] || detail.key}
                </Text>
                <Text style={styles.pwbDetailInfo}>{detail.info}</Text>
                <View style={styles.pwbLevelBox}>
                  <Text style={styles.pwbLevelText}>
                    Tingkat Kamu:{" "}
                    <Text
                      style={[styles.boldText, getLevelStyle(detail.level)]}
                    >
                      {detail.level}
                    </Text>
                  </Text>
                  <Text style={styles.pwbLevelDesc}>{detail.levelDesc}</Text>
                </View>
              </View>
            ))}
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Halaman ${pageNumber} dari ${totalPages}`
          }
          fixed
        />
      </Page>

      {/* Page 4: Development Suggestions */}
      <Page size="A4" style={styles.page}>
        <View style={{ marginBottom: 15 }}>
          <Text
            style={[styles.sectionTitle, { textAlign: "center", fontSize: 16 }]}
          >
            Saran Pengembangan Talenta
          </Text>
        </View>

        {/* Learning Strategy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleWithIcon}>📚 Strategi Belajar</Text>
          <Text style={styles.emphasizedText}>{learningStrategyDesc}</Text>
        </View>

        {/* PWB Development Suggestions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleWithIcon}>
            📈 Peningkatan Keterampilan Psikologis
          </Text>
          <Text style={[styles.textSmall, { marginBottom: 8 }]}>
            Berikut beberapa saran pengembangan yang dapat kamu lakukan untuk
            meningkatkan keterampilan psikologis mu.
          </Text>

          {pwbDetails &&
            pwbDetails
              .filter((detail) => detail.level !== "Tinggi" && detail.devDesc)
              .slice(0, 3)
              .map((detail) => (
                <View key={detail.key} style={styles.devBox}>
                  <Text style={styles.devTitle}>
                    {PWB_TITLES[detail.key] || detail.key}
                  </Text>
                  <Text style={styles.devText}>{detail.devDesc}</Text>
                </View>
              ))}

          {pwbDetails &&
            pwbDetails.every((detail) => detail.level === "Tinggi") && (
              <View style={[styles.devBox, { backgroundColor: "#E6F2FA" }]}>
                <Text style={[styles.devText, { color: "#108981" }]}>
                  ✓ Selamat! Semua keterampilan psikologismu berada di level
                  tinggi. Terus pertahankan!
                </Text>
              </View>
            )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Hasil ini memberikan gambaran umum mengenai kecenderungan karir dan
            kepribadian kamu.
          </Text>
          <Text style={styles.footerText}>
            Gunakan hasil ini sebagai bahan refleksi diri dan pengembangan karir
            ke depan.
          </Text>
          <Text style={styles.footerBrand}>
            © {new Date().getFullYear()} Universitas Lampung
          </Text>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Halaman ${pageNumber} dari ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export default TalentAssessmentPDF;
