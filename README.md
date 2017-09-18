# music-App

[预览](https://jx-zyf.github.io/music-App/src/index.html)

效果图
![](https://github.com/jx-zyf/music-App/blob/master/result/result.gif)

pc端请到调试窗口(F12)查看，移动端直接预览

排行榜中的歌单由jQuery ajax请求存储歌曲信息的.json文件动态生成，搜索页也是如此；

音乐播放界面主要用了H5中的audio及其API，歌词滚动的逻辑是位于两条歌词出现时间点之间，则显示前面的歌词，当然如果是最后一条歌词就没有下一条了
