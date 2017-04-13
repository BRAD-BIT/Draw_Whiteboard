window.sketch = {}, sketch.Locale = function () {
    function a() {
        d(), i.find("li").on("click", function (a) {
            var b = $(a.target).attr("data-language");
            "string" == typeof b && g[b] && sketch.Locale.change(b)
        }), i.on("mouseenter", function () {
            i.find(".list").show()
        }), i.on("mouseleave", function () {
            i.find(".list").hide()
        })
    }


    function d() {
        var a = $(".toolbar");

    }

    var e = "sketch-toy-language", f = "en", g = {
        en: {
            "new": "New",
            save: "Save",
            undo: "Undo",
            erase: "Erase",
            size: "Size",
            vibration: "Vibration",
            color: "Color",
        }
    }, h = f, i = $(".select-language");
    return {
        initialize: a, string: function (a) {
            var b = g[h] || b[f], c = b[a];
            return "undefined" == typeof c && (c = g[f][a]), "undefined" == typeof c && (c = ""), c
        }, change: function (a) {
            g[a] && (sketch.Main.trackEvent("Locale", "Change", a), h = a, b(), window.location.reload())
        }
    }
}(), sketch.Related = function () {


    function b(a) {
        g.length && (g.addClass(a), $.ajax({
            url: "http://sketch-toy.tumblr.com/api/read/json?callback=?",
            dataType: "script",
            context: this,
            success: function () {
                "object" == typeof tumblr_api_read && tumblr_api_read.posts.length && c(tumblr_api_read.posts)
            }
        }))
    }

    function c(a) {
        if (a && g.length) {
            $("<h3>").text(sketch.Locale.string("featured-sketches") + ":").appendTo(g);
            for (var b = "/" === window.location.pathname ? 6 : 4, c = 0, d = Math.min(a.length, b); d > c; c++) {
                var e = a[c];
                $(['<a href="' + e["photo-link-url"] + '">', '<img src="' + e["photo-url-250"] + '">', "</a>"].join("")).appendTo(g)
            }
        }
    }


    function e() {
        i && "/" !== window.location.pathname && d()
    }

    var f, g, h, i = !1;
    return {update: e}
}(), sketch.Dropdown = {
    create: function (a) {
        function b() {
            n.addClass("open"), o.addClass("open"), $(document).on("mousedown", m), d()
        }

        function c() {
            n.removeClass("open"), o.removeClass("open"), $(document).off("mousedown", m)
        }

        function d() {
            var a = n.outerWidth(), b = o.outerWidth();
            o.css("margin-left", -(b - a) / 2)
        }

        function e(a) {
            q = a, n.find(".value").text(a), o.find("button").removeClass("selected"), o.find('button[data-value="' + q + '"]').addClass("selected")
        }

        function f() {
            return q
        }

        function g(a) {
            a.preventDefault()
        }

        function h(a) {
            a.preventDefault(), n.hasClass("open") ? c() : b()
        }

        function i(a) {
            a.preventDefault()
        }

        function j(a) {
            a.preventDefault();
            var b = $(a.currentTarget);
            b.length && (e(b.attr("data-value")), c(), "function" == typeof this.onChanged && this.onChanged(q))
        }

        function k() {
            o.hasClass("auto-width") && o.width(n.outerWidth() - 1), b()
        }

        function l() {
            c()
        }

        function m(b) {
            for (var d = b.target, e = !0; d && d.getAttribute;) {
                if (d && d == a.get(0)) {
                    e = !1;
                    break
                }
                d = d.parentNode
            }
            e && c()
        }

        var n = a.find(".dropdown-title"), o = a.find(".dropdown-list"), p = o.find(".dropdown-item"), q = null;
        a.on("mouseover", $.proxy(k, this)), a.on("mouseout", $.proxy(l, this)), n.on("click", $.proxy(g, this)), n.on("touchstart", $.proxy(h, this)), n.on("mousedown", $.proxy(i, this)), p.on("click touchstart", $.proxy(j, this)), this.setValue = e, this.getValue = f
    }
}, sketch.Main = function () {


    function i() {
        colorDropdown = new sketch.Dropdown.create($(".color-dropdown")), colorDropdown.setValue(Bb), colorDropdown.onChanged = function (a) {
            GlobalColor=a;
            makeCursor(a);

        }, sizeDropdown = new sketch.Dropdown.create($(".size-dropdown")), sizeDropdown.setValue(Cb), sizeDropdown.onChanged = function (a) {
            GlobalSize=a;
        }, vibrationDropdown = new sketch.Dropdown.create($(".vibration-dropdown")), vibrationDropdown.setValue(1), vibrationDropdown.onChanged = function (a) {
            alert("Vibration Changed To "+a);
        }
    }
    function download(data, filename, type) {
        var a = document.createElement("a"),
            file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }
    function downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;
    }
	function xx() {
	
		$(".toolbar .undo-button").click(function() {
            if(users_paths[userName]!=null)
            {
                if(users_paths[userName].length>0)
                {
                    paths_num--;
                    users_paths[userName][users_paths[userName].length-1].remove();
                    users_paths[userName].pop();
                    pathsToSave[userName].pop();
                    socket.emit('undo',room,userName);
                }
            }
		});
		$(".toolbar .save-button").click(function() {
		    if(paths_num>0)
            {
                alert("your draws successfully saved");
                var canvas = document.getElementById('myCanvas'),
                    dataUrl = canvas.toDataURL();

                var users=new Array();
                var pths=new Array();
                for (var user in pathsToSave) {
                    users.push(user);
                    pths.push(pathsToSave[user]);
                }
                //console.log(JSON.stringify(pths));
                socket.emit('save', room, userName,dataUrl,JSON.stringify(users),JSON.stringify(pths));
            }
            else alert("there is no draws to save");

		});
        $(".toolbar .snapshot-button").click(function() {
            if(paths_num>0)
            {
                var canvas = document.getElementById('myCanvas'),
                    dataUrl = canvas.toDataURL();
                //console.log(dataUrl);
                downloadURI(dataUrl, "YourDraws.png");
                alert("your draws successfully downloaded");

            }
            else alert("there is no draws to download");

        });
		$(".toolbar .eraser-toggle").click(function() {
		    if(users_paths[userName]!=null)
            {
                if(users_paths[userName].length>0)
                {
                    if (confirm('Are you sure you want to clear all room draw ?'))
                    {
                        while(users_paths[userName].length>0)
                        {
                            paths_num--;
                            users_paths[userName][users_paths[userName].length-1].remove();
                            users_paths[userName].pop();
                            pathsToSave[userName].pop();
                            socket.emit('undo',room,userName);
                        }
                    }
                }
            }
		});    
		$(".toolbar .new-button").click(function() {
            window.location = "/home";
		});    		
    }

    var W, X, Y, Z, _ = {}, ab = 760, bb = 960, cb = 580, db = 3, eb = .7, fb = 3, gb = "#000000", hb = 50, ib = 6, jb = 4, kb = 20, lb = 2, mb = !(!$("#left-pillar").length || !$("#right-pillar").length), nb = {
        x: 0,
        y: 0,
        scale: 1,
        width: bb,
        height: cb
    }, ob = {
        width: 0,
        height: 0
    }, pb = [], qb = [], rb = [], sb = 0, tb = 0, ub = 0, vb = 0, wb = !1, xb = 0, yb = 0, zb = db, Ab = eb, Bb = gb, Cb = fb, Db = 0, Eb = 0, Fb = 0, Gb = {
        x: 0,
        y: 0
    }, Mb = {
        toolbar: null,
        saveButton: null,
        resetButton: null,
        dashToggle: null,
        vibrationDropdown: null,
        sizeDropdown: null,
        facebookConnect: null
    };
    return _.initialize = function () {
        if (Z = $(".sketch-canvas-container"), Y = $(".sketch-canvas"), W = Y.get(0), Mb.spinner = $("#spinner"), Mb.toolbar = $(".toolbar"), Mb.saveButton = $(".toolbar .save-button"), Mb.undoButton = $(".toolbar .undo-button"), Mb.newButton = $(".toolbar .new-button"), Mb.resetButton = $(".toolbar .reset-button"), Mb.dashToggle = $(".toolbar .dash-toggle"), Mb.eraserToggle = $(".toolbar .eraser-toggle"), Mb.shareButton = $(".toolbar .share-button"), Mb.tweetButton = $(".toolbar .tweet-button"), Mb.replayControls = $(".replay-controls"), Mb.replayControlsProgress = $(".replay-controls .progress"), i(),xx(), sketch.Locale.initialize(), W && W.getContext) {
            X = W.getContext("2d"), document.addEventListener("dragover", function (a) {
                a.preventDefault()
            }, !1), document.addEventListener("dragenter", function (a) {
                a.preventDefault()
            }, !1), document.addEventListener("dragexit", function (a) {
                a.preventDefault()
            }, !1), Mb.toolbar.css("visibility", "visible"), "undefined" != typeof chrome && chrome.app && chrome.app.isInstalled ? $("html").addClass("chrome-app-installed") : navigator.userAgent.match(/chrome/gi) && $("html").addClass("chrome-app-capable"), $("html").addClass("initialized");

        }
    }, _
}(), sketch.Main.initialize();