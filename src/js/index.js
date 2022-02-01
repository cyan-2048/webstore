last_check = localStorage.versions != undefined ? (last_check = JSON.parse(localStorage.versions)) : (last_check = { non_existed: 1.0 });
proxy = localStorage.proxy != undefined ? (proxy = JSON.parse(localStorage.proxy)) : (proxy = "https://api.allorigins.win/raw?url=");
ratings = localStorage.ratings != undefined ? (ratings = JSON.parse(localStorage.ratings)) : (ratings = "https://bhackers.uber.space/srs/v1");
database = localStorage.database != undefined ? (database = JSON.parse(localStorage.database)) : (database = "https://banana-hackers.gitlab.io/store-db/data.json");
new_versions = {};
isKai = navigator.userAgent.toLocaleLowerCase().includes("kaios");
qr_prefix = localStorage.qr_prefix != undefined ? (qr_prefix = JSON.parse(localStorage.qr_prefix)) : (qr_prefix = "bhacker:");

(() => {
	var index = 0;
	var cancel = false;

	function next() {
		index = index + 1;
		if (index == data.apps.length || cancel) {
			index = 0;
			if (!cancel) {
				localStorage.versions = JSON.stringify(last_check);
			}
			cancel = false;
			return;
		}
		update();
	}

	cancel_update = () => {
		cancel = true;
	};

	update = () => {
		let ef = data.apps[index];
		function res(r) {
			if (last_check[ef.slug] && last_check[ef.slug] != r.version) {
				new_versions[ef.slug] = { from: last_check[ef.slug], to: r.version };
			}
			last_check[ef.slug] = r.version;
			next();
		}
		fetch(ef.download.manifest)
			.then((r) => r.json())
			.then((r) => res(r))
			.catch((e) => {
				console.error(e);
				fetch(proxy + ef.download.manifest)
					.then((r) => r.json())
					.then((r) => res(r))
					.catch((e) => next());
			});
	};
})();

var database_init = () => {
	fetch(database)
		.then((response) => response.json())
		.catch((e) => {
			console.error(e);
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

			fetch(ratings + "/download_counter/")
				.then((resulta) => resulta.json())
				.then((resulta) => {
					data.dl = resulta;
					let so = document.getElementById("sort");
					if (so.tagName == "SEL") {
						var i = document.createElement("opt");
						i.innerHTML = `<i class="fas fa-fire-alt"></i>Popularity`;
						i.setAttribute("value", "pop");
						so.querySelector("drop").appendChild(i);
					} else {
						var i = document.createElement("option");
						i.innerText = "Popularity";
						i.value = "pop";
						so.add(i);
					}
				})
				.catch((e) => {
					console.error(e);
					alert("can't download download counts, store will not have download count functionality");
				})
				.then(() => {
					fetch(ratings + "/ratings")
						.then((resulta) => resulta.json())
						.then((resulta) => {
							data.ratings = resulta;
							let so = document.getElementById("sort");
							if (so.tagName == "SEL") {
								var i = document.createElement("opt");
								i.innerHTML = `<i class="fas fa-star"></i>Ratings`;
								i.setAttribute("value", "ra");
								so.querySelector("drop").appendChild(i);
							} else {
								var i = document.createElement("option");
								i.innerText = "Ratings";
								i.value = "ra";
								so.add(i);
							}
						})
						.catch((e) => {
							console.error(e);
							alert("can't download download ratings, store will not have ratings functionality");
						});
				});
		});
};

database_init();

var init = (e) => {
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
		y += `[data-sel="${c}"] + #apps div.${c}:not(.hidden)`;
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
		img.alt = " ";
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

		if (!isKai) {
			var j = document.createElement("a");
			j.className = "info";
			j.innerHTML = `<i class="fas fa-info-circle"></i> Info`;
			j.href = `#${a.slug}`;
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
		}
		b.className = "app";
		b.dataset.slug = a.slug;
		for (let d of a.meta.categories) {
			b.classList.add(d);
		}
		document.getElementById("apps").children[0].appendChild(b);
	}

	if (e != undefined) {
		location.hash = "";
	} else {
		document.querySelector("#splash #image").className = "loaded";
		document.getElementById("splash").style = "opacity: 0; visibility: hidden";
	}
	if (!isKai) document.getElementById("le").innerText = document.querySelectorAll(`[data-sel="app"] + #apps .app:not(.hidden)`).length;
	else document.querySelector(".app").classList.add("selected");
	if (location.hash != "") hashManager(undefined);
};

