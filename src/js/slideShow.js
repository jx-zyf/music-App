function ChangeImg(wrap,lis,imgs,speed){
    this.wrap=wrap;
    this.lis=lis;
    this.imgs=imgs;
    this.speed=speed||2000;
    this.curIndex=0;
    this.handle=null;
    this.init();
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