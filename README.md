     _____ _ _ _      _____                  _____       __                                 _   
    |  _  | (_) |    /  __ \                |_   _|     / _|                               | |  
    | | | | |_| | __ | /  \/ ___  _ __ ___    | | _ __ | |_ ___  _ __ _ __ ___   __ _ _ __ | |_ 
    | | | | | | |/ / | |    / _ \| '__/ _ \   | || '_ \|  _/ _ \| '__| '_ ` _ \ / _` | '_ \| __|
    \ \/' / | |   <  | \__/\ (_) | | |  __/  _| || | | | || (_) | |  | | | | | | (_| | | | | |_ 
     \_/\_\_|_|_|\_\  \____/\___/|_|  \___|  \___/_| |_|_| \___/|_|  |_| |_| |_|\__,_|_| |_|\__|
                                                                                            
                                                                                            
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
