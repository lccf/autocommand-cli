import * as browserSync from 'browser-sync';

type StringOrArray = string | Array<string | Function>
type StringOrStringArray = string | Array<string>;

interface bSyncConfigStructure {
  plugin: browserSync.BrowserSyncStatic;
  init: browserSync.Options;
  reload: Boolean;
}

interface defineStructure {
  file: string | Function;
  path?: string;
  command: StringOrStringArray;
  behavior?: behaviorStructure;
}

interface behaviorStructure {
  [key: string]: {
    match: RegExp | string;
    message: string;
  }
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