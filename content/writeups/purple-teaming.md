---
title: "Purple Teaming"
date: 2022-10-16
slug: purple-teaming
excerpt: "What purple teaming is and why it works: red and blue teams collaborating to improve security, with a worked example against the threat actor APT27."
source: https://medium.com/@NicPWNs/purple-teaming-2af5e5cab617?source=rss-57a2a039424d------2
tags: ["threatintelligence"]
---

Purple Teaming is a concept where both red and blue teams within an organization work closely together for better security. The improvement to an organization’s security through purple teaming comes from continuous collaboration, knowledge sharing, and feedback with one another. Purple teaming can be seen as one-time events or a continuous effort within an organization.

![A hand from a blue side and a hand from a red side reaching toward a glowing portal, representing red and blue teams forming a purple team](/writeups/purple-teaming/img-1.png)

## Red & Blue

As the name suggests, purple teaming is the combination of both red (attack) and blue (defense) teams within an organization. So how is purple teaming different from both of these teams independently?

In traditional red teaming, a team is focused on offensive capabilities against their target organization for the purpose of identifying vulnerabilities, testing the response of the blue team, and confirming patching of previously found weaknesses. This often includes concepts like adversary emulation and penetration testing.

In blue teaming, a team, or usually the security operations center (SOC) is focused on the regular security operations of an organization. This usually includes security analysis, incident detection, incident response, and vulnerability management.

Even in an organization where both of these teams are present and functioning independently, the full value of purple teaming is not fully realized. Purple teaming needs the active collaboration between the red and blue teams in a series of processes to perform knowledge transfer and conduct exercises to improve an organization’s overall security capability. With effective purple teaming, recurring cooperation between the red and blue team happens to keep each team accountable and productive.

## Relevant Threat Actor APT27

Like in previous blog posts, let’s look at another threat actor relevant to the United States Defense Industrial Base (DIB). Then we can use this threat actor as an example for how purple teaming could be effective.

[APT27](https://attack.mitre.org/groups/G0027/) is a Chinese-based threat actor that generally uses compromise of websites to target their victims. The group has been active since 2010 and targets many sectors including government, aerospace, defense, energy, and gambling.

One of APT27’s [attacks in 2017](https://thehackernews.com/2018/06/chinese-watering-hole-attack.html) targeted a national datacenter where malicious code was injected into government websites to facilitate a watering hole attack. This caused systems to be compromised with malware called [HyperBro](https://attack.mitre.org/software/S0398/) which is a remote access trojan (RAT). This malware facilitated further keylogging, browser exploitation, and command and control (C2).

Another of APT27’s [attacks](https://www.secureworks.com/research/threat-group-3390-targets-organizations-for-cyberespionage) made use of [PlugX](https://attack.mitre.org/software/S0013/), a C2 tool that uses DLL side-loading on a compromised system. This also made use of [ChinaChopper](https://attack.mitre.org/software/S0020/), a web-based shell that allows for code execution on a compromised system. The attacks using these tools primarily targeted manufacturing companies in the DIB and embassies in Washington D.C.

### Purple Teaming APT27

APT27 is a threat actor group with clear evidence of targeting manufacturing companies in the defense industrial base, which makes them the perfect example of a threat to look out for if in this sector. When a specific threat actor is in mind, purple teaming is a great process to use to prepare against APT27 tactics and techniques, or similar.

To employ purple teaming with a focus on APT27, the red and blue teams of an organization would want to meet to identify the tactics and techniques relevant to their organization. After identifying these issues and determining objectives for the purple team, the activities can begin. The red team should research and attempt to emulate APT27’s capabilities and behavior, while the blue team researches and attempts to protect and harden their systems against the known adversarial behavior. After a series of live exercises or continuous engagement, the teams should regularly meet and transfer knowledge about what they discovered, what was successful, and how they can improve the organization’s security as a whole.

### APT27 IOCs

**Hashes**

1cb4b74e9d030afbb18accf6ee2bfca1  
b333b5d541a0488f4e710ae97c46d9c2  
014122d7851fa8bf4070a8fc2acd5dc5  
b313bbe17bd5ee9c00acff3bfccdb48a  
f7a842eb1364d1269b40a344510068e8

**Domains**

american.blackcmd.com  
api.apigmail.com  
dav.local-test.com  
navydocument.com

**IP Addresses**

66.63.178.142  
208.115.242.36  
74.63.195.236  
106.187.45.162

### YARA Rule

Below is a custom made YARA rule I developed to recognize some of the IOCs related to APT27 and their tools listed above.

```
import "hash"
rule APT27 {
 meta:

 description = "Recognize potential APT27 Malware activity."
 condition:

 uint16(0) == 0x5A4D and
 hash.md5(0, filesize) == "1cb4b74e9d030afbb18accf6ee2bfca1" or
 hash.md5(0, filesize) == "b333b5d541a0488f4e710ae97c46d9c2" or
 hash.md5(0, filesize) == "014122d7851fa8bf4070a8fc2acd5dc5" or
 hash.md5(0, filesize) == "b313bbe17bd5ee9c00acff3bfccdb48a" or
 hash.md5(0, filesize) == "f7a842eb1364d1269b40a344510068e8"
}
```

## More

Thank you for reading my post about cyberthreat intelligence! Be sure to check out my other and future [posts about CTI](/notes?tag=threatintelligence).

## References

The Hacker News. (2018, June 14). *Chinese hackers carried out country-level watering hole attack*. The Hacker News. Retrieved October 14, 2022,  
from [https://thehackernews.com/2018/06/chinese-watering-hole-attack.html](https://thehackernews.com/2018/06/chinese-watering-hole-attack.html)

MITRE. (n.d.). *Threat group-3390*. Threat Group-3390, Earth Smilodon, TG-3390, Emissary Panda, BRONZE UNION, APT27, Iron Tiger, LuckyMouse,  
Group G0027 | MITRE ATT&CK®. Retrieved October 14, 2022, from [https://attack.mitre.org/groups/G0027/](https://attack.mitre.org/groups/G0027/)

*Purple teaming: Combined Red & Blue Team Security Testing*. Nettitude INC. (2022, October 11). Retrieved October 14, 2022, from  
[https://www.nettitude.com/us/penetration-testing/purple-teaming/](https://www.nettitude.com/us/penetration-testing/purple-teaming/)

Secureworks. (2015, August 5). *Threat group-3390 targets organizations for Cyberespionage*. Secureworks. Retrieved October 14, 2022, from  
[https://www.secureworks.com/research/threat-group-3390-targets-organizations-for-cyberespionage](https://www.secureworks.com/research/threat-group-3390-targets-organizations-for-cyberespionage)
