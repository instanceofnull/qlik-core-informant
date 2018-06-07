const { of } = require('rxjs/observable/of'),
  { combineLatest } = require('rxjs/observable/combineLatest'),
  { map, reduce, shareReplay, switchMap, take, tap } = require('rxjs/operators'),
  { openDoc, getDocList, isDesktopMode } = require('rxq/Global');

const cmd = 'use',
  help = `${cmd} <app> <qId>`;

module.exports = (replServer) => {
  let { context } = replServer;

  replServer.defineCommand(cmd, {
    help,
    action(args) {
      // arg parsing
      let [type, ...qId] = args.split(' ');
      qId = qId.join(' ');

      // error checking
      if (!(type && qId)) {
        console.error(`.${cmd} command requires a type and name/qId arguments`);
        return;
      }

      switch (type) {
        case 'app':
          const { session$, host, port } = context;

          // tables specific check
          if (!session$) {
            console.log(`.${cmd} app requires an active session. (.connect <host>)`);
            replServer.displayPrompt();
            return;
          }

          const isQlikCore$ = session$.pipe(
            switchMap(h => isDesktopMode(h))
          );

          context.app$ = combineLatest(session$, isQlikCore$).pipe(
            switchMap(([h, isQlikCore]) => {
              // core & sense desktop
              if(isQlikCore) {
                return openDoc(h, qId);
              // server
              } else {
                return getDocList(h).pipe(
                  map(docs => docs.filter(f => f.qDocName === qId).reduce((acc, x) => x.qDocId, "")),
                  switchMap(app => openDoc(h, app))
                );
              }
            }),
            shareReplay(1)
          );

          // connect the app here, so it will be available in other commands
          context.app$.pipe(take(1)).subscribe(
            () => {
              replServer.setPrompt(`(qci | ${host}:${port} | ${qId})> `);
              replServer.displayPrompt();
            },
            err => {
              console.log('error connecting to app: ', err);
              replServer.displayPrompt();
            }
          );
          break;

        default:
          console.log(`.${cmd} requires a valid type and qId. (.use <app> <qvf file name>)`);
          replServer.displayPrompt();
          break;
      }
    }
  });
}
