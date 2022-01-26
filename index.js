var data,
	database = "https://banana-hackers.gitlab.io/store-db/data.json",
	ratings = "https://bhackers.uber.space/srs/v1";

const database_init = () => {
	fetch(database)
		.then((response) => response.json())
		.catch((e) => {
			console.log(e);
			alert("can't download database please reload the page");
		})
		.then((response) => {
			data = response;
			if (document.readyState === "complete" || document.readyState === "interactive") {
				init();
			} else {
				window.addEventListener("DOMContentLoaded", () => {
					let a = undefined;
					init(a);
				});
			}
		});
};

database_init();

const init = (e) => {
	var p = e == undefined ? "app" : document.querySelector("#category .selected").dataset.name;
	document.getElementById("category").innerHTML = "<style></style>";
	var cats = [];
	cats.push("app");
	for (let a in data.categories) {
		cats.push(data.categories[a].name);
	}
	var y = "";
	cats.forEach((a, e) => {
		var g = document.getElementById("category");
		var b = document.createElement("button");
		var c = a.toLocaleLowerCase();
		var si = "fas fa-store";
		try {
			si = data.categories[c].icon;
		} catch (e) {}
		if (a == "app") {
			// maybe temporary, plans of i10n
			b.innerText = " All Apps";
		} else {
			b.innerText = " " + a;
			if (data.categories[c].description != undefined) b.title = data.categories[c].description;
		}

		var ic = document.createElement("i");
		ic.className = si;

		b.insertBefore(ic, b.childNodes[0]);
		b.dataset.name = c;
		y += `[data-sel="${c}"] + #apps div.${c}`;
		if (e == cats.length - 1) {
			y += `{ display: flex !important}`;
		} else {
			y += `,`;
		}
		g.parentElement.dataset.sel = p;
		g.appendChild(b);
	});

	document.querySelector(`#category [data-name='${p}']`).className = "selected";
	document.getElementById("category").querySelector("style").innerHTML = y;

	sort();
	document.getElementById("apps").children[0].innerHTML = "";
	for (let a of data.apps) {
		var b = document.createElement("div");

		var d = document.createElement("div");
		d.className = "header";
		var img = document.createElement("img");
		img.src = a.icon;
		img.onerror = (e) => {
			e.target.src = `data:@file/png;base64,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`;
		};
		d.appendChild(img);

		var ca = document.createElement("div");
		ca.className = "cat";
		ca.innerText = a.meta.categories.map((str) => capitalize(str)).join(", ");

		var na = document.createElement("div");
		na.className = "na";
		na.innerText = a.name;

		var au = document.createElement("div");
		au.className = "au";
		au.innerText = a.author[0].split("<")[0];

		var te = document.createElement("div");
		te.className = "teco";

		te.appendChild(ca);
		te.appendChild(na);
		te.appendChild(au);

		d.appendChild(te);

		b.appendChild(d);

		b.appendChild(document.createTextNode(truncate(a.description, 206)));

		var sp = document.createElement("div");
		sp.className = "spacer";
		b.appendChild(sp);

		var j = document.createElement("button");
		j.className = "info";
		j.innerHTML = `<i class="fas fa-info-circle"></i> Info`;
		var c = document.createElement("a");
		c.href = a.download.url;
		c.innerHTML = `<i class="fas fa-file-download"></i> Download`;
		var k = document.createElement("button");
		k.className = "share";
		k.innerHTML = `<i class="far fa-clipboard"></i> Share`;

		var bcn = document.createElement("div");
		bcn.className = "bucon";

		bcn.appendChild(j);
		bcn.appendChild(c);
		bcn.appendChild(k);

		b.appendChild(bcn);

		b.className = "app";
		b.dataset.slug = a.slug;
		for (let d of a.meta.categories) {
			b.classList.add(d);
		}
		document.getElementById("apps").children[0].appendChild(b);
	}
	if (e != undefined) window.location.hash = "";
	if (window.location.hash != "") hashManager();
	document.getElementById("le").innerText = document.querySelectorAll(`[data-sel="app"] + #apps .app`).length;
};

var lastScroll = 0;

