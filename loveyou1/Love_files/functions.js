/*
 * http://love.hackerzhou.me
 */

var $win = $(window);
var THEME_STORAGE_KEY = "love-page-theme";

function resizeStage() {
    var stageWidth = 1100;
    var stageHeight = 680;
    var sidePadding = 24;
    var availableWidth = Math.max($win.width() - sidePadding * 2, 320);
    var scale = Math.min(1, availableWidth / stageWidth);

    $("#wrap").css("transform", "scale(" + scale + ")");
    $("#main").css("height", stageHeight * scale + 36);
}

function padTimeUnit(value) {
    return value < 10 ? "0" + value : String(value);
}

function createClockUnit(value, label) {
    return ""
        + "<div class=\"clock-unit\">"
        + "<span class=\"digit\">" + value + "</span>"
        + "<span class=\"unit-label\">" + label + "</span>"
        + "</div>";
}

function initParticles() {
    var $layer = $("#particles");
    if (!$layer.length) {
        return;
    }

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    var count = $win.width() < 700 ? 14 : 22;
    var symbols = ["♥", "✿", "✧", "•"];
    var html = [];
    var i;

    for (i = 0; i < count; i++) {
        var isDot = i % 3 === 0;
        var left = Math.random() * 100;
        var delay = Math.random() * 12;
        var duration = 10 + Math.random() * 12;
        var size = isDot ? (5 + Math.random() * 4) : (12 + Math.random() * 10);
        var drift = (Math.random() * 120 - 60).toFixed(1) + "px";
        var symbol = symbols[i % symbols.length];
        var className = isDot ? "petal is-dot" : "petal";

        html.push(
            "<span class=\"" + className + "\" style=\""
            + "left:" + left.toFixed(2) + "%;"
            + "font-size:" + size.toFixed(1) + "px;"
            + "width:" + (isDot ? size.toFixed(1) + "px" : "auto") + ";"
            + "height:" + (isDot ? size.toFixed(1) + "px" : "auto") + ";"
            + "animation-duration:" + duration.toFixed(1) + "s;"
            + "animation-delay:" + (-delay).toFixed(1) + "s;"
            + "--drift:" + drift + ";"
            + "\">" + (isDot ? "" : symbol) + "</span>"
        );
    }

    $layer.html(html.join(""));
}

function applyTheme(theme) {
    var isNight = theme === "night";
    var $body = $("body");
    var $themeToggle = $("#theme-toggle");

    $body.toggleClass("theme-night", isNight);
    $body.toggleClass("theme-day", !isNight);
    $themeToggle.attr("aria-pressed", isNight ? "true" : "false");
    $themeToggle.attr("aria-label", isNight ? "切换日间模式" : "切换夜间模式");
    $themeToggle.find(".theme-icon").text(isNight ? "☀" : "☾");
    $themeToggle.find(".theme-label").text(isNight ? "日间" : "夜间");

    try {
        window.localStorage.setItem(THEME_STORAGE_KEY, isNight ? "night" : "day");
    } catch (error) {
        // Ignore storage failures in private mode.
    }
}

function initThemeToggle() {
    var savedTheme = "day";

    try {
        savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY) || "day";
    } catch (error) {
        savedTheme = "day";
    }

    if (savedTheme !== "night" && savedTheme !== "day") {
        savedTheme = "day";
    }

    applyTheme(savedTheme);

    $("#theme-toggle").on("click", function() {
        var nextTheme = $("body").hasClass("theme-night") ? "day" : "night";
        applyTheme(nextTheme);
    });
}

$(function() {
    var media = document.getElementById("media");
    var $musicToggle = $("#music-toggle");
    var $body = $("body");

    function updateMusicToggle() {
        var isPlaying = media && !media.paused;
        $musicToggle.toggleClass("is-playing", isPlaying);
        $body.toggleClass("is-music-playing", isPlaying);
        $musicToggle.attr("aria-pressed", isPlaying ? "true" : "false");
        $musicToggle.attr("aria-label", isPlaying ? "暂停背景音乐" : "播放背景音乐");
        $musicToggle.find(".music-label").text(isPlaying ? "暂停音乐" : "播放音乐");
    }

    resizeStage();
    initParticles();
    initThemeToggle();
    $win.on("resize", resizeStage);

    if (media) {
        media.addEventListener("play", updateMusicToggle);
        media.addEventListener("pause", updateMusicToggle);
        updateMusicToggle();

        $musicToggle.on("click", function() {
            if (media.paused) {
                var playResult = media.play();
                if (playResult && playResult.catch) {
                    playResult.catch(updateMusicToggle);
                }
            } else {
                media.pause();
            }
        });
    }
});

(function($) {
	function typewriterDelay(char) {
		if (!char) {
			return 70;
		}
		if (char === "\n") {
			return 220;
		}
		if (/[，、；：]/.test(char)) {
			return 180;
		}
		if (/[。！？!?]/.test(char)) {
			return 320;
		}
		if (char === " " || char === "　") {
			return 40;
		}
		return 58 + Math.floor(Math.random() * 28);
	}

	$.fn.typewriter = function() {
		this.each(function() {
			var $ele = $(this);
			var str = $ele.html();
			var progress = 0;
			var typing = true;

			$ele.html("");

			function step() {
				if (!typing) {
					return;
				}

				var current = str.substr(progress, 1);
				var delay = 70;

				if (current === "<") {
					progress = str.indexOf(">", progress) + 1;
					delay = 12;
				} else {
					delay = typewriterDelay(current);
					progress++;
				}

				$ele.html(
					str.substring(0, progress)
					+ (progress < str.length ? "<span class=\"type-cursor\">_</span>" : "")
				);

				if (progress >= str.length) {
					typing = false;
					return;
				}

				window.setTimeout(step, delay);
			}

			step();
		});
		return this;
	};
})(jQuery);

function timeElapse(date){
	var current = Date();
	var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
	var days = Math.floor(seconds / (3600 * 24));
	seconds = seconds % (3600 * 24);
	var hours = Math.floor(seconds / 3600);
	if (hours < 10) {
		hours = "0" + hours;
	}
	seconds = seconds % 3600;
	var minutes = Math.floor(seconds / 60);
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	seconds = seconds % 60;
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	var result = ""
		+ createClockUnit(days, "天")
		+ createClockUnit(hours, "小时")
		+ createClockUnit(minutes, "分钟")
		+ createClockUnit(seconds, "秒");
	$("#clock").html(result);
}
