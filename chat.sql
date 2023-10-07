/*
Navicat MySQL Data Transfer

Source Server         : 本地mysql
Source Server Version : 50527
Source Host           : localhost:3306
Source Database       : chat

Target Server Type    : MYSQL
Target Server Version : 50527
File Encoding         : 65001

Date: 2023-10-07 22:55:22
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键Id',
  `commentId` varchar(32) NOT NULL COMMENT '留言者的id',
  `commentContent` mediumtext COMMENT '留言内容',
  `commentTime` datetime NOT NULL COMMENT '留言时间',
  `commentGrade` varchar(4) DEFAULT NULL COMMENT '留言评价星星',
  `commentState` int(2) NOT NULL DEFAULT '0' COMMENT '留言是否回复/0未回复/1已回复',
  `commentService` varchar(16) DEFAULT NULL COMMENT '回复留言的客服名称',
  `commentReply` mediumtext COMMENT '客服回复的内容',
  PRIMARY KEY (`id`),
  KEY `orderComment` (`commentId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES ('1', '7e42f71dfd6e44c612756dfb7a91adbc', '32', '2022-12-19 16:48:24', '10', '1', '轮子哥', '666');
INSERT INTO `comment` VALUES ('2', '7e42f71dfd6e44c612756dfb7a91adbc', '2', '2022-12-19 17:08:28', '10', '1', '轮子哥测试号222', '这个问题我也不知道怎么回答呢');
INSERT INTO `comment` VALUES ('3', '7e42f71dfd6e44c612756dfb7a91adbc', '轮子哥帅不帅？', '2022-12-19 19:48:33', '3.5', '1', '轮子哥测试号222', '很帅！');
INSERT INTO `comment` VALUES ('4', '7e42f71dfd6e44c612756dfb7a91adbc', '中午吃什么？', '2022-12-19 19:49:23', '10', '0', null, null);
INSERT INTO `comment` VALUES ('5', '7e42f71dfd6e44c612756dfb7a91adbc', 'l', '2022-12-19 20:31:10', '10', '0', null, null);
INSERT INTO `comment` VALUES ('6', '26aa2b5fb4ab1f179bc2c75bdeb51a49', '1', '2022-12-19 20:46:44', '10', '0', null, null);
INSERT INTO `comment` VALUES ('7', '27a6ab69d26fb0503808d11b2531f038', '？。', '2022-12-20 18:38:56', '10', '0', null, null);
INSERT INTO `comment` VALUES ('8', '735ea3a731db699d3ffeceeffb77b345', '请问我是谁？', '2023-02-18 20:28:48', '10', '1', '轮子哥测试号', '你是小黑子');
INSERT INTO `comment` VALUES ('9', '728f6b276ef33432471c57f0a4710d73', '12', '2023-04-07 22:33:25', '10', '1', '大家', '666');
INSERT INTO `comment` VALUES ('10', '728f6b276ef33432471c57f0a4710d73', '测试1', '2023-04-07 23:02:21', '10', '0', null, null);
INSERT INTO `comment` VALUES ('11', '728f6b276ef33432471c57f0a4710d73', '测试二', '2023-04-07 23:02:27', '10', '0', null, null);
INSERT INTO `comment` VALUES ('12', '281f20eb822e697e40c57c57f72a365b', '你好呀', '2023-06-10 09:08:29', '10', '0', null, null);
INSERT INTO `comment` VALUES ('13', '780d8b30f55dc93a068c1ac026f524c5', '2', '2023-10-02 21:50:06', '10', '0', null, null);
INSERT INTO `comment` VALUES ('14', '18ae102a1f11ae97a5e386614a3e3f62', '我giao', '2023-10-03 12:38:08', '10', '1', '大家', '嘿嘿');

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sendId` varchar(32) NOT NULL COMMENT '发送者的id',
  `sendMessage` mediumtext COMMENT '发送的消息',
  `sendTime` varchar(32) NOT NULL COMMENT '发送时间',
  `receiveId` varchar(32) NOT NULL COMMENT '消息接受者的id',
  `sendType` int(2) NOT NULL COMMENT '消息发送类型',
  `isRetract` int(2) DEFAULT '0' COMMENT '是否撤回/0未撤回/1撤回',
  PRIMARY KEY (`id`),
  KEY `messageSelect` (`sendId`,`receiveId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of message
-- ----------------------------
INSERT INTO `message` VALUES ('1', '18ae102a1f11ae97a5e386614a3e3f62', '我giao', '2023-10-05 09:45:41', '666', '1', '0');
INSERT INTO `message` VALUES ('2', '18ae102a1f11ae97a5e386614a3e3f62', '666', '2023-10-05 09:45:54', '666', '1', '1');
INSERT INTO `message` VALUES ('3', '18ae102a1f11ae97a5e386614a3e3f62', '呵呵', '2023-10-05 09:46:00', '666', '1', '0');
INSERT INTO `message` VALUES ('4', '666', 'eee', '2023-10-05 09:46:19', '18ae102a1f11ae97a5e386614a3e3f62', '1', '0');
INSERT INTO `message` VALUES ('5', '666', 'bbb', '2023-10-05 09:46:22', '18ae102a1f11ae97a5e386614a3e3f62', '1', '1');
INSERT INTO `message` VALUES ('6', '666', 'ccc', '2023-10-05 09:46:25', '18ae102a1f11ae97a5e386614a3e3f62', '1', '0');
INSERT INTO `message` VALUES ('7', '18ae102a1f11ae97a5e386614a3e3f62', '6', '2023-10-05 09:47:15', '666', '1', '0');
INSERT INTO `message` VALUES ('8', '18ae102a1f11ae97a5e386614a3e3f62', '33', '2023-10-06 16:58:40', '666', '1', '0');
INSERT INTO `message` VALUES ('9', '1ec06f53d1e7819bb40827a733ae82b2', '444', '2023-10-06 22:57:51', '666', '1', '0');
INSERT INTO `message` VALUES ('10', '1ec06f53d1e7819bb40827a733ae82b2', '2112', '2023-10-06 23:00:41', '666', '1', '1');
INSERT INTO `message` VALUES ('11', '18ae102a1f11ae97a5e386614a3e3f62', '66', '2023-10-06 23:02:02', '666', '1', '0');
INSERT INTO `message` VALUES ('12', '666', '55', '2023-10-06 23:02:07', '18ae102a1f11ae97a5e386614a3e3f62', '1', '0');
INSERT INTO `message` VALUES ('13', '1ec06f53d1e7819bb40827a733ae82b2', '1', '2023-10-06 23:02:53', '666', '1', '0');
INSERT INTO `message` VALUES ('14', '666', '22', '2023-10-06 23:02:57', '1ec06f53d1e7819bb40827a733ae82b2', '1', '1');
INSERT INTO `message` VALUES ('15', '780d8b30f55dc93a068c1ac026f524c5', '333', '2023-10-07 22:05:32', '666', '1', '1');
INSERT INTO `message` VALUES ('16', '1ec06f53d1e7819bb40827a733ae82b2', '666', '2023-10-07 22:41:09', '666', '1', '0');

-- ----------------------------
-- Table structure for offlinelist
-- ----------------------------
DROP TABLE IF EXISTS `offlinelist`;
CREATE TABLE `offlinelist` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `userId` varchar(32) NOT NULL COMMENT '用户浏览器指纹id',
  `serviceId` int(32) NOT NULL COMMENT '客服Id',
  `userName` varchar(16) NOT NULL COMMENT '用户昵称',
  `ip` varchar(64) DEFAULT NULL COMMENT '用户ip地址',
  `area` varchar(255) DEFAULT NULL COMMENT '用户所在地区',
  `device` varchar(255) DEFAULT NULL COMMENT '用户设备',
  `extend` varchar(10922) DEFAULT NULL COMMENT '用户扩展信息，外部自定义传值',
  `userState` int(1) NOT NULL DEFAULT '0' COMMENT '用户状态',
  `isProhibit` int(12) NOT NULL DEFAULT '0' COMMENT '是否封禁',
  `updateTime` varchar(32) DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `update` (`userId`,`serviceId`) USING BTREE,
  KEY `serviceId` (`serviceId`) USING BTREE,
  KEY `selectOffline` (`serviceId`,`updateTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of offlinelist
-- ----------------------------
INSERT INTO `offlinelist` VALUES ('20', '780d8b30f55dc93a068c1ac026f524c5', '666', '用户780d8b', '1', '本机地址', 'Windows', 'U2FsdGVkX19Cu72hsUuXB3HswRh0dwhfXfd8h7lblZnSnCIz/nQVzj1Niqt94tcTrlnZ8T08ljc/LdmTYWXQC4nw2l1MnFmA8okbGezLsxDst4rHp3B/6Y/rM6R/JzoG', '0', '0', '2023-10-07 22:20:51');
INSERT INTO `offlinelist` VALUES ('22', '1ec06f53d1e7819bb40827a733ae82b2', '666', '轮子哥', '1', '本机地址', 'Android-Moto G (4)', 'U2FsdGVkX19Cu72hsUuXB3HswRh0dwhfXfd8h7lblZnSnCIz/nQVzj1Niqt94tcTrlnZ8T08ljc/LdmTYWXQC4nw2l1MnFmA8okbGezLsxDst4rHp3B/6Y/rM6R/JzoG', '0', '0', '2023-10-07 22:54:31');
INSERT INTO `offlinelist` VALUES ('24', '61f500da3d5eedc794a0d5eaab6e36f5', '666', '用户61f500', '1', '本机地址', 'iOS-iPhone', 'U2FsdGVkX19Cu72hsUuXB3HswRh0dwhfXfd8h7lblZnSnCIz/nQVzj1Niqt94tcTrlnZ8T08ljc/LdmTYWXQC4nw2l1MnFmA8okbGezLsxDst4rHp3B/6Y/rM6R/JzoG', '0', '0', '2023-10-06 15:58:16');
INSERT INTO `offlinelist` VALUES ('26', '18ae102a1f11ae97a5e386614a3e3f62', '666', '用户18ae10', '1', '本机地址', 'Windows', '', '0', '0', '2023-10-06 23:02:44');
INSERT INTO `offlinelist` VALUES ('30', 'd570334e02a04c395059f551cf15e8c5', '666', '用户d57033', '1', '本机地址', 'iOS-iPhone', '', '0', '0', '2023-10-06 17:02:34');
INSERT INTO `offlinelist` VALUES ('31', '8a35e7eb131560e78cc95342dfd9ef2d', '666', '用户8a35e7', '1', '本机地址', 'iOS-iPhone', 'U2FsdGVkX19Cu72hsUuXB3HswRh0dwhfXfd8h7lblZnSnCIz/nQVzj1Niqt94tcTrlnZ8T08ljc/LdmTYWXQC4nw2l1MnFmA8okbGezLsxDst4rHp3B/6Y/rM6R/JzoG', '0', '0', '2023-10-06 17:13:22');

-- ----------------------------
-- Table structure for service
-- ----------------------------
DROP TABLE IF EXISTS `service`;
CREATE TABLE `service` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serviceId` varchar(32) NOT NULL COMMENT '客服id',
  `servicePassword` varchar(16) NOT NULL COMMENT '客服密码',
  `serviceName` varchar(32) NOT NULL COMMENT '客服昵称',
  `serviceState` int(1) NOT NULL DEFAULT '0' COMMENT '客服状态',
  `serviceFrequency` int(16) NOT NULL DEFAULT '0' COMMENT '客服接待次数',
  `serviceAccount` varchar(16) NOT NULL COMMENT '客服账号',
  `serviceMax` int(4) NOT NULL DEFAULT '5' COMMENT '客服最大接待次数',
  PRIMARY KEY (`id`),
  KEY `loginSelect` (`servicePassword`,`serviceAccount`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of service
-- ----------------------------
INSERT INTO `service` VALUES ('1', '666', '666', '轮子哥', '0', '659', '666', '3');
INSERT INTO `service` VALUES ('2', '123456', '123456', '轮子哥测试号222', '0', '0', '123456', '5');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `userId` varchar(32) NOT NULL COMMENT '用户浏览器指纹id',
  `userName` varchar(16) NOT NULL COMMENT '用户昵称',
  `ip` varchar(64) DEFAULT NULL COMMENT '用户ip地址',
  `area` varchar(255) DEFAULT NULL COMMENT '用户所在地区',
  `device` varchar(255) DEFAULT NULL COMMENT '用户设备',
  `extend` varchar(10922) DEFAULT NULL COMMENT '扩展信息',
  `userState` int(1) NOT NULL DEFAULT '0' COMMENT '用户状态',
  `isProhibit` int(12) NOT NULL DEFAULT '0' COMMENT '是否封禁',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('9', '18ae102a1f11ae97a5e386614a3e3f62', '用户18ae10', '1', '本机地址', 'Windows', '', '0', '0');
INSERT INTO `user` VALUES ('10', '05b6a0aa97ca6873bc1ca76844561b47', '用户05b6a0', '1', '本机地址', 'Windows', '', '0', '0');
INSERT INTO `user` VALUES ('11', '9a1abf2c5adf996e43c54935d7c9a01e', '用户9a1abf', '1', '本机地址', 'Windows', '', '0', '0');
INSERT INTO `user` VALUES ('12', 'd570334e02a04c395059f551cf15e8c5', '用户d57033', '1', '本机地址', 'iOS-iPhone', '', '0', '0');
INSERT INTO `user` VALUES ('13', '8a35e7eb131560e78cc95342dfd9ef2d', '用户8a35e7', '1', '本机地址', 'iOS-iPhone', '', '0', '0');
INSERT INTO `user` VALUES ('14', '1ec06f53d1e7819bb40827a733ae82b2', '轮子哥', '1', '本机地址', 'Android-Moto G (4)', 'U2FsdGVkX19Cu72hsUuXB3HswRh0dwhfXfd8h7lblZnSnCIz/nQVzj1Niqt94tcTrlnZ8T08ljc/LdmTYWXQC4nw2l1MnFmA8okbGezLsxDst4rHp3B/6Y/rM6R/JzoG', '0', '0');
INSERT INTO `user` VALUES ('15', '780d8b30f55dc93a068c1ac026f524c5', '用户780d8b', '1', '本机地址', 'Windows', 'U2FsdGVkX19Cu72hsUuXB3HswRh0dwhfXfd8h7lblZnSnCIz/nQVzj1Niqt94tcTrlnZ8T08ljc/LdmTYWXQC4nw2l1MnFmA8okbGezLsxDst4rHp3B/6Y/rM6R/JzoG', '0', '0');
