const { map, switchMap, take } = require('rxjs/operators'),
  { getDocList } = require('rxq/Global'),
  { evaluate } = require('rxq/Doc'),
  { getLayout } = require('rxq/GenericObject');

module.exports = (replServer) => {
  let { context } = replServer;

  replServer.defineCommand('evaluate', {
    help: 'evaluate <expression>',
    action(expression) {
      // error checking
      if (!expression) {
        console.error('The evaluate command requires an expression.');
        replServer.displayPrompt();
        return;
      }

      if(!context.app$) {
          console.error('The evaluate command requires an active application. (.use app <name>)');
          replServer.displayPrompt();
          return;
      }

      context.app$.pipe(
        switchMap(h => evaluate(h, expression)),
        take(1)
      ).subscribe(
          result => {
              context.$expression = expression;
              context.$result = result;
              console.log(`$expression = ${expression} = $result = ${result}`);
              replServer.displayPrompt();
          },
          err => console.log('evaluate.err: ', err)
      );
    }
  });
}
