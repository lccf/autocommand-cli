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
- command可是以数组
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


### ignore
根据指定规则过滤文件，默认为正则表达式
* 可选

示例：
```javascript
{
    "ignore": "^_"
}
```
以为上过滤以_打头的文件。

### variable
自义变量，在command，file等选项中使用#{variableName}的形式使用
* 可选

### browserSync
配置使用browserSync
* 可选
