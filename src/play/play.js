$(function(){
    let id=location.search.match(/id=([^]*)/)[1];  //获取音乐id
    start(id);
})

// 进入播放界面
function start(id){
    $.get('../play.json').then(function(result){
        let song=result.filter(item=>item.id==id);
        // 获取歌曲信息
        let {url,lyric,name,coverimg,bgimg,singer}=song[0];
        // 设置歌曲信息
        setInfo(bgimg,coverimg,name,singer);
        // 获取歌词信息
        getlyric(lyric);
        // 开始播放
        play(url);
    },function(err){
        console.log('error:'+err);
    });
}

function setInfo(bgimg,coverimg,name,singer){
    $('.play_page').css('background',`url(${bgimg}) center /cover transparent`);
    $('.song_img').css('background',`url(${coverimg}) center /cover transparent`);
    $('.song_info>h2').text(name);
    $('.song_info>span').text(singer);
}

function play(url){
    var $audio=$('.audio');
    let mPlay=$('.icon_play');
    let endminute,endsecond,endTime;
    $audio.attr('src',url);
    $audio.on('canplay',function(){
        $audio[0].play();
        // 计算歌曲总时长
        let endminute=Math.floor(this.duration/60);
        let endsecond=Math.floor(this.duration%60);
        endTime=`${doublee(endminute)}:${doublee(endsecond)}`;
        $('.time_end').text(endTime);
    });
    // 当媒体播放停止时，会触发ended事件
    $audio.on('ended',function(){
        mPlay.css('background-position','center top');
        mPlay.attr('data-play','false');
    });
    mPlay.on('click',function(){
        if(mPlay.attr('data-play')==='true'){
            // 暂停
            $audio[0].pause();
            mPlay.css('background-position','center top');
            mPlay.attr('data-play','false');
        }else{
            // 播放
            $audio[0].play();
            mPlay.css('background-position','center 69.5%')
            mPlay.attr('data-play','true');
        }
    })
    setInterval(function(){
        //计算当前播放时间
		let curminute=Math.floor($audio[0].currentTime/60);
		let cursecond=Math.floor($audio[0].currentTime%60);
        let curTime=`${doublee(curminute)}:${doublee(cursecond)}`;
		$('.time_now').text(curTime);
        $('.now_progress').css('width',`${$audio[0].currentTime*100/$audio[0].duration}%`);
        
        // 歌词滚动
        let $p=$('.lyric p');
        let curlyric;
        for(var i=0;i<$p.length;i++){
            if($p.eq(i).length!==0&&$p.eq(i).attr('data-time')<curTime&&curTime<$p.eq(i+1).attr('data-time')){
                $p.eq(i).addClass('curlyric').siblings().removeClass('curlyric');
                curlyric=$p.eq(i);
            }
        }
        if(curlyric){
            let top=$('.curlyric').offset().top;
            let lineTop=$('.lyric').offset().top;
            let speed=top-lineTop-$('.lyric_wrap').height()/3;
            $('.lyric').css('transform',`translateY(-${speed}px)`);
        }
    },500)
    // 收藏
    $('.m_like').on('click',function(){
        if($(this).attr('data-like')==='true'){
            $(this).css('background-position','left 9%');
            $(this).attr('data-like','false');
        }else{
            $(this).css('background-position','left top');
            $(this).attr('data-like','true');
        }
    })
}

function getlyric(lyric){
    let arr=lyric.split('\n');
    let reg=/^\[(.+)\](.*)$/;
    arr=arr.map(function(item){
        let lyricInfo=reg.exec(item);
        if(lyricInfo){
            return {
                time:lyricInfo[1],
                words:lyricInfo[2]
            }
        }
    });
    arr.forEach(function (item) {
        let $p =$('<p></p>') 
        if (typeof item === 'object' && item.hasOwnProperty('words')) {
            $p.attr('data-time',item.time).text(item.words)
        }
        $p.appendTo($('.lyric'))
    });
}

//格式化时间
function doublee(num){
	return num>=10?num:'0'+num
}