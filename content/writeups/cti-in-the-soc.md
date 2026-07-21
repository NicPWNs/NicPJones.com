---
title: "CTI in the SOC"
date: 2022-10-03
slug: cti-in-the-soc
excerpt: "How cyber threat intelligence (CTI) supports a security operations center (SOC), enriching detection, incident response, and decision-making with real context."
source: https://medium.com/@NicPWNs/cti-in-the-soc-154d3cd1accc?source=rss-57a2a039424d------2
tags: ["threatintelligence"]
---

Cyberthreat intelligence (CTI) is a very important component of any organization’s security operations center (SOC). A SOC usually handles many facets of security detection, analysis, and response, so CTI helps inform these processes to make them more effective.

![SOC](/writeups/cti-in-the-soc/img-1.png)

## Informing SOC Operations

There are varying types of CTI. Some that help inform SOC operations are indicators of compromise (IOCs) and threat profiles.

### Indicators of Compromise

IOCs are specific technical indicators that an attempted attack or compromise is present within an environment. Some categories of IOCs include file hashes, IP addresses, domains, and URLs. A SOC can use all of these types of IOCs to build detections and alerts around known malicious signatures. If a SOC is able to identify any malicious IOCs within the environment being monitored, they will know to take quick action, as this activity is likely to be malicious in nature and is less likely to be a false positive.

### Threat Actor Profiles

Another category of CTI that assists SOC operations are threat actor profiles. Threat actor profiles are full catalogs of threat actors and their known tactics, techniques, and procedures (TTPs). A SOC can use threat actor profiles to plan and secure their systems against specific threat actors that they believe they might be a target for. A SOC can also reactively use threat profiles when responding to incidents to potentially identify compromise through already known threat actor behaviors. [MITRE ATT&CK’s Groups page](https://attack.mitre.org/groups/) is a commonly used source of threat actor profiles. For example, [APT33](https://attack.mitre.org/groups/G0064/), a specific threat actor, has been known to use a tool called [DarkComet](https://attack.mitre.org/software/S0334/) for persistence on their targets. A SOC can use this information to look out for DarkComet on their systems or search for it if they believe they have been attacked by APT33.

## APT33

We can take a look at APT33 to understand more about their threat actor profile and all of the CTI related to them. APT33 is a threat actor group attributed to Iran that has been in operation since 2013. The group tends to target aviation and energy industries in the United States, Saudi Arabia, and South Korea. APT33 has also been known as HOLMIUM and Elfin.

### APT33 Attack History

APT33 does not have any extremely high-profile attacks attributed to them, but rather a series of attack campaigns over the years.

\- In 2016 and 2017, APT33 specifically targeted many aviation related companies. In these attacks they made use of spear phishing attacks with malicious files attached. The emails were mostly themed around job position vacancies.  
  
\- In the late 2017 and 2018 timeframe, APT33 started targeting engineering industries with a different attack vector. In these cases, APT33 made use of stolen credentials to compromise end users through their email clients. These stolen credentials were likely acquired from public data breaches.  
  
\- A bit more recent campaign in June 2019 targeted many U.S. organizations with spear phishing, including federal agencies. These attacks used infection methods from an internally developed tool.

## APT33 Software IOCs

Some of the best IOCs to recognize APT33 behavior are to identify the presence of the many malicious tools they use.

### DarkComet

DarkComet has many different IOCs including IP addresses, file hashes, and domains. Rather than listing them here, they can be found in [AlienVault’s Open Threat Exchange](https://otx.alienvault.com/pulse/5996c52b91b7a90781f83fc1).

### StoneDrill

StoneDrill also has many different IOCs including IP addresses, file hashes, and domains. Rather than listing them here, they can be found in [AlienVault’s Open Threat Exchange](https://otx.alienvault.com/pulse/58bd8ff2f6a7975cc9a1138d/).

### POWERTON

POWERTON has one primary IOC in the form of an MD5 [file hash](https://otx.alienvault.com/indicator/file/e2d60bb6e3e67591e13b6a8178d89736): e2d60bb6e3e67591e13b6a8178d89736.

## APT33 YARA Rule

Below is a custom made YARA rule I developed to recognize a majority of the IOCs related to APT33 and their tools listed above.

```
import "hash"
rule APT33 {
 meta:

 description = "Recognize potential APT33 activity."
 condition:

 uint16(0) == 0x5A4D and

 hash.md5(0, filesize) == "e2d60bb6e3e67591e13b6a8178d89736" or

 hash.md5(0, filesize) == "e5b4359a3773764a372173074ae9b6bd" or

 hash.md5(0, filesize) == "e55564594dad16a2ca19fb85903b9300" or

 hash.md5(0, filesize) == "cd30ca2b6ff5111155dec94ee29ec186" or

 hash.md5(0, filesize) == "d01781f1246fd1b64e09170bd6600fe1" or

 hash.md5(0, filesize) == "ac3c25534c076623192b9381f926ba0d"

}
```

## More

Thank you for reading my post about cyberthreat intelligence! Be sure to check out my other and future [posts about CTI](/notes?tag=threatintelligence).

## References

AlienVault. (n.d.). *Alienvault — Open Threat Exchange*. AlienVault Open Threat Exchange. Retrieved October 3, 2022, from [https://otx.alienvault.com/](https://otx.alienvault.com/)

Bautista, W. (2018). *Practical cyber intelligence: How action-based intelligence can be an effective response to incidents;how action-based*  
*intelligence can be an*. PACKT Publishing.

MITRE. (n.d.). *APT33*. APT33, HOLMIUM, Elfin, Group G0064 | MITRE ATT&CK®. Retrieved October 3, 2022, from  
[https://attack.mitre.org/groups/G0064/](https://attack.mitre.org/groups/G0064/)

MITRE. (n.d.). *Darkcomet*. DarkComet, Software S0334 | MITRE ATT&CK®. Retrieved October 3, 2022, from [https://attack.mitre.org/software/S0334/](https://attack.mitre.org/software/S0334/)

MITRE. (n.d.). *Powerton*. POWERTON, Software S0371 | MITRE ATT&CK®. Retrieved October 3, 2022, from [https://attack.mitre.org/software/S0371/](https://attack.mitre.org/software/S0371/)

MITRE. (n.d.). *Stonedrill*. StoneDrill, Software S0380 | MITRE ATT&CK®. Retrieved October 3, 2022, from [https://attack.mitre.org/software/S0380/](https://attack.mitre.org/software/S0380/)

MITRE. (n.d.). *Turnedup*. TURNEDUP, Software S0199 | MITRE ATT&CK®. Retrieved October 3, 2022, from [https://attack.mitre.org/software/S0199/](https://attack.mitre.org/software/S0199/)
