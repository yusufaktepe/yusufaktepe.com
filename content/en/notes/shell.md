+++
title = "Shell Notes"
weight = 1
bookcase_cover_src = "cover/shell.png"
bookcase_cover_src_dark = "cover/shell.png"
hidden = true
toc = true
+++

## POSIX: 'Here string' alternative

```sh
# Bash
read -r VAR <<< "$(command)"
# Dash
read -r VAR <<+++
    "$(command)"
+++
```

## Print unique lines without sorting

This is an alternative to `awk '!Line[$0]++'`, which prints unique lines.

```sh
unique() {
    IFS_Old=$IFS
    IFS=$'\n'
    set --

    while IFS= read -r Line; do
        case $IFS$*$IFS in
            *"$IFS$Line$IFS"*) ;; # Seen
            *) set -- "$@" "$Line" ;; # Unique
        esac
    done

    printf '%s\n' "$@"

    IFS=$IFS_Old
}

$ printf '%s\n' foo bar baz foo baz | unique
```

## Bash builtin date

```sh
# GNU date
$ date '+%H:%M · %a, %b %d · %Y'
# Bash
$ printf '%(%H:%M · %a, %b %d · %Y)T\n'

# Output:
# 23:40 · Thu, Feb 22 · 2024
```

## Debug script recursively

```sh
# Follows 'exec's
bash -c "set -x; export SHELLOPTS; ./script"
```

## Pipe two commands, return the exit status of the first

```sh
# Returns 1 if `maim` selection canceled, 0 otherwise
mispipe "maim -usl -b 2 -c 0.35,0.55,0.85,0.25" "xclip -sel c -t image/png"
```

## Reverse an array

```sh
shopt -s extdebug
printf '%s\n' "${ARRAY[@]}"
shopt -u extdebug
```

## Print random array element

```sh
printf '%s\n' "${ARRAY[RANDOM % $#]}"
```

## Cycle through an array

```sh
ARRAY=(a b c d)

cycle_array() {
    printf '%s\n' "${ARRAY[${i:=0}]}"
    (( i = i >= ${#ARRAY[@]}-1 ? 0 : ++i ))
}
```

## Get first/last `n` element of an array

```sh
printf '%s\n' "${ARRAY[@]:0:n}"
printf '%s\n' "${ARRAY[@]: -n}"

# Last n args POSIX
set -- arg1 arg2 arg3
shift "$(($#-n))"
printf '%s\n' "${@}"
```

## `head` and `tail` with bash

```sh
head() {
    mapfile -tn "$1" Line < "$2"
    printf '%s\n' "${line[@]}"
}

tail() {
    mapfile -tn 0 Line < "$2"
    printf '%s\n' "${line[@]: -$1}"
}

$ head 2 file
$ tail 2 file
```

## Ternary test

```sh
## Set the value of x to y if y is greater than x.
# x → variable to set
# y > x → condition to test
# ? y → if the test succeeds
# : x → if the test fails
(( x = y > x ? y : x ))
```

## Log script output

```sh
# Start logging
exec 6>&1      # save stdout
exec 7>&2      # save stderr
exec &>"$1"

# Stop logging
exec 1>&6 6>&- # Restore stdout
exec 2>&7 7>&- # Restore stderr

# Redirect error
printf '%s\n' 'Err: This is an error message.' >&2
```

