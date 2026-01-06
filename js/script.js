const launches__list = document.getElementById("launches__list");
const launches = document.getElementById("launches");
const WindowDetails = document.getElementById("windowDetails");
const closeButton = document.getElementById("closeButton");
const gallery = document.getElementById("gallery");
const wiki = document.getElementById("wiki");
const dateInfo = document.getElementById("dateInfo");
const numberAsteroids = document.getElementById("numberAsteroids");
const asteroidList = document.getElementById("asteroidList");

const number = document.getElementById("number");
const description = document.getElementById("description");
const name = document.getElementById("name");

const getData = async () => {
    const res = await fetch("https://api.spacexdata.com/v5/launches");
    const resJson = await res.json();
    // console.log(resJson);
    resJson.reverse();
    createGrid(resJson);
}

// Aqui llamo a la api de spaceX que no tiene key, la fecha la utilizaré para llamar a la otra API

const getDetails = async (launch) => {
    const res = await fetch("https://api.spacexdata.com/v5/launches/" + launch);
    const resJson = await res.json();

    name.textContent = resJson.name;
    // console.log(resJson.details);
    if (resJson.details == null) {
        description.textContent = "Sin detalles";
    } else {
        description.textContent = resJson.details;
    }
    gallery.innerHTML = "";
    number.textContent = resJson.flight_number;
    wiki.href = resJson.links.wikipedia;
    wiki.textContent = resJson.links.wikipedia;
    dateInfo.textContent = resJson.date_local.slice(0, resJson.date_local.lastIndexOf("T"));
    getNasa(resJson.date_local.slice(0, resJson.date_local.lastIndexOf("T")));

    resJson.links.flickr.original.forEach(img => {
        const imgGallery = document.createElement("img");
        imgGallery.src = img;
        imgGallery.className = "imgGallery";

        const linkGallery = document.createElement("a");
        linkGallery.href = img;
        linkGallery.appendChild(imgGallery);
        linkGallery.target = "blank";

        gallery.appendChild(linkGallery);
    });
    // img.referrerPolicy = "no-referrer";
}


// Aqui llamo a la api de la NASA que sí tiene key utilizando la fecha de la misión seleccionada para obtener los asteroides cercanos a la Tierra de esa fecha

const getNasa = async (date) => {
    const res = await fetch("https://api.nasa.gov/neo/rest/v1/feed?start_date=" + date + "&end_date=" + date + "&api_key=Sae62qI7Dvy6SVdDZf1uRP1ywWMJbncNRcWRAcwr");
    const resJson = await res.json();
    // console.log(resJson);
    // console.log(resJson.near_earth_objects[date]);
    numberAsteroids.textContent = resJson.element_count;
    asteroidList.innerHTML = "";
    const fragmento = new DocumentFragment();
    resJson.near_earth_objects[date].forEach(asteroid => {
        const li = document.createElement("li");
        li.textContent = asteroid.name;
        li.className = "windowDetails__asteroid-li";

        const dateHourP = document.createElement("p");
        dateHourP.textContent = "Fecha y hora de avistamiento:";
        dateHourP.className = "windowDetails__asteroid-data";
        li.appendChild(dateHourP);
        const dateHour = document.createElement("p");
        dateHour.textContent = asteroid.close_approach_data[0].close_approach_date_full;
        dateHour.className = "windowDetails__asteroid-info";
        li.appendChild(dateHour);

        const sizeP = document.createElement("p");
        sizeP.textContent = "Diámetro:";
        li.appendChild(sizeP);
        sizeP.className = "windowDetails__asteroid-data";
        const size = document.createElement("p");
        size.textContent = asteroid.estimated_diameter.meters.estimated_diameter_max;
        size.className = "windowDetails__asteroid-info";
        li.appendChild(size);

        const dangerP = document.createElement("p");
        dangerP.textContent = "Potencialmente peligroso:";
        dangerP.className = "windowDetails__asteroid-data";
        li.appendChild(dangerP);
        const danger = document.createElement("p");

        if (asteroid.is_potentially_hazardous_asteroid == false) {
            danger.textContent = "No";
        } else {
            danger.textContent = "Sí";
        }
        danger.className = "windowDetails__asteroid-info";
        li.appendChild(danger);

        fragmento.appendChild(li);
    });
    asteroidList.appendChild(fragmento);
}

const createGrid = (data) => {
    const fragment = new DocumentFragment();

    data.forEach(launch => {
        if (launch.links.patch.small != null) {

            const li = document.createElement("li");
            li.className = "list";

            const name = document.createElement("p");
            name.textContent = launch.name;

            const date = document.createElement("p");
            date.textContent = launch.date_local.slice(0, launch.date_local.lastIndexOf("T"));
            date.className = "launches__date";

            const id = document.createElement("P");
            id.textContent = launch.id;
            id.style.display = "none";

            const link = document.createElement("a");
            link.className = "list__link";

            const img = document.createElement("img");
            img.src = launch.links.patch.small;
            img.className = "list__img";

            link.appendChild(id);
            link.appendChild(name);
            link.appendChild(img);
            link.appendChild(date);
            li.appendChild(link);

            fragment.appendChild(li);
        }
    });
    launches__list.appendChild(fragment);
}

const openWindow = (event) => {
    event.preventDefault();
    // console.log(event.target.tagName);
    if (event.target.tagName === "A") {
        windowDetails.classList.remove("cerrar");
        windowDetails.style.display = "block";
        windowDetails.classList.add("abrir");
        getDetails(event.target.children[0].textContent);
    } else if (event.target.parentElement.children[0].tagName === "P") {
        windowDetails.classList.remove("cerrar");
        windowDetails.style.display = "block";
        windowDetails.classList.add("abrir");
        getDetails(event.target.parentElement.children[0].textContent);
    }
}

const closeWindow = () => {
    windowDetails.classList.remove("abrir");
    windowDetails.classList.add("cerrar");
}

getData();

launches.addEventListener("click", openWindow);
closeButton.addEventListener("click", closeWindow);