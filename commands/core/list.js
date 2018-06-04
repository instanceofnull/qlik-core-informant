const { map, switchMap, take } = require('rxjs/operators'),
  { getDocList } = require('rxq/Global'),
  { createSessionObject } = require('rxq/Doc'),
  { getLayout } = require('rxq/GenericObject');

module.exports = (replServer) => {
  let { context } = replServer;

  replServer.defineCommand('list', {
    help: 'list <apps|sheets|objects|dimensions|measures|bookmarks|stories|variables>',
    action(type) {
      // error checking
      if (!type) {
        console.error('The list command requires a list type argument');
        return;
      }

      switch (type) {
        case 'apps':
          const { session$ } = context;
          session$.pipe(
            switchMap(h => getDocList(h)),
            take(1)
          ).subscribe(
            docs => {
              replServer.context.apps = docs;
              console.log(docs.map(m => m.qDocName).join('\n'));

              // cleanup the prompt
              this.displayPrompt();
            },
            err => console.error('list.apps.err: ', err)
          );
          break;

        case 'sheets':
          const { app$ } = context;
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
            err => console.log('list.sheets.err: ', err)
          );
          break;

        default:
          console.log(`listing ${type}`);
      }
    }
  });
}
