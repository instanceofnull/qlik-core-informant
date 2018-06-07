const { switchMap } = require('rxjs/operators'),
  { getTableData } = require('rxq/Doc'),
  cTable = require('console.table');

const cmd = 'sample',
  help = `samples data from specified table // eg. .${cmd} Sales Fact`;

module.exports = (replServer) => {
  let { context } = replServer;

  replServer.defineCommand(cmd, {
    help,
    action(table) {
      // error checking
      if (!context.app$) {
        console.error(`.${cmd} command requires an active application. (.use app <name>)`);
        replServer.displayPrompt();
        return;
      }
      if (!table) {
        console.error(`.${cmd} command requires a table name.`);
        replServer.displayPrompt();
        return;
      }

      context.app$.pipe(
        switchMap(h => getTableData(h, -1, 11, true, table)),
      ).subscribe(
        tbl => {
          // update the context
          context.$table = tbl;

          // output - slice(1) to skip the headers
          const output = tbl.slice(1).map(({ qValue: row }) => {
            return row.reduce((acc, x) => {
              const index = row.indexOf(x);
              const prop = tbl[0].qValue[index].qText;
              return { ...acc, [prop]: x.qText };
            }, {});
          });
          console.table(output);
          replServer.displayPrompt();
        },
        err => {
          console.log(`${cmd}.err: `, JSON.stringify(err, null, 2));
          replServer.displayPrompt();
        }
      )

    }
  });
}