$(function () {
    const pSBC = (p, c0, c1, l) => {
        let r, g, b, P, f, t, h, i = parseInt, m = Math.round, a = typeof(c1) == "string";
        if (typeof(p) != "number" || p < -1 || p > 1 || typeof(c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
        if (!this.pSBCr) this.pSBCr = (d) => {
            let n = d.length, x = {};
            if (n > 9) {
                [r, g, b, a] = d = d.split(","), n = d.length;
                if (n < 3 || n > 4) return null;
                x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4)), x.g = i(g), x.b = i(b), x.a = a ? parseFloat(a) : -1
            } else {
                if (n == 8 || n == 6 || n < 4) return null;
                if (n < 6)d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
                d = i(d.slice(1), 16);
                if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = m((d & 255) / 0.255) / 1000;
                else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
            } return x };
        h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = this.pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? this.pSBCr(c1) : P ? {r: 0,g: 0,b: 0,a: -1} : {r: 255, g: 255, b: 255, a: -1}, p = P ? p * -1 : p, P = 1 - p;
        if (!f || !t) return null;
        if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
        else r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
        a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
        if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
        else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1,f ? undefined : -2)
    }
    
    /* Click Active */
    $('.mi-link, .sctp-item').click(function () {
        if($(this).hasClass('active')) { return false; }
        else {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
        }
    });

    /* Setting Color */
    const dli_color = ['#A9888D', '#9488A9', '#889EA9', '#8AA37D', '#a3967d'];
    $('.dl-item-icon').each(function (index) {
        $(this).css('background-color', dli_color[index%dli_color.length]);
    });
    $('.fr-wrapper.av').each(function (index) {
        $(this).css('background-color', dli_color[index%dli_color.length] + '80');
    });

    /* File Received Layout */
    $('.fr-files').each(function () {
        let frw = $(this).children('.fr-wrapper');
        if (frw.length > 3) {
            let gap = frw.length - 2;
            for(let i = 0; i < gap; i++) frw.eq(i + 2).hide();
            $(this).append(`<div class="fr-wrapper mr"><i class="fa-solid fa-angles-right"></i></div>`);
        };
    });

    $('.btn-dwld, .btn-s-ra, .r-area .btn-close').click(function() {
        $('.r-area').toggleClass('show');
        $('.btn-dwld').toggleClass('active');
    });
    $('.btn-s-la, .l-area .btn-close').click(function() {
        $('.l-area').toggleClass('show');
    });
    $(document).click(function(e) {
        if (!$(e.target).is('.r-area.show, .r-area.show *, .btn-dwld i, .btn-s-ra, .btn-s-ra *, .r-area .btn-close')) {
            $('.r-area').removeClass('show');
            $('.btn-dwld').removeClass('active');
        };
    });

    /* Setting Title */
    $('.rf-column-cell.fn').attr('title', $('.rf-column-cell.fn').html());

    /* Set File Type */
    $('.rf-column-cell.tp').each(function() {
        let $this = $(this).children('span');
        let color;
        switch ($this.html().toLowerCase()) {
            case 'jpg': case 'png': case 'gif': case 'mp3':
                color = '#E0AAB0';
                break;
            case 'mp4': case 'pdf': case 'doc': case 'docx':
                color = '#ABBED8';
                break;
            case 'app': case 'html': case 'sass': case 'css': case 'js': case 'cshtml':
                color = '#AFD6DB';
                break;
            case 'txt':
                color = '#A0A2BC';
                break;
            default:
                color = '#9FA3E8';
                break;
        }
        $this.css('color', pSBC(-0.56, color));
        $this.css('background-color', pSBC(0.68, color));
    });

    /* Video Play  */
    $('.vdo-play').click(function() {
        let $this = $(this);
        $this.toggleClass('pause');
        if ($this.hasClass('pause')) $this.parent().siblings('video')[0].play();
        else $this.parent().siblings('video')[0].pause();
    });
    $('video').each(function() {
        let $this = $(this);
        $this.on('loadedmetadata', function() {
            $this.next().next().html(formatSecond($this[0].duration));
        });
        $this.on('timeupdate', function(){ 
            $this.next().next().html(formatSecond($this.prop('currentTime'))); 
        });
    });
    function formatSecond(timenow) {
        var m = Math.floor(timenow / 60);
        var s = Math.floor(timenow % 60);
        if(m.toString().length < 2) {m = '0' + m;}
        if(s.toString().length < 2) {s = '0' + s;}
        return (m + ' : ' + s);
    }

    /* Search Bar */
    $('.m-area').scroll( function() {
        if ($(this).scrollTop() >= 66) {
            $(this).children('.header').addClass('fixed');
        }
        else {
            $(this).children('.header').removeClass('fixed');
        }
    });
});