document.addEventListener('DOMContentLoaded', function () {
    const linkCreateForm = document.querySelector('.link_create_form'),
        historyLinksContainer = document.querySelector('.history_links'),
        historyLinksList = historyLinksContainer.querySelector('.history_links_list');

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function updateLocalStorage(key, data) {
        let localItems = localStorage.getItem(key);
        if (localItems !== null) {
            localItems = JSON.parse(localItems);
            localItems.push(data);
            localStorage.setItem(key, JSON.stringify(localItems));
        } else {
            localStorage.setItem(key, JSON.stringify([data, ]));
        }
    }

    function updateLinks(container, data) {
        let linksList = container;
        let link = document.createElement('li');
        const template = `<span class="long-link">${data.long_url}</span>
                        <span>
                            <span class="short-link"><a href="${data.short_url}" target="_blank">${data.short_url}</a></span>
                            <span class="copy"><button class="btn btn-secondary">Copy</button></span>
                        </span>`;
        link.classList.add('link');
        link.insertAdjacentHTML("afterbegin", template);
        linksList.insertBefore(link, linksList.childNodes[0]);
    }

    function postData(url= '', data= {}) {
        const csrftoken = getCookie('csrftoken');
        return fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'X-CSRFToken': csrftoken,
            },
            body: data,
        })
            .then(response => response.json());
    }

    function loadPage() {
        let localItems = localStorage.getItem('hashes_urls');
        if (localItems !== null) {
            JSON.parse(localItems).forEach(function (item) {
                updateLinks(historyLinksList, item);
            });
        }
    }

    linkCreateForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        const response = postData('/', formData);
        const form = this;
        response.then(function (data) {
            updateLocalStorage('hashes_urls', data);
            updateLinks(historyLinksList, data);
            form.reset();
        });
    });
    historyLinksList.addEventListener('click', function(event) {

        if (event.target.classList.contains('btn')) {
            const btnClick = event.target;
            const linkParent = btnClick.parentNode.previousElementSibling;
            const link = linkParent.firstElementChild;
            let range = document.createRange();
            range.selectNode(link);
            window.getSelection().addRange(range);

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    btnClick.classList.toggle('success');
                    btnClick.textContent = 'Copied';
                    setTimeout(function () {
                        btnClick.classList.toggle('success');
                        btnClick.textContent = 'Copy';
                    }, 1500);
                }
            } catch(err) {
                console.log('Oops, unable to copy');
            }
            window.getSelection().removeAllRanges();
        }
    });

    loadPage();
});