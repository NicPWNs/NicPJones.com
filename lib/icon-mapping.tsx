"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAws,
  faMicrosoft,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { faShield, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { siComptia, siIsc2 } from "simple-icons";

export function getIconForIssuer(issuer: string): React.JSX.Element {
  const lowerIssuer = issuer.toLowerCase();

  if (lowerIssuer.includes("isc2") || lowerIssuer.includes("(isc)²")) {
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
        <path d={siIsc2.path} />
      </svg>
    );
  }

  if (lowerIssuer.includes("comptia")) {
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
        <path d={siComptia.path} />
      </svg>
    );
  }

  if (lowerIssuer.includes("aws") || lowerIssuer.includes("amazon")) {
    return <FontAwesomeIcon icon={faAws} />;
  }

  if (lowerIssuer.includes("microsoft") || lowerIssuer.includes("azure")) {
    return <FontAwesomeIcon icon={faMicrosoft} />;
  }

  if (lowerIssuer.includes("github")) {
    return <FontAwesomeIcon icon={faGithub} />;
  }

  if (
    lowerIssuer.includes("offensive security") ||
    lowerIssuer.includes("offsec")
  ) {
    return <FontAwesomeIcon icon={faShield} />;
  }

  if (lowerIssuer.includes("ec-council") || lowerIssuer.includes("eccouncil")) {
    return <FontAwesomeIcon icon={faShield} />;
  }

  if (
    lowerIssuer.includes("giac") ||
    lowerIssuer.includes("sans") ||
    lowerIssuer.includes("isaca") ||
    lowerIssuer.includes("itil") ||
    lowerIssuer.includes("axelos")
  ) {
    return <FontAwesomeIcon icon={faGraduationCap} />;
  }

  // Default icon
  return <FontAwesomeIcon icon={faGraduationCap} />;
}
