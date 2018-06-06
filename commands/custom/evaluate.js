const { _trow } = require('rxjs/observable/throw'),
  { from } = require('rxjs/observable/from'),
  { catchError, concatMap, reduce, take, tap, withLatestFrom } = require('rxjs/operators'),
  { evaluateEx } = require('rxq/Doc');

const cmd = 'evaluate';

module.exports = (replServer) => {
  let { context } = replServer;

  replServer.defineCommand(cmd, {
    help: `evaluates multiple <expressions> // eg .${cmd} Sum([Sales Amount]) Avg(Revenue) Max(Year)`,
    action(expressions) {
      // error checking
      if (!expressions) {
        console.error(`.${cmd} command requires an expression.`);
        replServer.displayPrompt();
        return;
      }

      if (!context.app$) {
        console.error(`.${cmd} command requires an active application. (.use app <name>)`);
        replServer.displayPrompt();
        return;
      }

      // replace ") " with "|" and split it into an array
      expressions = expressions.replace(/\)\s{1}/g, ")|").split("|");

      // for each expression
      from(expressions).pipe(
        // also get the app handle
        withLatestFrom(context.app$),
        // create inner observables of the "evaluateEx" action/return values
        concatMap(([expression, h]) => evaluateEx(h, expression)),
        // and concatenate the return values into an array
        reduce((acc, x) => [...acc, x], []),
      ).subscribe(
        results => {
          // update the context
          context.$expressions = results.map((value, i) => ({
            expr: expressions[i],
            ...value
          }));

          // output
          console.log(`$expressions = `, JSON.stringify(context.$expressions, null, 2));
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
