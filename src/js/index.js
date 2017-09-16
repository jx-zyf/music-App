// 轮播图
(function slideShow(){
    let slide=$('.slide');
    let slideImgs=$('.slideImg img');
    let slideLis=$('.slideImg ul li');
    new ChangeImg(slide,slideLis,slideImgs,2500);
})();

// 选项卡切换
(function tab(){
    $('.header_nav').on('click touchend',function(e){
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
                musicList.forEach(function(item){
                    let $a=$(`<a href="javascript:;">
                        <div class="musicIndex">${item.id}</div>
                        <div class="musicContent">
                            <h3>${item.name}</h3>
                            <p>${item.singer}<span>${item.description}</span></p>
                        </div>
                    </a>`);
                    $('.hot_music>.musicList').append($a);
                });
                // 请求过的标志
                $('.content>ul>li').eq(index).attr('data-downloaded','yes');
                $('.hot_music>.musicList').append($fullList);
                $('.loading').remove();
            },function(err){
                console.log('error:'+err);
            })
        }
    })
})();

// 搜索页
// 搜索框逻辑
(function focusShowCancel(){
    $('#search').on('focus',function(){
        // 获得焦点时取消按钮出现，热门搜索隐藏
        $('.search_cancel').css('display','block').animate({
            opacity:1
        },600);
        $('.hot_search').css('display','none');
    }).on('blur',function(){
        // 失去焦点时取消按钮隐藏
        $('.search_cancel').animate({
            opacity:0
        },600);
        setTimeout(function(){
            $('.search_cancel').css('display','none');
        },600)
        // 失去焦点 并value为空 热门搜索出现
        if($('#search').val()===''){
            $('.hot_search').css('display','block');
        }
    });

    // $('.search_cancel').on('click',function(){
    //     $('.search_cancel').animate({
    //         opacity:0
    //     },600);
    // });
})();
// 搜索
async function search(keyword){
    var searchResult=[];
    var database;
    // 异步操作
    if(keyword=='') return;
    await $.get('./music.json').then(function(result){
        database=result;
        var search_result=database.filter(function(item){
            return item.name.indexOf(keyword)>=0
                    ||item.name.indexOf(keyword.toLowerCase())>=0
                    ||item.name.indexOf(keyword.toUpperCase())>=0
                    ||item.singer.indexOf(keyword)>=0
                    ||item.singer.indexOf(keyword.toLowerCase())>=0
                    ||item.singer.indexOf(keyword.toUpperCase())>=0
                    ||item.description.indexOf(keyword)>=0
                    ||item.description.indexOf(keyword.toLowerCase())>=0
                    ||item.description.indexOf(keyword.toUpperCase())>=0;
        })
        searchResult=search_result.slice(0);
    },function(err){
        console.log('error:'+err);
    });
    // 等异步操作完成后再返回
    return searchResult;
}
// search('云长').then(function(res){
//     console.log(res);
// });
// 显示搜索结果
function showList(){
    var keyword=$('#search').val();
    search(keyword).then(function(res){
        // 没有输入关键字
        if(res==undefined){
            return;
        }
        // 没找到结果
        if(res.length===0){
            $('.search .musicList').append('<div class="no_result">暂无结果</div>');
        }else{
            res.forEach(function(item){
                let $li=$(`<a href="javascript:;">
                    <div class="musicContent">
                        <h3>${item.name}</h3>
                        <p>${item.singer}<span>${item.description}</span></p>
                    </div>
                </a>`);
                $('.search .musicList').append($li);
            })
        }
    })
    // oninput/onpropertchange value变化就触发，
    // 而onchange触发事件必须满足两个条件：
    // a）当前对象属性改变，并且是由键盘或鼠标事件激发的（脚本触发无效）
    // b）当前对象失去焦点(onblur)
    $('#search').on('change input propertychange',function(){
        if($('#search').val()==''){
            // 清空搜索结果
            $('.search .musicList').empty();
        }
    });
}
document.addEventListener('keyup',function(e){
    if(e.keyCode===13){
        showList();
    }
})