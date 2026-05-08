import { drawScopeGrid, setupScopeCanvas } from "./canvas";
import { withAlpha } from "./palette";
import {
	calculateScopeActivity,
	normalizeWindowedSamples,
	resolveScopeWindow,
} from "./processing";
import type { ScopeThemePalette } from "./types";

type TravelDebris = {
	x: number;
	y: number;
	radius: number;
	vx: number;
	spin: number;
	seed: number;
};

type TravelLaser = {
	x: number;
	y: number;
	vx: number;
	age: number;
};

type TravelSpark = {
	x: number;
	y: number;
	age: number;
	seed: number;
};

type TravelState = {
	rocketY: number;
	targetY: number;
	debris: TravelDebris[];
	lasers: TravelLaser[];
	sparks: TravelSpark[];
	health: number;
	hitUntil: number;
	explodingUntil: number;
	respawnAt: number;
	lastTime: number;
	lastSpawn: number;
	lastShot: number;
	lastManualInputAt: number;
	isInManualMode: boolean;
	starVelocity: number;
	starScroll: number;
};

const MAX_HEALTH = 100;
const TRAVEL_STATE_BY_CANVAS = new WeakMap<HTMLCanvasElement, TravelState>();

function getTravelState(
	canvas: HTMLCanvasElement,
	height: number,
): TravelState {
	const existing = TRAVEL_STATE_BY_CANVAS.get(canvas);
	if (existing) return existing;

	const state: TravelState = {
		rocketY: height * 0.5,
		targetY: height * 0.5,
		debris: [],
		lasers: [],
		sparks: [],
		health: MAX_HEALTH,
		hitUntil: 0,
		explodingUntil: 0,
		respawnAt: 0,
		lastTime: performance.now(),
		lastSpawn: 0,
		lastShot: 0,
		lastManualInputAt: 0,
		isInManualMode: false,
		starVelocity: 0,
		starScroll: 0,
	};
	TRAVEL_STATE_BY_CANVAS.set(canvas, state);
	return state;
}

function pickSafeLane(
	debris: TravelDebris[],
	rocketX: number,
	currentY: number,
	height: number,
): number {
	const lanes: { y: number; score: number }[] = [];
	const centerY = height * 0.54;
	for (let lane = 0; lane < 7; lane++) {
		const laneY = height * (0.14 + (lane / 6) * 0.72);
		let score = 0;
		for (const rock of debris) {
			const dx = Math.abs(rock.x - rocketX);
			const dy = Math.abs(rock.y - laneY);
			if (dx < 180) {
				score += dy - rock.radius * 3.6 - (180 - dx) * 0.78;
				if (dx < 90 && dy < rock.radius + 18) score -= 240;
			}
		}
		const centerPenalty =
			(Math.abs(laneY - centerY) / Math.max(1, height * 0.5)) * 24;
		score -= centerPenalty;
		if (laneY > height * 0.84) score -= 22;
		if (laneY < height * 0.2) score -= 18;
		lanes.push({ y: laneY, score });
	}
	let bestScore = -Infinity;
	for (const lane of lanes) {
		if (lane.score > bestScore) bestScore = lane.score;
	}
	const safeScoreFloor = bestScore - 14;
	let nearestSafeY = height * 0.5;
	let nearestDistance = Infinity;
	for (const lane of lanes) {
		if (lane.score < safeScoreFloor) continue;
		const distance = Math.abs(lane.y - currentY);
		if (distance < nearestDistance) {
			nearestDistance = distance;
			nearestSafeY = lane.y;
		}
	}
	return nearestSafeY;
}

function drawHealthLine(
	ctx: CanvasRenderingContext2D,
	height: number,
	health: number,
	palette: ScopeThemePalette,
) {
	ctx.fillStyle = withAlpha(palette.accentDim, 0.45);
	ctx.fillRect(6, height - 7, 62, 3);
	ctx.fillStyle = health <= 25 ? palette.alert : palette.accentSoft;
	ctx.fillRect(6, height - 7, 62 * Math.max(0, health / MAX_HEALTH), 3);
}

