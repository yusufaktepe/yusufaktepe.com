+++
title = "Log in from TTY without typing username"
date = "2020-12-23T18:29:04+03:00"
draft = false
# description = ""
tags = ["linux", "tips"]
aliases = ["/blog/2020/log-in-from-tty-without-typing-username"]
+++

If you are someone like me who finds login managers unnecessary and logs into
window manager from TTY, this tweak can save you time.

<!--more-->

Edit `getty@tty1.service`:
```sh
sudo systemctl edit --full getty@tty1.service
```

Find the line that starts with the *ExecStart*:
```
ExecStart=-/sbin/agetty -o '-p -- \\u' --noclear - $TERM
```

Replace `\\u` with the username you want to log into and add `-n` option to agetty:
```
ExecStart=-/sbin/agetty -n -o '-p -- yusuf' --noclear - $TERM
```

Now you can log into your specified user only by typing the password.

This only affects *`tty1`*; you can switch to another TTY to log in with a
different username.

> See [`man agetty`](https://man.archlinux.org/man/core/util-linux/agetty.8.en) for more information.

