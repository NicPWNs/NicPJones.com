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
  Award,
  Bug,
} from "lucide-react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAws,
  faMicrosoft,
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import {
  faShield,
  faCertificate,
  faGraduationCap,
  faBriefcase,
  faTrophy,
  faCode,
} from "@fortawesome/free-solid-svg-icons";

config.autoAddCss = false;

const TYPING_SPEED = 100;

interface Certification {
  name: string;
  issueDate: string;
  expirationDate: string | null;
  verificationLink?: string;
  icon: JSX.Element;
}

interface Education {
  institution: string;
  degree: string;
  period: string;
  gpa: string;
  notes: string[];
}

interface WorkExperience {
  company: string;
  location: string;
  period?: string;
  positions: {
    title: string;
    period: string;
    responsibilities: string[];
  }[];
}

interface Award {
  name: string;
  date: string;
  description?: string;
}

interface Bounty {
  platform: string;
  cve: string;
  description: string;
  reward: string;
  date: string;
  reportLink: string;
}

interface Project {
  name: string;
  period: string;
  description: string;
  skills: string[];
  link: string;
}

export default function Component() {
  const [displayedText, setDisplayedText] = useState<JSX.Element[]>([]);
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
  const [showBounties, setShowBounties] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [certPosition, setCertPosition] = useState({ x: 20, y: 20 });
  const [eduPosition, setEduPosition] = useState({ x: 20, y: 20 });
  const [expPosition, setExpPosition] = useState({ x: 20, y: 20 });
  const [awardsPosition, setAwardsPosition] = useState({ x: 20, y: 20 });
  const [bountiesPosition, setBountiesPosition] = useState({ x: 20, y: 20 });
  const [projectsPosition, setProjectsPosition] = useState({ x: 20, y: 20 });
  const nodeRef = useRef<HTMLDivElement>(null);
  const certNodeRef = useRef<HTMLDivElement>(null);
  const eduNodeRef = useRef<HTMLDivElement>(null);
  const expNodeRef = useRef<HTMLDivElement>(null);
  const awardsNodeRef = useRef<HTMLDivElement>(null);
  const bountiesNodeRef = useRef<HTMLDivElement>(null);
  const projectsNodeRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const certifications: Certification[] = [
    {
      name: "ISC2 CISSP",
      issueDate: "2024",
      expirationDate: "2027",
      verificationLink:
        "https://www.credly.com/badges/560ed8db-b774-4e82-8739-16e3d4f5ef3f",
      icon: <FontAwesomeIcon icon={faShield} />,
    },
    {
      name: "OSCP",
      issueDate: "2021",
      expirationDate: null,
      verificationLink:
        "https://www.credly.com/badges/c854a9a8-65d6-49e0-99cc-4185431ffbe1",
      icon: <FontAwesomeIcon icon={faShield} />,
    },
    {
      name: "CompTIA Security+",
      issueDate: "2019",
      expirationDate: "2025",
      verificationLink:
        "https://www.credly.com/badges/b7a679ec-9e89-4c38-8365-0c5bb455fb96",
      icon: <FontAwesomeIcon icon={faCertificate} />,
    },
    {
      name: "ISC2 CC",
      issueDate: "2022",
      expirationDate: "2025",
      verificationLink:
        "https://www.credly.com/badges/aecc6db8-b949-4ab3-aa00-9838934663e7",
      icon: <FontAwesomeIcon icon={faShield} />,
    },
    {
      name: "CEH",
      issueDate: "2020",
      expirationDate: "2026",
      verificationLink:
        "https://aspen.eccouncil.org/VerifyBadge?type=certification&a=kwThnOZRxPYI9uNmvx1awPJNuF+UI30UkmnnwhXV4vE=",
      icon: <FontAwesomeIcon icon={faShield} />,
    },
    {
      name: "CompTIA CySA+",
      issueDate: "2022",
      expirationDate: "2025",
      verificationLink:
        "https://www.credly.com/badges/facfd8f5-5a14-4882-9abb-8ec3700753c6",
      icon: <FontAwesomeIcon icon={faCertificate} />,
    },
    {
      name: "AWS Certified Security Specialty",
      issueDate: "2022",
      expirationDate: "2025",
      verificationLink:
        "https://www.credly.com/badges/d39908cf-2441-4b2d-9713-b69c96f0b422",
      icon: <FontAwesomeIcon icon={faAws} />,
    },
    {
      name: "AWS Certified Solutions Architect Professional",
      issueDate: "2023",
      expirationDate: "2026",
      verificationLink:
        "https://www.credly.com/badges/41c69366-9c82-4a9a-808c-ba752a0e9da2",
      icon: <FontAwesomeIcon icon={faAws} />,
    },
    {
      name: "AWS Certified Solutions Architect Associate",
      issueDate: "2020",
      expirationDate: "2026",
      verificationLink:
        "https://www.credly.com/badges/2683baf7-4512-4afd-b5e2-41a294fe4a9f",
      icon: <FontAwesomeIcon icon={faAws} />,
    },
    {
      name: "AWS Certified Cloud Practitioner",
      issueDate: "2019",
      expirationDate: "2026",
      verificationLink:
        "https://www.credly.com/badges/257fb17c-7afb-40e2-9d84-2270199b555b",
      icon: <FontAwesomeIcon icon={faAws} />,
    },
    {
      name: "Azure Security Engineer Associate (AZ-500)",
      issueDate: "2020",
      expirationDate: "2026",
      verificationLink:
        "https://learn.microsoft.com/api/credentials/share/en-us/NicPJones/3192E98671159E7B?sharingId=D82E446A8052F8AA",
      icon: <FontAwesomeIcon icon={faMicrosoft} />,
    },
    {
      name: "Azure Fundamentals (AZ-900)",
      issueDate: "2020",
      expirationDate: null,
      verificationLink:
        "https://learn.microsoft.com/api/credentials/share/en-us/NicPJones/85F4F1A7BD1BECC7?sharingId=D82E446A8052F8AA",
      icon: <FontAwesomeIcon icon={faMicrosoft} />,
    },
    {
      name: "CompTIA Network+",
      issueDate: "2017",
      expirationDate: "2025",
      verificationLink:
        "https://www.credly.com/badges/f63e1a16-90f8-407f-bab7-54c0307e1109",
      icon: <FontAwesomeIcon icon={faCertificate} />,
    },
    {
      name: "CompTIA A+",
      issueDate: "2017",
      expirationDate: "2025",
      verificationLink:
        "https://www.credly.com/badges/78ab4d15-6dfe-4cae-81d3-736fa15d216d",
      icon: <FontAwesomeIcon icon={faCertificate} />,
    },
    {
      name: "CompTIA ITF+",
      issueDate: "2017",
      expirationDate: null,
      verificationLink:
        "https://www.credly.com/badges/f44688b9-39af-4ccb-a299-b4f312f784d8",
      icon: <FontAwesomeIcon icon={faCertificate} />,
    },
    {
      name: "GitHub Foundations",
      issueDate: "2024",
      expirationDate: "2027",
      verificationLink:
        "https://www.credly.com/badges/708d4cbb-14c9-4df2-ac99-5c244d60b5e5",
      icon: <FontAwesomeIcon icon={faGithub} />,
    },
    {
      name: "GitHub Actions",
      issueDate: "2024",
      expirationDate: "2027",
      verificationLink:
        "https://www.credly.com/badges/27b80a71-a37d-48a9-8da5-5a25d66632b7",
      icon: <FontAwesomeIcon icon={faGithub} />,
    },
    {
      name: "ISACA CMMI Associate",
      issueDate: "2024",
      expirationDate: "2027",
      icon: <FontAwesomeIcon icon={faGraduationCap} />,
    },
    {
      name: "ITIL v4 Foundation",
      issueDate: "2019",
      expirationDate: null,
      icon: <FontAwesomeIcon icon={faGraduationCap} />,
    },
  ];

  const educationInfo: Education[] = [
    {
      institution: "Wilmington University",
      degree: "M.S. in Cybersecurity",
      period: "August 2021 - August 2023",
      gpa: "4.0",
      notes: ["Epsilon Pi Tau Honor Society"],
    },
    {
      institution: "Capitol Technology University",
      degree: "B.S. in Cyber & Information Security",
      period: "August 2016 - May 2020",
      gpa: "3.8",
      notes: [
        "Dean's List (x4)",
        "Magna Cum Laude",
        "Upsilon Pi Epsilon Honor Society",
      ],
    },
    {
      institution: "Sussex Technical High School",
      degree:
        "Certificate in Electronics/Computer Information Systems Engineering",
      period: "August 2012 - May 2016",
      gpa: "3.8",
      notes: ["Key Club", "HAM Radio", "SkillsUSA"],
    },
  ];

  const workExperience: WorkExperience[] = [
    {
      company: "T-Rex Solutions, LLC",
      location: "Bethesda, MD - Remote",
      period: "June 2019 - Present",
      positions: [
        {
          title: "Information Security Manager",
          period: "January 2024 – Present",
          responsibilities: [
            "Develop and execute T-Rex information security strategy and manage information security analyst(s).",
          ],
        },
        {
          title: "Security Engineer",
          period: "June 2022 – December 2023",
          responsibilities: [
            "Primary assignment on contract with Palantir Technologies.",
          ],
        },
        {
          title: "Lead Information Security Analyst",
          period: "May 2020 – July 2022",
          responsibilities: [
            "Previous responsibilities in addition to periodic penetration testing, network infrastructure management, incident response exercise development, MITRE ATT&CK adoption, ISO 27001 preparation, cross-training team members, support to cloud technology lab projects (TLPs), and managing the information security intern.",
          ],
        },
        {
          title: "Cybersecurity Analyst",
          period: "August 2019 - May 2020",
          responsibilities: [
            "Report to CISO/CIO and lead malicious email analysis, vulnerability & patch management, cloud security architecting, security awareness training, and network monitoring.",
          ],
        },
        {
          title: "Cybersecurity Intern",
          period: "June 2019 - August 2019",
          responsibilities: [
            "Supported the security team in implementing Splunk and developing procedures, policies, compliance, and training.",
          ],
        },
      ],
    },
    {
      company: "Palantir Technologies",
      location: "Washington D.C. - Remote",
      positions: [
        {
          title: "Forward Deployed Data Engineer (Contractor)",
          period: "June 2022 - December 2023",
          responsibilities: [
            "Build data pipelines in Palantir Foundry using Python/PySpark to clean, normalize, and create value from data.",
          ],
        },
      ],
    },
    {
      company: "Synack Red Team",
      location: "Freelance",
      positions: [
        {
          title: "Security Researcher",
          period: "May 2022 - August 2024",
          responsibilities: [
            "The Synack Red Team (SRT) is an exclusive bug bounty and penetration testing program where admitted team members have the opportunity to test for security vulnerabilities on web, host, and mobile platforms in Synack's extensive customer base.",
            "Team members must complete a series of technical assessments and interviews to join.",
          ],
        },
      ],
    },
    {
      company: "Mobius Intelligent Systems",
      location: "Laurel, MD - Remote",
      positions: [
        {
          title: "Applications Tester & Developer",
          period: "May 2019 - September 2019",
          responsibilities: [
            "Tested and assisted in developing VBA, JavaScript, PHP, MySQL, and Python intelligence applications for customers.",
          ],
        },
      ],
    },
    {
      company: "Capitol Technology University Cyber Lab",
      location: "Laurel, MD",
      positions: [
        {
          title: "SOC Analyst/Engineer",
          period: "March 2019 - September 2019",
          responsibilities: [
            "Managed and developed the Cyber Lab's Security Operations Center (SOC) in order to keep the lab network secure and promote a learning environment for other students and myself.",
            "Created Splunk rules and dashboards for analysis.",
          ],
        },
      ],
    },
    {
      company: "ADNET Systems, Inc.",
      location: "NASA GSFC, Greenbelt, MD",
      positions: [
        {
          title: "Data Technician",
          period: "December 2018 - May 2019",
          responsibilities: [
            "Managed CentOS and macOS systems and their logs to support heliophysics satellite missions (SDO, SOHO, STEREO).",
          ],
        },
      ],
    },
    {
      company: "CSRA, Inc.",
      location: "Falls Church, VA",
      positions: [
        {
          title: "IT Intern",
          period: "December 2017 - January 2018",
          responsibilities: [
            "Managed documents and IT resources to assist the government contract effort.",
            "Imaged and prepped Windows 10 systems and Android phones for deployment.",
          ],
        },
      ],
    },
  ];

  const awards: Award[] = [
    {
      name: "Parsons Cyber CTF",
      date: "September 2024",
      description: "2nd Place",
    },
    {
      name: "Mike Sterling 5K Run",
      date: "August 2024",
      description: "3rd Place",
    },
    { name: "Parsons Cyber CTF", date: "June 2024", description: "2nd Place" },
    {
      name: "CT Cubed CTF @ DEFCON",
      date: "August 2023",
      description: "1st Place",
    },
    {
      name: "BSides Charm Exabeam CTF",
      date: "April 2023",
      description: "1st Place",
    },
    {
      name: "T-Rex Azure Data Adventure Game Day",
      date: "March 2022",
      description: "1st Place",
    },
    {
      name: "T-Rex AWS Architecting Game Day #7",
      date: "April 2021",
      description: "1st Place",
    },
    {
      name: "T-Rex AWS Databases Game Day #3",
      date: "October 2020",
      description: "1st Place",
    },
    {
      name: "T-Rex AWS SSL/TLS Game Day #2",
      date: "August 2020",
      description: "1st Place",
    },
    {
      name: "T-Rex AWS Networking Game Day #1",
      date: "July 2020",
      description: "1st Place",
    },
    {
      name: "Maryland Cyber Challenge",
      date: "December 2019",
      description: "3rd Place",
    },
    {
      name: "Parsons Cyber CTF",
      date: "November 2019",
      description: "3rd Place",
    },
    {
      name: "Parsons Cyber CTF",
      date: "October 2019",
      description: "1st Place",
    },
    {
      name: "SkillsUSA National Web Design Competition",
      date: "2015 & 2016",
      description: "Represented Delaware in Louisville, KY",
    },
    {
      name: "SkillsUSA Delaware Web Design Competition",
      date: "2015 & 2016",
      description: "1st Place",
    },
    {
      name: "Boy Scouts of America Eagle Scout Award",
      date: "December 2014",
      description: "With 3 additional palms",
    },
  ];

  const bounties: Bounty[] = [
    {
      platform: "Huntr",
      cve: "CVE-2024-8098",
      description: "Python Code Injection",
      reward: "$900",
      date: "August 2024",
      reportLink:
        "https://huntr.com/bounties/083bb3f0-dd51-4d8c-bf17-7110ea730f5a",
    },
  ];

  const projects: Project[] = [
    {
      name: "HAMRadioWallet.com",
      period: "July 2024 - September 2024",
      description:
        "An app to add FCC Amateur Radio Licenses to Apple Wallet and Google Wallet.",
      skills: ["Web Development", "Apple Wallet", "Google Wallet"],
      link: "https://github.com/NicPWNs/hamradiowallet.com",
    },
    {
      name: "GitHub Discord Bot",
      period: "January 2024 - June 2024",
      description:
        "I created this serverless Discord bot to help developers subscribe a Discord channel to events in their GitHub repositories automatically.",
      skills: ["AWS Lambda", "AWS SQS", "Python", "Webhooks", "REST APIs"],
      link: "https://github.com/NicPWNs/GitHub-Discord-Bot",
    },
    {
      name: "Portable User Interface For Cyber Security Awareness",
      period: "December 2015 - June 2016",
      description:
        "My Portable User Interface For Cyber Security Awareness was the example of mastery to graduate my senior year at Sussex Technical High School. It has a physical aspect which is a portable kiosk engineered specifically to view the website with a touchscreen interface.",
      skills: [
        "Linux",
        "Raspberry Pi",
        "Information Security Awareness",
        "Web Development",
      ],
      link: "https://github.com/NicPWNs/STHS-STSP",
    },
  ];

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
                className="text-purple-400 hover:underline text-left"
              >
                Certs
              </button>
              <button
                onClick={() => setShowEducation(true)}
                className="text-purple-400 hover:underline text-left"
              >
                Education
              </button>
              <button
                onClick={() => setShowAwards(true)}
                className="text-purple-400 hover:underline text-left"
              >
                Awards
              </button>
              <button
                onClick={() => setShowExperience(true)}
                className="text-purple-400 hover:underline text-left"
              >
                Experience
              </button>
              <button
                onClick={() => setShowProjects(true)}
                className="text-purple-400 hover:underline text-left"
              >
                Projects
              </button>
              <button
                onClick={() => setShowBounties(true)}
                className="text-purple-400 hover:underline text-left"
              >
                Bounties
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

  const handleBountiesDrag = (e: DraggableEvent, data: DraggableData) => {
    setBountiesPosition({ x: data.x, y: data.y });
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
                    href="https://www.linkedin.com/in/nicpjones/details/certifications/"
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

      {showBounties && (
        <Draggable
          nodeRef={bountiesNodeRef}
          handle=".bounties-drag-handle"
          bounds="parent"
          position={bountiesPosition}
          onDrag={handleBountiesDrag}
        >
          <div ref={bountiesNodeRef} className="fixed">
            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg overflow-hidden shadow-lg flex flex-col max-w-[95vw] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px]`}
            >
              <div
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                } px-4 py-2 flex items-center bounties-drag-handle cursor-move`}
              >
                <div className="flex items-center space-x-2 flex-1">
                  <div
                    className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center cursor-pointer group"
                    onClick={handleButtonInteraction(() =>
                      setShowBounties(false)
                    )}
                    onTouchStart={handleButtonInteraction(() =>
                      setShowBounties(false)
                    )}
                    role="button"
                    tabIndex={0}
                    aria-label="Close Bounties"
                  >
                    <X className="w-2 h-2 text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } flex-1 text-center whitespace-nowrap`}
                >
                  Bug Bounties
                </div>
                <div className="flex-1"></div>
              </div>
              <div className="p-4 overflow-auto max-h-[70vh]">
                <div className="space-y-4">
                  {bounties.map((bounty, index) => (
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
                        <div className="font-semibold">{bounty.cve}</div>
                      </div>
                      <div className="text-sm mb-1">{bounty.platform}</div>
                      <div className="text-sm mb-1">{bounty.description}</div>
                      <div className="text-sm mb-1">
                        Reward: {bounty.reward}
                      </div>
                      <div className="text-sm mb-1">{bounty.date}</div>
                      <a
                        href={bounty.reportLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs flex items-center text-blue-400 hover:underline"
                      >
                        View Report <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
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
                        <span className="font-semibold">Skills:</span>{" "}
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
