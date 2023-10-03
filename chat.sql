/*
Navicat MySQL Data Transfer

Source Server         : 本地mysql
Source Server Version : 50527
Source Host           : localhost:3306
Source Database       : chat

Target Server Type    : MYSQL
Target Server Version : 50527
File Encoding         : 65001

Date: 2023-10-03 21:11:24
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
  PRIMARY KEY (`id`),
  KEY `messageSelect` (`sendId`,`receiveId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of message
-- ----------------------------

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
INSERT INTO `service` VALUES ('1', '666', '666', '大家', '0', '369', '666', '4');
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
  `extend` text COMMENT '用户扩展信息，外部自定义传值',
  `userState` int(1) NOT NULL DEFAULT '0' COMMENT '用户状态',
  `isProhibit` int(12) NOT NULL DEFAULT '0' COMMENT '是否封禁',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('80', '18ae102a1f11ae97a5e386614a3e3f62', '用户18ae10', '1', '本机地址', 'Windows', null, '0', '0');
