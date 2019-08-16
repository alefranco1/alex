let listMin = 0;
let listMax = 5;
let pageIndex = 1;

let streamData = (name) => {
    return fetch(`https://api.twitch.tv/kraken/search/streams?query=${name}&limit=${55}`, {
        method: 'GET', 
        mode: 'cors', 
        cache: 'no-cache', 
        credentials: 'same-origin', 
        headers: {
            'Client-ID': APIKEY,
            'Accept': 'application/vnd.twitchtv.v5+json'
        },
        redirect: 'follow', 
        referrer: 'no-referrer', 
    })
    .then(response => response.json())
    .catch(error => console.error(error))
};

let onSearch = (func) => {
    let gameName = document.getElementById("searchbar").value;
    streamData(gameName).then((parsedJson) => {
        let total = parsedJson._total
        let list = parsedJson.streams.map((element)=> {
            return {
                description: element.channel.description,
                displayName: element.channel.display_name, 
                game: element.game,
                image: element.preview.medium,
                total: total,
                url: element.channel.url,
                viewers: element.viewers,
            };
        });
        func(listMin, listMax, list);
    });
};

let listFive = (min, max, func) => {
    let table = document.getElementById("table");
    while (table.firstChild) {
    table.removeChild(table.firstChild);
    }
    for (let i = min; i < max; i++) {
        let row = document.createElement("div");
        row.setAttribute("class", "row");
        let firstColumn = document.createElement("div");
        firstColumn.setAttribute("class", "col-1");
        let img = document.createElement("img");
        img.setAttribute("src", func[i]["image"]);
        img.setAttribute("width", "100%");
        img.setAttribute("height", "120px")
        firstColumn.appendChild(img);
        row.appendChild(firstColumn);
        let secondColumn = document.createElement("div");
        secondColumn.setAttribute("class", "col-2");
        secondColumn.innerHTML = `
          <div class="display-name">
            <a href="${func[i]["url"]}">${func[i]["displayName"]}</a>
          </div>
          <p class="details">
            <span>${func[i]["game"]} - ${func[i]["viewers"]}</span>
            <span>${func[i]["description"]}</span>
          </p>
          `
        row.appendChild(secondColumn);
        table.appendChild(row);
    }
};

let onNext = () => {
    if(listMax !== 50) {
        listMin = listMax;
        listMax += 5;
        onSearch(listFive);
        pageIndex++
    };
    
};

let onPrevious = () => {
    if (listMin !== 0) {
        listMax -= 5;
        listMin -= 5;
        onSearch(listFive);
        pageIndex--
    };
};
