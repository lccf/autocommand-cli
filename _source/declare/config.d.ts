interface bSyncConfigStructure {
  init: any,
  reload: boolean
}
interface configStructure {
  watchFile: string,
  ignore: Array<string|any>,
  variable: any,
  define: any,
  browserSync?: bSyncConfigStructure
}
