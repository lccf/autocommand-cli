# autocommand-cli
autocommand的命令行版本，使用nodejs实现。

## 安装
```bash
npm install thinkjs/autocommand-cli -g
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

## 帮助
```bash
acmd --help
```

## 配置

### file
侦听的文件类型

示例：
```javascript
{
  "file": ["*.sass", "coffee/*.coffee", "jade/**/*.jade"]
}
```