function drawExplosion(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	now: number,
	endAt: number,
	palette: ScopeThemePalette,
) {
	const progress = Math.max(0, Math.min(1, 1 - (endAt - now) / 700));
	ctx.strokeStyle = withAlpha(palette.highlight, 1 - progress);
	ctx.lineWidth = 2;
	for (let ray = 0; ray < 12; ray++) {
		const angle = (ray / 12) * Math.PI * 2;
		const inner = 4 + progress * 10;
		const outer = 12 + progress * 34;
		ctx.beginPath();
		ctx.moveTo(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner);
		ctx.lineTo(x + Math.cos(angle) * outer, y + Math.sin(angle) * outer);
		ctx.stroke();
	}
}

function drawRocket(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	activity: number,
	palette: ScopeThemePalette,
	isHit: boolean,
	manualThrust: boolean,
) {
	ctx.save();
	ctx.translate(x, y);
	ctx.globalAlpha = isHit ? 0.42 : 1;
	ctx.shadowColor = palette.glow;
	ctx.shadowBlur = 8 + activity * 10;
	ctx.fillStyle = isHit ? palette.alert : palette.light;
	ctx.beginPath();
	ctx.moveTo(18, 0);
	ctx.lineTo(-11, -8);
	ctx.lineTo(-7, 0);
	ctx.lineTo(-11, 8);
	ctx.closePath();
	ctx.fill();

	ctx.shadowBlur = 0;
	ctx.fillStyle = palette.accentSecondary;
	ctx.beginPath();
	ctx.arc(2, -1, 3.2, 0, Math.PI * 2);
	ctx.fill();

	ctx.globalAlpha = manualThrust ? 0.9 : 0.62;
	ctx.fillStyle = palette.warm;
	for (let flame = 0; flame < 5; flame++) {
		ctx.beginPath();
		ctx.arc(
			-15 - flame * 4,
			Math.sin(flame + activity * 6) * 1.4,
			2.2 + activity * 2 + (manualThrust ? 1.4 : 0) - flame * 0.22,
			0,
			Math.PI * 2,
		);
		ctx.fill();
	}
	ctx.restore();
	ctx.globalAlpha = 1;
}

function fireLaser(
	state: TravelState,
	shipX: number,
	shipY: number,
	now: number,
	activity: number,
) {
	if (now - state.lastShot < Math.max(110, 240 - activity * 90)) return;
	state.lastShot = now;
	state.lasers.push({
		x: shipX + 20,
		y: shipY,
		vx: 210 + activity * 130,
		age: 0,
	});
}

