$(function(){
    let id=location.search.match(/id=([^]*)/)[1];  //获取音乐id
    $.get('../play.json').then(function(result){
        let song=result.filter(item=>item.id==id);
        let {url,lyric,name,coverimg,bgimg}=song[0];
        setImg(bgimg,coverimg);
    },function(err){
        console.log('error:'+err);
    });
    function setImg(bgimg,coverimg){
        $('.play_page').css('background',`url(${bgimg}) center /cover transparent`)
        $('.song_img').css('background',`url(${coverimg}) center /cover transparent`)
    }
})