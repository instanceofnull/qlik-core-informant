// const { switchMap } = require('rxjs/operators'),
//   { engineVersion } = require('rxq/Doc');

// custom command name / description -- modify this
// const cmd = 'simple-evaluate',
//  help = `evaluates a single expression // eg. .${cmd} sum([Sales Amount])`;

module.exports = (replServer) => {
  let { context } = replServer;

  replServer.defineCommand(cmd, {
    help,
    action(expr) {
      // action logic goes here
      // remember you can access core (session$, app$) variables from the context
      // note: if your custom command relies on the session$, app$, etc.
      // a little error checking goes a long ways in terms of user experience.
    }
  });
}