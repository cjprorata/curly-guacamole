var DIGIOH_LOADER = DIGIOH_LOADER || {};
(function (digioh_loader) {
    if (digioh_loader.loaded) { return; }
    digioh_loader.loaded = true;

    var isMainLoaded = false;

    function loadMain() {
        if (!isMainLoaded) {
            isMainLoaded = true;

            var e = document.createElement('script'); e.type = 'text/javascript'; e.async = true;
            e.src = '//www.lightboxcdn.com/vendor/5a9c5a6f-b8c1-47bb-829a-55322a8adccd/user' + ((window.sessionStorage.getItem('xdibx_boxqamode') == 1 || window.location.href.indexOf('boxqamode') > 0)  ? '_qa' : '') + '.js?cb=638854291505370059';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(e, s);
        }
    };

    function sendPV() {
        try {
            window.SENT_LIGHTBOX_PV = true;

            var hn = 'empty';
            if (window && window.location && window.location.hostname) {
                hn = window.location.hostname;
            }

            var i = document.createElement("img");
            i.width = 1;
            i.height = 1;
            i.src = ('https://www.lightboxcdn.com/z9g/digibox.gif?c=' + (new Date().getTime()) + '&h=' + encodeURIComponent(hn) + '&e=p&u=44577');
        }
        catch (e) {
        }
    };

    sendPV();
    loadMain();
})(DIGIOH_LOADER);