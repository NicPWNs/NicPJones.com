"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
} from "lucide-react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

export default function NotFound() {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [easterEggCount, setEasterEggCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const [isMobile, setIsMobile] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const nodeRef = useRef<HTMLDivElement>(null!);

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

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);
      setIsExpanded(newIsMobile);
      setWindowSize({
        width: Math.min(800, window.innerWidth - 32),
        height: Math.min(600, window.innerHeight - 32),
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleRefresh = () => {
    setVisibleLines(0);
    setShowPrompt(false);
    setCommandHistory([]);
    setCurrentInput("");
    setEasterEggCount(0);
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    setPosition({ x: 0, y: 0 });
  };

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    setPosition({ x: data.x, y: data.y });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleButtonInteraction =
    (action: () => void) => (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      action();
    };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      } p-4 font-mono flex items-center justify-center overflow-x-hidden`}
    >
      <Draggable
        nodeRef={nodeRef}
        handle=".drag-handle"
        bounds="parent"
        position={isExpanded ? { x: 0, y: 0 } : position}
        onDrag={handleDrag}
        disabled={isExpanded}
      >
        <div
          ref={nodeRef}
          className={`${isExpanded ? "w-full h-full fixed top-0 left-0" : ""}`}
          style={{
            width: isExpanded ? "100%" : windowSize.width,
            height: isExpanded ? "100%" : windowSize.height,
          }}
        >
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg overflow-hidden shadow-lg h-full flex flex-col`}
          >
            <div
              className={`${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              } px-2 sm:px-4 py-2 flex items-center drag-handle cursor-move`}
            >
              <div className="flex items-center space-x-2 flex-1">
                <div
                  className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center cursor-pointer group"
                  onClick={handleButtonInteraction(handleRefresh)}
                  onTouchStart={handleButtonInteraction(handleRefresh)}
                  role="button"
                  tabIndex={0}
                  aria-label="Refresh"
                >
                  <RotateCcw className="w-2 h-2 text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div
                  className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center cursor-pointer group"
                  onClick={handleButtonInteraction(toggleTheme)}
                  onTouchStart={handleButtonInteraction(toggleTheme)}
                  role="button"
                  tabIndex={0}
                  aria-label={
                    isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {isDarkMode ? (
                    <Sun className="w-2 h-2 text-yellow-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <Moon className="w-2 h-2 text-yellow-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <div
                  className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center cursor-pointer group"
                  onClick={handleButtonInteraction(handleExpand)}
                  onTouchStart={handleButtonInteraction(handleExpand)}
                  role="button"
                  tabIndex={0}
                  aria-label={isExpanded ? "Minimize" : "Maximize"}
                >
                  {isExpanded ? (
                    <Minimize2 className="w-2 h-2 text-green-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <Maximize2 className="w-2 h-2 text-green-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
              <div
                className={`text-sm font-semibold ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } flex-1 text-center whitespace-nowrap`}
              >
                404 - Not Found
              </div>
              <div className="flex-1"></div>
            </div>
            <div className="flex-1 p-2 sm:p-4 overflow-auto">
              <pre className="whitespace-pre-wrap break-words">
                {/* Animated terminal output */}
                {terminalLines.slice(0, visibleLines).map((line, i) => (
                  <span key={i}>
                    {line.text.startsWith("$") ? (
                      <>
                        <span className="text-red-500">$ </span>
                        <span className="text-yellow-500">{line.text.slice(2)}</span>
                      </>
                    ) : (
                      <span className={line.color || (isDarkMode ? "text-gray-100" : "text-gray-800")}>{line.text}</span>
                    )}
                    {"\n"}
                  </span>
                ))}

                {/* Command history */}
                {commandHistory.map((line, i) => (
                  <span key={`hist-${i}`}>
                    {line.startsWith("$") ? (
                      <>
                        <span className="text-red-500">$ </span>
                        <span className="text-yellow-500">{line.slice(2)}</span>
                      </>
                    ) : (
                      <span className={isDarkMode ? "text-green-500" : "text-green-600"}>{line}</span>
                    )}
                    {"\n"}
                  </span>
                ))}

                {/* Interactive prompt */}
                {showPrompt && (
                  <>
                    <span className="text-red-500">$ </span>
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCommand(currentInput);
                      }}
                      className={`bg-transparent outline-none text-yellow-500 ${isDarkMode ? "caret-gray-100" : "caret-gray-700"}`}
                      autoFocus
                      spellCheck={false}
                      aria-label="Terminal input"
                    />
                  </>
                )}

                {easterEggCount > 0 && (
                  <>
                    {"\n\n"}
                    <span className="text-gray-500 text-xs">Secrets found: {easterEggCount}/2</span>
                  </>
                )}
              </pre>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
}
