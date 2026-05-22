#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import {
	cpSync,
	existsSync,
	mkdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.resolve(fileURLToPath(import.meta.url), "..");
const rootDir = path.resolve(scriptDir, "..");
const sourcePng = path.join(
	rootDir,
	"packages/cosmo-pd101-plugin-auv3/appicon_v1.png",
);
const pluginIconDir = path.join(
	rootDir,
	"packages/cosmo-pd101-plugin/static/icons",
);
const windowsIconPath = path.join(pluginIconDir, "cosmo-pd101.ico");
const macosIconPath = path.join(pluginIconDir, "cosmo-pd101.icns");
const macosAppIconDir = path.join(
	rootDir,
	"packages/cosmo-pd101-plugin-auv3/CosmoPD101Host/CosmoPD101AUv3Ext-macOS/Assets.xcassets/AppIcon.appiconset",
);
const tempDir = path.join(pluginIconDir, ".generated");

function run(command, args) {
	const result = spawnSync(command, args, {
		stdio: "inherit",
		cwd: rootDir,
	});
	if (result.error) {
		throw new Error(`${command} failed: ${result.error.message}`);
	}
	if (result.status !== 0) {
		throw new Error(
			`${command} ${args.join(" ")} exited with code ${result.status}`,
		);
	}
}

function ensureDir(dirPath) {
	mkdirSync(dirPath, { recursive: true });
}

function resizePng(size, destination) {
	run("sips", [
		"-z",
		String(size),
		String(size),
		sourcePng,
		"--out",
		destination,
	]);
}

function writeMacosAppIconSet() {
	ensureDir(macosAppIconDir);
	const entries = [
		["icon_16.png", 16],
		["icon_16@2x.png", 32],
		["icon_32.png", 32],
		["icon_32@2x.png", 64],
		["icon_128.png", 128],
		["icon_128@2x.png", 256],
		["icon_256.png", 256],
		["icon_256@2x.png", 512],
		["icon_512.png", 512],
		["icon_512@2x.png", 1024],
		["icon_ios_1024.png", 1024],
	];

	for (const [filename, size] of entries) {
		resizePng(size, path.join(macosAppIconDir, filename));
	}

	cpSync(
		path.join(macosAppIconDir, "icon_ios_1024.png"),
		path.join(macosAppIconDir, "icon_ios_1024_dark.png"),
	);
	cpSync(
		path.join(macosAppIconDir, "icon_ios_1024.png"),
		path.join(macosAppIconDir, "icon_ios_1024_tinted.png"),
	);
}

function buildIcns() {
	const entries = [
		["icp4", 16, "icns-16.png"],
		["icp5", 32, "icns-32.png"],
		["icp6", 64, "icns-64.png"],
		["ic07", 128, "icns-128.png"],
		["ic08", 256, "icns-256.png"],
		["ic09", 512, "icns-512.png"],
		["ic10", 1024, "icns-1024.png"],
		["ic11", 32, "icns-16@2x.png"],
		["ic12", 64, "icns-32@2x.png"],
		["ic13", 256, "icns-128@2x.png"],
		["ic14", 512, "icns-256@2x.png"],
	];
	const payloads = [];

	for (const [type, size, filename] of entries) {
		const pngPath = path.join(tempDir, filename);
		resizePng(size, pngPath);
		payloads.push({
			type,
			data: readFileSync(pngPath),
		});
	}

	const bodyParts = payloads.map(({ type, data }) => {
		const entryHeader = Buffer.alloc(8);
		entryHeader.write(type, 0, "ascii");
		entryHeader.writeUInt32BE(data.length + 8, 4);
		return Buffer.concat([entryHeader, data]);
	});
	const totalLength = bodyParts.reduce((sum, part) => sum + part.length, 8);
	const fileHeader = Buffer.alloc(8);
	fileHeader.write("icns", 0, "ascii");
	fileHeader.writeUInt32BE(totalLength, 4);

	writeFileSync(macosIconPath, Buffer.concat([fileHeader, ...bodyParts]));
}

function buildIco() {
	const sizes = [16, 32, 48, 64, 128, 256];
	const payloads = [];

	for (const size of sizes) {
		const pngPath = path.join(tempDir, `icon-${size}.png`);
		resizePng(size, pngPath);
		payloads.push({
			size,
			data: readFileSync(pngPath),
		});
	}

	const headerSize = 6 + payloads.length * 16;
	const header = Buffer.alloc(headerSize);
	header.writeUInt16LE(0, 0);
	header.writeUInt16LE(1, 2);
	header.writeUInt16LE(payloads.length, 4);

	let offset = headerSize;
	for (const [index, payload] of payloads.entries()) {
		const entryOffset = 6 + index * 16;
		const dimension = payload.size === 256 ? 0 : payload.size;
		header.writeUInt8(dimension, entryOffset);
		header.writeUInt8(dimension, entryOffset + 1);
		header.writeUInt8(0, entryOffset + 2);
		header.writeUInt8(0, entryOffset + 3);
		header.writeUInt16LE(1, entryOffset + 4);
		header.writeUInt16LE(32, entryOffset + 6);
		header.writeUInt32LE(payload.data.length, entryOffset + 8);
		header.writeUInt32LE(offset, entryOffset + 12);
		offset += payload.data.length;
	}

	writeFileSync(
		windowsIconPath,
		Buffer.concat([header, ...payloads.map((payload) => payload.data)]),
	);
}

function main() {
	if (!existsSync(sourcePng)) {
		throw new Error(`Source icon not found: ${sourcePng}`);
	}

	ensureDir(pluginIconDir);
	rmSync(tempDir, { recursive: true, force: true });
	ensureDir(tempDir);

	writeMacosAppIconSet();
	buildIcns();
	buildIco();

	rmSync(tempDir, { recursive: true, force: true });

	process.stdout.write(`Generated ${windowsIconPath}\n`);
	process.stdout.write(`Generated ${macosIconPath}\n`);
}

try {
	main();
} catch (error) {
	rmSync(tempDir, { recursive: true, force: true });
	console.error(error instanceof Error ? error.message : String(error));
	process.exit(1);
}
