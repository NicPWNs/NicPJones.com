---
title: "What is Cyberthreat Intelligence?"
date: 2022-09-15
slug: what-is-cyberthreat-intelligence
excerpt: "What is cyber threat intelligence (CTI)? A clear definition, analyzing an adversary's intent, opportunity, and capability, and why CTI matters for defense."
source: https://medium.com/@NicPWNs/what-is-cyberthreat-intelligence-9474b90e507f?source=rss-57a2a039424d------2
tags: ["threatintelligence"]
---

![What is Cyberthreat Intelligence?](/writeups/what-is-cyberthreat-intelligence/img-1.jpg)

Cyberthreat intelligence (CTI) can be defined as “an analysis of an adversary’s intent, opportunity, and capability to do harm” (Bautista, 2018). CTI is a particular focus area within the field of information security as a whole, and requires specific skills and tooling to take advantage of it. CTI might encompass knowledge of a specific cyber incident, trends for different threat actors, or even just new security vulnerabilities that are opportunities for adversaries. With this broad range of CTI, there are many specialized tools and methodologies that come with it to help track the valuable data that CTI is.

## Types of Cyberthreat Intelligence

### OSINT

One commonly known type of CTI is OSINT or open-source intelligence. OSINT is information that is publicly available, but specifically collected for the purpose of serving as intelligence (Bautista, 2018). Some examples of OSINT are social media, public records, or published documents. OSINT is useful for gathering specific details about individuals and companies. Check out the [OSINT Framework](https://osintframework.com/), a free tool that lists a lot of OSINT sources.

### IMINT

Another information source that can serve as CTI is IMINT or image intelligence. Image intelligence is less about regular taken photos (which would be considered OSINT) and more about higher-level imagery. This includes image data from satellites or other types of aerial reconnaissance (Bautista, 2018). IMINT is particularly useful for identifying or becoming familiar with a geographical area. [Google Earth](https://earth.google.com/web/@0,0,0a,22251752.77375655d,35y,0h,0t,0r) is the best example of IMINT.

### HUMINT

Another interesting type of intelligence is human intelligence, known as HUMINT. HUMINT is generally information that was collected by a person trained to do so (Bautista, 2018). This often comes into play with the collection of foreign information (like spies!). HUMINT often involves individuals trained in other languages and culture to mix in with the source of the intelligence (Bautista, 2018). HUMINT is useful for gathering information that would typically only be accessible to those with privileges to it.

## Cyberthreat Intelligence Platforms

CTI platforms are tools that help with the overall collection, management, categorization, and use of cyberthreat intelligence. There are many of these platforms that exist, so I’ll point out a few here.

### Cyware CSAP

Cyware’s Situational Awareness Platform ([CSAP](https://cyware.com/cyber-security-situational-awareness-platform-csap)) is a threat intelligence platform that captures threat intelligence information in real-time for action to be taken against threats (Cyware Labs, n.d). The CSAP platform specializes in aggregation of unstructured and structured intelligence, with multiple different paths of intelligence sharing. This includes automatically updating other security tools with the latest threat intelligence available and also collecting new threat intelligence from those same tools (Cyware Labs, n.d). All of the CTI in the platform is categorized and managed for human intervention and alerting as well.

### IBM X-Force Exchange

IBM’s [X-Force Exchange](https://www.ibm.com/products/xforce-exchange) is a cloud-based threat intelligence platform focused on the consumption of CTI for action. X-Force Exchange seems to have an emphasis on the sharing of intelligence throughout the community, not just within one’s own enterprise. X-Force exchange supports typical threat intelligence standards for integration with other security tooling, and aims to improve the speed and accuracy of security operations overall (IBM, n.d).

### Anomali ThreatStream

Anomali’s [ThreatStream](https://www.anomali.com/products/threatstream) is another threat intelligence platform that assists with automating the collection and lifecycle of CTI. ThreatStream aims to increase security operations’ productivity and shorten the time to detection of threats. This platform, much like the others, attempts to remove the extraneous data and noise from bulk amounts of intelligence, and filter it to relevant intelligence that action can be taken on (Anomali, n.d).

## CVSS Scores

CVSS scores are often a component of CTI that is focused on a specific vulnerability or CVE that exists. CVSS stands for Common Vulnerability Scoring System, and like the name suggests, is a system for normalizing the severity and impact of security vulnerabilities in a standard and recognizable format. While there are many, the main CVSS scoring used is the base metric group which is made up of multiple factors to calculate the overall score. Some of these sections are Attack Vector, Attack Complexity, Privileges Required, User Interaction, and CIA (confidentiality, integrity, availability) impact (NIST, n.d). Each of these is rated at different levels to calculate the overall CVSS score. The CVSS score can then be used as CTI to determine how quickly a vulnerability needs to be patched, or to prioritize it against other present vulnerabilities.

## CVSS Examples

### CVE-2008–4250 (MS08–067)

![Microsoft](/writeups/what-is-cyberthreat-intelligence/img-2.png)

MS08–067 almost has a maximum score, but falls short with a scope of “unchanged”.

**Base Score**: 9.8

**Attack Vector (AV)**: Network — This is a “remote” code execution vulnerability.  
**Attack Complexity (AC)**: Low — Very specialized skills are not needed to exploit this vulnerability.  
**Privileges Required (PR)**: None — No preexisting privileges are needed to exploit this vulnerability.  
**User Interaction (UI)**: None — No end-user interaction is required to exploit this vulnerability.  
**Scope**: Unchanged — The exploited vulnerability only impacts resources at the immediate target.  
**Confidentiality Impact**: High — The vulnerability has a high likelihood to impact the confidentiality of data.  
**Integrity Impact**: High — The vulnerability has a high likelihood to impact the integrity of data.  
**Availability Impact**: High — The vulnerability has a high likelihood to impact the availability of data.

[Link to NIST CVSS calculation.](https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator?vector=\(AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H/E:H/RL:O/RC:C\))

### CVE-2014–0160 (Heartbleed)

![Heartbleed](/writeups/what-is-cyberthreat-intelligence/img-3.png)

Heartbleed has a high CVSS, but loses some points because it only reads data and doesn’t write any.

**Base Score**: 7.5

**Attack Vector (AV)**: Network — This is a “remote” buffer over-read vulnerability.  
**Attack Complexity (AC)**: Low — Very specialized skills are not needed to exploit this vulnerability.  
**Privileges Required (PR)**: None — No preexisting privileges are needed to exploit this vulnerability.  
**User Interaction (UI)**: None — No end-user interaction is required to exploit this vulnerability.  
**Scope**: Unchanged — The exploited vulnerability only impacts resources at the immediate target.  
**Confidentiality Impact**: High — The vulnerability has a high likelihood to impact the confidentiality of data.  
**Integrity Impact**: Low — The vulnerability has a low likelihood to impact the integrity of data because it only reads it.  
**Availability Impact**: Low — The vulnerability has a low likelihood to impact the availability of data because it only reads it.

[Link to NIST CVSS calculation.](https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator?name=CVE-2014-0160&vector=AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N&version=3.1&source=NIST)

### CVE-2021–44228 (Log4j)

![Log4j](/writeups/what-is-cyberthreat-intelligence/img-4.png)

Log4j hits a maximum CVSS score with a worst case scenario vulnerability.

**Base Score**: 10.0

**Attack Vector (AV)**: Network — This is a “remote” arbitrary code execution vulnerability.  
**Attack Complexity (AC)**: Low — Very specialized skills are not needed to exploit this vulnerability.  
**Privileges Required (PR)**: None — No preexisting privileges are needed to exploit this vulnerability.  
**User Interaction (UI)**: None — No end-user interaction is required to exploit this vulnerability.  
**Scope**: Changed — The exploited vulnerability can impact other resources beyond the typical scope that it is related to.  
**Confidentiality Impact**: High — The vulnerability has a high likelihood to impact the confidentiality of data.  
**Integrity Impact**: High — The vulnerability has a high likelihood to impact the integrity of data.  
**Availability Impact**: High — The vulnerability has a high likelihood to impact the availability of data.

[Link to NIST CVSS calculation.](https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator?name=CVE-2021-44228&vector=AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H&version=3.1&source=NIST)

## More

Thank you for reading my post about cyberthreat intelligence! Be sure to check out my other and future [posts about CTI](/notes?tag=threatintelligence).

## References

Anomali. (n.d.). *Anomali ThreatStream Threat Intelligence Management*. Anomali. Retrieved September 12, 2022, from  
[https://www.anomali.com/products/threatstream](https://www.anomali.com/products/threatstream)

Bautista, W. (2018). *Practical cyber intelligence: How action-based intelligence can be an effective response to incidents;how action-based*  
*intelligence can be an*. PACKT Publishing.

Cyware Labs. (n.d.). *Cyber Security Situational Awareness: Strategic threat intelligence and management: Cyware*. Cyware Labs. Retrieved  
September 12, 2022, from [https://cyware.com/cyber-security-situational-awareness-platform-csap](https://cyware.com/cyber-security-situational-awareness-platform-csap)

IBM. (n.d.). *IBM X-Force Exchange*. IBM. Retrieved September 12, 2022, from [https://www.ibm.com/products/xforce-exchange](https://www.ibm.com/products/xforce-exchange)

NIST. (n.d.). *National Vulnerability Database*. NVD. Retrieved September 12, 2022, from [https://nvd.nist.gov/](https://nvd.nist.gov/)
