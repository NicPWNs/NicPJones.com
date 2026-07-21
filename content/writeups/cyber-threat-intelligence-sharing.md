---
title: "Cyber Threat Intelligence Sharing"
date: 2022-10-16
slug: cyber-threat-intelligence-sharing
excerpt: "Why organizations share cyber threat intelligence (CTI), trading threat-actor profiles and indicators of compromise to defend faster, and how sharing works."
source: https://medium.com/@NicPWNs/cyber-threat-intelligence-sharing-270c7d184baa?source=rss-57a2a039424d------2
tags: ["threatintelligence"]
---

Cyber threat intelligence (CTI) sharing is the process of sharing CTI like threat actor profiles and indicators of compromise between organizations, especially those within the same industry. CTI sharing promotes the exchange of this information between like-minded organizations to make an entire sector more secure as a whole.

![Colored network nodes linked across a map of the United States, representing cyber threat intelligence sharing](/writeups/cyber-threat-intelligence-sharing/img-1.jpg)

## ISACs

Information Sharing and Analysis Centers (ISACs) are a primary method of facilitating CTI sharing. ISACs are organizations formed for collecting and distributing CTI feeds to their member organizations which are typically divided into specific sectors and industries. For example, there is an aviation ISAC, an automotive ISAC, a real estate ISAC, and many more. ISACs are extremely beneficial to an organization because a direct feed from the ISAC can be obtained for the latest CTI, tailored to their industry. This also includes CTI that was provided directly by other ISAC members with the same interests. CTI available via ISAC feeds may even be somewhat private and would not have been as easily obtainable for an organization.

### National Defense ISAC

![National Defense ISAC logo](/writeups/cyber-threat-intelligence-sharing/img-2.png)

The [National Defense ISAC](https://ndisac.org/) is the ISAC available for organizations within the Defense Industrial Base (DIB). The cost to join this ISAC is not publicly available but an inquiry must first be submitted. Only those who meet specific criteria listed on [their website](https://ndisac.org/who-can-join/) like critical suppliers to the DIB or contractors to the DoD can be eligible to join. The benefits of joining the National Defense ISAC are access to threat intelligence, peer-to-peer collaboration platform, best practices information, alerts and notifications relevant to the industry, training opportunities, and many more.

## APT19 Threat Actor

Let’s take a look at another threat actor relevant to the United States Defense Industrial Base, APT19. APT 19, also known as Codoso, is a Chinese-based threat actor that targets many industries, including the defense industry.

One attack performed by APT19 was an attack on Forbes.com in November 2014 where they compromised the website to use as a watering hole. They infected the Forbes “thought of the day” widget on the website with malware designed to take advantage of an Adobe Flash zero-day vulnerability. Users visiting the site would then drive-by-download the malware when visiting the website. The main goal of this attack was to target the defense industry.

Another attack performed by APT19 against organizations in the telecommunications, legal services, and education industries. Although these industries are not relevant to the DIB, the attack still provides CTI about the capabilities of the threat. In this case, APT19 performed similar actions using compromised websites to host malware side-loaded with a real signed executable. This malware was custom in nature but fairly generic, and seemed to have the purpose of gaining access to systems for further attacks in the future.

### IOCs

**Hashes**

3ea6b2b51050fe7c07e2cf9fa232de6a602aa5eff66a2e997b25785f7cf50daa  
3577845d71ae995762d4a8f43b21ada49d809f95c127b770aff00ae0b64264a3  
ea67d76e9d2e9ce3a8e5f80ff9be8f17b2cd5b1212153fdf36833497d9c060c0  
de33dfce8143f9f929abda910632f7536ffa809603ec027a4193d5e57880b292  
b690394540cab9b7f8cc6c98fd95b4522b84d1a5203b19c4974b58829889da4c  
de984eda2dc962fde75093d876ec3fe525119de841a96d90dc032bfb993dbdac  
ccf87057a4ab02e53bff5828d779a6e704b040aef863f66e8f571638d7d50cd2

**Domains**

[www.jbossas.org](http://www.jbossas.org)  
supermanbox.org  
www.supermanbox.org  
www.microsoft-cache.com

**IP Addresses**

121.54.168.230  
218.54.139.20  
210.181.184.64  
42.200.18.194

## YARA Rule

Below is a custom made YARA rule I developed to recognize some of the IOCs related to APT19 and their tools listed above.

```
import "hash"
rule APT19 {
 meta:

 description = "Recognize potential APT19 Malware activity."
 condition:

 uint16(0) == 0x5A4D and
 hash.sha256(0, filesize) == "3ea6b2b51050fe7c07e2cf9fa232de6a602aa5eff66a2e997b25785f7cf50daa" or
 hash.sha256(0, filesize) == "3577845d71ae995762d4a8f43b21ada49d809f95c127b770aff00ae0b64264a3" or
 hash.sha256(0, filesize) == "ea67d76e9d2e9ce3a8e5f80ff9be8f17b2cd5b1212153fdf36833497d9c060c0" or
 hash.sha256(0, filesize) == "de33dfce8143f9f929abda910632f7536ffa809603ec027a4193d5e57880b292" or
 hash.sha256(0, filesize) == "b690394540cab9b7f8cc6c98fd95b4522b84d1a5203b19c4974b58829889da4c" or
 hash.sha256(0, filesize) == "de984eda2dc962fde75093d876ec3fe525119de841a96d90dc032bfb993dbdac" or
 hash.sha256(0, filesize) == "ccf87057a4ab02e53bff5828d779a6e704b040aef863f66e8f571638d7d50cd2"
}
```

## More

Thank you for reading my post about cyberthreat intelligence! Be sure to check out my other and future [posts about CTI](/notes?tag=threatintelligence).

## References

Bautista, W. (2018). *Practical cyber intelligence: How action-based intelligence can be an effective response to incidents;how action-based*  
*intelligence can be an*. PACKT Publishing.

Chickowski, E. (2015, February 10). *Chinese Hacking Group Codoso team uses Forbes.com as watering hole*. Dark Reading. Retrieved October 14,  
2022, from [https://www.darkreading.com/attacks-breaches/chinese-hacking-group-codoso-team-uses-forbes-com-as-watering-hole](https://www.darkreading.com/attacks-breaches/chinese-hacking-group-codoso-team-uses-forbes-com-as-watering-hole)

Grunzweig, J. (2016, January 22). *New attacks linked to C0d0so0 group*. Unit 42. Retrieved October 14, 2022, from  
[https://unit42.paloaltonetworks.com/new-attacks-linked-to-c0d0s0-group/](https://unit42.paloaltonetworks.com/new-attacks-linked-to-c0d0s0-group/)

MITRE. (n.d.). *APT19*. APT19, Codoso, C0d0so0, Codoso Team, Sunshop Group, Group G0073 | MITRE ATT&CK®. Retrieved October 14, 2022, from  
[https://attack.mitre.org/groups/G0073/](https://attack.mitre.org/groups/G0073/)

National Defense ISAC. (2022, February 18). *National Defense Information Sharing and Analysis Center (NDISAC)*. National Defense ISAC. Retrieved  
October 14, 2022, from [https://ndisac.org/](https://ndisac.org/)
