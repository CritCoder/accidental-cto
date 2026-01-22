"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ThreeBackground = dynamic(
  () => import("@/components/ui/three-background"),
  {
    ssr: false,
    loading: () => null
  }
);

export default function Home() {
  const [stage, setStage] = useState<"landing" | "intro" | "book">("landing");

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      <ThreeBackground />

      {/* Landing Screen */}
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center z-10 transition-all duration-1000 cursor-pointer ${
          stage === "landing" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setStage("intro")}
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight">
          The <span className="italic text-[#d4a853]">Accidental</span> CTO
        </h1>
        <p className="text-white/50 mt-6 flex items-center gap-2 text-sm">
          <span className="w-2 h-2 bg-[#d4a853] rounded-full animate-pulse" />
          Click anywhere to begin
        </p>
      </div>

      {/* Intro Screen */}
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center z-10 transition-all duration-1000 cursor-pointer ${
          stage === "intro" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setStage("book")}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#d4a853] text-lg md:text-xl mb-4 tracking-widest uppercase">
            A Story About
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-8 leading-tight">
            Building, Breaking, and Learning
          </h2>
          <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
            From a 3 AM server crash to scaling for millions. This is the story of how an accidental CTO learned to build infrastructure the hard way.
          </p>
          <p className="text-white/40 text-sm flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-[#d4a853] rounded-full animate-pulse" />
            Click to start reading
          </p>
        </div>
      </div>

      {/* Book Content */}
      <div
        className={`fixed inset-0 z-10 transition-all duration-1000 overflow-y-auto ${
          stage === "book" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-3xl mx-auto px-6 py-20">
          {/* Chapter Header */}
          <div className="text-center mb-16">
            <p className="text-[#d4a853] text-sm tracking-widest uppercase mb-4">
              Chapter 1
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
              The 3 AM Phone Call
            </h2>
            <div className="w-16 h-px bg-[#d4a853]/50 mx-auto" />
          </div>

          {/* Book Content */}
          <article className="prose prose-invert prose-lg max-w-none">
            <h3 className="text-2xl font-serif text-[#d4a853] mb-6">Part 1: The Crash</h3>

            <p className="text-white/80 leading-relaxed mb-6">
              The phone didn&apos;t just ring; it screamed.
            </p>

            <p className="text-white/80 leading-relaxed mb-6">
              It&apos;s a specific kind of vibration, the one that phone manufacturers design for maximum panic. A violent, angry buzz on the cheap wooden bedside table. The kind that doesn&apos;t just wake you up, but jolts you straight into a state of high alert. The time on the clock glowed a menacing red: <span className="text-[#d4a853] font-semibold">3:14 AM</span>.
            </p>

            <p className="text-white/80 leading-relaxed mb-6">
              My heart started pounding before my eyes were even open. At this ungodly hour, there are only two reasons for a phone call: a family emergency, or a company catastrophe. The caller ID confirmed the latter. It flashed a name I knew all too well: <span className="text-[#d4a853] font-semibold">&quot;Suumit.&quot;</span>
            </p>

            <p className="text-white/80 leading-relaxed mb-6">
              Suumit Shah, my co-founder, my partner-in-crime, the business brain to my builder hands. He only calls at 3 AM for one reason. The company is on fire.
            </p>

            <p className="text-white/80 leading-relaxed mb-6">
              I swiped to answer, my voice a dry, croaky mess. &quot;Hello?&quot;
            </p>

            <blockquote className="border-l-4 border-[#d4a853] pl-6 my-8 italic text-white/70">
              &quot;Subhash! Uth! Sab bandh ho gaya hai!&quot;
              <footer className="text-white/50 text-sm mt-2 not-italic">
                Suumit&apos;s voice was a shotgun blast of adrenaline and panic through the phone speaker. Wake up! Everything&apos;s shut down!
              </footer>
            </blockquote>

            <p className="text-white/80 leading-relaxed mb-6">
              He didn&apos;t need to say more. I was already out of bed, the cold floor a shock to my system. I stumbled towards my laptop, the familiar white glow of the Apple logo a beacon in the dark room. My mind was a whirlwind, a frantic checklist of digital disasters.
            </p>

            <ul className="text-white/70 space-y-3 mb-6 list-none pl-0">
              <li className="flex items-start gap-3">
                <span className="text-[#d4a853]">→</span>
                Did we get hacked? A DDoS attack? Some script kiddie from a foreign country deciding to take us down for fun?
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#d4a853]">→</span>
                Did a developer push a bad piece of code? A single misplaced semicolon that brought the whole system to its knees?
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#d4a853]">→</span>
                Did our cloud provider have an outage? Was this out of our hands completely?
              </li>
            </ul>

            <p className="text-white/80 leading-relaxed mb-6">
              &quot;The site is not loading. The app is showing an error. Nothing. It&apos;s a complete blackout,&quot; Suumit continued, his voice tight with anxiety. I could hear him pacing on the other end.
            </p>

            <p className="text-white/80 leading-relaxed mb-6">
              &quot;Okay, okay, I&apos;m on it. Shanti,&quot; I said, trying to sound calmer than I felt. <em className="text-white/60">Be calm.</em> The first rule of firefighting is to not become part of the fire.
            </p>

            <p className="text-white/80 leading-relaxed mb-6">
              My fingers, still clumsy with sleep, flew across the keyboard. I opened the terminal, the black screen with green text that was my window into our entire operation. This was my command center.
            </p>

            <div className="bg-black/50 border border-white/10 rounded-lg p-4 my-8 font-mono text-sm">
              <span className="text-green-400">$</span> <span className="text-white">ssh root@dukaan.app</span>
            </div>

            <p className="text-white/80 leading-relaxed mb-6">
              I hit Enter.
            </p>

            <p className="text-white/80 leading-relaxed mb-6">
              The cursor blinked. And blinked. And blinked.
            </p>

            <p className="text-white/80 leading-relaxed mb-6">
              Normally, the login prompt would appear instantly. This delay… this was a bad sign. A very bad sign. It meant the server wasn&apos;t just sick; it was on its deathbed, struggling to even answer the door.
            </p>

            <p className="text-white/80 leading-relaxed mb-6">
              And then I saw the reason. The simple, almost embarrassing reason for our catastrophic failure. Staring at me from the top of the system monitor was the server&apos;s total memory: <span className="text-[#d4a853] font-bold text-xl">512MB</span>.
            </p>

            <p className="text-white/80 leading-relaxed mb-6">
              Five hundred and twelve megabytes.
            </p>

            <p className="text-white/80 leading-relaxed mb-6">
              My modern smartphone has 8 Gigabytes of RAM, sixteen times more than the machine running our entire company. The thousands of businesses relying on us, the millions of products in their catalogs, the entire hopes and dreams of Dukaan, were all running on a machine with less power than the phone in my pocket.
            </p>

            <div className="text-center my-12">
              <span className="text-[#d4a853]">• • •</span>
            </div>

            <p className="text-white/60 text-center italic">
              Continue reading...
            </p>
          </article>

          {/* Back button */}
          <div className="text-center mt-16">
            <button
              onClick={() => setStage("landing")}
              className="text-white/40 hover:text-white/70 transition-colors text-sm"
            >
              ← Back to start
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
