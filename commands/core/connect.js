const { connectSession } = require('rxq/connect');

module.exports = (replServer) => {
  let { context } = replServer;
  context.sessions = [];

  replServer.defineCommand('connect', {
    help: `connect <ip:port>`,
    action(server) {
      // error checking
      if (!server) {
        console.error('The connect command requires a host');
        return;
      }

      const [host, port] = server.split(':');

      // update context variables
      const session = {
        host,
        session$: connectSession({ host, port })
      };
      context.sessions.push(session);

      // if we don't have an active session, set the new
      // session as the active session and update the repl
      // prompt.
      if(!context.activeSession) {
        context.session$ = session.session$;
        context.host = host;
        context.port = port;
        replServer.setPrompt(`(qci | ${host}:${port})> `);
      }

      // ouput
      this.displayPrompt();
    }
  });

}