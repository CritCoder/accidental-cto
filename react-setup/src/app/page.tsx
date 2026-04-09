"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { marked } from "marked";

const ThreeBackground = dynamic(
  () => import("@/components/ui/three-background"),
  {
    ssr: false,
    loading: () => null
  }
);

type Stage = "landing" | "intro" | "book";

interface Chapter {
  title: string;
  content: string;
}

function parseChapters(md: string): Chapter[] {
  const parts = md.split(/^## /m).filter(Boolean);
  return parts.map((part) => {
    const firstNewline = part.indexOf("\n");
    const title = part.slice(0, firstNewline).trim();
    const content = part.slice(firstNewline).trim();
    return { title, content };
  });
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("landing");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapterIndex, setChapterIndex] = useState(0);
  const bookRef = useRef<HTMLDivElement>(null);

  // Load book content
  useEffect(() => {
    fetch("/CTO.md")
      .then((r) => r.text())
      .then((md) => {
        const parsed = parseChapters(md);
        setChapters(parsed);
      });
  }, []);

  const currentChapter = chapters[chapterIndex];
  const totalChapters = chapters.length;

  const goNextChapter = useCallback(() => {
    setChapterIndex((prev) => {
      if (prev < totalChapters - 1) return prev + 1;
      return prev;
    });
  }, [totalChapters]);

  const goPrevChapter = useCallback(() => {
    setChapterIndex((prev) => {
      if (prev > 0) return prev - 1;
      return prev;
    });
  }, []);

  // Scroll to top when chapter changes
  useEffect(() => {
    if (bookRef.current) {
      bookRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [chapterIndex]);

  // Stage navigation
  const stages: Stage[] = ["landing", "intro", "book"];

  const goNextStage = useCallback(() => {
    setStage((prev) => {
      const i = stages.indexOf(prev);
      if (prev === "book") {
        goNextChapter();
        return prev;
      }
      return i < stages.length - 1 ? stages[i + 1] : prev;
    });
  }, [goNextChapter]);

  const goPrevStage = useCallback(() => {
    setStage((prev) => {
      if (prev === "book" && chapterIndex > 0) {
        goPrevChapter();
        return prev;
      }
      const i = stages.indexOf(prev);
      return i > 0 ? stages[i - 1] : prev;
    });
  }, [goPrevChapter, chapterIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        goNextStage();
      } else if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        goPrevStage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNextStage, goPrevStage]);

  // Tap handler for book content - left 30% = prev, right 30% = next
  const handleBookTap = useCallback(
    (clientX: number, target: EventTarget) => {
      // Don't navigate if tapping the back button
      if (target instanceof HTMLElement && target.closest("button")) return;

      const w = window.innerWidth;
      if (clientX > w * 0.7) {
        goNextChapter();
      } else if (clientX < w * 0.3) {
        goPrevChapter();
      }
    },
    [goNextChapter, goPrevChapter]
  );

  const renderedContent = currentChapter
    ? marked(currentChapter.content, { breaks: true })
    : "";

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      <ThreeBackground />

      {/* Landing Screen */}
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center z-10 transition-all duration-1000 cursor-pointer ${
          stage === "landing" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setStage("intro")}
        onTouchEnd={(e) => {
          e.preventDefault();
          setStage("intro");
        }}
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight">
          The <span className="italic text-[#d4a853]">Accidental</span> CTO
        </h1>
        <p className="text-white/50 mt-6 flex items-center gap-2 text-sm">
          <span className="w-2 h-2 bg-[#d4a853] rounded-full animate-pulse" />
          Tap anywhere to begin
        </p>
      </div>

      {/* Intro Screen */}
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center z-10 transition-all duration-1000 cursor-pointer ${
          stage === "intro" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setStage("book")}
        onTouchEnd={(e) => {
          e.preventDefault();
          setStage("book");
        }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#d4a853] text-lg md:text-xl mb-4 tracking-widest uppercase">
            A Story About
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-8 leading-tight">
            Building, Breaking, and Learning
          </h2>
          <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
            From a 3 AM server crash to scaling for millions. This is the story
            of how an accidental CTO learned to build infrastructure the hard
            way.
          </p>
          <p className="text-white/40 text-sm flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-[#d4a853] rounded-full animate-pulse" />
            Tap to start reading
          </p>
        </div>
      </div>

      {/* Book Content */}
      <div
        ref={bookRef}
        className={`fixed inset-0 z-10 transition-all duration-1000 overflow-y-auto ${
          stage === "book" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => handleBookTap(e.clientX, e.target)}
        onTouchEnd={(e) => {
          if (e.touches.length === 0 && e.changedTouches.length > 0) {
            handleBookTap(e.changedTouches[0].clientX, e.target);
          }
        }}
      >
        {/* Tap zone indicators */}
        <div className="fixed left-0 top-0 bottom-0 w-[30%] z-20 cursor-w-resize opacity-0" />
        <div className="fixed right-0 top-0 bottom-0 w-[30%] z-20 cursor-e-resize opacity-0" />

        <div className="max-w-3xl mx-auto px-6 py-20">
          {currentChapter && (
            <>
              {/* Chapter Header */}
              <div className="text-center mb-16">
                <p className="text-[#d4a853] text-sm tracking-widest uppercase mb-4">
                  {chapterIndex + 1} / {totalChapters}
                </p>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
                  {currentChapter.title}
                </h2>
                <div className="w-16 h-px bg-[#d4a853]/50 mx-auto" />
              </div>

              {/* Rendered markdown content */}
              <article
                className="prose prose-invert prose-lg max-w-none
                  prose-headings:font-serif prose-headings:text-[#d4a853]
                  prose-p:text-white/80 prose-p:leading-relaxed prose-p:mb-6
                  prose-strong:text-[#d4a853] prose-strong:font-semibold
                  prose-em:text-white/60
                  prose-blockquote:border-l-[#d4a853] prose-blockquote:text-white/70 prose-blockquote:italic
                  prose-li:text-white/70
                  prose-code:text-green-400 prose-code:bg-black/50 prose-code:px-1 prose-code:rounded
                  prose-a:text-[#d4a853] prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: renderedContent as string }}
              />

              {/* Navigation footer */}
              <div className="flex items-center justify-between mt-16 text-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (chapterIndex > 0) goPrevChapter();
                    else setStage("landing");
                  }}
                  className="text-white/40 hover:text-white/70 transition-colors"
                >
                  {chapterIndex > 0 ? "← Previous" : "← Back to start"}
                </button>
                <span className="text-white/30">
                  Tap sides to navigate
                </span>
                {chapterIndex < totalChapters - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goNextChapter();
                    }}
                    className="text-white/40 hover:text-white/70 transition-colors"
                  >
                    Next →
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
