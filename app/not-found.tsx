"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:',.<>?/~`0123456789ABCDEFabcdef";
const MATRIX_CHARS = "01";

interface MatrixDrop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  length: number;
}

export default function NotFound() {
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [glitchText, setGlitchText] = useState("404");
  const [matrixDrops, setMatrixDrops] = useState<MatrixDrop[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [easterEggCount, setEasterEggCount] = useState(0);

  const terminalLines = [
    { text: "$ curl -I https://nicpjones.com" + (typeof window !== "undefined" ? window.location.pathname : ""), delay: 0 },
    { text: "HTTP/2 404", delay: 800, color: "text-red-400" },
    { text: "content-type: text/html", delay: 1000 },
    { text: "x-error: page-not-found", delay: 1100 },
    { text: "", delay: 1300 },
    { text: "$ echo \"The page you're looking for doesn't exist.\"", delay: 1500 },
    { text: "The page you're looking for doesn't exist.", delay: 2200, color: "text-yellow-400" },
    { text: "", delay: 2500 },
  ];

  const [visibleLines, setVisibleLines] = useState<number>(0);

  // Terminal lines typing effect
  useEffect(() => {
    if (visibleLines < terminalLines.length) {
      const timer = setTimeout(() => {
        setVisibleLines((v) => v + 1);
      }, terminalLines[visibleLines].delay);
      return () => clearTimeout(timer);
    } else {
      setShowPrompt(true);
    }
  }, [visibleLines, terminalLines.length]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(interval);
  }, []);

  // 404 glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const glitched = "404"
          .split("")
          .map((char) =>
            Math.random() > 0.5
              ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
              : char
          )
          .join("");
        setGlitchText(glitched);
        setTimeout(() => setGlitchText("404"), 100);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Matrix rain
  useEffect(() => {
    const drops: MatrixDrop[] = Array.from({ length: 15 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * -100,
      speed: 0.5 + Math.random() * 1.5,
      length: 5 + Math.floor(Math.random() * 15),
      chars: Array.from(
        { length: 5 + Math.floor(Math.random() * 15) },
        () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
      ),
    }));
    setMatrixDrops(drops);

    const interval = setInterval(() => {
      setMatrixDrops((prev) =>
        prev.map((drop) => ({
          ...drop,
          y: drop.y > 110 ? -10 : drop.y + drop.speed,
          chars: drop.chars.map((c) =>
            Math.random() > 0.9
              ? MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
              : c
          ),
        }))
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      let response: string;

      switch (trimmed) {
        case "help":
          response =
            "Available commands: help, home, whoami, hack, sudo, ls, cat flag.txt, exit";
          break;
        case "home":
        case "cd ~":
        case "cd /":
        case "exit":
          if (typeof window !== "undefined") window.location.href = "/";
          response = "Redirecting...";
          break;
        case "whoami":
          response = "guest (uid=404 gid=404 groups=404(lost))";
          break;
        case "hack":
          response = "Nice try. Access denied.";
          break;
        case "sudo hack":
        case "sudo su":
        case "sudo rm -rf /":
          response = "guest is not in the sudoers file. This incident will be reported.";
          break;
        case "ls":
          response = "flag.txt   .hidden   void/   /dev/null";
          break;
        case "cat flag.txt":
          response = "NicPWNs{y0u_f0und_th3_404_fl4g}";
          setEasterEggCount((c) => c + 1);
          break;
        case "cat .hidden":
          response = "You found a secret! Now go home: type 'home'";
          setEasterEggCount((c) => c + 1);
          break;
        case "cd void":
          response = "You stare into the void. The void stares back.";
          break;
        case "ping":
          response = "PING 404.nicpjones.com: 56 data bytes\nRequest timeout for icmp_seq 0\nRequest timeout for icmp_seq 1\n--- 404 packets transmitted, 0 packets received, 100.0% packet loss ---";
          break;
        case "":
          response = "";
          break;
        default:
          response = `bash: ${trimmed}: command not found. Type 'help' for available commands.`;
      }

      setCommandHistory((prev) => [...prev, `$ ${cmd}`, response]);
      setCurrentInput("");
    },
    []
  );

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono overflow-hidden relative">
      {/* Matrix rain background */}
      <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none">
        {matrixDrops.map((drop, i) => (
          <div
            key={i}
            className="absolute text-xs leading-tight"
            style={{
              left: `${drop.x}%`,
              top: `${drop.y}%`,
              transform: "translateX(-50%)",
            }}
          >
            {drop.chars.map((char, j) => (
              <div
                key={j}
                style={{
                  opacity: 1 - j / drop.chars.length,
                  color: j === 0 ? "#fff" : undefined,
                }}
              >
                {char}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Glitchy 404 */}
        <div className="mb-8 select-none">
          <h1
            className="text-8xl md:text-9xl font-bold text-red-500 tracking-widest"
            style={{
              textShadow:
                "0 0 10px rgba(239,68,68,0.7), 0 0 20px rgba(239,68,68,0.5), 0 0 40px rgba(239,68,68,0.3)",
            }}
          >
            {glitchText}
          </h1>
        </div>

        {/* Terminal window */}
        <div className="w-full max-w-2xl">
          <div className="bg-gray-800 rounded-t-lg px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-gray-400 text-sm">
              guest@nicpjones.com: ~
            </span>
          </div>
          <div className="bg-black/80 backdrop-blur-sm rounded-b-lg p-4 text-sm min-h-[300px] max-h-[400px] overflow-y-auto border border-gray-700 border-t-0">
            {/* Animated terminal output */}
            {terminalLines.slice(0, visibleLines).map((line, i) => (
              <div key={i} className={`${line.color || "text-green-400"} whitespace-pre-wrap`}>
                {line.text}
              </div>
            ))}

            {/* Command history */}
            {commandHistory.map((line, i) => (
              <div
                key={`hist-${i}`}
                className={`whitespace-pre-wrap ${
                  line.startsWith("$") ? "text-green-400" : "text-gray-300"
                }`}
              >
                {line}
              </div>
            ))}

            {/* Interactive prompt */}
            {showPrompt && (
              <div className="flex items-center">
                <span className="text-green-400 mr-2">$</span>
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCommand(currentInput);
                  }}
                  className="bg-transparent outline-none text-green-400 flex-1 caret-green-400"
                  autoFocus
                  spellCheck={false}
                  aria-label="Terminal input"
                />
                <span
                  className={`w-2 h-4 bg-green-400 ${
                    showCursor ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Go home button */}
        <Link
          href="/"
          className="mt-6 px-6 py-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-500/30 hover:border-green-400 transition-all duration-200"
        >
          cd /home
        </Link>

        {easterEggCount > 0 && (
          <div className="mt-4 text-xs text-gray-500">
            Secrets found: {easterEggCount}/2
          </div>
        )}
      </div>
    </div>
  );
}
