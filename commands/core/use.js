const { map, shareReplay, switchMap, take } = require('rxjs/operators'),
  { openDoc } = require('rxq/Global');

module.exports = (replServer) => {
  let { context } = replServer;

  replServer.defineCommand('use', {
    help: 'use <app> <qvf file name>',
    action(args) {
      // arg parsing
      let [type, ...qId] = args.split(' ');
      qId = qId.join(' ');

      // error checking
      if (!(type && qId)) {
        console.error('The use command requires a type and name/qId arguments');
        return;
      }

      switch (type) {
        case 'app':
          const { session$, host, port } = context;

          // tables specific check
          if (!session$) {
            console.log('.use app requires an active session. (.connect <host>)');
            replServer.displayPrompt();
            return;
          }

          context.app$ = session$.pipe(
            switchMap(h => openDoc(h, qId)),
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
          break;
      }
    }
  });
}
