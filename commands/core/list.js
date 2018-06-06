const { map, switchMap, take } = require('rxjs/operators'),
  { getDocList } = require('rxq/Global'),
  { createSessionObject, getTablesAndKeys } = require('rxq/Doc'),
  { getLayout } = require('rxq/GenericObject');

const cmd = 'list',
  types = '<apps|sheets|tables>';

module.exports = (replServer) => {
  let { context } = replServer;

  replServer.defineCommand(cmd, {
    help: `${cmd} ${types}`,
    action(type) {
      // error checking
      if (!type) {
        console.error(`The list command requires a valid type. ${types}`);
        replServer.displayPrompt();
        return;
      }

      switch (type) {
        case 'apps':
          let { session$ } = context;
          
          // apps specific check
          if(!session$) {
            console.log('.list apps requires a valid session. (.connect <host>)');
            replServer.displayPrompt();
            return;
          }

          session$.pipe(
            switchMap(h => getDocList(h))
          ).subscribe(
            docs => {
              context.apps = docs;
              console.log(docs.map(m => m.qDocName).join('\n'));
              replServer.displayPrompt();
            },
            err => {
              console.error(`${cmd}.apps.err: `, err);
              replServer.displayPrompt();
            }
          );
          break;

        case 'sheets': {
          const { app$ } = context;

          // sheets specific check
          if(!app$) {
            console.log('.list tables requires an active application. (.use app <name>)');
            replServer.displayPrompt();
            return;
          }
          
          app$.pipe(
            switchMap(h => createSessionObject(h, {
              qInfo: {
                qType: 'SheetList'
              },
              qAppObjectListDef: {
                qType: 'sheet'
              }
            })),
            switchMap(h => getLayout(h)),
            map(m => m.qAppObjectList.qItems.map(n => ({
              id: n.qInfo.qId,
              name: n.qMeta.title,
              description: n.qMeta.description || 'Not available.'
            }))),
            take(1)
          ).subscribe(
            sheets => {
              sheets.forEach(({ id, name, description }) => 
                console.log(`${id} -- ${name} -- Description: ${description}`));
              replServer.displayPrompt();
            },
            err => {
              console.log(`${cmd}.sheets.err: `, err);
              replServer.displayPrompt();
            }
          );
          break;
        }
        case 'tables': {
          const { app$ } = context;

          // tables specific check
          if(!app$) {
            console.log('.list tables requires an active application. (.use app <name>)');
            replServer.displayPrompt();
            return;
          }

          app$.pipe(
            switchMap(h => getTablesAndKeys(h, { qcy: 9999, qcx: 9999 }, { qcy: 0, qcx: 0 }, 30, true, false))
          ).subscribe(
            tables => {
              context.$tables = tables;
              const output = tables.qtr.map(({ qName, qNoOfRows, qFields }) => {
                const fieldCt = qFields.length;
                const keyCt = qFields.filter(f => f.qKeyType !== 'NOT_KEY').length;
                const fieldStr = qFields.map(m => `[${m.qName}] ` + JSON.stringify(m, null, 2)).join('\n');
                return `${qName} -- Rows: ${qNoOfRows} -- Fields: ${fieldCt} -- Keys: ${keyCt}\n${fieldStr}`;
              }).join('\n');
              console.log('Tables & Fields');
              console.log(`------------\n${output}\n`);
              console.log('The full response of the getTablesAndKeys call is available in your console as $tables.\n');
              replServer.displayPrompt();
            },
            err => {
              console.log(`${cmd}.sheets.err: `, err);
              replServer.displayPrompt();
            }
          );
          break;
        }

        default:
          console.log(`.${cmd} requires a valid type! ${types}`);
      }
    }
  });
}
