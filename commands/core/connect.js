const { shareReplay } = require('rxjs/operators'),
  { connectSession } = require('rxq/connect');

module.exports = (replServer) => {
  let { context } = replServer;
  context.sessions = [];

  replServer.defineCommand('connect', {
    help: `connect <ip:port>`,
    action(server) {
      // error checking
      if (!server) {
        console.error('The connect command requires a host');
        replServer.displayPrompt();
        return;
      }

      const [host, port = 80] = server.split(':');

      // update context variables
      context.session$ = connectSession({ host, port }).pipe(shareReplay(1));
      context.host = host;
      context.port = port;

      context.session$.subscribe(
        () => {
          replServer.setPrompt(`(qci | ${host}:${port})> `)
          replServer.displayPrompt();
        },
        err => {
          console.log('connect.error: ', err);
          replServer.displayPrompt();
        }
      );
    }
  });

}