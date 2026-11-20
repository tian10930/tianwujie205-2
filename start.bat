@echo off
chcp 65001
title 全栈项目本地服务
cd /d %~dp0backend
call npm start
pause
