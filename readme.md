# autocommand-cli
autocommand的命令行版本，使用nodejs实现。

## 安装
```bash
npm install thinkjs/autocommand-cli -g
```

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

### 监听
```bash
acmd watch
```

## 配置

示例：
```javascript
{
  // 侦听的文件
  "file": ["**/*.jade", "*.sass", "*.ls"],
  // 过滤
  "ignore": ["^_"],
  // 变量
  "variable": { },
  // 定义
  "define": {
    ".jade": {
      "file": "#{fileName}.html",
      "command": "jade -Po ./ #{fileName}.jade"
    },
    ".sass": {
      "command": "sass --sourcemap=none --style compact #{fileName}.sass ./#{fileName}.css"
    },
    ".ls": {
      "file": "#{fileName}.js",
      "command": "lsc -cbp ./#{fileName}.ls>./#{fileName}.js"
    },
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
- file和command可是支持变量

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


### ignore
根据指定规则过滤文件，默认为正则表达式
* 可选

示例：
```javascript
{
    "ignore": "^_"
}
```
以为上过滤以_打头的文件名，可以用数组传入多个过滤规则

### variable
自义变量，在command，file等选项中使用#{variableName}的形式使用
* 可选
在command，file中默认支持以下变量：
- file 表示当前文件
- fileName 表示当前文件名(不包含扩展名)
- relativePath 当前文件相对于项目根目录的路径

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
