import browserSync = require('browser-sync');

type StringOrStringArray = string | Array<string>;

interface bSyncConfigStructure {
  init: browserSync.Options,
  reload: Boolean
}

interface defineStructure {
  file: string,
  command: StringOrStringArray
}

export default interface configStructure {
  file: StringOrStringArray,
  ignore?: StringOrStringArray,
  variable?: any,
  define: defineStructure,
  environment?: any,
  browserSync?: bSyncConfigStructure
}