var lastScroll = 0;

window.addEventListener("DOMContentLoaded", () => {
	let a = isKai ? document.querySelector("sel") : document.querySelector("select");
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
		let a = document.querySelectorAll(`[data-sel="${t.dataset.name}"] + #apps .${t.dataset.name}:not(.hidden)`);
		document.getElementById("le").innerText = a.length;
		if (isKai) {
			document.querySelector(".app.selected").classList.remove("selected");
			a[0].classList.add("selected");
			setTimeout(() => {
				let e = document.querySelector("#category button.selected").getBoundingClientRect(),
					t = e.left - document.body.getBoundingClientRect().left + e.width / 2;
				document.getElementById("category").scrollBy({ top: 0, left: t - window.innerWidth / 2, behavior: "smooth" });
			}, 0);
		}
	};

	if (!isKai) {
		var c = document.createElement("button");
		c.id = "scrollup";
		var i = document.createElement("i");
		i.className = "fas fa-chevron-up";
		c.appendChild(i);
		document.body.appendChild(c);
		if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())) {
			c.style.transform = "none";
		} else {
			document.getElementById("apps").addEventListener("wheel", function (event) {
				if (document.body.scrollTop == 0) {
					c.style.transform = "translateY(70px)";
					return;
				}
				if (event.deltaY < 0 && c.style.transform == "translateY(70px)") {
					c.style.transform = "none";
				} else if (event.deltaY > 0 && c.style.transform == "none") {
					c.style.transform = "translateY(70px)";
				} else {
					return;
				}
			});
		}

		document.getElementById("search").oninput = (e) => {
			let val = e.target.value.toLocaleLowerCase();
			if (val == "") document.querySelectorAll(".hidden").forEach((e) => e.classList.remove("hidden"));
			document.querySelectorAll(".app").forEach((el) => {
				let slug = el.dataset.slug;
				let r = data.apps.find((o) => {
					return o.slug == slug;
				});
				if ((r.description + r.meta.tags + r.name + r.author).replace(/[; .]/g, "").replace(/<(.*)/g, "").toLowerCase().includes(val)) {
					el.classList.remove("hidden");
				} else {
					el.classList.add("hidden");
				}
			});
			let c = document.getElementById("barcontainer").dataset.sel;
			document.getElementById("le").innerText = document.querySelectorAll(`[data-sel="${c}"] + #apps div.${c}:not(.hidden)`).length;
		};
	} else {
		var inp = document.createElement("input");
		inp.max = 1;
		inp.type = "number";
		inp.maxLength = 1;
		inp.id = "secret";
		document.body.appendChild(inp);
		inp.focus();
		inp.onblur = () => {
			setTimeout(() => {
				inp.focus();
			}, 1);
		};
		function aha() {
			if (!window.fullScreen) {
				document.documentElement.requestFullscreen();
			}
			document.getElementById("secret").value = "9";
		}
		window.addEventListener("keyup", aha);
		window.onkeydown = (e) => {
			e.preventDefault();
			function isInViewport(n) {
				let t = n.getBoundingClientRect();
				return t.top >= 0 && t.left >= 0 && t.bottom <= window.innerHeight - 30 && t.right <= window.innerWidth;
			}
			let k = e.key;
			let c = document.getElementById("barcontainer").dataset.sel;
			let array = Array.from(document.querySelectorAll(`[data-sel="${c}"] + #apps div.${c}:not(.hidden)`));
			let index = array.indexOf(document.querySelector("#apps .app.selected"));
			let array1 = Array.from(document.getElementById("category").children);
			let index1 = array1.indexOf(document.querySelector("#category button.selected"));
			let array2 = Array.from(document.querySelectorAll("#appcard a,#img img:first-child")).filter((e) => isInViewport(e));
			let index2 = array2.indexOf(document.querySelector("#appcard .selected"));
			let index3 = Array.from(document.querySelectorAll("#appcard a,#img img")).indexOf(document.querySelector("#appcard .selected"));

			if (index != -1) {
				switch (k) {
					case "ArrowDown":
						if (index != array.length - 1) {
							document.querySelector(".app.selected").classList.remove("selected");
							array[index + 1].classList.add("selected");
						}
						break;
					case "ArrowUp":
						if (index != 0) {
							document.querySelector(".app.selected").classList.remove("selected");
							array[index - 1].classList.add("selected");
						}
						break;
					case "Backspace":
						location = "about:blank";
						break;
					case "ArrowLeft":
						if (index1 != 0) {
							array1[index1 - 1].click();
						}
						break;
					case "ArrowRight":
						if (index1 != array1.length - 1) {
							array1[index1 + 1].click();
						}
						break;
					case "Enter":
						location.hash = "#" + document.querySelector("#apps .app.selected").dataset.slug;
						return;
						break;
				}
				setTimeout(() => {
					let t = document.querySelector("#apps .app.selected").getBoundingClientRect(),
						e = t.top - document.body.getBoundingClientRect().top + t.height / 2;
					document.getElementById("container").scrollBy({ left: 0, top: e - window.innerHeight / 2, behavior: "smooth" });
				}, 0);
			} else if (location.hash != "") {
				if (index3 != -1) {
					let ac = document.getElementById("appcard");
					switch (k) {
						case "ArrowDown":
							ac.scrollBy({ left: 0, top: 70, behavior: "smooth" });
							break;
						case "ArrowUp":
							ac.scrollBy({ left: 0, top: -70, behavior: "smooth" });
							break;
					}
				}
				if (index2 != -1) {
					let v = () => document.querySelectorAll("#appcard .selected").forEach((e) => e.classList.remove("selected"));
					switch (k) {
						case "ArrowUp":
							if (index2 != 0) {
								v();
								array2[index2 - 1].classList.add("selected");
							}
							break;
						case "ArrowDown":
							if (index2 != array2.length - 1) {
								v();
								array2[index2 + 1].classList.add("selected");
							}
							break;
					}
				} else {
					if (array2.length > 0 && k.match(/ArrowUp|ArrowDown/g)) {
						document.querySelectorAll("#appcard .selected").forEach((e) => e.classList.remove("selected"));
						array2[0].classList.add("selected");
					}
				}

				if (document.querySelector("#appcard .selected").tagName == "IMG") {
					let b = () => document.querySelectorAll("#appcard .selected").forEach((e) => e.classList.remove("selected"));
					let arr = Array.from(document.querySelectorAll("#img img"));
					let ind = arr.indexOf(document.querySelector("#appcard .selected"));
					let c = () => {
						setTimeout(() => {
							let e = document.querySelector("#appcard .selected").getBoundingClientRect(),
								t = e.left - document.body.getBoundingClientRect().left + e.width / 2;
							document.getElementById("img").scrollBy({ top: 0, left: t - window.innerWidth / 2, behavior: "smooth" });
						}, 0);
					};
					let d = () => {
						let v = document.getElementById("scrp"),
							po = document.querySelector("#appcard img.selected");
						if (v.className == "full" && po) v.src = po.src;
					};
					switch (k) {
						case "ArrowRight":
							if (ind != arr.length - 1) {
								b();
								arr[ind + 1].classList.add("selected");
								c();
								d();
							}
							break;
						case "ArrowLeft":
							if (ind != 0) {
								b();
								arr[ind - 1].classList.add("selected");
								c();
								d();
							}
							break;
						case "Enter":
						case "Backspace":
							if (k == "Backspace" && document.getElementById("scrp").className == "") {
								location.hash = "";
								return;
							}
							document.getElementById("scrp").classList.toggle("full");
							d();
							break;
					}
				} else {
					document.getElementById("img").scrollTo({ left: 0 });
					if (k == "Backspace") {
						location.hash = "";
					}
				}
			}
		};
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
		clipboard(location.origin + "/#" + e.target.parentElement.parentElement.dataset.slug);
	} else if (e.target.id == "scrollup") {
		document.body.scrollTo({ top: 0, behavior: "smooth" });
	} else if (e.target.id == "cards") {
		document.querySelector("#appcard .close").click();
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

	data.apps.sort((a, b) => a.name.localeCompare(b.name));
	switch (isAvail()) {
		case "cab":
			data.apps.sort((a, b) => a.meta.categories[0].localeCompare(b.meta.categories[0]));
			break;
		case "ra":
			data.apps.sort((a, b) => {
				var o = 0;
				if (!data.ratings[a.slug]) return true;
				if (data.ratings[b.slug]) o = data.ratings[b.slug].average_rating;
				return data.ratings[a.slug].average_rating < o;
			});
			break;
		case "pop":
			data.apps.sort((a, b) => {
				var o = 0;
				if (!data.dl[a.slug]) return true;
				if (data.dl[b.slug]) o = data.dl[b.slug];
				return data.dl[a.slug] < o;
			});
			break;
	}

	// if changed via select element
	if (e != undefined && e.target) {
		init(e);
	}
}

