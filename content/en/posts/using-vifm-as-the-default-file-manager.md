+++
title = "Using Vifm as the default file manager"
date = "2021-06-05T22:45:39+03:00"
draft = false
# description = ""
tags = ["linux", "shell", "scripts", "vifm", "tips"]
aliases = ["/blog/2021/using-vifm-as-the-default-file-manager"]
+++

{{< figure align=center src="/img/post/vifm-window.png" alt="vifm-window" >}}

In this post, I will share a tip on using Vifm as the default file manager.

<!--more-->

## vifm-tab script
This script allows me to use Vifm as a single instance and when I want to open
a directory that utilizes `xdg-open` to launch the default file manager, it
opens in this instance's new tab.

For this script to work you need to set the server name in your vifmrc:
```vim
let $VIFM_SERVER_NAME = v:servername
```

Save this script to your PATH: (I've added some comments inside the script so
you can adjust to your needs.)
```sh
#!/bin/sh

if [ -n "$*" ]; then
	if [ "$1" = . ]; then
		# Browsers are passing . as an argument and setting PWD for dir path
		cmd="tabnew | cd \"$PWD\""
	else
		cmd="tabnew | cd \"$*\""
	fi
else
	cmd=redraw
fi

if [ -n "$(vifm --server-list)" ]; then
	vifm --server-name vifm --remote -c "$cmd"
else
	if [ -t 2 ]; then
		# When you call vifm-tab from terminal this will set terminal instance
		# to 'vifm' so you can assign window rule in your wm
		xdotool getactivewindow set_window --classname vifm &
		vifm -c "$cmd"
	else
		# You can adjust this to your terminal and shell:
		alacritty --class vifm -e sh -c "vifm -c '$cmd'; zsh" >/dev/null 2>&1 &
	fi
fi
```

Now you can open vifm with `vifm-tab` and pass your path as an argument to open
in this single instance.

### Setting `vifm-tab` as a default file manager

Create `vifm-tab.desktop` file under `~/.local/share/applications/` with the following content.
```
[Desktop Entry]
Categories=System;FileTools;FileManager;Utility;ConsoleOnly;
Comment=Vi[m] like ncurses based file manager
Exec=vifm-tab %F
GenericName=File Manager
Icon=vifm
Name=Vifm (Tab)
Terminal=true
TryExec=vifm
Type=Application
Keywords=File;Directory;Browse;
MimeType=inode/directory;
```

Now you can set vifm-tab as the default file manager:
```sh
xdg-mime default vifm-tab.desktop inode/directory
```

---

> You can find my vifm config and scripts [here](https://github.com/yusufaktepe/dotfiles).

