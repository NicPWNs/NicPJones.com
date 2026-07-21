---
title: "Vim-timidation: Don’t Be Scared of Vim"
date: 2022-04-19
slug: vim-timidation-dont-be-scared-of-vim
excerpt: "Stuck in Vim with no other editor? A friendly beginner's guide to Vim basics: modes, editing, saving, and quitting, so the terminal never traps you again."
source: https://blog.nicpwns.com/vim-timidation-dont-be-scared-of-vim-ad8c1d1ba7d
tags: ["linux"]
---

### How to use Vim

Have you ever found yourself on a Linux terminal without Nano or another GUI text editor to save you from Vim? Maybe you’ve found yourself in Vim with no escape? Or maybe you know the basics of Vim but still run into keystroke issues that make you “:q!” and start over again. Whatever your relationship with Vim is, I’d like to cover the most fundamental and useful tips with you here. Let’s get text editing!

![Vim logo.](/writeups/vim-timidation-dont-be-scared-of-vim/img-1.png)

## Vim Overview

Vim is a text editor that can be found on most Linux systems and has a reputation for being difficult to use due to being a keyboard-only application. Vim stands for “Vi iMproved” because Vim inherits most of the original Vi text editor’s keystrokes and takes the editor to the next level. Vim uses a combination of modes, shortcut keystrokes, and commands to allow you to code and edit configurations all day without touching your mouse!

## Opening Vim

You usually will not need to install Vim as it usually comes installed by default on most Linux distributions.

**Open an empty Vim editor:**

```
nicpwns@NIC-PC:~$ vim
```

**Open an existing or new file in Vim:**

```
nicpwns@NIC-PC:~$ vim MyFile.txt
```

## Modes in Vim

### Normal Mode

Normal mode is the neutral mode you are placed into when first opening Vim. This is where most of the keyboard shortcuts referenced below will be used. From normal mode, the other modes like insert and command mode can be entered. You can always return to normal mode by hitting `[esc]`.

### Insert Mode

Insert mode can be entered by pressing the `i` key from normal mode. Insert mode is the mode used for normal text editing and formatting. But remember, a mouse doesn't work with Vim, so you'll have to use the arrow keys and other shortcuts to navigate the text you are editing.

### Command Mode

Command mode can be initiated by entering `:` from normal mode. This opens a command bar at the bottom of Vim for commands to be entered. Commands in Vim are used for actions like saving, quitting, and configuring the editor. Commands are entered directly after the ":" in the command bar and pressing `[Enter]` runs them.

### Visual Mode

Visual mode can be activated by pressing `v` from normal mode. Visual mode is primarily used for text selection, like highlighting text to perform further operations on it. Visual mode replaces the typical click and drag that would be performed with a mouse.

## Keyboard Shortcuts in Vim

Keyboard shortcuts are used in normal mode. These are mostly for navigation and basic text manipulation.

-   `i` - Enter insert mode. (before the highlighted character)
-   `v` - Enter visual mode.
-   `:` - Enter command mode.
-   `/` - Enter regex command mode.
-   `[esc]` - Return to normal mode.
-   `🡄` or h \- Move the cursor left.
-   `🡇` or j \- Move the cursor down.
-   `🡅` or k \- Move the cursor up.
-   `🡆` or l \- Move the cursor right.
-   `x` - Delete the highlighted character.
-   `p` - Paste content of current buffer.
-   `dd` - Delete the entire line.
-   `u` - Undo the last change.
-   `[ctrl] + r` - Redo the last undo.
-   `I` - Insert at the front of the line.
-   `a` - Insert after the highlighted character.
-   `A` - Insert at the end of the line.
-   `o` - Insert at the line below.
-   `y` - Copy. (*yank*)
-   `d` - Cut. (*delete*)
-   `p` - Paste. (*put*)

## Commands in Vim

Commands are used to modify and configure the current file and editor instance. Most begin by entering a colon `:`.

-   `:q` - Quit the Vim editor.
-   `:q!` - Force quit the Vim editor. (If changes have been made)
-   `:w` - Write/save the current file.
-   `:w file.txt` - Write/save the current file as a specified name.
-   `:wq` - Write and quit the current file.
-   `:x` - Shortcut for ":wq".
-   `:set` number - Turn on line numbers.
-   `:#` - Jump to specified line number.
-   `:h` or `:help` - Open [Vim help text](https://vimhelp.org/).
-   `/word` - Search for a specific word. Press / again to jump to next occurrence.
-   `:%s/word/replacement/g` - Substitute all occurrences of a word with a replacement.

## Bonus

### Vimdiff

[Vimdiff](https://linux.die.net/man/1/vimdiff) is a wrapper application that runs vim with special arguments to compare two files. Seeing a quick visual difference between two files can often be of great use, especially when comparing configuration files. Use vimdiff like shown below.

```
nicpwns@NIC-PC:~$ vimdiff file1.conf file2.conf
```

![Vim in diff mode comparing file1.conf with file2.conf.](/writeups/vim-timidation-dont-be-scared-of-vim/img-2.png)

*Vim in diff mode comparing file1.conf with file2.conf.*

### Vimtutor

[Vimtutor](https://linux.die.net/man/1/vimtutor) is a command line application that is typically installed with Vim. Vimtutor opens in Vim and prompts an interactive experience to learn the basics of Vim. It’s a great lesson to do if you’re using Vim for the first time or if you just need a refresher. Run Vimtutor easily as shown below.

```
nicpwns@NIC-PC:~$ vimtutor
```

![Vimtutor after first launching.](/writeups/vim-timidation-dont-be-scared-of-vim/img-3.png)

*Vimtutor after first launching.*

### IDE Integrations

Have a favorite IDE or code editor and don’t want to restrict yourself to a simple terminal? Most have a Vim mode or integration! See some below.

-   Visual Studio Code — [Vim emulation for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim)
-   Sublime Text — [Vintage Mode](https://www.sublimetext.com/docs/vintage.html)
-   Eclipse — [Vrapper](https://marketplace.eclipse.org/content/vrapper-vim)
-   Atom — [vim-mode-plus](https://atom.io/packages/vim-mode-plus)
-   JetBrains IDEs — [IdeaVim](https://github.com/JetBrains/ideavim)

## Bare Minimum

If you are going to retain any information about using Vim, these are the shortcuts and commands that are worth remembering:

-   `i` - Enter insert mode.
-   `[esc]` - Return to normal mode.
-   `dd` - Delete the entire line.
-   `:q!` - Force quit the Vim editor.
-   `:x` - Save and quit.
-   `/word` - Search for a specific word. Press / again to jump to next occurrence.
-   `:h` or `:help` - Open Vim help menu.

## You’re On Your Own

Now that you’re up to speed on all facets of Vim, you can face the beast on your own. Avoid the intimidation of Vim and embrace it instead. Vim is known to improve efficiency in coding without the need of a mouse. Just [watch this competitive programmer](https://www.youtube.com/watch?v=uGrBHohIgQY) win first place using the Vim editor! Even if you don’t decide to use Vim, now you at least know the command to exit.

![I’ve been using vim for a year now, mostly because I don’t know how to exit it.](/writeups/vim-timidation-dont-be-scared-of-vim/img-4.png)

Want to make a WordPress blog? Check out my post about [how to create a WordPress blog](/notes/how-to-create-a-blog)!
