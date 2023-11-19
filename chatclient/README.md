# chatclient

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## 跨域 webpack devServer 代理 前 vue.config.js

## 用户认证授权 JWT Token 后 auth.js

## Vuex 管理状态 缓存 把登录信息存入 localstorage 缓存

## 请求响应拦截 前 request.js

```
    axios.create axios实例 发送网络请求
    请求 前 -> 后 带token 检查有没有token -> 把token放header中
    响应 后 -> 前 根据 status 作出响应 登陆成功 存token 登陆过期 删token
    1000 登陆成功
    2002 请先登录
    2003 服务器错误
    1006 登陆过期 (token过期)
    1002 验证码过期
```

## 连接数据库 后 connectDB.js

## 路由 VueRouter

## 登录/注册 POST

1000 登陆成功
1005 注册成功
1001 账号密码错误
1002 验证码过期
1003 账户被注册
1007 账户注销
1008 账户冻结

### 验证信息

    ```
        先校验 rules 再发请求
        查数据 对数据 查验证码
        成功 更新User LastLoginTime 生成token带回
    ```

### 获取存储信息

    ```
        拿到数据&token
        调Vuex 存 数据 -> 缓存
                  token -> cookie
        跳转页面
    ```

### 创建记录(仅 register)

    ```
        验证完没问题 提交到数据库
    ```

## 个人设置 Setting

### 获取信息

    ```
        从缓存中拿 userInfo
    ```

### 修改信息

1006 token 过期
1003 昵称重复
200 修改成功
1009 与原密码相同

#### 个人信息

    ```
        发请求 带上token
        后 先查token 再在数据库查找用户 改信息
    ```

#### 密码

    ```
        发请求 验token 原密码校验 新密码校验 修改数据库
    ```

#### 登录页 views/chatLogin

#### 首页 views/chatHome

#### 侧边栏 views/sidebar

```
    侧边栏内容
            首页 views/chatHome
                组件
                    components/conversation     中间栏 消息列表栏
                        组件
                            components/topSearch    搜索
                            components/todo     日程
                                this.$router.push
                                    views/schedule
                            components/conversationList     消息列表
                                组件
                                    components/conversationList/recentConversation   最近
                                    components/conversationList/fenzuConversation    分组
                                    components/conversationList/groupConversation    群

            添加好友 views/Add
                组件
                    components/Add/validateNews 好友验证申请列表
            空间 views/MZone
            设置 views/Setting
```
