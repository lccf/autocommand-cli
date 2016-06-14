import browserSync = require('browser-sync');

type StringOrStringArray = string | Array<string>;

interface bSyncConfigStructure {
  init: browserSync.Options;
  reload: Boolean;
}

interface defineStructure {
  file: string;
  command: StringOrStringArray;
}

export interface configStructure {
  file: StringOrStringArray;
  define: defineStructure;
  ignore?: StringOrStringArray;
  variable?: any;
  environment?: any;
  browserSync?: bSyncConfigStructure;
  debug?: boolean;
}