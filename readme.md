# autocommand-cli
autocommand的命令行版本，使用nodejs实现。

## 示例
安装
```bash
npm install lccf/autocommand-cli#latest -g
```

创建项目
```bash
mkdir acmd-project
cd acmd-project
# 安装编译库，pug用来编译jade、node-sass编译sass、livescript编译ls
npm install pug-cli node-sass livescript --save-dev
# 初始化配置文件
acmd config -i
```
创建文件

vim index.jade
```jade
doctype html
html
  head
    title index
    link(rel="stylesheet" href="style.css")
  body
    h1 acmd 测试
```
vim style.sass
```sass
html
  background-color: #CCC

h1
  text-align: center
  padding:
    top: 40px
```

编译
```bash
acmd run
```
编译模式，系统会根据配置中的file字段找到匹配的文件，并执行对应的命令。

侦听模式
```bash
acmd watch
```
侦听模式，系统会根据配置中的file字段找到匹配的文件，侦听文件的修改，并执行对应的命令。默认启用browser-sync的server功能，可直接访问页面。用编辑器修改jade、sass文件后会自动更新。

## 帮助
```bash
acmd --help
```

## 参考
### 生成配置文件
```bash
acmd config -i, --init [config]
```
### 测试配置文件是否正确
```bash
acmd config -t, --test [config]
```

### 执行命令
```bash
acmd run
```
扫描配置文件，根据配置文件的内容对匹配的文件执行指定命令

#### 对指定文件执行命令
```bash
acmd run -f *.jade *.coffee // 对当前目录下的jade/coffee文件执行命令
acmd run -f '*.{jade,ts}' '**/*.{coffee,sass}' // 根据glob的查找规则文件并执行命令
git status -suno | awk '{print $2}' | acmd run -o // 对git中已修改的文件执行命令
find . -name *.jade | acmd run -o // 对管道中的文件执行命令
```

### 监听
```bash
acmd watch
```

## nodejs模块
```javascript
var acmd = require('autocommand-cli').create();
var config = {...};
acmd.watch(config); // 有watch和run方法，对应侦听和运行模式
```
运行在命令行模式时，ignore、file、command可以为函数类型。ignore的参数为全路径的文件名。file、command的参数为一个对象，见variable配置项。

## 配置

示例：
```javascript
{
  // 侦听的文件
  "file": ["**/*.jade", "*.sass", "*.ls"],
  // 过滤
  "ignore": ["_*", "node_modules/"],
  // 变量
  "variable": {
    "LocalBin": "~/node_modules/.bin"
  },
  // 环境变量
  "environment": {
    ":PATH": "#{LocalBin}"
  },
  // 定义
  "define": {
    ".jade": {
      "file": "#{relativePath}/#{fileName}.html",
      "command": "pug -Po . #{file}"
    },
    ".sass": {
      "file": "#{relativePath}/#{fileName}.html",
      "command": "node-sass --output-style compact #{fileName}.sass ./#{fileName}.css"
    },
    ".ls": {
      "file": "#{relativePath}/#{fileName}.js",
      "command": "lsc -cbp ./#{fileName}.ls>./#{fileName}.js"
    },
    // 嵌套目录
    "jade/": {
      // ~代表baseDir
      // .代表当前
      "path": ".",
      ".jade": {
        "file": "#{relativePath}/#{fileName}.html",
        "command": "pug -Po . #{file}"
      }
    }
  },
  // browserSync配置
  "browserSync": {
    // 初始化配置
    "init": {
      "server": {
        "baseDir": "./"
      },
      "open": false
    },
    // 启动livereload
    "reload": true
  }
}
// vim: se sw=2 ts=2 sts=2 ft=javascript et:
```

### file
侦听的文件类型
* 必选

示例：
```javascript
{
  "file": ["*.sass", "coffee/*.coffee", "jade/**/*.jade"]
}
```

### define
配置命令选项
* 必选

针对指定文件配置：
```javascript
{
  "define": {
    ".jade": {
      "file": "#{fileName}.html",
      "command": "jade -Po ./ #{fileName}.jade"
    }
  }
}
```
- file键表示文件编译后的真实文件名，用来显示和发送给livereload函数
- command代表要执行的命令，可以用数组传入多个命令
- file和command可支持变量

针对指定目录配置：
```javascript
{
  "define": {
    // 嵌套目录
    "jade/": {
      // ~代表baseDir
      // .代表当前
      "path": "~",
      ".jade": {
        "file": "#{fileName}.html",
        "command": "jade -Po ./ jade/#{fileName}.jade"
      }
    }
  }
}
```
- path 代表执行编译命令的路径，因某些项目需在固定路径编译

修改默认命令行为
```javascript
{
  "define": {
    ".sass": {
      "file": "#{fileName}.css",
      "command": "node-sass #{file} #{fileName}.css",
      "behavior": {
        "stderr": [
          {
            "match": "/Rendering Complete/",
            "message": "reject sass error"
          }
        ]
      }
    }
  }
}
```
在上例中node-sass不论任何场景，均会在stderr中输出内容影响命令的判断。在behavior中指配置针对stderr的规则，如果match的规则符合，会将这一次的编译错误reject掉，同时输出message中的内容。

### ignore
根据指定规则过滤文件，参见[ignore](https://www.npmjs.com/package/ignore)
* 可选

示例：
```javascript
{
    "ignore": ["_*", "node_modules/"]
}
```
过滤以_开头的文件，过滤node_modules目录中的文件。

### variable
自义变量，在command，file等选项中使用#{variableName}的形式使用
* 可选
在command，file中默认支持以下变量：
- file 表示当前文件
- fileName 表示当前文件名(不包含扩展名)
- basePath 当前命令的工作路径
- relativePath 当前文件相对于项目根目录的路径
- defilePath 针对当前文件的定义路径
- relativeFile 相对于当前工作路径的文件名，含路径
- defineRelativePath 文件相路径相对于定义命令目录的路径
- variable 自定义变量

* 在variable中定义的变量使用~表示项目当前路径

### environment
环境变量，用来改变执行命令时的环境变量。为key/value形式的定义默认会覆盖同名环境变量。
示例：
```javascript
{
  "environment": {
    "PATH": "./abc"
  }
}
// 修改后的环境变量为 ./abc
```
当key以:开头，表示去merge一个环境变量。环境变量为数组时，使用系统环境变量分隔符去join。
示例:
```javascript
{
  "environment": {
    ":PATH": ["./abc", "./def"]
  }
}
// 修改后的环境变量为 ./abc:./def:$PATH(:在windows下为;)
```

### browserSync
配置使用browserSync
* 可选
