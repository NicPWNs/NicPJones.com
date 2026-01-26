"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  X,
  ExternalLink,
  CheckCircle,
  Bug,
} from "lucide-react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import {
  faBriefcase,
  faTrophy,
  faCode,
} from "@fortawesome/free-solid-svg-icons";
import {
  Certification,
  Education,
  WorkExperience,
  Award,
  Exploit,
  Project,
} from "@/lib/types";
import { getIconForIssuer } from "@/lib/icon-mapping";
import { siCredly } from "simple-icons";

config.autoAddCss = false;

const TYPING_SPEED = 100;

interface CertificationWithIcon extends Certification {
  icon: React.JSX.Element;
}

interface HomeClientProps {
  certifications: Certification[];
  education: Education[];
  workExperience: WorkExperience[];
  awards: Award[];
  cves: Exploit[];
  projects: Project[];
}

export default function HomeClient({
  certifications: certificationsProp,
  education: educationInfo,
  workExperience,
  awards,
  cves,
  projects,
}: HomeClientProps) {
  const [displayedText, setDisplayedText] = useState<React.JSX.Element[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isTypingCommand, setIsTypingCommand] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const [showCertifications, setShowCertifications] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [showExperience, setShowExperience] = useState(false);
  const [showAwards, setShowAwards] = useState(false);
  const [showCVEs, setShowCVEs] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [certPosition, setCertPosition] = useState({ x: 20, y: 20 });
  const [eduPosition, setEduPosition] = useState({ x: 20, y: 20 });
  const [expPosition, setExpPosition] = useState({ x: 20, y: 20 });
  const [awardsPosition, setAwardsPosition] = useState({ x: 20, y: 20 });
  const [cvesPosition, setCvesPosition] = useState({ x: 20, y: 20 });
  const [projectsPosition, setProjectsPosition] = useState({ x: 20, y: 20 });
  const nodeRef = useRef<HTMLDivElement>(null!);
  const certNodeRef = useRef<HTMLDivElement>(null!);
  const eduNodeRef = useRef<HTMLDivElement>(null!);
  const expNodeRef = useRef<HTMLDivElement>(null!);
  const awardsNodeRef = useRef<HTMLDivElement>(null!);
  const cvesNodeRef = useRef<HTMLDivElement>(null!);
  const projectsNodeRef = useRef<HTMLDivElement>(null!);
  const [isMobile, setIsMobile] = useState(false);

  // Apply icons to certifications
  const certifications: CertificationWithIcon[] = useMemo(
    () =>
      certificationsProp.map((cert) => ({
        ...cert,
        icon: getIconForIssuer(cert.issuer),
      })),
    [certificationsProp]
  );

  const information = useMemo(
    () => [
      { command: "whoami", response: "Nic Jones (NicPWNs)" },
      {
        command: "cat About.txt",
        response: (
          <>
            I{"'"}m a cybersecurity professional, hobbyist developer, and
            lifelong student.
            {"\n\n"}I currently work as the Information Security Manager at
            T-Rex.
            {"\n\n"}Please check out the commands and links below!
          </>
        ),
      },
      {
        command: "help",
        response: (
          <>
            Available commands:
            <div className="grid grid-cols-3 gap-x-2 mt-2">
              <button
                onClick={() => setShowCertifications(true)}
                className="text-purple-400 hover:underline text-left cursor-pointer"
              >
                Certs
              </button>
              <button
                onClick={() => setShowEducation(true)}
                className="text-purple-400 hover:underline text-left cursor-pointer"
              >
                Education
              </button>
              <button
                onClick={() => setShowAwards(true)}
                className="text-purple-400 hover:underline text-left cursor-pointer"
              >
                Awards
              </button>
              <button
                onClick={() => setShowExperience(true)}
                className="text-purple-400 hover:underline text-left cursor-pointer"
              >
                Experience
              </button>
              <button
                onClick={() => setShowProjects(true)}
                className="text-purple-400 hover:underline text-left cursor-pointer"
              >
                Projects
              </button>
              <button
                onClick={() => setShowCVEs(true)}
                className="text-purple-400 hover:underline text-left cursor-pointer"
              >
                CVEs
              </button>
            </div>
          </>
        ),
      },
      {
        command: "ls Links/",
        response: (
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/NicPWNs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/nicpjones/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              LinkedIn
            </a>
            <a
              href="https://blog.nicpwns.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Blog
            </a>
            <a
              href="https://www.credly.com/users/nicpjones/badges"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Credly
            </a>
            <a
              href="https://app.hackthebox.eu/profile/72382"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              HackTheBox
            </a>
            <a
              href="https://www.hackerrank.com/nicpwns"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              HackerRank
            </a>
            <a
              href="https://stackoverflow.com/users/21022536/nicpwns"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              StackOverflow
            </a>
            <a
              href="https://steamcommunity.com/id/nicpwns2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Steam
            </a>
          </div>
        ),
      },
      {
        command: "echo $CONTACT",
        response: (
          <a
            href="mailto:nic@nicpjones.com"
            className="text-blue-400 hover:underline"
          >
            nic@nicpjones.com
          </a>
        ),
      },
      { command: "exit", response: "" },
    ],
    []
  );

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

  useEffect(() => {
    if (currentLine < information.length) {
      const { command, response } = information[currentLine];

      if (isTypingCommand) {
        if (currentChar === 0) {
          setDisplayedText((prev) => [
            ...prev,
            <span key={`prompt-${currentLine}`} className="text-red-500">
              ${" "}
            </span>,
          ]);
        }

        if (currentChar < command.length) {
          const typingInterval = setInterval(() => {
            setDisplayedText((prev) => [
              ...prev,
              <span
                key={`command-${currentLine}-${currentChar}`}
                className="text-yellow-500"
              >
                {command[currentChar]}
              </span>,
            ]);
            setCurrentChar((prev) => prev + 1);
          }, TYPING_SPEED);

          return () => clearInterval(typingInterval);
        } else {
          setIsTypingCommand(false);
          setCurrentChar(0);
          if (command !== "exit") {
            setDisplayedText((prev) => [
              ...prev,
              <br key={`br1-${currentLine}`} />,
            ]);
          }
        }
      } else {
        if (command !== "exit") {
          setDisplayedText((prev) => [
            ...prev,
            <span key={`response-${currentLine}`} className="text-green-500">
              {response}
            </span>,
            <br key={`br2-${currentLine}`} />,
            ...(command !== "help" && command !== "ls Links/"
              ? [<br key={`br3-${currentLine}`} />]
              : []),
          ]);
        }
        setCurrentLine((prev) => prev + 1);
        setIsTypingCommand(true);
        setCurrentChar(0);
      }
    }
  }, [currentLine, currentChar, isTypingCommand, information]);

  const handleRefresh = () => {
    setDisplayedText([]);
    setCurrentLine(0);
    setCurrentChar(0);
    setIsTypingCommand(true);
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    setPosition({ x: 0, y: 0 });
  };

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleCertDrag = (e: DraggableEvent, data: DraggableData) => {
    setCertPosition({ x: data.x, y: data.y });
  };

  const handleEduDrag = (e: DraggableEvent, data: DraggableData) => {
    setEduPosition({ x: data.x, y: data.y });
  };

  const handleExpDrag = (e: DraggableEvent, data: DraggableData) => {
    setExpPosition({ x: data.x, y: data.y });
  };

  const handleAwardsDrag = (e: DraggableEvent, data: DraggableData) => {
    setAwardsPosition({ x: data.x, y: data.y });
  };

  const handleCVEsDrag = (e: DraggableEvent, data: DraggableData) => {
    setCvesPosition({ x: data.x, y: data.y });
  };

  const handleProjectsDrag = (e: DraggableEvent, data: DraggableData) => {
    setProjectsPosition({ x: data.x, y: data.y });
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
                aria-label="Website Title"
              >
                NicPJones.com
              </div>
              <div className="flex-1"></div>
            </div>
            <div className="flex-1 p-2 sm:p-4 overflow-auto">
              <pre className="whitespace-pre-wrap break-words">
                {displayedText}
                <span
                  className={`inline-block w-2 h-4 ${
                    isDarkMode ? "bg-gray-100" : "bg-gray-700"
                  } ml-1 animate-pulse`}
                ></span>
              </pre>
            </div>
          </div>
        </div>
      </Draggable>

      {showCertifications && (
        <Draggable
          nodeRef={certNodeRef}
          handle=".cert-drag-handle"
          bounds="parent"
          position={certPosition}
          onDrag={handleCertDrag}
        >
          <div ref={certNodeRef} className="fixed">
            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg overflow-hidden shadow-lg flex flex-col max-w-[95vw] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px]`}
            >
              <div
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                } px-4 py-2 flex items-center cert-drag-handle cursor-move`}
              >
                <div className="flex items-center space-x-2 flex-1">
                  <div
                    className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center cursor-pointer group"
                    onClick={handleButtonInteraction(() =>
                      setShowCertifications(false)
                    )}
                    onTouchStart={handleButtonInteraction(() =>
                      setShowCertifications(false)
                    )}
                    role="button"
                    tabIndex={0}
                    aria-label="Close Certifications"
                  >
                    <X className="w-2 h-2 text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } flex-1 text-center whitespace-nowrap`}
                >
                  Certifications
                </div>
                <div className="flex-1"></div>
              </div>
              <div className="p-4 overflow-auto max-h-[70vh]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {certifications.map((cert, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-200"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 mr-2 flex items-center justify-center">
                          {cert.icon}
                        </div>
                        <div className="font-semibold text-sm">{cert.name}</div>
                      </div>
                      <div className="text-xs mb-1">
                        Issued: {cert.issueDate}
                      </div>
                      <div className="text-xs mb-2">
                        {cert.expirationDate
                          ? `Expires: ${cert.expirationDate}`
                          : "Does not expire"}
                      </div>
                      {cert.verificationLink && (
                        <a
                          href={cert.verificationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center text-blue-400 hover:underline"
                        >
                          Verify <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <a
                    href="https://www.credly.com/users/nicpjones/badges"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-400 hover:underline"
                  >
                    View on Credly{" "}
                    <svg viewBox="0 0 24 24" className="w-4 h-4 ml-1 fill-current">
                      <path d={siCredly.path} />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Draggable>
      )}

      {showEducation && (
        <Draggable
          nodeRef={eduNodeRef}
          handle=".edu-drag-handle"
          bounds="parent"
          position={eduPosition}
          onDrag={handleEduDrag}
        >
          <div ref={eduNodeRef} className="fixed">
            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg overflow-hidden shadow-lg flex flex-col max-w-[95vw] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px]`}
            >
              <div
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                } px-4 py-2 flex items-center edu-drag-handle cursor-move`}
              >
                <div className="flex items-center space-x-2 flex-1">
                  <div
                    className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center cursor-pointer group"
                    onClick={handleButtonInteraction(() =>
                      setShowEducation(false)
                    )}
                    onTouchStart={handleButtonInteraction(() =>
                      setShowEducation(false)
                    )}
                    role="button"
                    tabIndex={0}
                    aria-label="Close Education"
                  >
                    <X className="w-2 h-2 text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } flex-1 text-center whitespace-nowrap`}
                >
                  Education
                </div>
                <div className="flex-1"></div>
              </div>
              <div className="p-4 overflow-auto max-h-[70vh]">
                <div className="space-y-6">
                  {educationInfo.map((edu, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-200"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{edu.institution}</h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <p className="font-semibold mb-1">{edu.degree}</p>
                      <p className="text-sm mb-1">{edu.period}</p>
                      <p className="text-sm mb-2">GPA: {edu.gpa}</p>
                      {edu.notes.length > 0 && (
                        <div className="mb-2">
                          <p className="font-semibold text-sm">Notes:</p>
                          <ul className="list-disc list-inside text-xs">
                            {edu.notes.map((note, i) => (
                              <li key={i}>{note}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <a
                    href="https://www.linkedin.com/in/nicpjones/details/education/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-400 hover:underline"
                  >
                    View on LinkedIn{" "}
                    <FontAwesomeIcon
                      icon={faLinkedin}
                      className="w-4 h-4 ml-1"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Draggable>
      )}

      {showExperience && (
        <Draggable
          nodeRef={expNodeRef}
          handle=".exp-drag-handle"
          bounds="parent"
          position={expPosition}
          onDrag={handleExpDrag}
        >
          <div ref={expNodeRef} className="fixed">
            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg overflow-hidden shadow-lg flex flex-col max-w-[95vw] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px]`}
            >
              <div
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                } px-4 py-2 flex items-center exp-drag-handle cursor-move`}
              >
                <div className="flex items-center space-x-2 flex-1">
                  <div
                    className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center cursor-pointer group"
                    onClick={handleButtonInteraction(() =>
                      setShowExperience(false)
                    )}
                    onTouchStart={handleButtonInteraction(() =>
                      setShowExperience(false)
                    )}
                    role="button"
                    tabIndex={0}
                    aria-label="Close Experience"
                  >
                    <X className="w-2 h-2 text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } flex-1 text-center whitespace-nowrap`}
                >
                  Work Experience
                </div>
                <div className="flex-1"></div>
              </div>
              <div className="p-4 overflow-auto max-h-[70vh]">
                <div className="space-y-6">
                  {workExperience.map((exp, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-200"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{exp.company}</h3>
                        <FontAwesomeIcon
                          icon={faBriefcase}
                          className="w-5 h-5 text-blue-500"
                        />
                      </div>
                      <p className="text-sm mb-1">{exp.location}</p>
                      {exp.period && (
                        <p className="text-sm mb-2">{exp.period}</p>
                      )}
                      {exp.positions.map((position, posIndex) => (
                        <div key={posIndex} className="mb-4">
                          <p className="font-semibold">{position.title}</p>
                          <p className="text-sm mb-1">{position.period}</p>
                          <ul className="list-disc list-inside text-xs">
                            {position.responsibilities.map(
                              (resp, respIndex) => (
                                <li key={respIndex}>{resp}</li>
                              )
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <a
                    href="https://www.linkedin.com/in/nicpjones/details/experience/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-400 hover:underline"
                  >
                    View on LinkedIn{" "}
                    <FontAwesomeIcon
                      icon={faLinkedin}
                      className="w-4 h-4 ml-1"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Draggable>
      )}

      {showAwards && (
        <Draggable
          nodeRef={awardsNodeRef}
          handle=".awards-drag-handle"
          bounds="parent"
          position={awardsPosition}
          onDrag={handleAwardsDrag}
        >
          <div ref={awardsNodeRef} className="fixed">
            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg overflow-hidden shadow-lg flex flex-col max-w-[95vw] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px]`}
            >
              <div
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                } px-4 py-2 flex items-center awards-drag-handle cursor-move`}
              >
                <div className="flex items-center space-x-2 flex-1">
                  <div
                    className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center cursor-pointer group"
                    onClick={handleButtonInteraction(() =>
                      setShowAwards(false)
                    )}
                    onTouchStart={handleButtonInteraction(() =>
                      setShowAwards(false)
                    )}
                    role="button"
                    tabIndex={0}
                    aria-label="Close Awards"
                  >
                    <X className="w-2 h-2 text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } flex-1 text-center whitespace-nowrap`}
                >
                  Awards
                </div>
                <div className="flex-1"></div>
              </div>
              <div className="p-4 overflow-auto max-h-[70vh]">
                <div className="space-y-4">
                  {awards.map((award, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-200"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <FontAwesomeIcon
                          icon={faTrophy}
                          className="w-5 h-5 text-yellow-500 mr-2"
                        />
                        <div className="font-semibold">{award.name}</div>
                      </div>
                      <div className="text-sm mb-1">{award.date}</div>
                      {award.description && (
                        <div className="text-sm">{award.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Draggable>
      )}

      {showCVEs && (
        <Draggable
          nodeRef={cvesNodeRef}
          handle=".cves-drag-handle"
          bounds="parent"
          position={cvesPosition}
          onDrag={handleCVEsDrag}
        >
          <div ref={cvesNodeRef} className="fixed">
            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg overflow-hidden shadow-lg flex flex-col max-w-[95vw] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px]`}
            >
              <div
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                } px-4 py-2 flex items-center cves-drag-handle cursor-move`}
              >
                <div className="flex items-center space-x-2 flex-1">
                  <div
                    className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center cursor-pointer group"
                    onClick={handleButtonInteraction(() =>
                      setShowCVEs(false)
                    )}
                    onTouchStart={handleButtonInteraction(() =>
                      setShowCVEs(false)
                    )}
                    role="button"
                    tabIndex={0}
                    aria-label="Close CVEs"
                  >
                    <X className="w-2 h-2 text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } flex-1 text-center whitespace-nowrap`}
                >
                  CVEs
                </div>
                <div className="flex-1"></div>
              </div>
              <div className="p-4 overflow-auto max-h-[70vh]">
                <div className="space-y-4">
                  {cves.map((cve, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-200"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <Bug className="w-5 h-5 text-green-500 mr-2" />
                        <div className="font-semibold">{cve.cve}</div>
                      </div>
                      <div className="text-sm mb-1">{cve.description}</div>
                      <div className="text-sm mb-1">{cve.date}</div>
                      <a
                        href={cve.reportLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs flex items-center text-blue-400 hover:underline"
                      >
                        View Report <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                      {cve.cveLink && (
                        <a
                          href={cve.cveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center text-blue-400 hover:underline"
                        >
                          View NIST NVD{" "}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Draggable>
      )}

      {showProjects && (
        <Draggable
          nodeRef={projectsNodeRef}
          handle=".projects-drag-handle"
          bounds="parent"
          position={projectsPosition}
          onDrag={handleProjectsDrag}
        >
          <div ref={projectsNodeRef} className="fixed">
            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg overflow-hidden shadow-lg flex flex-col max-w-[95vw] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px]`}
            >
              <div
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                } px-4 py-2 flex items-center projects-drag-handle cursor-move`}
              >
                <div className="flex items-center space-x-2 flex-1">
                  <div
                    className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center cursor-pointer group"
                    onClick={handleButtonInteraction(() =>
                      setShowProjects(false)
                    )}
                    onTouchStart={handleButtonInteraction(() =>
                      setShowProjects(false)
                    )}
                    role="button"
                    tabIndex={0}
                    aria-label="Close Projects"
                  >
                    <X className="w-2 h-2 text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } flex-1 text-center whitespace-nowrap`}
                >
                  Projects
                </div>
                <div className="flex-1"></div>
              </div>
              <div className="p-4 overflow-auto max-h-[70vh]">
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-200"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <FontAwesomeIcon
                          icon={faCode}
                          className="w-5 h-5 text-blue-500 mr-2"
                        />
                        <div className="font-semibold">{project.name}</div>
                      </div>
                      <div className="text-sm mb-1">{project.period}</div>
                      <div className="text-sm mb-2">{project.description}</div>
                      <div className="text-sm mb-2">
                        {project.skills.join(", ")}
                      </div>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs flex items-center text-blue-400 hover:underline"
                      >
                        View Project <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <a
                    href="https://www.linkedin.com/in/nicpjones/details/projects/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-400 hover:underline"
                  >
                    View on LinkedIn{" "}
                    <FontAwesomeIcon
                      icon={faLinkedin}
                      className="w-4 h-4 ml-1"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
}
