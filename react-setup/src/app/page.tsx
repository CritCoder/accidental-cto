"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback, useRef } from "react";

const ThreeBackground = dynamic(
  () => import("@/components/ui/three-background"),
  {
    ssr: false,
    loading: () => null
  }
);

export default function Home() {
  const [stage, setStage] = useState<"landing" | "intro" | "book">("landing");
  const [isMobile, setIsMobile] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle touch events for swipe navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    const duration = Date.now() - touchStartRef.current.time;

    // Swipe detection: horizontal > vertical, fast enough, long enough
    if (Math.abs(deltaX) > Math.abs(deltaY) && duration < 400 && Math.abs(deltaX) > 60) {
      if (deltaX < 0) {
        // Swipe left - go forward
        if (stage === "landing") setStage("intro");
        else if (stage === "intro") setStage("book");
      } else {
        // Swipe right - go back
        if (stage === "book") setStage("intro");
        else if (stage === "intro") setStage("landing");
      }
    }
    touchStartRef.current = null;
  }, [stage]);

  // Skip directly to book
  const skipToBook = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setStage("book");
  }, []);

  return (
    <main
      className="min-h-screen bg-black relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <ThreeBackground />

      {/* CSS Fallback Background for when WebGL fails */}
      <div className="css-background fixed inset-0 -z-10 pointer-events-none" aria-hidden="true" />

      {/* Landing Screen */}
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center z-10 transition-all duration-700 ${
          stage === "landing" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setStage("intro")}
      >
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight px-4 text-center">
          The <span className="italic text-[#d4a853]">Accidental</span> CTO
        </h1>
        <p className="text-white/50 mt-6 flex items-center gap-2 text-sm">
          <span className="w-2 h-2 bg-[#d4a853] rounded-full animate-pulse" />
          {isMobile ? "Tap anywhere or swipe left" : "Click anywhere to begin"}
        </p>

        {/* Skip button for mobile - always visible */}
        <button
          onClick={skipToBook}
          className="mt-8 px-6 py-3 border border-[#d4a853]/40 text-[#d4a853] text-sm rounded-full
                     hover:bg-[#d4a853]/10 active:bg-[#d4a853]/20 transition-all touch-manipulation"
        >
          Skip to Book →
        </button>
      </div>

      {/* Intro Screen */}
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center z-10 transition-all duration-700 ${
          stage === "intro" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setStage("book")}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#d4a853] text-base md:text-xl mb-3 md:mb-4 tracking-widest uppercase">
            A Story About
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif text-white mb-6 md:mb-8 leading-tight">
            Building, Breaking, and Learning
          </h2>
          <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8 md:mb-12 max-w-2xl mx-auto">
            From a 3 AM server crash to scaling for millions. The story of how an accidental CTO learned to build infrastructure the hard way.
          </p>
          <p className="text-white/40 text-sm flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-[#d4a853] rounded-full animate-pulse" />
            {isMobile ? "Tap to start reading" : "Click to start reading"}
          </p>

          {/* Back button */}
          <button
            onClick={(e) => { e.stopPropagation(); setStage("landing"); }}
            className="mt-6 text-white/30 text-sm hover:text-white/60 transition-colors touch-manipulation"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Book Content */}
      <div
        ref={contentRef}
        className={`fixed inset-0 z-10 transition-all duration-700 overflow-y-auto overscroll-contain ${
          stage === "book" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 safe-area-padding">
          {/* Chapter Header */}
          <div className="text-center mb-10 md:mb-16">
            <p className="text-[#d4a853] text-xs sm:text-sm tracking-widest uppercase mb-3 md:mb-4">
              Chapter 1
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white mb-3 md:mb-4">
              The 3 AM Phone Call
            </h2>
            <div className="w-12 md:w-16 h-px bg-[#d4a853]/50 mx-auto" />
          </div>

          {/* Book Content - Mobile optimized */}
          <article className="book-content">
            <h3 className="text-xl sm:text-2xl font-serif text-[#d4a853] mb-4 md:mb-6">Part 1: The Crash</h3>

            <p className="book-paragraph">
              The phone didn&apos;t just ring; it screamed.
            </p>

            <p className="book-paragraph">
              It&apos;s a specific kind of vibration, the one that phone manufacturers design for maximum panic. A violent, angry buzz on the cheap wooden bedside table. The kind that doesn&apos;t just wake you up, but jolts you straight into a state of high alert. The time on the clock glowed a menacing red: <span className="text-[#d4a853] font-semibold">3:14 AM</span>.
            </p>

            <p className="book-paragraph">
              My heart started pounding before my eyes were even open. At this ungodly hour, there are only two reasons for a phone call: a family emergency, or a company catastrophe. The caller ID confirmed the latter. It flashed a name I knew all too well: <span className="text-[#d4a853] font-semibold">&quot;Suumit.&quot;</span>
            </p>

            <p className="book-paragraph">
              Suumit Shah, my co-founder, my partner-in-crime, the business brain to my builder hands. He only calls at 3 AM for one reason. The company is on fire.
            </p>

            <p className="book-paragraph">
              I swiped to answer, my voice a dry, croaky mess. &quot;Hello?&quot;
            </p>

            <blockquote className="border-l-2 sm:border-l-4 border-[#d4a853] pl-4 sm:pl-6 my-6 md:my-8 italic text-white/70 text-base sm:text-lg">
              &quot;Subhash! Uth! Sab bandh ho gaya hai!&quot;
              <footer className="text-white/50 text-xs sm:text-sm mt-2 not-italic">
                Wake up! Everything&apos;s shut down!
              </footer>
            </blockquote>

            <p className="book-paragraph">
              He didn&apos;t need to say more. I was already out of bed, the cold floor a shock to my system. I stumbled towards my laptop, the familiar white glow of the Apple logo a beacon in the dark room. My mind was a whirlwind, a frantic checklist of digital disasters.
            </p>

            <ul className="text-white/70 space-y-2 sm:space-y-3 mb-4 md:mb-6 list-none pl-0 text-sm sm:text-base leading-relaxed">
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-[#d4a853] shrink-0">→</span>
                <span>Did we get hacked? A DDoS attack? Some script kiddie from a foreign country deciding to take us down for fun?</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-[#d4a853] shrink-0">→</span>
                <span>Did a developer push a bad piece of code? A single misplaced semicolon that brought the whole system to its knees?</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-[#d4a853] shrink-0">→</span>
                <span>Did our cloud provider have an outage? Was this out of our hands completely?</span>
              </li>
            </ul>

            <p className="book-paragraph">
              &quot;The site is not loading. The app is showing an error. Nothing. It&apos;s a complete blackout,&quot; Suumit continued, his voice tight with anxiety. I could hear him pacing on the other end.
            </p>

            <p className="book-paragraph">
              &quot;Okay, okay, I&apos;m on it. Shanti,&quot; I said, trying to sound calmer than I felt. <em className="text-white/60">Be calm.</em> The first rule of firefighting is to not become part of the fire.
            </p>

            <p className="book-paragraph">
              My fingers, still clumsy with sleep, flew across the keyboard. I opened the terminal, the black screen with green text that was my window into our entire operation. This was my command center.
            </p>

            <div className="bg-black/50 border border-white/10 rounded-lg p-3 sm:p-4 my-6 md:my-8 font-mono text-xs sm:text-sm overflow-x-auto">
              <span className="text-green-400">$</span> <span className="text-white">ssh root@dukaan.app</span>
            </div>

            <p className="book-paragraph">
              I hit Enter.
            </p>

            <p className="book-paragraph">
              The cursor blinked. And blinked. And blinked.
            </p>

            <p className="book-paragraph">
              Normally, the login prompt would appear instantly. This delay… this was a bad sign. A very bad sign. It meant the server wasn&apos;t just sick; it was on its deathbed, struggling to even answer the door.
            </p>

            <p className="book-paragraph">
              And then I saw the reason. The simple, almost embarrassing reason for our catastrophic failure. Staring at me from the top of the system monitor was the server&apos;s total memory: <span className="text-[#d4a853] font-bold text-lg sm:text-xl">512MB</span>.
            </p>

            <p className="book-paragraph">
              Five hundred and twelve megabytes.
            </p>

            <p className="book-paragraph">
              My modern smartphone has 8 Gigabytes of RAM, sixteen times more than the machine running our entire company. The thousands of businesses relying on us, the millions of products in their catalogs, the entire hopes and dreams of Dukaan, were all running on a machine with less power than the phone in my pocket.
            </p>

            <div className="text-center my-10 md:my-12">
              <span className="text-[#d4a853]">• • •</span>
            </div>

            <p className="text-white/60 text-center italic text-sm sm:text-base">
              Continue reading...
            </p>
          </article>

          {/* Back button */}
          <div className="text-center mt-12 md:mt-16 pb-8">
            <button
              onClick={() => setStage("landing")}
              className="text-white/40 hover:text-white/70 active:text-white/90 transition-colors text-sm touch-manipulation px-4 py-2"
            >
              ← Back to start
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
