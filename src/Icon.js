/*
 * this is a tiny wrapper around bytesize icons
 *
 * see https://github.com/danklammer/bytesize-icons
 */

import React from "react";

// thanks stackoverflow!
const camelToWormCase = str =>
	str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

export function Icon(props) {
	var icon = "file";
	var size = 1.44;
	var stroke = 2;

	for(var prop in props) {
		switch(prop) {
		case "w":
		case "stroke":
			stroke = props[prop];
			break;
		case "i":
		case "icon":
			icon = props[prop];
			break;
		case "s":
		case "size":
			size = props[prop];
			break;

		case "wUltraLight": stroke=0.5; break;
		case "wThin":       stroke=1.0; break;
		case "wLight":      stroke=1.5; break;
		case "wMedium":     stroke=2.0; break;
		case "wBold":       stroke=2.5; break;
		case "wThick":      stroke=3.0; break;
		case "wHeavy":      stroke=3.5; break;
		case "wBrutal":     stroke=4.0; break;

		case "sTiny":   size=0.6; break;
		case "sSmall":  size=0.8; break;
		case "sEm":     size=1.0; break;
		case "sFont":   size=1.44;break;
		case "sBig":    size=1.66;break;
		case "sLarge":  size=2.0; break;
		case "sHuge":   size=2.5; break;

		default:
			icon = camelToWormCase(prop);
			break;
		}
	}

	return <svg className="icon-bytesize"
		viewBox="0 0 32 32"
		width={size+"em"} height={size+"em"}
		fill="none" stroke="currentcolor"
		strokeLinecap="round" strokeLinejoin="round"
		strokeWidth={stroke}>
		<use xlinkHref={"bytesize-symbols.min.svg#i-"+icon} />
	</svg>;
}
