---
title: "MITRE Frameworks"
date: 2022-10-16
slug: mitre-frameworks
excerpt: "MITRE ATT&amp;CK has become a major centerpiece of the cyber security industry over recent years. In addition to MITRE ATT&amp;CK, there are other similar\u2026"
source: https://medium.com/@NicPWNs/mitre-frameworks-b17ef7235b0a?source=rss-57a2a039424d------2
tags: ["threatintelligence"]
---

MITRE ATT&CK has become a major centerpiece of the cyber security industry over recent years. In addition to MITRE ATT&CK, there are other similar matrix frameworks made by MITRE that can be used in addition to ATT&CK to improve cybersecurity operations with cyber threat intelligence.

![MITRE Frameworks](/writeups/mitre-frameworks/img-1.png)

*MITRE ATT&CK Matrix*

## MITRE ATT&CK

![](/writeups/mitre-frameworks/img-2.png)

[MITRE ATT&CK](https://attack.mitre.org/) is an open-source collection of known cyber adversary tactics, techniques, and procedures (TTPs). MITRE ATT&CK is visualized in the form of a matrix where the tactics are the high-level goals of an adversary, techniques are the methods in which the tactics are achieved, and procedures are the specific tools or steps followed to perform a technique. MITRE ATT&CK also maps the TTPs to other forms of cyber threat intelligence (CTI) like software and threat actor groups. Generally, MITRE ATT&CK is often used as a common language between tools and organizations when discussing how attacks are performed and mitigated.

## MITRE Engage

![](/writeups/mitre-frameworks/img-3.png)

[MITRE Engage](https://engage.mitre.org/matrix/), formerly known as [MITRE SHIELD](https://shield.mitre.org/resources/downloads/Introduction_to_MITRE_Shield.pdf), is similar to MITRE ATT&CK with a matrix format, but the Engage framework is a knowledgebase of active defense TTPs. Active cyber defense is different from traditional systems security in that it involves active tactics such as cyber deception and disruption to stop attacks. Some of the high-level tactics of the MITRE Engage framework include detect, direct, disrupt, reassure, and motivate. Some techniques for disruption include lures like honeypots or [canary tokens](https://canarytokens.org/generate). MITRE Engage can also be filtered against relevant ATT&CK TTPs.

## MITRE D3FEND

![](/writeups/mitre-frameworks/img-4.png)

[MITRE D3FEND](https://d3fend.mitre.org/) is another matrix-formatted framework that focuses on more traditional cyber defense TTPs. D3FEND includes the primary tactics of harden, detect, isolate, deceive, and evict. These include traditional defensive technique capabilities like disk encryption, file hashing, URL analysis, DNS denylisting, and many more. In comparison with MITRE Engage, MITRE D3FEND seems to be a much smaller project with much less focus on active defense countermeasures. Although D3FEND does have a small section of the matrix dedicated to deception, MITRE Engage is the better framework for those types of defenses.

## Threat Actor Examples

### Example Organization

For the purposes of the following examples, we’ll be focusing on a fake company named *Strong Manufacturing*. Strong Manufacturing primarily manufactures technology focused items, but they are looking to expand into manufacturing for government contracts. They act as a manufacturer-for-contract solely, so they contain many proprietary schematics for a variety of companies. This makes Strong Manufacturing part of the Defense Industrial Base (DIB) sector in the United States.

### Relevant Threat Actors  
  
Ajax Security Team

[Ajax Security Team](https://attack.mitre.org/groups/G0130/) is a threat actor group operating out of Iran since 2010. They target the DIB in the United States and they have about five known techniques mapped between MITRE ATT&CK and MITRE Engage.

### Leviathan

[Leviathan](https://attack.mitre.org/groups/G0065/) is a threat actor group attributed to Chinese state-sponsored activity and has also been known as APT40. They also target the DIB in the United States and have many associated techniques.

### APT17

[APT17](https://attack.mitre.org/groups/G0025/) is another China-based threat actor group that targets the United States DIB. This threat actor has only a couple known techniques, but their one attack method is very interesting.

### More about APT17

[APT17](https://attack.mitre.org/groups/G0025/) has also been known as Deputy Dog. The main knowledge about their attacks is that they make use of [Microsoft TechNet profile pages as their command and control (C2) infrastructure](https://www2.fireeye.com/rs/fireye/images/APT17_Report.pdf). They have put a lot of effort into making these profiles look legitimate, to then hide in plain sight to make use of the TechNet infrastructure for their operations. They then make use of malware known as [BLACKCOFFEE](https://attack.mitre.org/software/S0069/) which provides a shell and methods for enumeration and exfiltration on target systems. This attack method is currently their only known capability.

### APT17 IOCS

The following are some of the [IOCs for BLACKCOFEE](https://github.com/mandiant/iocs/blob/master/APT17/7b9e87c5-b619-4a13-b862-0145614d359a.ioc), the malware used by APT17.

**Hashes:**

de56eb5046e518e266e67585afa34612  
195ade342a6a4ea0a58cfbfb43dc64cb  
4c21336dad66ebed2f7ee45d41e6cada  
0370002227619c205402c48bde4332f6  
ac169b7d4708c6fa7fee9be5f7576414

**Domains:**

translate.wordraference.com  
news.jusched.net

**IP Addresses:**

130.184.156.62  
69.80.72.165  
110.45.151.43  
121.101.73.231  
103.250.72.39

### YARA Rule

Below is a custom made YARA rule I developed to recognize some of the IOCs related to APT17 and their tools listed above.

```
import "hash"

rule APT17 {

 meta:
 description = "Recognize potential APT17 BLACKCOFEE activity."

 condition:
 uint16(0) == 0x5A4D and
 hash.md5(0, filesize) == "de56eb5046e518e266e67585afa34612" or
 hash.md5(0, filesize) == "195ade342a6a4ea0a58cfbfb43dc64cb" or
 hash.md5(0, filesize) == "4c21336dad66ebed2f7ee45d41e6cada" or
 hash.md5(0, filesize) == "0370002227619c205402c48bde4332f6" or
 hash.md5(0, filesize) == "ac169b7d4708c6fa7fee9be5f7576414"
}
```

## More

Thank you for reading my post about cyberthreat intelligence! Be sure to check out my other and future [posts about CTI](/notes?tag=threatintelligence).

## References

FireEye. (2015, May). *HIDING IN PLAIN SIGHT: FIREEYE AND MICROSOFT EXPOSE OBFUSCATION TACTIC*. Retrieved October 14, 2022, from  
[https://www2.fireeye.com/rs/fireye/images/APT17\_Report.pdf](https://www2.fireeye.com/rs/fireye/images/APT17_Report.pdf)

MITRE. (n.d.). D3FEND Matrix. Retrieved October 14, 2022, from [https://d3fend.mitre.org/](https://d3fend.mitre.org/)

MITRE. (n.d.). *Mitre ATT&CK®*. MITRE ATT&CK®. Retrieved October 14, 2022, from [https://attack.mitre.org/](https://attack.mitre.org/)

MITRE. (n.d.). *MITRE Engage*. MITRE Engage™. Retrieved October 14, 2022, from [https://engage.mitre.org/matrix/](https://engage.mitre.org/matrix/)
