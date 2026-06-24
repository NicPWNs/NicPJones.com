---
title: "Vim-timidation: Don’t Be Scared of Vim"
date: 2022-04-19
slug: vim-timidation-dont-be-scared-of-vim
excerpt: "Have you ever found yourself on a Linux terminal without Nano or another GUI text editor to save you from Vim? Maybe you’ve found yourself in Vim with no…"
source: https://blog.nicpwns.com/vim-timidation-dont-be-scared-of-vim-ad8c1d1ba7d
tags: ["linux"]
---

<h4>How to use Vim</h4>
<p>Have you ever found yourself on a Linux terminal without Nano or another GUI text editor to save you from Vim? Maybe you’ve found yourself in Vim with no escape? Or maybe you know the basics of Vim but still run into keystroke issues that make you “:q!” and start over again. Whatever your relationship with Vim is, I’d like to cover the most fundamental and useful tips with you here. Let’s get text editing!</p>
<figure><img src="/writeups/vim-timidation-dont-be-scared-of-vim/img-1.png" alt="Vim logo." /></figure>
<h3>Vim Overview</h3>
<p>Vim is a text editor that can be found on most Linux systems and has a reputation for being difficult to use due to being a keyboard-only application. Vim stands for “Vi iMproved” because Vim inherits most of the original Vi text editor’s keystrokes and takes the editor to the next level. Vim uses a combination of modes, shortcut keystrokes, and commands to allow you to code and edit configurations all day without touching your mouse!</p>
<h3>Opening Vim</h3>
<p>You usually will not need to install Vim as it usually comes installed by default on most Linux distributions.</p>
<p><strong>Open an empty Vim editor:</strong></p>
<pre><code>nicpwns@NIC-PC:~$ vim</code></pre>
<p><strong>Open an existing or new file in Vim:</strong></p>
<pre><code>nicpwns@NIC-PC:~$ vim MyFile.txt</code></pre>
<h3>Modes in Vim</h3>
<h4>Normal Mode</h4>
<p>Normal mode is the neutral mode you are placed into when first opening Vim. This is where most of the keyboard shortcuts referenced below will be used. From normal mode, the other modes like insert and command mode can be entered. You can always return to normal mode by hitting <code>[esc]</code>.</p>
<h4>Insert Mode</h4>
<p>Insert mode can be entered by pressing the <code>i</code> key from normal mode. Insert mode is the mode used for normal text editing and formatting. But remember, a mouse doesn't work with Vim, so you'll have to use the arrow keys and other shortcuts to navigate the text you are editing.</p>
<h4>Command Mode</h4>
<p>Command mode can be initiated by entering <code>:</code> from normal mode. This opens a command bar at the bottom of Vim for commands to be entered. Commands in Vim are used for actions like saving, quitting, and configuring the editor. Commands are entered directly after the ":" in the command bar and pressing <code>[Enter]</code> runs them.</p>
<h4>Visual Mode</h4>
<p>Visual mode can be activated by pressing <code>v</code> from normal mode. Visual mode is primarily used for text selection, like highlighting text to perform further operations on it. Visual mode replaces the typical click and drag that would be performed with a mouse.</p>
<h3>Keyboard Shortcuts in Vim</h3>
<p>Keyboard shortcuts are used in normal mode. These are mostly for navigation and basic text manipulation.</p>
<ul><li><code>i</code> - Enter insert mode. (before the highlighted character)</li><li><code>v</code> - Enter visual mode.</li><li><code>:</code> - Enter command mode.</li><li><code>/</code> - Enter regex command mode.</li><li><code>[esc]</code> - Return to normal mode.</li><li><code>🡄 </code>or h<code> </code>- Move the cursor left.</li><li><code>🡇 </code>or j<code> </code>- Move the cursor down.</li><li><code>🡅 </code>or k<code> </code>- Move the cursor up.</li><li><code>🡆 </code>or l<code> </code>- Move the cursor right.</li><li><code>x</code> - Delete the highlighted character.</li><li><code>p</code> - Paste content of current buffer.</li><li><code>dd</code> - Delete the entire line.</li><li><code>u</code> - Undo the last change.</li><li><code>[ctrl] + r</code> - Redo the last undo.</li><li><code>I</code> - Insert at the front of the line.</li><li><code>a</code> - Insert after the highlighted character.</li><li><code>A</code> - Insert at the end of the line.</li><li><code>o</code> - Insert at the line below.</li><li><code>y</code> - Copy. (<em>yank</em>)</li><li><code>d</code> - Cut. (<em>delete</em>)</li><li><code>p</code> - Paste. (<em>put</em>)</li></ul>
<h3>Commands in Vim</h3>
<p>Commands are used to modify and configure the current file and editor instance. Most begin by entering a colon <code>:</code>.</p>
<ul><li><code>:q</code> - Quit the Vim editor.</li><li><code>:q!</code> - Force quit the Vim editor. (If changes have been made)</li><li><code>:w</code> - Write/save the current file.</li><li><code>:w file.txt</code> - Write/save the current file as a specified name.</li><li><code>:wq</code> - Write and quit the current file.</li><li><code>:x</code> - Shortcut for ":wq".</li><li><code>:set</code> number - Turn on line numbers.</li><li><code>:#</code> - Jump to specified line number.</li><li><code>:h</code> or <code>:help</code> - Open <a href="https://vimhelp.org/">Vim help text</a>.</li><li><code>/word</code> - Search for a specific word. Press / again to jump to next occurrence.</li><li><code>:%s/word/replacement/g</code> - Substitute all occurrences of a word with a replacement.</li></ul>
<h3>Bonus</h3>
<h4>Vimdiff</h4>
<p><a href="https://linux.die.net/man/1/vimdiff">Vimdiff</a> is a wrapper application that runs vim with special arguments to compare two files. Seeing a quick visual difference between two files can often be of great use, especially when comparing configuration files. Use vimdiff like shown below.</p>
<pre><code>nicpwns@NIC-PC:~$ vimdiff file1.conf file2.conf</code></pre>
<figure><img src="/writeups/vim-timidation-dont-be-scared-of-vim/img-2.png" alt="Vim in diff mode comparing file1.conf with file2.conf." /><figcaption>Vim in diff mode comparing file1.conf with file2.conf.</figcaption></figure>
<h4>Vimtutor</h4>
<p><a href="https://linux.die.net/man/1/vimtutor">Vimtutor</a> is a command line application that is typically installed with Vim. Vimtutor opens in Vim and prompts an interactive experience to learn the basics of Vim. It’s a great lesson to do if you’re using Vim for the first time or if you just need a refresher. Run Vimtutor easily as shown below.</p>
<pre><code>nicpwns@NIC-PC:~$ vimtutor</code></pre>
<figure><img src="/writeups/vim-timidation-dont-be-scared-of-vim/img-3.png" alt="Vimtutor after first launching." /><figcaption>Vimtutor after first launching.</figcaption></figure>
<h4>IDE Integrations</h4>
<p>Have a favorite IDE or code editor and don’t want to restrict yourself to a simple terminal? Most have a Vim mode or integration! See some below.</p>
<ul><li>Visual Studio Code — <a href="https://marketplace.visualstudio.com/items?itemName=vscodevim.vim">Vim emulation for Visual Studio Code</a></li><li>Sublime Text — <a href="https://www.sublimetext.com/docs/vintage.html">Vintage Mode</a></li><li>Eclipse — <a href="https://marketplace.eclipse.org/content/vrapper-vim">Vrapper</a></li><li>Atom — <a href="https://atom.io/packages/vim-mode-plus">vim-mode-plus</a></li><li>JetBrains IDEs — <a href="https://github.com/JetBrains/ideavim">IdeaVim</a></li></ul>
<h3>Bare Minimum</h3>
<p>If you are going to retain any information about using Vim, these are the shortcuts and commands that are worth remembering:</p>
<ul><li><code>i</code> - Enter insert mode.</li><li><code>[esc]</code> - Return to normal mode.</li><li><code>dd</code> - Delete the entire line.</li><li><code>:q!</code> - Force quit the Vim editor.</li><li><code>:x</code> - Save and quit.</li><li><code>/word</code> - Search for a specific word. Press / again to jump to next occurrence.</li><li><code>:h</code> or <code>:help</code> - Open Vim help menu.</li></ul>
<h3>You’re On Your Own</h3>
<p>Now that you’re up to speed on all facets of Vim, you can face the beast on your own. Avoid the intimidation of Vim and embrace it instead. Vim is known to improve efficiency in coding without the need of a mouse. Just <a href="https://www.youtube.com/watch?v=uGrBHohIgQY">watch this competitive programmer</a> win first place using the Vim editor! Even if you don’t decide to use Vim, now you at least know the command to exit.</p>
<figure><img src="/writeups/vim-timidation-dont-be-scared-of-vim/img-4.png" alt="I’ve been using vim for a year now, mostly because I don’t know how to exit it." /></figure>
<p>Want to make a WordPress blog? Check out my post about <a href="/notes/how-to-create-a-blog">how to create a WordPress blog</a>!</p>
