"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:',.<>?/~`0123456789ABCDEFabcdef";

export default function NotFound() {
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [glitchText, setGlitchText] = useState("404");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [easterEggCount, setEasterEggCount] = useState(0);

  const terminalLines = [
    { text: "$ curl -I https://nicpjones.com" + (typeof window !== "undefined" ? window.location.pathname : ""), delay: 0 },
    { text: "HTTP/2 404", delay: 800, color: "text-red-400" },
    { text: "content-type: text/html", delay: 1000, color: "text-blue-400" },
    { text: "x-error: page-not-found", delay: 1100, color: "text-blue-400" },
    { text: "", delay: 1300 },
    { text: "$ echo \"The page you're looking for doesn't exist.\"", delay: 1500 },
    { text: "The page you're looking for doesn't exist.", delay: 2200, color: "text-blue-400" },
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
    <div className="min-h-screen bg-gray-900 font-mono">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
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
          <div className="bg-gray-700 rounded-t-lg px-2 sm:px-4 py-2 flex items-center">
            <div className="flex items-center space-x-2 flex-1">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <div className="w-4 h-4 rounded-full bg-yellow-500" />
              <div className="w-4 h-4 rounded-full bg-green-500" />
            </div>
            <div className="text-sm font-semibold text-gray-300 flex-1 text-center whitespace-nowrap">
              404 - Not Found
            </div>
            <div className="flex-1" />
          </div>
          <div className="bg-gray-800 rounded-b-lg p-2 sm:p-4 text-sm min-h-[300px] max-h-[400px] overflow-y-auto">
            {/* Animated terminal output */}
            {terminalLines.slice(0, visibleLines).map((line, i) => (
              <div key={i} className="whitespace-pre-wrap">
                {line.text.startsWith("$") ? (
                  <>
                    <span className="text-red-500">$ </span>
                    <span className="text-yellow-500">{line.text.slice(2)}</span>
                  </>
                ) : (
                  <span className={line.color || "text-gray-100"}>{line.text}</span>
                )}
              </div>
            ))}

            {/* Command history */}
            {commandHistory.map((line, i) => (
              <div key={`hist-${i}`} className="whitespace-pre-wrap">
                {line.startsWith("$") ? (
                  <>
                    <span className="text-red-500">$ </span>
                    <span className="text-yellow-500">{line.slice(2)}</span>
                  </>
                ) : (
                  <span className="text-gray-100">{line}</span>
                )}
              </div>
            ))}

            {/* Interactive prompt */}
            {showPrompt && (
              <div className="flex items-center">
                <span className="text-red-500 mr-1">$ </span>
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCommand(currentInput);
                  }}
                  className="bg-transparent outline-none text-yellow-500 caret-transparent w-0 flex-shrink-0"
                  style={{ width: currentInput.length + "ch" }}
                  autoFocus
                  spellCheck={false}
                  aria-label="Terminal input"
                />
                <span className="inline-block w-2 h-4 bg-gray-100 animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Go home button */}
        <Link
          href="/"
          className="mt-6 px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg text-yellow-500 hover:bg-gray-700 hover:border-gray-600 transition-all duration-200"
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