window.addEventListener("DOMContentLoaded", () => {
	let a = navigator.userAgent.toLocaleLowerCase().includes("kaios") ? document.querySelector("sel") : document.querySelector("select");
	a.remove();
	if (document.getElementById("sort").tagName == "SELECT") {
		document.getElementById("sort").onchange = sort;
	}
	document.getElementById("category").onclick = (e) => {
		let t = e.target;
		if (t.tagName == "BUTTON") {
			t.parentElement.parentElement.dataset.sel = t.dataset.name;
		} else return;
		for (let k of t.parentElement.children) {
			k.removeAttribute("class");
		}
		t.className = "selected";
		document.getElementById("le").innerText = document.querySelectorAll(`[data-sel="${t.dataset.name}"] + #apps .${t.dataset.name}`).length;
	};

	if (!navigator.userAgent.toLocaleLowerCase().includes("kaios")) {
		var c = document.createElement("button");
		c.id = "scrollup";
		var i = document.createElement("i");
		i.className = "fas fa-chevron-up";
		c.appendChild(i);
		document.body.appendChild(c);
		if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())) {
			c.style.transform = "none";
		} else {
			window.addEventListener("wheel", function (event) {
				if (document.body.scrollTop == 0) {
					c.style.transform = "translateY(70px)";
					return;
				}
				if (event.deltaY < 0) {
					c.style.transform = "none";
				} else if (event.deltaY > 0) {
					c.style.transform = "translateY(70px)";
				}
			});
		}
	}
});

document.onclick = (e) => {
	if (e.target.tagName == "OPT") {
		document.activeElement.blur();
		let x = e.target.parentElement.parentElement.children[0];
		x.innerHTML = "";
		for (let n of e.target.childNodes) {
			let t = n.cloneNode(true);
			x.appendChild(t);
		}
		x.setAttribute("value", e.target.getAttribute("value"));
		sort(e);
	} else if (e.target.className == "share") {
		clipboard(window.location.origin + "/#" + e.target.parentElement.parentElement.dataset.slug);
	} else if (e.target.tagName == "I") {
		e.target.parentElement.click();
	} else if (e.target.id == "scrollup") {
		document.body.scrollTo({ top: 0, behavior: "smooth" });
	}
};

function sort(e) {
	function isAvail() {
		if (document.getElementById("sort").selectedOptions) {
			return document.getElementById("sort").selectedOptions[0].value;
		} else {
			return document.querySelector("#sort cho").getAttribute("value");
		}
	}

	switch (isAvail()) {
		case "abc":
			data.apps.sort((a, b) => a.name.localeCompare(b.name));
			break;
		case "cab":
			data.apps.sort((a, b) => a.name.localeCompare(b.name));
			data.apps.sort((a, b) => a.meta.categories[0].localeCompare(b.meta.categories[0]));
			break;
	}
	// if changed via select element
	if (e != undefined && e.target) {
		init(e);
	}
}

window.onhashchange = hashManager;

function hashManager() {
	let a = document.querySelector(`.app[data-slug=${window.location.hash.split("#")[1]}]`);
	var c = 500;
	if (document.querySelector("#category").dataset.sel == "app") c = 0;
	if (a != null && window.location.hash != "") {
		document.querySelector("button[data-name=app]").click();
		setTimeout(() => {
			const rect = a.getBoundingClientRect();
			const elY = rect.top - document.body.getBoundingClientRect().top + rect.height / 2;
			document.body.scrollBy({
				left: 0,
				top: elY - window.innerHeight / 2,
				behavior: "smooth",
			});
		}, c);
	}
}

async function dlCountApp(appSlug) {
	return await fetch(`${ratings}/download_counter/`);
}

//works needs a few fixes but it works
async function getAppRatings(appID) {
	const rawRatings = await fetch(`${ratings}/ratings/${appID}`);
	if (!rawRatings.ok) throw new Error(`Unable to fetch ratings for app ${appID}.`);
	return await rawRatings.json();
}

const capitalize = ([first, ...rest], locale = navigator.language) => first.toLocaleUpperCase(locale) + rest.join("");

const truncate = (n, t) => {
	return n.length > t ? n.substr(0, t - 1) + "…" : n;
};

function clipboard(o) {
	if (navigator.clipboard)
		navigator.clipboard.writeText(o).then(
			function () {
				console.log("Async: Copying to clipboard was successful!");
			},
			function (o) {
				console.error("Async: Could not copy text: ", o);
			}
		);
	else {
		var e = document.createElement("textarea");
		(e.value = o), (e.style.top = "0"), (e.style.left = "0"), (e.style.position = "fixed"), document.body.appendChild(e), e.focus(), e.select();
		try {
			var c = document.execCommand("copy") ? "successful" : "unsuccessful";
			console.log("Fallback: Copying text command was " + c);
		} catch (o) {
			console.error("Fallback: Oops, unable to copy", o);
		}
		document.body.removeChild(e);
	}
}
