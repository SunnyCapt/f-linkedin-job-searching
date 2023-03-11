// ==UserScript==
// @name         LinkedInTitlesScraper.js
// @version      0.1
// @description  monkey script to parse linkedin job titles
// @author       SunnyCapt
// @match        https://*.linkedin.com/jobs/search*
// ==/UserScript==

(function() {
    'use strict';

    const SIZE = 1000;
    const LIMIT = -1;

    let sleep = ms => new Promise(r => setTimeout(r, ms));

    var xpath = function(xpathToExecute){
        var result = [];
        var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
        for ( var i=0 ; i < nodesSnapshot.snapshotLength; i++ ){
            result.push( nodesSnapshot.snapshotItem(i) );
        }
        return result;
    }

    function downloadAsFile(data) {
        var a = document.createElement("a");
        var file = new Blob([data], {type: 'application/json'});
        a.href = URL.createObjectURL(file);
        a.download = "ln.titles.json";
        a.click();
    }

    function parseTitles() {
        return xpath('//input[contains(@name, "title-filter-value")]/../label')
            .map(e=>[e.getAttribute('for').replace('title-', '') - 0, e.querySelector('span').textContent.trim()])
            .reduce((map, e) => {map[e[0]] = e[1]; return map}, {})
    }

    function getCurrentTitleMaxId() {
        var current_q = document.location.search.split('&').filter(e => e.startsWith('f_T='))
        current_q = current_q[0].split('=')[1].split('%2C')
        return Number(current_q[current_q.length - 1]);
    }

    function nextPage() {
        var search = document.location.search.split('&')
        var index = search.findIndex(e=>e.startsWith('f_T='))

        if (index == -1) {
            search.push(`f_T=${[...Array(SIZE).keys()].map(i => i + 1)}`)
        } else {
            var max_id = getCurrentTitleMaxId()
            if (max_id + SIZE > LIMIT && LIMIT !== -1) {
                alert(`LIMIT: ${LIMIT} | WILL GOT ${max_id + SIZE - 1}`)
            }
            search[index] = `f_T=${[...Array(SIZE).keys()].map(i => i + max_id + 1)}`
        }

        document.location.search = search.join('&')
    }

    async function main() {
        await sleep(3000)
        var titles = parseTitles()
        downloadAsFile(JSON.stringify(titles))
        await sleep(3000)
        if (Object.values(titles).includes('')) {
            alert('FINISH')
        }
        nextPage()
    }

    main()
})();
