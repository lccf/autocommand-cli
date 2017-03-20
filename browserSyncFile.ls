path = require \path
exec = require \child_process .exec
chokidar = require \chokidar

# config {{{
baseDir = '.'

compileWatchFile = [
  "#baseDir/_source/**/*.ts"
]

autoCompileFile = false
#autoCompileFile = true
# }}}
# getTimeToken {{{
getTimeToken = ->
  currDate = new Date()
  hours = currDate.getHours()
  minutes = currDate.getMinutes()
  seconds = currDate.getSeconds()
  if hours < 10
    hours = "0#hours"
  if minutes < 10
    minutes = "0#minutes"
  if seconds < 10
    seconds = "0#seconds"
  "#hours:#minutes:#seconds"
# }}}
# compileTask {{{
getCompileCmdAndFileName = (file, ext) ->
  filename = path.basename file, ext
  relativePath = path.relative baseDir, path.dirname(file)
  if path.sep isnt \/
    relativePath = relativePath.split path.sep .join \/
    file = file.split path.sep .join \/

  # console.log filename
  switch ext
  case '.ts' then
    switch relativePath
    case '_source/lib'
      compileFileName = "#baseDir/lib/#{filename}.js"
      cmd = "tsc -t es5 --outDir #baseDir/lib #file"
    default
      compileFileName = "#{filename}.js"
      cmd = "tsc -t es5 --outDir #baseDir #file"
  default
    compileFileName = cmd = ''

  [cmd, compileFileName]

compileTask = (file, ext, reload) !->
  cmdIndex = -1
  try
    [cmd, filename] = getCompileCmdAndFileName file, ext

  if not cmd or not filename
    console.log "cmd not define. file: #file ext: #ext"

  # exec callback
  execCallback = (err, stdo, stde) !->
    if err is null and not stde
      if cmdIndex is -1
        console.log "[#{getTimeToken!}] compiled #filename"
        reload filename if reload
      else
        execCmd()
    else
      console.log err || stde

  # execute command
  do execCmd = !->
    environment = Object.assign {}, process.env
    environment['PATH'] = "./node_modules/.bin#{path.delimiter}#{environment['PATH']}"
    if Array.isArray cmd
      currCmd = cmd[++cmdIndex]
      if cmd.length <= cmdIndex+1
        ``cmdIndex = -1;``
    else
      currCmd = cmd

    if currCmd
      exec currCmd, environment, execCallback

compileCallback = (file) !->
  ext = path.extname file
  filename = path.basename file

  if filename.match(/\.d\.ts$/) isnt null
    return undefined

  # ignore partial file
  if filename.charAt(0) is '_'
    return undefined

  switch ext
  case '.ts'
    compileTask file, ext
  default
    console.log 'unknown file type.'
# }}}
# watcher {{{
console.log('watch model，files:\n'+compileWatchFile.join('\n'));
watcher = chokidar.watch compileWatchFile
.on \change, compileCallback

# auto compile file
if autoCompileFile
  watcher.on \add, compileCallback
# }}}

# vim: set sw=2 ts=2 sts=2 et fdm=marker:
