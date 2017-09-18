function ChangeImg(wrap,lis,imgs,speed){
    this.wrap=wrap;
    this.lis=lis;
    this.imgs=imgs;
    this.speed=speed||2000;
    this.curIndex=0;
    this.handle=null;
    this.init();
    this.touch();
}
ChangeImg.prototype={
    nextImg:function(nextIndex){
        this.imgs[this.curIndex].className="active hide";
        this.lis[this.curIndex].className="";
        this.imgs[nextIndex].className="active show";
        this.lis[nextIndex].className="select";
        this.curIndex=nextIndex;
    },
    start:function(){
        var _this=this;
        this.handle=setInterval(function(){
            _this.nextImg(_this.curIndex+1>=_this.imgs.length?0:_this.curIndex+1);
        },this.speed);
    },
    stop:function(){
        clearInterval(this.handle);
    },
    touch:function(){
        this.imgs.ontouchmove=function(e){
            // 如果有多个地方滑动，我们就不发生这个事件
            if(e.targetTouches.length > 1){
                return;
            }
            var iTouch = e.targetTouches[0];
            endPos = {x:iTouch.pageX,y:iTouch.pageY}
            // 判断出滑动方向，向右为1，向左为-1
            var scrollDirection = iTouch.pageX-startPos.x > 0 ? 1 : -1;
            var nextIndex=this.curIndex+scrollDirection;
            nextIndex>=this.imgs.length?this.imgs.length:nextIndex;
            nextIndex<=0?0:nextIndex;
            // console.log(nextIndex);
            this.nextImg(nextIndex);
        }
    },
    init:function(){
        var _this=this;
        this.start();
        this.wrap.onmouseover=function(){
            _this.stop();
        };
        this.wrap.onmouseout=function(){
            _this.start();
        };
        for(var i=0,l=this.lis.length;i<l;i++){
            (function(i){
                _this.lis[i].onclick=function(){
                    _this.nextImg(i);
                }
            })(i);
        }
    }
}