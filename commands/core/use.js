const { map, shareReplay, switchMap } = require('rxjs/operators');
const { openDoc } = require('rxq/Global');

module.exports = (replServer) => {
  let { context } = replServer;

  replServer.defineCommand('use', {
    help: 'use <app|sheet|object|dimension|measure|bookmark|story> <name|qId>',
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
          context.app$ = session$.pipe(
            switchMap(h => openDoc(h, qId)),
            shareReplay(1)
          );

          replServer.setPrompt(`(qci | ${host}:${port} | ${qId})> `);
          replServer.displayPrompt();
          break;

        default:
          console.log(`listing ${type}`);
      }
    }
  });
}
