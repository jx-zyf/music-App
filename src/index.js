// 轮播图
(function slideShow(){
    let slide=$('.slide');
    let slideImgs=$('.slideImg img');
    let slideLis=$('.slideImg ul li');
    new ChangeImg(slide,slideLis,slideImgs,2500);
})();

// 选项卡切换
(function tab(){
    $('.header_nav').on('click',function(e){
        let curA=e.target;
        let index=$(curA).index();
        if(curA.tagName==='A'){
            $(curA).addClass('active').siblings().removeClass('active');
            $($('.content>ul>li')[index]).addClass('select').siblings().removeClass('select');
        }
        if(index===1){
            // 排行榜请求
            if($('.content>ul>li').eq(index).attr('data-downloaded')==='yes'){
                // 防止无限请求
                return;
            }
            $.get('./music.json').then(function(result){
                let musicList=result;
                let $fullList=$(`<div class="fullList">
                    <p>
                        <img src="./images/QQ_Music_favicon.png" />
                        <span>查看完整榜单</span>
                    </p>
                </div>`)
                console.log(musicList);
                musicList.forEach(function(item){
                    let $a=$(`<a href="javascript:;">
                        <div class="musicIndex">${item.id}</div>
                        <div class="musicContent">
                            <h3>${item.name}</h3>
                            <p>${item.singer}<span>${item.description}</span></p>
                        </div>
                    </a>`);
                    $('.musicList').append($a);
                });
                // 请求过的标志
                $('.content>ul>li').eq(index).attr('data-downloaded','yes');
                $('.musicList').append($fullList);
                $('.loading').remove();
            },function(err){
                console.log('error:'+err);
            })
        }
    })
})();