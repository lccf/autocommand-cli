import browserSync = require('browser-sync');
type StringOrArray = string | Array<string | Function>
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
  ignore?: StringOrArray;
  variable?: any;
  environment?: any;
  browserSync?: bSyncConfigStructure;
  debug?: boolean;
}