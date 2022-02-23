---
title: "Getting crypto prices from terminal & setting an alarm"
date: 2021-03-27T13:09:14+03:00
draft: false
# description: ""
# summary: ""
tags: ["linux", "shell", "scripts", "crypto"]
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

There are a lot of APIs where you can get crypto prices. However, I used
Binance because I've wanted to get real-time prices for the pairs I trade.

<!--more-->

Here's how you can get the prices of all cryptos listed on Binance:
```
curl -s https://api.binance.com/api/v1/ticker/price
```

We can make the output of this command more readable using `jq`:
```
curl -s https://api.binance.com/api/v1/ticker/price | jq -r '.[] | (.symbol + " = " + .price)'
```

Now you can *grep* the output of this command to get the price of a trading pair.

### 'crypto_prices' script

Here's the script I'm using to get the prices of trading pairs I follow:
```bash
#!/usr/bin/env bash

Cur=${1:-BTC|ETH|XMR}
Fiat=${2:-USDT}
Api=https://api.binance.com/api/v1/ticker/price

shopt -s nocasematch extglob

while read -ra Rate; do
	if [[ ${Rate[*]} =~ ^($Cur)($Fiat).*$ ]]; then
		Coin=${Rate[0]}
		Price=${Rate[1]}
		Price=${Price%%+(0)}

		Rates+=("$(printf '%-9s = %s\n' "$Coin" "${Price/%.}")")
	fi
done < <(curl -s $Api | jq -r '.[] | (.symbol + " " + .price)' 2>/dev/null)

printf '%s\n' "${Rates[@]}"

```

- To get prices of *SOL*, *ADA* and *MATIC* you can run:
```
crypto_prices 'SOL|ADA|MATIC'
```

---

### 'crypto_warn' script
This script gets prices from the `crypto_prices` and sends a notification/alarm
when the given condition is met:
```bash
#!/usr/bin/env bash
# Dependencies: dunstify, ffmpeg

AlarmSound=~/Music/calling.mp3

for arg in "$@"; do
	case $arg in
		-c) Cur=$2 ;;
		-f) Fiat=$2 ;;
		-le) ExprLE="<= $2" ;;
		-ge) ExprGE=">= $2" ;;
		-C) Continuous=true ;;
		-a) Alarm=true ;;
		-A) Alarm=true CAlarm=true ;;
	esac
	shift
done

while :; do
	P=$(crypto_prices "$Cur" "${Fiat:-USDT}")

	for Expr in "$ExprLE" "$ExprGE"; do
		[ -z "$Expr" ] && continue
		[ -z "$P" ] && break
		[ "${Expr% *}" = '>=' ] && Color='#2EBD85'
		[ "${Expr% *}" = '<=' ] && Color='#E0294A'

		if (( $(printf '%s\n' "${P##* } $Expr" | bc -l) )); then
			Expr=${Expr/<=/▼} Expr=${Expr/>=/▲}

			dunstify -a crypto -t 15000 -r 2001 -i money-manager-ex \
				-h string:bgcolor:$Color "${P/=*/$Expr}"

			if [ -n "$Alarm" ] && [ -z "$Rang" ]; then
				ffplay -volume 60 -nodisp -loglevel -8 -autoexit "$AlarmSound" >/dev/null
				[ -z "$CAlarm" ] && Rang=true
			fi

			[ -z "$Continuous" ] && break 2
		fi
	done

	sleep 5
done
```

- To get a notification/alarm when the *ETH* price gets above $3000 or drop below $2900 you can run:
```
crypto_warn -c eth -le 2900 -ge 3000 -a
```

---

> You can find my other scripts [here](https://github.com/yusufaktepe/dotfiles/tree/tp/.local/bin).

