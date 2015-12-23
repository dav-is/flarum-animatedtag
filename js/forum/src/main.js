import { extend } from 'flarum/extend';
import CommentPost from 'flarum/components/CommentPost';
import DiscussionListItem from 'flarum/components/DiscussionListItem';

app.initializers.add('davis-animatedtag', function() {
    extend(CommentPost.prototype, 'config', function() {
        renderani(app.forum.attribute('animationtype'),0);
    });
    extend(DiscussionListItem.prototype, 'config', function() {
        renderani(app.forum.attribute('animationtype'),1);
    });
    
    function renderani(type, where){
        //Make sure canvas doesn't get added twice
        if (document.getElementById('tag-canvas')) { } else {
            //Define Varibles
            var width, largeHeader, canvas, ctx, triangles, circles, height, target, heroitems, animateHeader = true;
            var tpcolor = {};
            var colors = [];
            var i = 0;
            
            //Define color of hero background
            var cltp = document.getElementsByClassName("Hero")[0].style['background-color'];
            cltp = cltp.substring(4, cltp.length-1)
                 .replace(/ /g, '')
                 .split(',');
            cltp[0] = Number(cltp[0]);
            cltp[1] = Number(cltp[1]);
            cltp[2] = Number(cltp[2]);
            //Convert Hero Background to HEX
            var cl = $ui.color.rgb2hex(cltp);
            //Get Tetradic Colors from background
            var tempclr = $ui.color.tetradic(cl);
            //Remove Background color from group
            tempclr.splice(0, 1);
            //Put colors into array
            while (i < 3) {
                //Change color to RGB
                tpcolor[i] = $ui.color.hex2rgb(tempclr[i]);
                //Change RGB Array into String
                colors[i] = tpcolor[i][0]+","+tpcolor[i][1]+","+tpcolor[i][2];
                //Go to next color
                i++;
            }
            //Run Animation
            initHeader();
            addListeners();
        
            function initHeader() {
                width = window.innerWidth;
                var topbar;
                if (window.innerWidth > 768) {
                    topbar = 52;
                    switch (where){
                        case 0:
                            height = 141;
                        break;
                        case 1:
                            height = 111;
                        break;
                    }
                } else {
                    topbar = 46;
                    switch (where){
                        case 0:
                            height = 102;
                        break;
                        case 1:
                            height = 72;
                        break;
                    }
                }
                target = {x: 0, y: height};

                largeHeader = document.getElementsByClassName("Hero")[0];
                heroitems = document.getElementsByClassName("container")[1];
                largeHeader.style.height = height+'px';
                heroitems.style.top = topbar+"px";
                
                var canvastemp = document.createElement('canvas');
                canvastemp.setAttribute("id", "tag-canvas");
                if(document.getElementById('tag-canvas')) { } else {
                largeHeader.insertBefore(canvastemp, largeHeader.firstChild);
                }
        
                canvas = document.getElementById('tag-canvas');
                canvas.width = width;
                canvas.height = height;
                ctx = canvas.getContext('2d');
        
                // create particles
                switch (type) {
                    case "0":
                        triangles = [];
                        for(var x = 0; x < 480; x++) {
                            addTriangle(x*10);
                        }
                    break;
                    case "1":
                        circles = [];
                        for(var x = 0; x < width*0.5; x++) {
                            var c = new Circle();
                            circles.push(c);
                        }
                    break;
                    case "2":
                        circles = [];
                        for(var x = 0; x < width*0.5; x++) {
                            var c = new Circle();
                            circles.push(c);
                        }
                    break;
                }
               animate();
            }
        
            function addTriangle(delay) {
                setTimeout(function() {
                    var t = new Triangle();
                    triangles.push(t);
                    tweenTriangle(t);
                }, delay);
            }
        
            function tweenTriangle(tri) {
                var t = Math.random()*(2*Math.PI);
                var x = (200+Math.random()*100)*Math.cos(t) + width*0.5;
                var y = (200+Math.random()*100)*Math.sin(t) + height*0.5-20;
                var time = 4+3*Math.random();
        
                TweenLite.to(tri.pos, time, {x: x,
                    y: y, ease:Circ.easeOut,
                    onComplete: function() {
                        tri.init();
                        tweenTriangle(tri);
                }});
            }
        
            // Event handling
            function addListeners() {
                window.addEventListener('scroll', scrollCheck);
                window.addEventListener('resize', resize);
            }
        
            function scrollCheck() {
                if(document.body.scrollTop > height) animateHeader = false;
                else animateHeader = true;
            }
        
            function resize() {
                width = window.innerWidth;
                var topbar;
                if (window.innerWidth > 768) {
                    topbar = 52;
                    switch (where){
                        case 0:
                            height = 141;
                        break;
                        case 1:
                            height = 111;
                        break;
                    }
                } else {
                    topbar = 46;
                    switch (where){
                        case 0:
                            height = 102;
                        break;
                        case 1:
                            height = 72;
                        break;
                    }
                }
                heroitems.style.top = topbar+"px";
                largeHeader.style.height = height+'px';
                canvas.width = width;
                canvas.height = height;
            }
        
            function animate() {
                switch(type){
                    case "0":
                        if(animateHeader) {
                            ctx.clearRect(0,0,width,height);
                            for(var i in triangles) {
                                triangles[i].draw();
                            }
                        }
                        requestAnimationFrame(animate);
                    break;
                    case "1":
                        if(animateHeader) {
                            ctx.clearRect(0,0,width,height);
                            for(var i in circles) {
                                circles[i].draw();
                            }
                        }
                        requestAnimationFrame(animate);
                    break;
                    case "2":
                        if(animateHeader) {
                            ctx.clearRect(0,0,width,height);
                            for(var i in circles) {
                                circles[i].draw();
                            }
                        }
                        requestAnimationFrame(animate);
                    break;
                }
            }
            // Canvas manipulation
            function Triangle() {
                var _this = this;
        
                // constructor
                (function() {
                    _this.coords = [{},{},{}];
                    _this.pos = {};
                    init();
                })();
        
                function init() {
                    _this.pos.x = width*0.5;
                    _this.pos.y = height*0.5-20;
                    _this.coords[0].x = -10+Math.random()*40;
                    _this.coords[0].y = -10+Math.random()*40;
                    _this.coords[1].x = -10+Math.random()*40;
                    _this.coords[1].y = -10+Math.random()*40;
                    _this.coords[2].x = -10+Math.random()*40;
                    _this.coords[2].y = -10+Math.random()*40;
                    _this.scale = 0.1+Math.random()*0.3;
                    _this.color = colors[Math.floor(Math.random()*colors.length)];
                    setTimeout(function() { _this.alpha = 0.8; }, 10);
                }
        
                this.draw = function() {
                    if(_this.alpha >= 0.005) _this.alpha -= 0.005;
                    else _this.alpha = 0;
                    ctx.beginPath();
                    ctx.moveTo(_this.coords[0].x+_this.pos.x, _this.coords[0].y+_this.pos.y);
                    ctx.lineTo(_this.coords[1].x+_this.pos.x, _this.coords[1].y+_this.pos.y);
                    ctx.lineTo(_this.coords[2].x+_this.pos.x, _this.coords[2].y+_this.pos.y);
                    ctx.closePath();
                    ctx.fillStyle = 'rgba('+_this.color+','+ _this.alpha+')';
                    ctx.fill();
                };
        
                this.init = init;
            }
            // Canvas manipulation
            function Circle() {
                var _this = this;
        
                // constructor
                (function() {
                    _this.pos = {};
                    init();
                })();
        
                function init() {
                    _this.pos.x = Math.random()*width;
                    if (type == "1") {
                        _this.pos.y = height+Math.random()*100;
                    } else if (type == "2") {
                        _this.pos.y = (Math.random()*100)*-1;
                    }
                    _this.alpha = 0.1+Math.random()*0.3;
                    _this.scale = 0.1+Math.random()*0.3;
                    _this.velocity = Math.random();
                }
        
                this.draw = function() {
                    if(_this.alpha <= 0) {
                        init();
                    }
                    if (type == "1") {
                        _this.pos.y -= _this.velocity;
                    } else if (type == "2") {
                        _this.pos.y += _this.velocity;
                    }
                    _this.alpha -= 0.0005;
                    ctx.beginPath();
                    ctx.arc(_this.pos.x, _this.pos.y, _this.scale*10, 0, 2 * Math.PI, false);
                    ctx.fillStyle = 'rgba(255,255,255,'+ _this.alpha+')';
                    ctx.fill();
                };
            }
        }
    }
});