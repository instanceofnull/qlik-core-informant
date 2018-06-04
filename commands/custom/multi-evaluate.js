const { merge } = require('rxjs/observable/merge'), 
  { map, switchMap, take, tap } = require('rxjs/operators'),
  { evaluate } = require('rxq/Doc');

const cmd = 'multi-evaluate';

module.exports = (replServer) => {
  let { context } = replServer;

  replServer.defineCommand(cmd, {
    help: `${cmd} <expressions>
    \t\t  ${cmd} Sum(Sales) Sum(Revenue) Max(Year)`,
    action(expressions) {
      // error checking
      if (!expressions) {
        console.error(`The ${cmd} command requires an expression.`);
        replServer.displayPrompt();
        return;
      }

      if (!context.app$) {
        console.error(`The ${cmd} command requires an active application. (.use app <name>)`);
        replServer.displayPrompt();
        return;
      }

      expressions = expressions.split(') ');
      context.app$.pipe(
        switchMap(h => merge(expressions.map(expression => evaluate(h, expression)))),
      ).subscribe(
        results => {
          console.log(results);
          context.$expressions = [];
          context.$results = [];
          expressions.forEach((expr, i) => {
            context.$expressions[i] = expr;
            context.$results[i] = results[i];
            console.log(`$expressions[${i}] = ${expr} = $results[${i}] = ${results[i]}`);
          });
          replServer.displayPrompt();
        },
        err => console.log(`${cmd}.err: `, err)
      );
    }
  });
}