window.onhashchange = hashManager;

var info_open = false;

function hashManager(e) {
	if (isKai && location.hash == "") {
		document.querySelector("#appcard .selected").classList.remove("selected");
		document.getElementById("cards").removeAttribute("style");
		document.getElementById("appcard").removeAttribute("style");
		document.body.style.overflow = "auto";
		document.querySelector(`[data-slug='${e.oldURL.split("#")[1]}']`).classList.add("selected");
		setTimeout(() => {
			let t = document.querySelector("#apps .app.selected").getBoundingClientRect(),
				e = t.top - document.body.getBoundingClientRect().top + t.height / 2;
			document.getElementById("container").scrollBy({ left: 0, top: e - window.innerHeight / 2, behavior: "smooth" });
		}, 0);
		return;
	}
	let hash = location.hash.split("#")[1];
	let a = document.querySelector(`.app[data-slug="${hash}"]`);
	var c = 200;
	if (document.querySelector("#category").dataset.sel == "app") c = 0;
	if (a != null && location.hash != "") {
		if (e == undefined) document.querySelector("button[data-name=app]").click();
		setTimeout(() => {
			var rect = a.getBoundingClientRect();
			var elY = rect.top - document.body.getBoundingClientRect().top + rect.height / 2;
			document.body.scrollBy({
				left: 0,
				top: elY - window.innerHeight / 2,
				behavior: "smooth",
			});
		}, c);
	}
	if (info_open && location.hash == "") {
		document.querySelector("#appcard .close").click();
		return;
	}
	let r = data.apps.find((o) => {
		return o.slug == hash;
	});
	if (r == undefined) return;
	document.body.style.overflow = "hidden";
	let v = document.getElementById("appcard");
	v.scrollTo({ top: 0 });
	v.querySelector("#head img").src = "";
	v.querySelector("#head img").src = r.icon;
	v.querySelector("#head img").alt = "e";
	v.querySelector("#boxue #na").innerText = r.name;
	v.querySelector("#boxue #ca").innerText = r.meta.categories.map((str) => capitalize(str)).join(", ");
	v.querySelector("#boxue #de").innerText = r.author[0].split("<")[0];
	for (let m of v.querySelectorAll(`#ave #to, #appcard > #de`)) {
		for (let h of m.childNodes) {
			if (h.id == undefined || h.className == undefined) {
				h.remove();
			}
		}
	}
	for (let cu of v.querySelectorAll("#scr #img,#bucon,#spe ul,#chat,#qrcode")) {
		cu.innerHTML = "";
	}
	v.querySelector("#appcard > #de").appendChild(document.createTextNode(r.description));
	var af = document.createElement("a");
	af.href = r.download.url;
	af.innerText = "Download";
	v.querySelector("#bucon").appendChild(af);
	if (r.screenshots.length == 0) {
		v.querySelector("#scr").style.display = "none";
	} else {
		v.querySelector("#scr").style = "display: block";
		for (let g of r.screenshots) {
			var h = document.createElement("img");
			h.src = g;
			h.onerror = (e) => {
				e.target.remove();
			};
			v.querySelector("#scr #img").appendChild(h);
		}
	}
	function creli(a, b) {
		var u = document.createElement("li");
		var x = document.createElement("div");
		x.className = "a";
		x.innerText = a;
		u.appendChild(x);
		var y = document.createElement("div");
		y.className = "b";
		if (typeof b === "string") {
			y.innerText = b;
		} else if (Array.isArray(b)) {
			for (let ku of b) {
				y.appendChild(ku);
			}
		} else {
			y.appendChild(b);
		}
		u.appendChild(y);
		return u;
	}
	function qr_gen(t, e) {
		var l = qrjs(t),
			r = document.createElement("canvas");
		(r.width = e), (r.height = e);
		for (var a = r.getContext("2d"), h = l.modules, n = e / h.length, o = e / h.length, f = 0; f < h.length; ++f)
			for (var c = h[f], i = 0; i < c.length; ++i) {
				a.fillStyle = c[i] ? "#000" : "#fff";
				var d = Math.ceil((i + 1) * n) - Math.floor(i * n),
					g = Math.ceil((f + 1) * o) - Math.floor(f * o);
				a.fillRect(Math.round(i * n), Math.round(f * o), d, g);
			}
		return r;
	}
	if (isKai) {
		v.querySelector("#qr").style.display = "none";
	} else {
		v.querySelector("#qr").style.display = "block";
		v.querySelector("#qrcode").appendChild(qr_gen(qr_prefix + r.slug, 100));
	}
	var ul = v.querySelector("#spe ul");
	for (let uu of ["author", "maintainer"]) {
		if (r[uu]) {
			var bee;
			if (r[uu][0].includes("<") && r[uu].length == 1) {
				var uy = document.createElement("a");
				let ye = r[uu][0].split("<")[1].split(">")[0];
				if (r[uu][0].includes("@")) {
					uy.href = "mailto:" + ye;
				} else {
					uy.href = ye;
				}
				uy.target = "_blank";
				uy.innerText = r[uu][0].split("<")[0];
				bee = uy;
			} else if (r[uu].length != 1) {
				bee = [];
				r[uu].forEach((e, i) => {
					if (e.includes("<")) {
						var uy = document.createElement("a");
						let ye = e.split("<")[1].split(">")[0];
						if (e.includes("@")) {
							uy.href = "mailto:" + ye;
						} else {
							uy.href = ye;
						}
						uy.innerText = e.split("<")[0];
						uy.target = "_blank";
						bee.push(uy);
					} else {
						bee.push(document.createTextNode(e));
					}
					if (i != r[uu].length - 1) bee.push(document.createTextNode(", "));
				});
			} else if (!r[uu][0].includes("<") && r[uu].length == 1) {
				bee = r[uu][0];
			}
			var i = uu == "author" ? "Developers" : "Maintainers";
			ul.appendChild(creli(i, bee));
		}
	}
	for (let uu of ["website", "git_repo", "donation"]) {
		if (r[uu]) {
			var yy = document.createElement("a");
			yy.innerText = r[uu];
			yy.target = "_blank";
			yy.href = r[uu];
			var i = "Repository";
			switch (uu) {
				case "website":
				case "donation":
					i = capitalize(uu);
					break;
			}
			ul.appendChild(creli(i, yy));
		}
	}
	if (last_check[r.slug]) {
		ul.appendChild(creli("Version", last_check[r.slug]));
	}
	ul.appendChild(creli("Type", capitalize(r.type)));
	if (r.locales) {
		ul.appendChild(creli("Languages", r.locales.join(", ")));
	}
	ul.appendChild(creli("Anti-features", `Ads: ${r.has_ads}\n Tracking: ${r.has_tracking}`));
	if (r.license) {
		var bee;
		if (r.license.includes("<")) {
			var uy = document.createElement("a");
			let ye = r.license.split("<")[1].split(">")[0];
			uy.href = ye;
			uy.innerText = r.license.split("<")[0];
			uy.target = "_blank";
			bee = uy;
		} else {
			bee = r.license;
		}
		ul.appendChild(creli("License", bee));
	}
	if (data.dl && data.dl[r.slug]) {
		ul.appendChild(creli("Downloads", data.dl[r.slug].toString()));
	}
	if (data.ratings && data.ratings[r.slug]) {
		let y = data.ratings[r.slug];
		v.querySelector("#ra").style.display = "block";
		v.querySelector("#ave #sco").innerText = y.average_rating.toFixed("1");
		v.querySelector("#ave #stars").style = `--stars:${(y.average_rating / 5) * 100}%`;
		v.querySelector("#ave #to").appendChild(document.createTextNode(`${y.rating_count} total`));
		for (let b of v.querySelectorAll("#cha *")) {
			b.style = "--to:0%";
		}
		getAppRatings(r.slug, (cb, err) => {
			if (location.hash == "#" + r.slug && cb != "eroor404") {
				if (!isKai) {
					[1, 2, 3, 4, 5].forEach((ar) => {
						let a = cb.ratings.filter((a) => a.points == ar).length;
						v.querySelector(`#appcard [data-r="${ar}"]`).style = `--to:${(a / y.rating_count) * 100}%`;
					});
				}
				let k = v.querySelector("#chat");
				for (let o of cb.ratings) {
					var p = document.createElement("div");
					var q = document.createElement("div");
					q.className = "tie";
					var tr = 14;
					if (isKai) tr = 6;
					q.appendChild(document.createTextNode(`@${truncate(o.username, tr)}`));
					if (!isKai) {
						var stars = document.createElement("div");
						stars.id = "stars";
						stars.style = `--stars:${(o.points / 5) * 100}%`;
						q.appendChild(stars);
						q.appendChild(document.createTextNode(new Date(o.creationtime * 1000).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })));
					} else {
						q.appendChild(document.createTextNode(`\u00A0\u00A0 ${o.points} ★ \u00A0\u00A0`));
						q.appendChild(document.createTextNode(new Date(o.creationtime * 1000).toLocaleDateString()));
					}
					p.appendChild(q);
					p.appendChild(document.createTextNode(o.description));
					k.appendChild(p);
				}
			} else return;
		});
	} else {
		v.querySelector("#ra").style.display = "none";
	}
	document.getElementById("cards").style = "opacity:1;visibility:visible";
	document.getElementById("appcard").style = "transform:translate(50%, -50%)";
	info_open = true;
	if (isKai) {
		if (location.hash != "") {
			document.querySelector(".app.selected").classList.remove("selected");
			document.querySelector("#appcard a,#img img").classList.add("selected");
		}
	} else {
		document.querySelector("#appcard .close").addEventListener("click", function cliky() {
			document.querySelector("#appcard .close").removeEventListener("click", cliky);
			info_open = false;
			location.hash = "";
			document.getElementById("cards").removeAttribute("style");
			document.getElementById("appcard").removeAttribute("style");
			document.body.style.overflow = "auto";
		});
	}
}

(() => {
	toast = (a) => {
		try {
			let o = Object.keys(a);
			var n = document.getElementById("notif");
			var t = document.createElement("div");
			if (o.includes("text")) {
				t.innerText = a.text;
			}
			if (o.includes("delay")) {
				setTimeout(() => {
					t.remove();
				}, 1000 * o.delay);
			}
			if (o.includes("element")) {
				n.appendChild(o.element);
				return;
			}
			n.appendChild(t);
		} catch (e) {}
	};
})();

function getAppRatings(appID, cb) {
	fetch(`${ratings}/ratings/${appID}`)
		.then((response) => response.json())
		.then((response) => cb(response))
		.catch((e) => cb("eroor404", e));
}

var capitalize = ([first, ...rest], locale = navigator.language) => first.toLocaleUpperCase(locale) + rest.join("");

var truncate = (n, t) => {
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

if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = Array.prototype.forEach;
}
