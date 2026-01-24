// Add a manual navbar toggler only when Bootstrap's Collapse plugin is not available
if (typeof bootstrap === 'undefined' || !bootstrap.Collapse) {
    (function () {
        var toggler = document.querySelector('.navbar-toggler');
        var collapse = document.getElementById('primaryLinks');
        if (!toggler || !collapse) return;
        toggler.addEventListener('click', function (e) {
            e.preventDefault();
            collapse.classList.toggle('show');
            var expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', (!expanded).toString());
        });
    })();
}

     (function () {
            var downloadLinks = document.querySelectorAll('a[download]');
            if (!downloadLinks.length) return;

            downloadLinks.forEach(function (link) {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    var url = this.href;
                    var filename = url.split('/').pop() || 'download';

                    fetch(url)
                        .then(function (resp) {
                            if (!resp.ok) throw new Error('Network response was not ok');
                            return resp.blob();
                        })
                        .then(function (blob) {
                            var blobUrl = URL.createObjectURL(blob);
                            var a = document.createElement('a');
                            a.href = blobUrl;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            setTimeout(function () { URL.revokeObjectURL(blobUrl); }, 1000);

                            var modalEl = document.getElementById('socialModal');
                            if (modalEl) new bootstrap.Modal(modalEl).show();
                        })
                        .catch(function (err) {
                            console.error('Download failed:', err);
                            var modalEl = document.getElementById('socialModal');
                            if (modalEl) new bootstrap.Modal(modalEl).show();
                        });
                });
            });
        })();