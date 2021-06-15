(function(){
    function jQuery (selector){
        return new jQuery.prototype.init(selector);
    }

    jQuery.prototype.init = function(selector){
        this.length = 0;
        if(selector == null){
            return this;
        }
        if(typeof(selector) == "string" && selector.indexOf(".") != -1){
            var dom = document.getElementsByClassName(selector.slice(1));
        }else if(typeof(selector) == "string" && selector.indexOf("#") != -1){
            var dom = document.getElementById(selector.slice(1));
        }

        if(selector instanceof Element || dom.length == undefined){
            this[0] = dom || selector;
            this.length++;
        }else{
            for(var i = 0; i < dom.length; i ++){
                this[i] = dom[i];
                this.length++;
            }
        }
    }

    jQuery.prototype.css = function(decObj){
        for(var i = 0; i < this.length; i++){
            for(var prop in decObj){
                this[i].style[prop] = decObj[prop];
            }
        }
        return this;
    }

    jQuery.prototype.get = function(index){
        return index == null ? [].slice.call(this,0) : (index >= 0 ? this[index] : this[index + this.length]);
    }

    jQuery.prototype.eq = function(index){
        var dom = index == null ? null : (index >= 0 ? this[index] : this[index + this.length]);
        return this.addPrevObject(dom);
    }

    jQuery.prototype.addPrevObject = function(dom){
        if(dom.constructor != jQuery){
            dom = jQuery(dom);
        }
        dom.prevObject = this;
        
        return dom;
    }

    jQuery.prototype.add = function (selcetor){
        var addDom = jQuery(selcetor);

        // var newDom = this;
        // 这边拿到的this是jq对象。对象类型之间的赋值是地址的指向。
        //this把自己的空间链接给了newDom
        // console.log(this);
        // for(var i = 0; i < addDom.length; i ++){
        //     newDom[newDom.length++ + i] = addDom[i]
        // }
        // 给引用位置添加了东西，this也会跟着改变。
        // console.log(this);
        // this.addPrevObject(newDom);
        // return newDom;

        
        // 正常的
        var self = this;
        var newDom = jQuery();
        // console.log(this);
        for(var i = 0; i < self.length; i++){
            newDom[i] = self[i];
        }
        for(var i = newDom.length++; i < addDom.length; i++){
            newDom[newDom.length++] = addDom[i];
        }
        // console.log(this);
        this.addPrevObject(newDom);
        
        return newDom;

    }
    jQuery.prototype.end = function(){
        return this.prevObject;
    }

    jQuery.prototype.selfOn = function(type,handle){
        // for(var i = 0; i < this.length; i++){
        //     if(!this[i].cacheEvent){
        //         this[i].cacheEvent = {};
        //     }
        //     if(!this[i].cacheEvent[type]){
        //         this[i].cacheEvent[type] = [handle]
        //     }else{
        //         this[i].cacheEvent[type].push(handle);
        //     }
        // }
        this.createObjectForDom("cacheEvent",type,handle);
        return this;
    }

    jQuery.prototype.selfTrigger = function(type){
        var list = arguments.length > 1 ? [].slice.call(arguments,1) : null;
        var self = this;
        for(var i = 0; i < this.length; i++){
            if(this[i].cacheEvent[type]){
                this[i].cacheEvent[type].forEach(function(ele,index){
                    ele.apply(self,list);
                    //为什么要用apply？因为apply传递方式是数组型的。
                    //为什么要用self？ 因为要保持两边this指向相同。
                });
            }    
        }
        return this;
    }

    jQuery.prototype.myQueue = function(queueName,handle){
        queueName = queueName || 'fx';
        if(handle){
            // for(var i = 0; i < this.length; i ++){
            //     if(!this[i].queue){
            //         this[i].queue = {};
            //     }
            //     if(!this[i].queue[queueName]){
            //         this[i].queue[queueName] = [handle];
            //     }else{
            //         this[i].queue[queueName].push(handle);
            //     }
            // }
            this.createObjectForDom("queue",queueName,handle);
        }else{
            return this[0].queue[queueName];
        }
        return this;
    }

    jQuery.prototype.myDequeue = function(queueName){
        queueName = queueName || 'fx';
        var shiftFn;
        var self = this;
        var next = function(){
            self.myDequeue(queueName);
        }
        for(var i = 0; i < this.length; i ++){
            shiftFn = this[i].queue[queueName].shift();
            if(shiftFn == null){
                break;
            }
            shiftFn(next);
            //从数组弹出的函数进行执行，在执行的传递next这个参数，next是个函数
            //只有当shiftFn执行体中有next执行的时候,才会调用next方法。
            //next方法是，再一次的执行元素筐中队列的内容。
            //其实最后的出口也可以是没有next（）调用了
            //然后能返回的是this，返回到了self.myDequeue(queueName)身上。
            //但是，对于没有以next()进行结束处理的话，意思是在绑定的入队的时候每个都带了next（）
            //还是会报错的，所以还是把出口做好。
        }
        return this;
    }


    //完全实现了，在dom元素身上绑定一系列我们想要的数据或方法。
    jQuery.prototype.createObjectForDom = function(objName,typeName,handle){
        for(var i = 0; i < this.length; i ++){
            if(!this[i][objName]){
                this[i][objName] = {};
            }
            if(!this[i][objName][typeName]){
                this[i][objName][typeName] = [handle];
            }else{
                this[i][objName][typeName].push(handle);
            }
        }
    }

    jQuery.prototype.myDelay = function(delayMs){
        this.myQueue("animate",function(next){
            setTimeout(function(){
                console.log(delayMs);
                next();                
            },delayMs)
        });
        return this;
    }

    jQuery.prototype.myAnimate = function(targetObj,callback){
        var len = this.length;
        var self = this;
        var queueFn = function(next){
            var times = 0;
            for(var i = 0; i < len; i++){
                startMove(self[i],targetObj,function(){
                    times++;
                    if(times == len){
                        callback && callback();
                        next();
                    }
                });
            }
        }
        this.myQueue("animate",queueFn);
        //console.log(this.myQueue("animate"));
        if(this.myQueue("animate").length == 1){
            this.myDequeue("animate");
        }
        
        function getStyle (obj, attr) {
            if (obj.currentStyle) {
                return obj.currentStyle[attr];
            }else {
                return window.getComputedStyle(obj,false)[attr];
            }
        }
                
        function startMove (obj, json, callblack) {
            clearInterval(obj.timer);
            var iSpeed;
            var iCur;
            var name;
            obj.timer = setInterval(function () {
                var bStop = true;
                for (var attr in json) {                            
                    if (attr === 'opacity') {                                
                        name = attr;
                        iCur = parseFloat(getStyle(obj, attr)) * 100;
                    }else {
                        iCur = parseInt(getStyle(obj, attr));
                    }                            
                    iSpeed = (json[attr] - iCur) / 7;
                    if (iSpeed > 0) {
                        iSpeed = Math.ceil(iSpeed);
                    }else {
                        iSpeed = Math.floor(iSpeed);
                    }
                    if (attr === 'opacity') {
                        obj.style.opacity = (iCur + iSpeed) / 100;
                    }else {
                        obj.style[attr] = iCur + iSpeed + 'px';
                    }
                    if (json[attr] - iCur !== 0) {
                        bStop = false;
                    }
                }
                if (bStop) {
                    clearInterval(obj.timer);
                    callblack();
                }
            }, 30);
        }
        return this;
    }

    jQuery.myCallbacks = function(){
        var options = arguments[0] || '';
        var fireIndex = 0;
        var fired = false;
        var list = [];
        var args= [];
        function fire (){
            for(;fireIndex < list.length ; fireIndex++){
                list[fireIndex].apply(window,args);
            }
            if(options.indexOf('once') != -1){
                list = [];
                fireIndex = 0;
            }
            
        }
        return {
            add : function(func){
                list.push(func);
                if(options.indexOf('memory') != -1 && fired){
                    fire();
                }
                return this;
            },
            fire : function(){
                fireIndex = 0;
                args = arguments;
                fired = true;
                fire();
            }
        }
    }

    jQuery.myDeferred = function () {
        // callback 
        // 3个callback
        // done resolve    fail reject     progress notify
        var arr = [
            [
                jQuery.myCallbacks('once memory'), 'done', 'resolve'
            ],[
                jQuery.myCallbacks('once memory'), 'fail', 'reject'
            ],[
                jQuery.myCallbacks('memory'), 'progress', 'notify'
            ]
        ];

        var pendding = true;

        var deferred = {};

        for (var i = 0; i < arr.length; i++) {
            deferred[ arr[i][1] ] = (function (index) {
                return function (func) {
                    arr[index][0].add(func)
                }
            })(i);
            deferred[ arr[i][2] ] =  (function (index) {
               return function () {
                    var args = arguments;
                    if (pendding) {
                        arr[index][0].fire.apply(window, args);
                        arr[index][2] == 'resolve' || arr[index][2] == 'reject' ? pendding = false : '';
                    }
                    
               }
            })(i);
        }


        return deferred;
    }


    jQuery.prototype.init.prototype = jQuery.prototype;

    window.$ = window.myJquery = jQuery;
}());