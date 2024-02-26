+++
title = "{Neo}vim Notes"
weight = 2
bookcase_cover_src = "cover/vim.png"
bookcase_cover_src_dark = "cover/vim.png"
hidden = true
toc = true
+++

## Delete everything except lines containing string

```vim
%v/\(keep1\|keep2\)/d
%g!/\(keep1\|keep2\)/d
```

## Replace last occurrence in line

```vim
" Replace last space with comma
%s/.*\zs /,/gc
```

## Run command in all Neovim instances

*Requires [neovim-remote](https://github.com/mhinz/neovim-remote).*

```sh
# Switch all neovim instances to light theme
$ for f in $(nvr --serverlist); do nvr --servername $f --remote-send ':set bg=light<cr>'; done
```

