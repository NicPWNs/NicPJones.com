---
title: "Cyberthreat Intelligence"
date: 2022-11-06
slug: cyberthreat-intelligence
excerpt: "Cyberthreat intelligence (CTI) is a very complex topic within the realm of cybersecurity. CTI is not as simple as just downloading some indicators of\u2026"
source: https://medium.com/@NicPWNs/cyberthreat-intelligence-5c9bbb1493bd?source=rss-57a2a039424d------2
tags: ["threatintelligence"]
---

Cyberthreat intelligence (CTI) is a very complex topic within the realm of cybersecurity. CTI is not as simple as just downloading some indicators of compromise (IOCs) from the Internet anymore. CTI has many facets now to include jobs, policies, procedures, varying types, tools, and organizations.

![](/writeups/cyberthreat-intelligence/img-1.png)

## CTI Jobs

Within the field of CTI, there are a few relevant job titles that can typically be seen on the job market.

### Cyberthreat Intelligence Analyst

A cyberthreat intelligence analyst is typically tasked with all things analysis of intel gained from a cyberthreat intelligence program. This includes monitoring, assessing, synthesizing all data from an organization’s CTI program to determine relevant threats, applicability, and any other risks to information security. Essentially, the analyst takes raw intelligence and refines it to more usable and actionable data to make important security decisions from. Cyberthreat intelligence analysts are typically paid around [$111,000 a year](https://www.ziprecruiter.com/Salaries/Cyber-Threat-Analyst-Salary#:~:text=WhileZipRecruiterisseeingannual,annuallyacrosstheUnitedStates.) and can have varying levels like intern, junior, and senior depending on the size of a company and their threat intelligence program.

**Qualifications for a cyberthreat intelligence analyst typically include the following:**

-   Bachelor’s degree in cybersecurity, computer science, or intelligence
-   Basic security certifications like Security+, SSCP, or CEH
-   Three years of IT or security experience
-   Knowledge of frameworks like MITRE ATT&CK
-   Strong research and analytical skills

### Cyberthreat Intelligence Engineer

A cyberthreat intelligence engineer is typically the next step up from an analyst. Cyberthreat intelligence engineers are typically those tasked with taking a deeper technical dive into threat intelligence. This might involve work such as malware analysis, reverse engineering, and adversary attribution. A cyberthreat intelligence engineer may often be the individual or party that is generating and serving out new threat intelligence feeds that analysts make use of. Intelligence engineers create and manage the infrastructure around threat intelligence feeds as well. Cyberthreat intelligence engineers are typically paid around [$142,000 a year](https://www.talent.com/salary?job=threat+intelligence+engineer) and can also have varying levels like junior and senior depending on the size of an organization’s threat intelligence department.

**Qualifications for a cyberthreat intelligence engineer typically include the following:**

-   Bachelor’s degree in cybersecurity, computer science, or intelligence
-   Basic security certifications like Security+, SSCP, or CEH
-   Five to eight years of cybersecurity experience
-   Knowledge of frameworks like MITRE ATT&CK
-   Skills in malware analysis and reverse engineering
-   Scripting or DevOps background
-   Hands-on experience with security tools like Splunk and threat intelligence platforms

## CTI Governance

With cyberthreat intelligence gaining a bigger foothold as a full department or program within an organization, there are some policies and procedures that come with it.

### Policies

**Cyberthreat Intelligence Policy**: Some organizations may name this differently, depending on size, but generally a policy that states the intended purpose and goals of a CTI program should be in place. This policy will lay the groundwork for how the organization expects the CTI program to collect, process, analyze, and make use of cyberthreat intelligence for the efforts of information security.

**Logging & Event Management Policy**: A significant amount of CTI data is stored and streamed in regular logging and event data. Although this policy will not be entirely about CTI, the policy should at least have a section dedicated to describing the way logs are used for the efforts of cyberthreat intelligence at the organization.

### Procedures

**Cyberthreat Intelligence Collection & Analysis**: Organizations with a CTI program should have a procedure or SOP in place that describes specifically how CTI is collected or ingested, and how it is then analyzed and disseminated for use. A procedure like this likely will list out the specific sources that CTI is obtained from, how it is ingested into tools or storage, who is responsible for analysis and on what frequency, and how analysis is performed.

**Cyberthreat Intelligence Implementation**: As a follow-on to the previous CTI process, a process or SOP should also be in place that describes what is done with CTI after it is analyzed and refined for use. This procedure would likely describe how the refined CTI is further reviewed to perform threat modeling, prioritize the threats, and also how indicators of compromise (IOCs) or other technical CTI information is distributed to other security tools to inform signature-based detection.

### Department

When creating a CTI program in an organization, one consideration to think about is what department it will belong in. I believe the CTI team should be a component of the information security department, or the information technology (IT) department if this is where the security team exists. However, as long as the CTI team has the resources to complete their mission, I don’t think the department they are housed within matters too much. If a CTI team has the skilled personnel, necessary training, tools, and processes in place, then the department they are a part of should not have much impact on their performance.

## CTI Types

There are three types of CTI that include strategic, tactical, and operational cyberthreat intelligence.

### Strategic CTI

Strategic cyberthreat intelligence is focused on the bigger picture of planning and creating strategy. Strategic CTI is generally very risk-focused in nature and might include high-level threat modeling around known threat types to an overall industry or organizational archetype. Strategic CTI would typically be used for discussion with executives or planning for someone like a chief information security officer (CISO). An example might be that certain threats are being seen to target the aviation industry, so a CISO in the aviation industry invests more into securing against these known threats.

### Tactical CTI

Tactical cyberthreat intelligence is usually specific details about known threats and their known tactics, techniques, and procedures (TTPs). This type of CTI is much more actionable than strategic CTI in the short term because it describes what types of threats are active to defend against. The best example of tactical CTI is the [MITRE ATT&CK matrix](https://attack.mitre.org/) and all of the TTPs laid out by the framework. This tactical CTI is actionable by proactively finding ways to defend against these known TTPs. Higher-level members of a security team or security engineers are those who are most likely to interact with tactical CTI.

### Operational CTI

Operational cyberthreat intelligence is the lowest level of CTI that is the most useful and actionable of all types. Operational CTI often comes in the form of IOCs like file hashes, domains, URLs, and IP addresses that action can be taken on right away. Usually, these IOCs that are a form of operational CTI are configured on security tools like SIEMs and firewalls to take immediate action against the known threats in real-time. A security operations center (SOC) is most likely to use operational CTI to respond to threats.

## CTI Tools

### API Feeds

One tool used in the field of CTI is threat feeds that typically come in the form of a web-based API. Subscribers of these threat feeds are given credentials that allow them to authenticate to APIs that they can receive real-time threat intelligence from. Often, threat intelligence coming from these API feeds will be operational CTI like IOCs and other technical information that can be streamed directly into security tools. These threat feeds overall help to automate and improve the quality of security tools through providing them with up-to-date threat intelligence as soon as it is made available by the feed provider.

One example of API feeds are those made available by [threatintelligenceplatform.com](https://threatintelligenceplatform.com/threat-intelligence-api) that starts at around $15 a month for a feed.

### CTI Platforms

Another tool used in the field of CTI is a cyberthreat intelligence platform. A CTI platform usually serves as a tool where all things CTI can be stored, analyzed, and based from. One of the key features of a CTI platform is the aggregation of CTI sources like multiple threat feeds mentioned above. This CTI can then be shared out of the platform in human-readable formats or streamed directly to security tools that can use the CTI information further.

An example of a CTI platform is [Cyware’s Situational Awareness Platform](https://cyware.com/cyber-security-situational-awareness-platform-csap) (CSAP) that requires a request to obtain the cost.

## ISACs

ISACs are information sharing and analysis centers that were formed for collecting and distributing CTI feeds to their member organizations which are typically divided into specific sectors and industries. Most ISACs have a cost or other requirements associated with joining them. Even with the cost, organizations like to join ISACs for the specific CTI information tailored to the industry they are in. An ISAC might have exclusive CTI or CTI available faster than public mediums, making them valuable to organizations that want to respond to threats as soon as possible.

### RE-ISAC

The RE-ISAC is the real estate ISAC focused on threat intelligence for the real estate and broader sectors. The RE-ISAC helps members in the hotel, retail, commercial building, and resorts industries stay up to date on the latest threats to their business. The main requirement to join the RE-ISAC is a $5,000 [annual fee](https://www.reisac.org/about-the-isac/join) for corporate members, $15,000 for regional trade organizations, and $20,000 for national trade organizations.

### Space ISAC

The Space ISAC is the ISAC focused on threats to all organizations within the space industry, like the name suggests. This involves all of the space industry from the supply chain to massive corporations in the sector. The [primary goal of the Space ISAC](https://s-isac.org/about-us/) is to protect the space sector and reduce operational costs through the sharing of threat intelligence, analyzing trends, and conducting training. The space ISAC has four membership tiers available to join, with the lowest costing $2,500 a year and the highest at $50,000 a year.

## More

Thank you for reading my post about cyberthreat intelligence! Be sure to check out my other and future [posts about CTI](/notes?tag=threatintelligence).

## References

Bautista, W. (2018). *Practical cyber intelligence*. Packt Publishing.

Costa, J. (2022, August 30). *Three Types of Cyber Threat Intelligence*. Malware Patrol. Retrieved October 19, 2022, from  
https://www.malwarepatrol.net/three-types-of-cyber-threat-intelligence/

Cyware Labs. (n.d.). *CSAP*. Cyware Labs. Retrieved October 19, 2022, from [https://cyware.com/cyber-security-situational-awareness-platform-csap](https://cyware.com/cyber-security-situational-awareness-platform-csap)

National Council of ISACs. (n.d.). *Member ISACS*. National Council of ISACs. Retrieved October 19, 2022, from  
https://www.nationalisacs.org/member-isacs-3

Real Estate Information Sharing and Analysis Center. (n.d.). REISAC. Retrieved October 19, 2022, from [https://www.reisac.org/](https://www.reisac.org/)

Space ISAC. (2022, September 21). *Space information sharing and analysis center*. Space ISAC. Retrieved October 19, 2022, from [https://s-isac.org/](https://s-isac.org/)

Talent.com. (n.d.). *Threat Intelligence Engineer salary in USA — average salary*. Talent.com. Retrieved October 19, 2022, from  
https://www.talent.com/salary?job=threatintelligenceengineer
