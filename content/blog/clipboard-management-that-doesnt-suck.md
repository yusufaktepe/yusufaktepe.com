---
title: "Clipboard management that doesn't suck"
date: 2021-03-10T12:14:34+03:00
draft: false
# description: ""
# summary: ""
tags: ["linux", "shell", "scripts", "rofi", "clipboard"]
# categories: ["", ""]
# series: [""]
# aliases: [""]
# comments: false
# ShowToc: true
# TocOpen: true
# hideMeta: true
# hideSummary: true
# searchHidden: true
# ShowBreadCrumbs: false
# disableAnchoredHeadings: true
# weight: 1
---

{{< figure align=center src="/img/post/rofi-gpaste.png" alt="rofi-gpaste" >}}

After trying almost all clipboard managers on Linux, I found the best solution
by combining `rofi` and `gpaste` in one simple shell script.

<!--more-->

With this script --along with basic clipboard management-- you can edit past
entries, archive them, or generate QR codes from them.

> If you want to try it out, you can find it in [here](https://github.com/yusufaktepe/rofi-gpaste).

