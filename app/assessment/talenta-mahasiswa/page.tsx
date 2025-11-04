"use client";

import { useTest } from "@/lib/hooks/useTests";
import AssessmentIntro from "@/components/Assessment/AssessmentIntro";
import { Metadata } from "next";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

// Note: Metadata export removed as it can't be used in client components
// Move metadata to a separate layout.tsx or use generateMetadata in server component

export default function AssessmentPage() {
  // Fetch test data with ID = 1
  const { data, isLoading, isError, error } = useTest(1);

  console.log(data);

  return (
    <>
      <AssessmentIntro />

      {/* Test Data Section */}
      <section className="pb-20 pt-10 sm:pb-24 sm:pt-14 md:pb-[120px] md:pt-[80px]">
        <div className="container mx-auto px-8 md:px-16 lg:px-32">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900 md:p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              Data Tes dari API
            </h2>

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-myunila" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Memuat data tes...
                </p>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
                <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400" />
                <p className="mt-4 text-center font-semibold text-red-700 dark:text-red-400">
                  Gagal memuat data tes
                </p>
                <p className="mt-2 text-center text-sm text-red-600 dark:text-red-400">
                  {error?.message || "Terjadi kesalahan"}
                </p>
              </div>
            )}

            {/* Success State - Display Test Data */}
            {data?.data && (
              <div className="space-y-6">
                {/* Test Info */}
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-600 dark:text-green-400" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-800 dark:text-green-300">
                        Data berhasil dimuat dari API!
                      </p>
                      <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                        Endpoint: GET /tests/{data.data.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Test Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Nama Tes
                    </h3>
                    <p className="mt-1 text-gray-700 dark:text-gray-300">
                      {data.data.name}
                    </p>
                  </div>

                  {data.data.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Deskripsi
                      </h3>
                      <p className="mt-1 text-gray-700 dark:text-gray-300">
                        {data.data.description}
                      </p>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-300">
                        ID Tes
                      </h4>
                      <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {data.data.id}
                      </p>
                    </div>

                    <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                      <h4 className="font-semibold text-purple-900 dark:text-purple-300">
                        Status
                      </h4>
                      <p className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {data.data.active ? "Aktif" : "Tidak Aktif"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                      <h4 className="font-semibold text-amber-900 dark:text-amber-300">
                        Parent ID
                      </h4>
                      <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {data.data.parentId ?? "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                {data.data.instructions.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                      Instruksi ({data.data.instructions.length})
                    </h3>
                    <ol className="space-y-2">
                      {data.data.instructions
                        .sort((a, b) => a.order - b.order)
                        .map((instruction) => (
                          <li
                            key={instruction.id}
                            className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                          >
                            <span className="mr-2 font-semibold text-myunila">
                              {instruction.order + 1}.
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">
                              {instruction.text}
                            </span>
                          </li>
                        ))}
                    </ol>
                  </div>
                )}

                {/* Notes */}
                {data.data.notes.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                      Catatan ({data.data.notes.length})
                    </h3>
                    <div className="space-y-2">
                      {data.data.notes
                        .sort((a, b) => a.order - b.order)
                        .map((note) => (
                          <div
                            key={note.id}
                            className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20"
                          >
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {note.text}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Questions Summary */}
                {data.data.questions.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                      Pertanyaan ({data.data.questions.length})
                    </h3>
                    <div className="space-y-4">
                      {data.data.questions
                        .sort((a, b) => a.order - b.order)
                        .slice(0, 3)
                        .map((question, index) => (
                          <div
                            key={question.id}
                            className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                          >
                            <div className="mb-2 flex items-start gap-2">
                              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-myunila text-xs font-bold text-white">
                                {index + 1}
                              </span>
                              <p className="flex-1 font-medium text-gray-900 dark:text-white">
                                {question.text}
                              </p>
                            </div>
                            <div className="ml-8 mt-2 space-y-1">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Tipe: {question.type} | Opsi:{" "}
                                {question.options.length}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {question.options
                                  .sort((a, b) => a.order - b.order)
                                  .map((option) => (
                                    <span
                                      key={option.id}
                                      className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                    >
                                      {option.text}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      {data.data.questions.length > 3 && (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                          ... dan {data.data.questions.length - 3} pertanyaan
                          lainnya
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* JSON Preview */}
                <details className="mt-6">
                  <summary className="cursor-pointer font-semibold text-gray-900 hover:text-myunila dark:text-white">
                    Lihat JSON Response Lengkap
                  </summary>
                  <pre className="mt-3 overflow-auto rounded-lg bg-gray-900 p-4 text-xs text-green-400">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
