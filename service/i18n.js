const i18n = require('i18n');
 
// 配置i18n
i18n.configure({
  locales: ['en-US', 'zh-CN'], // 支持的语言列表
  directory: __dirname + '/language', // 语言文件目录
  defaultLocale: 'zh-CN', // 默认语言
});

// const getState= i18n.__; 

module.exports = i18n