     _____ _ _ _      _____                  _____       __                                 _   
    |  _  | (_) |    /  __ \                |_   _|     / _|                               | |  
    | | | | |_| | __ | /  \/ ___  _ __ ___    | | _ __ | |_ ___  _ __ _ __ ___   __ _ _ __ | |_ 
    | | | | | | |/ / | |    / _ \| '__/ _ \   | || '_ \|  _/ _ \| '__| '_ ` _ \ / _` | '_ \| __|
    \ \/' / | |   <  | \__/\ (_) | | |  __/  _| || | | | || (_) | |  | | | | | | (_| | | | | |_ 
     \_/\_\_|_|_|\_\  \____/\___/|_|  \___|  \___/_| |_|_| \___/|_|  |_| |_| |_|\__,_|_| |_|\__|
                                                                                            
                                                                                            
A command line/REPL utility to get the lowdown on your Qlik Core environment(s).

## Installation

```
npm i -g qlik-core-informant
```

## Running

```
qci
```

## Core commands

```
.help
.connect        <ip:port>
.list           <apps|sheets|tables>
.use            <app> <name>
```

## Custom commands

```
.evaluate           evaluates multiple expressions // eg. .evaluate sum(Sales) sum([Total Revenue]) max(Year)
.simple-evaluate    evalutes a single expression // eg. .simple-evaluate sum(Sales)
.sample             samples data from specified data model table // eg. .sample Sales Fact
.version                prints engine version.
```
## Development Setup

```
git clone https://github.com/instanceofnull/qlik-core-informant.git
npm i
npm link
```