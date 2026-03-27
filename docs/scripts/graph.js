(function() {
    var width, height, largeHeader, canvas, ctx, points, target, numCircles, neighbors, animateHeader = true;
    var isBanner = false;
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;

        largeHeader = document.getElementById('dynamicgraph');
        isBanner = largeHeader.hasAttribute('data-banner');

        if (isBanner) {
            // Height is CSS-controlled — never override it
            height = largeHeader.offsetHeight || 86;
            // Fixed target at ~70% width
            target = {x: width * 0.7, y: height / 2};
            if (width > 768) {
                numCircles = 5;
                neighbors = 3;
            } else {
                numCircles = 3;
                neighbors = 2;
            }
        } else {
            // Remove any existing height constraint
            largeHeader.style.height = 'auto';

            // Let browser calculate layout, then measure
            setTimeout(function() {
                var viewport_height = window.innerHeight;
                var content_height = largeHeader.scrollHeight;

                // Use whichever is larger
                height = Math.max(viewport_height, content_height);

                console.log('viewport:', viewport_height, 'content:', content_height, 'using:', height);

                // Now set the height and update canvas
                largeHeader.style.height = height + 'px';
                canvas.height = height;
                canvas.style.height = height + 'px';
            }, 50);

            // Use viewport height temporarily for initial setup
            height = window.innerHeight;
            if (width > 768) {
                target = {x: width/2, y: height/2};
                numCircles = 15;
                neighbors = 4;
            } else {
                target = {x: width * 0.85, y: height * 0.8};
                numCircles = 6;
                neighbors = 2;
            }
        }

        canvas = document.getElementById('dynamicgraph-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        points = [];
        for(var x = 0; x < width; x = x + width/numCircles) {
            for(var y = 0; y < height; y = y + height/numCircles) {
                var px = x + Math.random()*width/numCircles;
                var py = y + Math.random()*height/numCircles;
                var p = {x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }
        for(var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if(!(p1 == p2)) {
                    var placed = false;
                    for(var k = 0; k < neighbors; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for(var k = 0; k < neighbors; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }
        for(var i in points) {
            var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
            points[i].circle = c;
        }
    }

    // Event handling
    function addListeners() {
        if(!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        if (isBanner) return; // Fixed target — ignore mouse for banner
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
        if (isBanner) return; // Always animate the banner
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;

        if (isBanner) {
            canvas.width = width;
            target.x = width * 0.7;
        } else {
            largeHeader.style.height = 'auto';

            setTimeout(function() {
                var viewport_height = window.innerHeight;
                var content_height = largeHeader.scrollHeight;
                height = Math.max(viewport_height, content_height);

                largeHeader.style.height = height + 'px';
                canvas.width = width;
                canvas.height = height;
                canvas.style.height = height + 'px';
            }, 50);
        }
    }

    function initAnimation() {
        animate();
        for(var i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in points) {
                // detect points in range
                if(Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.5;
                    points[i].circle.active = 1.6;
                } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }
                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        var duration = isBanner ? 2+2*Math.random() : 1+1*Math.random();
        TweenLite.to(p, duration, {x:p.originX-50+Math.random()*100,
            y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
            onComplete: function() {
                shiftPoint(p);
            }});
    }

    // Canvas manipulation
    function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(255,255,255,'+ p.active+')';
            ctx.stroke();
        }
    }

    function Circle(pos,rad,color) {
        var _this = this;
        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();
        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(156,217,249,'+ _this.active+')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

})();
