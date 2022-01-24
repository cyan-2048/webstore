var data;

fetch("https://banana-hackers.gitlab.io/store-db/data.json")
	.then((response) => response.json())
	.then((response) => {
		data = response;
		if (document.readyState === "complete" || document.readyState === "interactive") {
			init();
		} else {
			window.addEventListener("DOMContentLoaded", init);
		}
	});

const init = () => {
	document.getElementById("category").innerHTML = "<style></style>";
	var cats = [];
	cats.push("app");
	for (let a in data.categories) {
		cats.push(data.categories[a].name);
	}
	cats.forEach((a, e) => {
		var g = document.getElementById("category");
		var b = document.createElement("button");
		if (a == "app") b.innerText = "All Apps";
		else {
			b.innerText = a;
		}
		var c = a.toLocaleLowerCase();
		var z = g.querySelector("style");
		z.innerHTML += `#category[data-sel="${c}"] + #apps > div.${c}`;
		if (e == cats.length - 1) {
			z.innerHTML += `{ max-height: 200px; margin-bottom: 1em; opacity: 1; }`;
		} else {
			z.innerHTML += `,`;
		}
		g.dataset.sel = "app";
		g.appendChild(b);
	});

	document.getElementById("category").onclick = (e) => {
		let t = e.target;
		if (t.tagName == "BUTTON" && t.innerText != "All Apps") {
			t.parentElement.dataset.sel = t.innerText.toLowerCase();
		} else {
			t.parentElement.dataset.sel = "app";
		}
	};

	document.getElementById("apps").innerHTML = "";
	for (let a of data.apps) {
		var b = document.createElement("div");
		b.innerText = `name: ${a.name} \n category: ${a.meta.categories} \n desc: ${a.description} \n `;
		var c = document.createElement("a");
		c.href = a.download.url;
		c.innerText = "Download";
		b.appendChild(c);
		b.className = "app";
		for (let d of a.meta.categories) {
			b.classList.add(d);
		}
		document.getElementById("apps").appendChild(b);
	}
};
