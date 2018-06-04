# qlik-core-informant
A command line/REPL utility to get the lowdown on your Qlik Core environment(s).

## Setup

```
git clone $url
npm i
npm link
```

## Running

```
qci
```

## Core commands

```
.help
.connect <ip:port>
.list <apps|sheets|objects|dimensions|measures|bookmarks|stories|variables>
.use <app|sheet|object|dimension|measure|bookmark|story|variable> <qId>
.evaluate <expr>
```

## Custom commands

```
.multi-evluate <expressions>
               sum(sales) sum(revenue) max(year)
```
