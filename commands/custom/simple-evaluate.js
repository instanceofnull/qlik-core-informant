const { map, switchMap, take } = require('rxjs/operators'),
  { evaluateEx } = require('rxq/Doc');

const cmd = 'simple-evaluate';

module.exports = (replServer) => {
  let { context } = replServer;

  replServer.defineCommand(cmd, {
    help: `evaluates a single expression // eg. .${cmd} sum([Sales Amount])`,
    action(expr) {
      // error checking
      if (!expr) {
        console.error(`.${cmd} command requires an expression.`);
        replServer.displayPrompt();
        return;
      }

      if (!context.app$) {
        console.error(`.${cmd} command requires an active application. (.use app <name>)`);
        replServer.displayPrompt();
        return;
      }

      context.app$.pipe(
        switchMap(h => evaluateEx(h, expr))
      ).subscribe(
          result => {
              context.$expression = { expr, ...result };
              console.log(`$expression = `, JSON.stringify(context.$expression, null, 2));
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