import { extend } from 'flarum/extend';
import CommentPost from 'flarum/components/CommentPost'

app.initializers.add('davis-animatedtag', function() {
    var rendered = false;
    extend(CommentPost.prototype, 'config', function() {
        renderani();
    });
    
function renderani(){
    if (!rendered) {
   var width, height, largeHeader, canvas, ctx, triangles, target, animateHeader = true;
    var cltp = document.getElementsByClassName("Hero")[0].style['background-color'];
    cltp = cltp.substring(4, cltp.length-1)
         .replace(/ /g, '')
         .split(',');
    cltp[0] = Number(cltp[0]);
    cltp[1] = Number(cltp[1]);
    cltp[2] = Number(cltp[2]);
    var cl = $ui.color.rgb2hex(cltp);
    var trifreq = 10; //Bigger is slower rel of shapes
    var trinum = 480; //org 480
    
    var tempclr = $ui.color.tetradic(cl);
    tempclr.splice(0, 1); //Remove background color from colors
    var tpcolor = {};
    var colors = [];
    var i = 0;
    while (i < 3) {
      tpcolor[i] = $ui.color.hex2rgb(tempclr[i]);
      colors[i] = tpcolor[i][0]+","+tpcolor[i][1]+","+tpcolor[i][2];
      i++;
    }
    // Main
    initHeader();
    addListeners();
    initAnimation();

    function initHeader() {
        width = window.innerWidth;
        height = ((window.innerHeight)/5);
        target = {x: 0, y: height};

        largeHeader = document.getElementsByClassName("DiscussionHero--colored")[0];
        largeHeader.style.height = height+'px';
        
        var canvastemp = document.createElement('canvas');
        canvastemp.setAttribute("id", "tag-canvas");
        if(document.getElementById('tag-canvas')){}else{
        largeHeader.insertBefore(canvastemp, largeHeader.firstChild);
        }
        
        canvas = document.getElementById('tag-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create particles
        triangles = [];
        for(var x = 0; x < trinum; x++) {
            addTriangle(x*trifreq);
        }
    }

    function addTriangle(delay) {
        setTimeout(function() {
            var t = new Triangle();
            triangles.push(t);
            tweenTriangle(t);
        }, delay);
    }

    function initAnimation() {
        animate();
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
        height = window.innerHeight;
        largeHeader.style.height = height+'px';
        canvas.width = width;
        canvas.height = height;
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in triangles) {
                triangles[i].draw();
            }
        }
        requestAnimationFrame(animate);
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
    rendered = true;
    }
    }
    
    });