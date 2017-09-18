$(function(){
    // 封面
    // 消失时间随机
    let time=Math.floor(Math.random()*1600);
    setTimeout(function(){
        $('.cover').css('display','none');
    },time);

    // 点击logo跳转到官网
    $('.music_logo').on('click',function(){
        window.open('https://y.qq.com');
    });

    // 由于歌曲有限，首页电台、热门歌单指定跳转到一首音乐
    $('.music_play').on('click',function(e){
        if($(e.target).parent().attr('data-mid')){
            let m_id=$(this).attr('data-mid');
            window.location.href=`./play/play.html?id=${m_id}`;
        }else{
            return;
        }
    });

    // 轮播图
    slideShow();

    // 选项卡切换
    $('.header_nav').on('click','span',function(e){
        let curSpan=e.target;
        let index=$(curSpan).index();
        $(curSpan).addClass('active').siblings().removeClass('active');
        $('.content>ul>li').eq(index).addClass('select').siblings().removeClass('select');

        if(index===1){
            // 排行榜请求
            $.get('./music.json').then(function(result){
                if($('.content>ul>li').eq(index).attr('data-downloaded')==='yes'){
                    // 防止无限请求
                    return;
                }
                let musicList=result;
                let $fullList=$(`<div class="fullList">
                    <p>
                        <img src="./images/QQ_Music_favicon.png" />
                        <span>查看完整榜单</span>
                    </p>
                </div>`)
                musicList.forEach(function(item){
                    let $a=$(`<a href="./play/play.html?id=${item.id}">
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

    // 搜索框逻辑
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

    // 热门歌曲点击搜索
    $('.hot_search .hot_search_list').on('click',function(e){
        if(e.target.tagName==='LI'){
            // 热门搜索隐藏
            $('.hot_search').css('display','none');
            // 输入框显示点击的内容
            $('#search').val($(e.target).text());
            // 显示搜索结果
            search($(e.target).text());
        }
    })
    // 回车搜索
    document.addEventListener('keyup',function(e){
        var keyword=$('#search').val();
        if(e.keyCode===13){
            // 将前一次结果清空
            $('.search .musicList').empty();
            search(keyword);
        }
    })
});

// 轮播图
function slideShow(){
    let slide=$('.slide');
    let slideImgs=$('.slideImg img');
    let slideLis=$('.slideImg ul li');
    new ChangeImg(slide,slideLis,slideImgs,3000);
};
// 发送请求核对信息并展示搜索结果
function search(keyword){
    var searchResult=[];
    var database;
    // 异步操作
    if(keyword=='') return;
    $.get('./music.json').then(function(result){
        database=result;
        searchResult=database.filter(function(item){
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
        if(searchResult.length===0){
            if($('.no_result').length!==0){
                return;
            }
            $('.search .musicList').append('<div class="no_result">暂无结果</div>');
        }else{
            searchResult.forEach(function(item){
                let $li=$(`<a href="./play/play.html?id=${item.id}">
                    <div class="musicContent">
                        <h3>${item.name}</h3>
                        <p>${item.singer}<span>${item.description}</span></p>
                    </div>
                </a>`);
                $('.search .musicList').append($li);
            })
        }
        $('#search').on('change input propertychange',function(){
            if($('#search').val()==''){
                // 清空搜索结果
                $('.search .musicList').empty();
            }
        });
    },function(err){
        console.log('error:'+err);
    });
}

// 一个巨坑：安卓浏览器不支持async await

// 显示搜索结果
// function showList(keyword){
//     search(keyword).then(function(res){
//         // 没有输入关键字
//         if(res==undefined){
//             return;
//         }
//         // 没找到结果
//         if(res.length===0){
//             if($('.no_result').length!==0){
//                 return;
//             }
//             $('.search .musicList').append('<div class="no_result">暂无结果</div>');
//         }else{
//             res.forEach(function(item){
//                 let $li=$(`<a href="./play/play.html?id=${item.id}">
//                     <div class="musicContent">
//                         <h3>${item.name}</h3>
//                         <p>${item.singer}<span>${item.description}</span></p>
//                     </div>
//                 </a>`);
//                 $('.search .musicList').append($li);
//                 // $('.search .musicList a').each(function(i,v){
//                 //     if($(v).html()===$li.html()){
//                 //         $(v).remove();
//                 //     }
//                 // })
//             })
//         }
//     })

//     // oninput/onpropertchange value变化就触发，
//     // 而onchange触发事件必须满足两个条件：
//     // a）当前对象属性改变，并且是由键盘或鼠标事件激发的（脚本触发无效）
//     // b）当前对象失去焦点(onblur)
//     $('#search').on('change input propertychange',function(){
//         if($('#search').val()==''){
//             // 清空搜索结果
//             $('.search .musicList').empty();
//         }
//     });
// }