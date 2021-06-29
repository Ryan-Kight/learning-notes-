# Git分布式版本控制系统
1. 记录版本
2. 方便协同开发

### Git日常工作流
- Remote Git远程仓库（pull到工作目录，clone到本地仓库）
- Repository Git本地仓库（push到远程仓库，checkout到工作目录）
- Staging Area 暂存区（commit到本地仓库）
- Working Directory 工作目录（add到暂存区）

### 使用Git的基本流程
1. 初始化仓库 git init
2. 仓库中出现新文件，文件后面会出现U的标识（untracked）为跟踪，未记录
3. git add 文件名 A （added） 使文件进入staged状态
4. 如果对文件进行修改了的话，后缀提示M （modified）调整过，稍作修改的表示。
5. 改变了，就要告诉git，所以要再次 git add 修改过的文件，再次告知。
6. git commit 成为一次版本 ：
    - 进入对此文件版本的描述界面，第一行添加描述
    - ESC后， :wq (writed quite)
    - 一般情况下，我们用git commit -m "描述"  进行版本描述

### Git工作区及文件状态
- working directory 工作目录 : 文件会存在两种 untracked modified  (git add *)
- staging area 暂存区 :  文件状态是 staged (commit *)
- repository 本地仓库 : 文件状态是commited

### 远程仓库
- 利用远程仓库的地址载到本地，然后进行开发后，再推送到远端。
- git push origin 分支名 远端仓库名
- ssh-keygen 命令 建立ssh密钥，与github上的进行绑定
  
### git命令集合
- git config --list 能查看你的用户信息
- git config --global user.name 配置用户信息
- git config --global user.email 配置你的邮箱
- git init 初始化仓库
- git add . 将工作目录中的所有内容存入暂存区（可以让他全家变绿）
- git commit -m "描述" 将暂存区内的内容存到本地仓库
- git status 查看仓库状态: 红色的为修改的未登记，新创建的未登记。绿色的为已经登记过的
- git log 可以查看做了哪些改动
- git log -p 就能看到每次改动的内容
- git reset --hard HEAD^ 回退到上个版本，之后的版本会被删除
- git reset --hard HEAD~1/2/3 回退一个/两个/三个版本
- git reflog 查看版本回退情况
- git reset --hard 版本号前六位 重置到该版本
- git diff 比较工作区与暂存区区别
- git diff HEAD 与上版本的差异
- git diff 版本号1 版本号2
### 项目协同
- git checkout -b 分支名称 创建并切换
- git checkout 分支名称    切换到该分支
- git branch    用于查看分支
- git branch 分支   创建新的分支
- git merge 分支名  当前分支与选中分支进行合并

