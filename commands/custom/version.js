const { switchMap } = require('rxjs/operators'),
  { engineVersion } = require('rxq/Global');

const cmd = 'version',
  help = `displays the engine version`;

module.exports = (replServer) => {
  let { context } = replServer;

  replServer.defineCommand(cmd, {
    help,
    action(args) {
      const { session$ } = context;
      if (!session$) {
        console.log(`.${cmd} requires an active session. (.connect <host>)`);
        replServer.displayPrompt();
        return;
      }

      session$.pipe(
        switchMap(h => engineVersion(h))
      ).subscribe(
        version => {
          console.log('Engine Version: ', JSON.stringify(version, null, 2));
          replServer.displayPrompt();
        },
        err => {
          console.log(`${cmd}.err: `, err);
          replServer.displayPrompt();
        }
      );
    }
  });
}