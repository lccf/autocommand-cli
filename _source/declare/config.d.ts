import browserSync = require('browser-sync');

interface bSyncConfigStructure {
  init: browserSync.Options,
  reload: Boolean
}

export interface configStructure {
  file: string,
  ignore: Array<string|any>,
  variable: any,
  define: any,
  browserSync?: bSyncConfigStructure
}
