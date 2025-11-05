import Link from "next/link";
import Image from "next/image";
import type { Assessment } from "@/types/assessment";

type Props = {
  assessment: Assessment;
};

function truncate(text: string, max = 140) {
  if (!text) return "";
  const t = text.trim();
  return t.length > max ? `${t.slice(0, max).trim()}…` : t;
}

export default function SingleAssessment({ assessment }: Props) {
  const {
    id,
    title,
    paragraph,
    image,
    tags = [],
    publishDate,
    author,
    rules,
  } = assessment;

  const href = `/assessment/${id}/start`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1280px) 384px, (min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800">
            <span className="text-sm">No Image</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-myunila/20 bg-myunila/10 px-2.5 py-1 text-xs font-medium text-myunila dark:border-myunila/30 dark:bg-myunila/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="line-clamp-2 text-lg font-semibold text-black transition-colors group-hover:text-myunila dark:text-white">
          {title}
        </h3>

        {/* Paragraph */}
        {paragraph && (
          <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {truncate(paragraph, 160)}
          </p>
        )}

        {/* Optional quick rules preview */}
        {Array.isArray(rules) && rules.length > 0 && (
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-300">
            {rules.slice(0, 2).map((r, idx) => (
              <li key={idx} className="line-clamp-1">
                {r}
              </li>
            ))}
            {rules.length > 2 && (
              <li className="list-none pl-0 text-xs text-gray-500 dark:text-gray-400">
                +{rules.length - 2} aturan lainnya
              </li>
            )}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          {/* Author / Date */}
          <div className="flex min-w-0 items-center gap-3">
            {author?.image ? (
              <Image
                src={author.image}
                alt={author.name || "Author"}
                width={28}
                height={28}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-700" />
            )}
            <div className="min-w-0">
              {author?.name && (
                <p className="truncate text-xs font-medium text-gray-800 dark:text-gray-200">
                  {author.name}
                </p>
              )}
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {publishDate || author?.designation || "Asesmen"}
              </p>
            </div>
          </div>

          {/* CTA */}
          <Link
            href={href}
            className="inline-flex items-center rounded-full bg-myunila px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-myunila-700 focus:outline-none focus:ring-2 focus:ring-myunila focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Mulai
          </Link>
        </div>
      </div>
    </article>
  );
}
