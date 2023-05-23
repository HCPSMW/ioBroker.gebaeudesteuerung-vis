/*
	ioBroker.vis gebaeudesteuerung-vis Widget-Set

	version: "0.0.1"

	Copyright 2023 SW
*/
"use strict";

/* global $, vis, systemDictionary */

// add translations for edit mode
$.extend(true, systemDictionary, {
	// Add your translations here, e.g.:
	// "size": {
	// 	"en": "Size",
	// 	"de": "Größe",
	// 	"ru": "Размер",
	// 	"pt": "Tamanho",
	// 	"nl": "Grootte",
	// 	"fr": "Taille",
	// 	"it": "Dimensione",
	// 	"es": "Talla",
	// 	"pl": "Rozmiar",
	//  "uk": "Розмір"
	// 	"zh-cn": "尺寸"
	// }
});

// // this code can be placed directly in gebaeudesteuerung-vis.html
// vis.binds["gebaeudesteuerung-vis"] = {
// 	version: "0.0.2",
// 	showVersion: function () {
// 		if (vis.binds["gebaeudesteuerung-vis"].version) {
// 			console.log("Version gebaeudesteuerung-vis: " + vis.binds["gebaeudesteuerung-vis"].version);
// 			vis.binds["gebaeudesteuerung-vis"].version = null;
// 		}
// 	},
// 	createWidget: function (widgetID, view, data, style) {
// 		var $div = $("#" + widgetID);
// 		// if nothing found => wait
// 		if (!$div.length) {
// 			return setTimeout(function () {
// 				vis.binds["gebaeudesteuerung-vis"].createWidget(widgetID, view, data, style);
// 			}, 100);
// 		}

// 		var text = "";
// 		text += "OID: " + data.oid + "</div><br>";
// 		text += 'OID value: <span class="gebaeudesteuerung-vis-value">' + vis.states[data.oid + ".val"] + "</span><br>";
// 		text += 'Color: <span style="color: ' + data.myColor + '">' + data.myColor + "</span><br>";
// 		text += "extraAttr: " + data.extraAttr + "<br>";
// 		text += "Browser instance: " + vis.instance + "<br>";
// 		text += 'htmlText: <textarea readonly style="width:100%">' + (data.htmlText || "") + "</textarea><br>";

// 		$("#" + widgetID).html(text);

// 		// subscribe on updates of value
// 		function onChange(e, newVal, oldVal) {
// 			$div.find(".template-value").html(newVal);
// 		}
// 		if (data.oid) {
// 			vis.states.bind(data.oid + ".val", onChange);
// 			//remember bound state that vis can release if didnt needed
// 			$div.data("bound", [data.oid + ".val"]);
// 			//remember onchange handler to release bound states
// 			$div.data("bindHandler", onChange);
// 		}
// 	},
// };

// vis.binds["gebaeudesteuerung-vis"].showVersion();

vis.binds["gebaeudesteuerung-vis"] = {
	version: "0.0.2",
	showVersion: function () {
		if (vis.binds["gebaeudesteuerung-vis"].version) {
			console.log("Version gebaeudesteuerung-vis: " + vis.binds["gebaeudesteuerung-vis"].version);
			vis.binds["gebaeudesteuerung-vis"].version = null;
		}
	},
	getMembersFromEnum: function (enumId) {
		return new Promise((resolve, reject) => {
			vis.conn.getObject(enumId, function (err, obj) {
				if (err) {
					reject(err);
				} else {
					resolve(obj.common.members);
				}
			});
		});
	},
	createDivForMember: function (memberId) {
		return new Promise((resolve, reject) => {
			vis.conn.getState(memberId, function (err, state) {
				if (err) {
					reject(err);
				} else {
					let div = document.createElement("div");
					div.innerText = `${memberId}: ${state.val}`;
					resolve(div);
				}
			});
		});
	},
	createWidget: function (widgetID, view, data, style) {
		var $div = $("#" + widgetID);
		// if nothing found => wait
		if (!$div.length) {
			return setTimeout(function () {
				vis.binds["gebaeudesteuerung-vis"].createWidget(widgetID, view, data, style);
			}, 100);
		}

		this.getMembersFromEnum("enum.rooms.og.r204")
			.then((members) => {
				let promises = members.map((member) => this.createDivForMember(member));
				return Promise.all(promises);
			})
			.then((divs) => {
				divs.forEach((div) => {
					$div.append(div);
				});
			})
			.catch((err) => {
				console.error(err);
			});
	},
};

vis.binds["gebaeudesteuerung-vis"].showVersion();
