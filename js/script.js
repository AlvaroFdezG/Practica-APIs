const launches__list = document.getElementById("launches__list");
const launches = document.getElementById("launches");
const WindowDetails = document.getElementById("windowDetails");
const closeButton = document.getElementById("closeButton");
const gallery = document.getElementById("gallery");


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

const getDetails = async (launch) => {
    const res = await fetch("https://api.spacexdata.com/v5/launches/" + launch);
    const resJson = await res.json();

    name.textContent = resJson.name;
    // console.log(resJson.details);
    if (resJson.details == null) {
        description.textContent = "Sin detalles";
    } else {
        const translatedDetails = await translate(resJson.details);
        // console.log(translatedDetails);
        description.textContent = translatedDetails;
    }
    gallery.innerHTML = "";
    number.textContent = resJson.flight_number;
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

const translate = async (text) => {

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