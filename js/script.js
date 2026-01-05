const launches__list = document.getElementById("launches__list");
const launches = document.getElementById("launches");
const WindowDetails = document.getElementById("windowDetails");
const closeButton = document.getElementById("closeButton");

const getData = async () => {
    const res = await fetch("https://api.spacexdata.com/v5/launches");
    const resJson = await res.json();
    console.log(resJson);
    resJson.reverse();
    createGrid(resJson);
}

const getDetails = async () => {
    const res = await fetch("https://api.spacexdata.com/v4/rockets/5e9d0d95eda69973a809d1ec");
    const resJson = await res.json();

    const img = document.createElement("img");

    console.log(resJson.flickr_images[0]);
    img.src = resJson.flickr_images[0];
    // img.referrerPolicy = "no-referrer";
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

            const link = document.createElement("a");
            link.className = "list__link";
            link.href = "#";

            const img = document.createElement("img");
            img.src = launch.links.patch.small;
            img.className = "list__img";

            link.appendChild(img);
            link.appendChild(name);
            link.appendChild(date);
            li.appendChild(link);

            fragment.appendChild(li);
        }
    });
    launches__list.appendChild(fragment);
}

const openWindow = () => {
    windowDetails.classList.remove("cerrar");
    windowDetails.style.display = "block";
    windowDetails.classList.add("abrir");
}

const closeWindow = () => {
    windowDetails.classList.remove("abrir");
    windowDetails.classList.add("cerrar");
}

getData();

launches.addEventListener("click", openWindow);
closeButton.addEventListener("click", closeWindow);