export function drawTravelScope(
	canvas: HTMLCanvasElement,
	samples: Uint8Array | Float32Array,
	hz: number,
	sampleRate: number,
	cycles: number,
	triggerLevel: number,
	zoom: number,
	palette: ScopeThemePalette,
	pressedKeys: ReadonlySet<string>,
	intensityMultiplier = 1,
) {
	const setup = setupScopeCanvas(canvas);
	if (!setup) return;
	const { ctx, width, height } = setup;
	drawScopeGrid(ctx, width, height, palette);

	const window = resolveScopeWindow(
		samples,
		hz,
		sampleRate,
		cycles,
		triggerLevel,
	);
	const normalized = normalizeWindowedSamples(
		samples,
		window.start,
		window.count,
	);
	const { energy, motion, activity, peak } = calculateScopeActivity(
		normalized,
		zoom,
	);
	const state = getTravelState(canvas, height);
	const now = performance.now();
	const dt = Math.min(0.05, Math.max(0.001, (now - state.lastTime) / 1000));
	state.lastTime = now;

	const time = now * 0.001;
	const rocketX = Math.max(28, width * 0.18);
	const hasSound = activity > 0.08 || peak > 0.12;
	const boostedActivity = Math.min(1, activity * intensityMultiplier);
	const boostedMotion = Math.min(1, motion * intensityMultiplier);
	const soundBoost = hasSound
		? 1 + boostedActivity * 0.9 + boostedMotion * 0.75 + peak * 0.35
		: 1;
	const topSafeY = 36;
	const bottomSafeY = height - 18;
	const isManual =
		pressedKeys.has("ArrowUp") ||
		pressedKeys.has("ArrowDown") ||
		pressedKeys.has("Space");

	if (now >= state.respawnAt && state.health <= 0) {
		state.health = MAX_HEALTH;
		state.rocketY = height * 0.5;
		state.targetY = height * 0.5;
		state.hitUntil = 0;
		state.explodingUntil = 0;
		state.isInManualMode = false;
	}

	// Spawn debris when audio is active or in manual mode
	const shouldSpawnDebris =
		(hasSound || state.isInManualMode) &&
		now - state.lastSpawn >
			Math.max(105, 620 - boostedActivity * 410 - boostedMotion * 95);
	if (shouldSpawnDebris) {
		state.lastSpawn = now;
		state.debris.push({
			x: width + 28,
			y: height * (0.12 + Math.random() * 0.76),
			radius: 3.5 + energy * 9 + Math.random() * 8,
			vx: 34 + boostedMotion * 110 + Math.random() * 58,
			spin: (Math.random() - 0.5) * 2.8,
			seed: Math.random() * Math.PI * 2,
		});
		if (intensityMultiplier > 1.1 && state.debris.length < 18) {
			state.debris.push({
				x: width + 46,
				y: height * (0.12 + Math.random() * 0.76),
				radius: 3.5 + energy * 8 + Math.random() * 7,
				vx: 42 + boostedMotion * 120 + Math.random() * 64,
				spin: (Math.random() - 0.5) * 3.4,
				seed: Math.random() * Math.PI * 2,
			});
		}
	}

	// Track manual input and timeout after 5 seconds
	if (isManual && state.health > 0) {
		state.lastManualInputAt = now;
		state.isInManualMode = true;
	} else if (now - state.lastManualInputAt > 5000) {
		state.isInManualMode = false;
	}

	// Check if there's debris close to the rocket
	const hasNearbyDebris = state.debris.some((rock) => {
		const dx = Math.abs(rock.x - (rocketX + 28));
		return dx < 320; // Check within 320px ahead
	});

	if (state.health > 0) {
		if (pressedKeys.has("ArrowUp")) state.targetY -= dt * 150 * soundBoost;
		if (pressedKeys.has("ArrowDown")) state.targetY += dt * 150 * soundBoost;
		if (!state.isInManualMode) {
			let desiredAutoTargetY = state.targetY;
			if (hasNearbyDebris) {
				const imminentRock = state.debris.find((rock) => {
					const dx = rock.x - rocketX;
					const dy = Math.abs(rock.y - state.rocketY);
					return dx > -20 && dx < 88 && dy < rock.radius + 22;
				});
				if (imminentRock) {
					const dodge = imminentRock.y >= state.rocketY ? -72 : 72;
					desiredAutoTargetY = state.rocketY + dodge;
				} else {
					// Actively avoid debris
					desiredAutoTargetY = pickSafeLane(
						state.debris,
						rocketX + 28,
						state.rocketY,
						height,
					);
				}
			} else {
				// Hover around middle with gentle sine pattern
				const hoverCenter = height * 0.56;
				const hoverRange = height * 0.08;
				desiredAutoTargetY = hoverCenter + Math.sin(time * 0.8) * hoverRange;
			}
			const autoTargetStep = dt * (120 + 100 * soundBoost);
			const autoDelta = desiredAutoTargetY - state.targetY;
			state.targetY += Math.max(
				-autoTargetStep,
				Math.min(autoTargetStep, autoDelta),
			);
		}
		if (pressedKeys.has("Space"))
			fireLaser(state, rocketX, state.rocketY, now, activity);
	}
	state.targetY = Math.max(topSafeY, Math.min(bottomSafeY, state.targetY));
	state.rocketY +=
		(state.targetY - state.rocketY) * Math.min(1, dt * (8.8 * soundBoost));

	for (const rock of state.debris) {
		rock.x -= rock.vx * dt * soundBoost;
		rock.y += Math.sin(time * 1.3 + rock.seed) * motion * 0.48;
	}
	for (const laser of state.lasers) {
		laser.x += laser.vx * dt * soundBoost;
		laser.age += dt;
	}
	for (const spark of state.sparks) spark.age += dt;

	const remainingDebris: TravelDebris[] = [];
	for (const rock of state.debris) {
		let hit = false;
		for (const laser of state.lasers) {
			if (Math.hypot(rock.x - laser.x, rock.y - laser.y) < rock.radius + 3) {
				hit = true;
				laser.age = 99;
				state.sparks.push({
					x: rock.x,
					y: rock.y,
					age: 0,
					seed: Math.random() * Math.PI * 2,
				});
				break;
			}
		}
		if (
			!hit &&
			state.health > 0 &&
			now > state.hitUntil &&
			Math.hypot(rock.x - rocketX, rock.y - state.rocketY) < rock.radius + 12
		) {
			hit = true;
			state.health = Math.max(0, state.health - 25);
			state.hitUntil = now + 240;
			state.sparks.push({
				x: rocketX,
				y: state.rocketY,
				age: 0,
				seed: Math.random() * Math.PI * 2,
			});
			if (state.health <= 0) {
				state.explodingUntil = now + 700;
				state.respawnAt = now + 1300;
			}
		}
		if (!hit && rock.x > -40) remainingDebris.push(rock);
	}
	state.debris = remainingDebris;
	state.lasers = state.lasers.filter(
		(laser) => laser.age < 1.15 && laser.x < width + 24,
	);
	state.sparks = state.sparks.filter((spark) => spark.age < 0.42);

	ctx.fillStyle = withAlpha(palette.backgroundOverlay, 0.62);
	ctx.fillRect(0, 0, width, height);

	// Update star velocity: accelerate with audio, decelerate naturally
	const targetStarVelocity = hasSound
		? activity * 1.65 + motion * 0.55 + peak * 0.25
		: 0;
	const lerpSpeed = hasSound ? 5.4 : 2.8; // Faster ramp-up when sound starts
	state.starVelocity +=
		(targetStarVelocity - state.starVelocity) * Math.min(1, lerpSpeed * dt);
	state.starVelocity = Math.max(0, state.starVelocity);
	state.starScroll += 42 * (1 + state.starVelocity) * dt;

	for (let star = 0; star < 54; star++) {
		const depth = 0.35 + ((star * 0.173) % 0.65);
		const x =
			(width + ((star * 47.3 - state.starScroll * depth) % width)) % width;
		const y = ((star * 71.7) % 1) * height;
		ctx.fillStyle = withAlpha(palette.dim, 0.22 + depth * 0.55);
		ctx.fillRect(x, y, 0.7 + depth * 1.4, 0.7 + depth * 1.4);
	}

	for (const rock of state.debris) {
		const wobble = Math.sin(time * rock.spin + rock.seed);
		ctx.save();
		ctx.translate(rock.x, rock.y);
		ctx.rotate(time * rock.spin + rock.seed);
		ctx.fillStyle = withAlpha(palette.medium, 0.52 + activity * 0.3);
		ctx.beginPath();
		for (let point = 0; point < 8; point++) {
			const angle = (point / 8) * Math.PI * 2;
			const radius = rock.radius * (0.72 + ((point * 0.37 + wobble) % 0.38));
			const x = Math.cos(angle) * radius;
			const y = Math.sin(angle) * radius;
			if (point === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		}
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}

	ctx.shadowColor = palette.glow;
	ctx.shadowBlur = 7;
	ctx.strokeStyle = palette.bright;
	ctx.lineWidth = 2;
	for (const laser of state.lasers) {
		ctx.beginPath();
		ctx.moveTo(laser.x - 16, laser.y);
		ctx.lineTo(laser.x, laser.y);
		ctx.stroke();
	}
	ctx.shadowBlur = 0;

	for (const spark of state.sparks) {
		const alpha = 1 - spark.age / 0.42;
		ctx.fillStyle = withAlpha(palette.highlight, alpha);
		for (let dot = 0; dot < 7; dot++) {
			const angle = spark.seed + dot * 0.9;
			const distance = spark.age * (26 + dot * 4);
			ctx.fillRect(
				spark.x + Math.cos(angle) * distance,
				spark.y + Math.sin(angle) * distance,
				2,
				2,
			);
		}
	}

	if (state.explodingUntil > now) {
		drawExplosion(
			ctx,
			rocketX,
			state.rocketY,
			now,
			state.explodingUntil,
			palette,
		);
	} else if (state.health > 0) {
		drawRocket(
			ctx,
			rocketX,
			state.rocketY,
			activity,
			palette,
			now < state.hitUntil,
			isManual,
		);
	}

	drawHealthLine(ctx, height, state.health, palette);
}
