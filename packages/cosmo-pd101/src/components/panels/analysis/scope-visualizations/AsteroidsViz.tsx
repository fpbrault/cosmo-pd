import { drawScopeGrid, setupScopeCanvas } from "./canvas";
import { withAlpha } from "./palette";
import {
	calculateScopeActivity,
	normalizeWindowedSamples,
	resolveScopeWindow,
} from "./processing";
import type { ScopeThemePalette } from "./types";

type Asteroid = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	radius: number;
	seed: number;
	splitDepth: number;
	tier: "small" | "medium" | "giant";
};

type Bullet = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	age: number;
};

type Spark = {
	x: number;
	y: number;
	age: number;
	seed: number;
};

type AsteroidsState = {
	shipX: number;
	shipY: number;
	shipVx: number;
	shipVy: number;
	shipAngle: number;
	asteroids: Asteroid[];
	bullets: Bullet[];
	sparks: Spark[];
	health: number;
	hitUntil: number;
	explodingUntil: number;
	respawnAt: number;
	lastTime: number;
	lastSpawn: number;
	lastShot: number;
	manualUntil: number;
	lastGiantSpawn: number;
};

const MAX_HEALTH = 100;
const ASTEROIDS_STATE_BY_CANVAS = new WeakMap<
	HTMLCanvasElement,
	AsteroidsState
>();

function createAsteroidsState(width: number, height: number): AsteroidsState {
	return {
		shipX: width / 2,
		shipY: height / 2,
		shipVx: 0,
		shipVy: 0,
		shipAngle: -Math.PI / 2,
		asteroids: [],
		bullets: [],
		sparks: [],
		health: MAX_HEALTH,
		hitUntil: 0,
		explodingUntil: 0,
		respawnAt: 0,
		lastTime: performance.now(),
		lastSpawn: 0,
		lastShot: 0,
		manualUntil: 0,
		lastGiantSpawn: 0,
	};
}

function getAsteroidsState(
	canvas: HTMLCanvasElement,
	width: number,
	height: number,
): AsteroidsState {
	const existing = ASTEROIDS_STATE_BY_CANVAS.get(canvas);
	if (existing) return existing;
	const state = createAsteroidsState(width, height);
	ASTEROIDS_STATE_BY_CANVAS.set(canvas, state);
	return state;
}

function angleDelta(from: number, to: number): number {
	return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

function wrapShip(state: AsteroidsState, width: number, height: number) {
	if (state.shipX < -14) state.shipX = width + 14;
	if (state.shipX > width + 14) state.shipX = -14;
	if (state.shipY < -14) state.shipY = height + 14;
	if (state.shipY > height + 14) state.shipY = -14;
}

function getFrequencySpawnProfile(hz: number) {
	const clampedHz = Math.max(
		30,
		Math.min(3600, Number.isFinite(hz) ? hz : 220),
	);
	const hzNorm = Math.log10(clampedHz / 30) / Math.log10(3600 / 30);
	const lowWeight = 1 - hzNorm;
	const highWeight = hzNorm;
	const radiusBias = 1.28 - highWeight * 0.46;
	const mediumChance = 0.44 * lowWeight + 0.08 * highWeight;
	const giantBand = Math.max(0, 1 - hzNorm / 0.38);
	const giantChance = 0.58 * giantBand;
	const burstChance = 0.06 * lowWeight + 0.62 * highWeight;
	const maxAsteroids = Math.round(9 + highWeight * 8);
	return {
		hzNorm,
		radiusBias,
		mediumChance,
		giantChance,
		burstChance,
		maxAsteroids,
	};
}

function spawnAsteroid(
	state: AsteroidsState,
	width: number,
	height: number,
	activity: number,
	hz: number,
	preferredTier?: Asteroid["tier"],
) {
	const edge = Math.floor(Math.random() * 4);
	const x = edge === 0 ? -20 : edge === 1 ? width + 20 : Math.random() * width;
	const y =
		edge === 2 ? -20 : edge === 3 ? height + 20 : Math.random() * height;
	const targetX = width * (0.42 + Math.random() * 0.16);
	const targetY = height * (0.42 + Math.random() * 0.16);
	const angle = Math.atan2(targetY - y, targetX - x);
	const spawnProfile = getFrequencySpawnProfile(hz);
	const asteroidTier: Asteroid["tier"] = (() => {
		if (preferredTier) return preferredTier;
		const roll = Math.random();
		const giantChance = Math.min(0.8, spawnProfile.giantChance);
		const mediumChance = Math.min(
			0.9,
			Math.max(0, Math.min(1 - giantChance, spawnProfile.mediumChance)),
		);
		if (roll < giantChance) return "giant";
		if (roll < giantChance + mediumChance) return "medium";
		return "small";
	})();
	const baseSpeed = 18 + activity * 64 + Math.random() * 4;
	const speedScale =
		asteroidTier === "giant" ? 0.76 : asteroidTier === "medium" ? 0.9 : 1;
	const speed = baseSpeed * speedScale;
	const radius =
		asteroidTier === "giant"
			? (24 + Math.random() * 10 + activity * 7) *
				(spawnProfile.radiusBias * 1.06)
			: asteroidTier === "medium"
				? (14 + Math.random() * 9 + activity * 5) * spawnProfile.radiusBias
				: (5 + Math.random() * 9 + activity * 7) *
					(spawnProfile.radiusBias * 0.92);
	state.asteroids.push({
		x,
		y,
		vx: Math.cos(angle) * speed,
		vy: Math.sin(angle) * speed,
		radius,
		seed: Math.random() * Math.PI * 2,
		splitDepth:
			asteroidTier === "giant" ? 2 : asteroidTier === "medium" ? 1 : 0,
		tier: asteroidTier,
	});
}

function spawnSplitAsteroids(
	state: AsteroidsState,
	asteroid: Asteroid,
	count: number,
) {
	if (asteroid.splitDepth <= 0 || asteroid.radius < 12) return;
	const childTier: Asteroid["tier"] =
		asteroid.tier === "giant" ? "medium" : "small";
	for (let i = 0; i < count; i++) {
		const angle = Math.random() * Math.PI * 2;
		const speed =
			Math.hypot(asteroid.vx, asteroid.vy) * (0.95 + Math.random() * 0.45);
		const childRadius =
			childTier === "medium"
				? Math.max(12.5, asteroid.radius * (0.5 + Math.random() * 0.08))
				: Math.max(5.5, asteroid.radius * (0.42 + Math.random() * 0.12));
		state.asteroids.push({
			x: asteroid.x + Math.cos(angle) * 2,
			y: asteroid.y + Math.sin(angle) * 2,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			radius: childRadius,
			seed: Math.random() * Math.PI * 2,
			splitDepth: asteroid.splitDepth - 1,
			tier: childTier,
		});
	}
}

function fireBullet(state: AsteroidsState, now: number, activity: number) {
	if (now - state.lastShot < Math.max(95, 230 - activity * 100)) return;
	state.lastShot = now;
	const speed = 170 + activity * 90;
	state.bullets.push({
		x: state.shipX + Math.cos(state.shipAngle) * 13,
		y: state.shipY + Math.sin(state.shipAngle) * 13,
		vx: Math.cos(state.shipAngle) * speed + state.shipVx * 0.5,
		vy: Math.sin(state.shipAngle) * speed + state.shipVy * 0.5,
		age: 0,
	});
}

function hasManualInput(pressedKeys: ReadonlySet<string>): boolean {
	return (
		pressedKeys.has("ArrowLeft") ||
		pressedKeys.has("ArrowRight") ||
		pressedKeys.has("ArrowUp") ||
		pressedKeys.has("ArrowDown") ||
		pressedKeys.has("Space")
	);
}

function drawHealthLine(
	ctx: CanvasRenderingContext2D,
	height: number,
	health: number,
	palette: ScopeThemePalette,
) {
	ctx.fillStyle = withAlpha(palette.accentSecondary, 0.45);
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
	for (let ray = 0; ray < 14; ray++) {
		const angle = (ray / 14) * Math.PI * 2;
		const inner = 3 + progress * 9;
		const outer = 12 + progress * 34;
		ctx.beginPath();
		ctx.moveTo(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner);
		ctx.lineTo(x + Math.cos(angle) * outer, y + Math.sin(angle) * outer);
		ctx.stroke();
	}
}

export function drawAsteroidsScope(
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
	const state = getAsteroidsState(canvas, width, height);
	const now = performance.now();
	const dt = Math.min(0.05, Math.max(0.001, (now - state.lastTime) / 1000));
	state.lastTime = now;
	const hasSound = activity > 0.08 || peak > 0.12;
	const manual = hasManualInput(pressedKeys);

	if (now >= state.respawnAt && state.health <= 0) {
		state.health = MAX_HEALTH;
		state.shipX = width / 2;
		state.shipY = height / 2;
		state.shipVx = 0;
		state.shipVy = 0;
		state.shipAngle = -Math.PI / 2;
		state.hitUntil = 0;
		state.explodingUntil = 0;
	}

	if (manual) state.manualUntil = now + 1400;
	const spawnDrivenByInput = manual || now < state.manualUntil;
	const spawnActivity = Math.min(
		1,
		(hasSound ? activity : 0.22) * intensityMultiplier,
	);
	const spawnPeak = Math.min(1, (hasSound ? peak : 0.12) * intensityMultiplier);
	const spawnProfile = getFrequencySpawnProfile(hz);
	const spawnInterval = spawnDrivenByInput
		? Math.max(190, 760 - spawnActivity * 240 - spawnPeak * 100)
		: Math.max(120, 620 - spawnActivity * 360 - spawnPeak * 150);
	const spawnPressure = Math.max(
		0,
		(state.asteroids.length - spawnProfile.maxAsteroids * 0.72) /
			Math.max(1, spawnProfile.maxAsteroids),
	);
	if (
		(hasSound || spawnDrivenByInput) &&
		now - state.lastSpawn > spawnInterval * (1 + spawnPressure * 0.8)
	) {
		state.lastSpawn = now;
		const availableSlots = Math.max(
			0,
			spawnProfile.maxAsteroids - state.asteroids.length,
		);
		if (availableSlots > 0) {
			let spawnCount = 1;
			if (
				Math.random() <
					spawnProfile.burstChance * (0.35 + spawnActivity * 0.9) &&
				availableSlots > 1
			) {
				spawnCount += 1;
			}
			if (
				intensityMultiplier > 1.1 &&
				motion > 0.42 &&
				spawnProfile.hzNorm > 0.62 &&
				availableSlots > spawnCount
			) {
				spawnCount += 1;
			}
			spawnCount = Math.min(spawnCount, availableSlots, 3);
			const lowFreqGiantWeight = Math.max(
				0,
				Math.min(1, (0.28 - spawnProfile.hzNorm) / 0.28),
			);
			const giantOnScreen = state.asteroids.some(
				(asteroid) => asteroid.tier === "giant",
			);
			const shouldForceGiant =
				spawnCount > 0 &&
				lowFreqGiantWeight > 0 &&
				now - state.lastGiantSpawn > 1100 &&
				(!giantOnScreen || Math.random() < 0.3 + lowFreqGiantWeight * 0.55);
			if (shouldForceGiant) {
				spawnAsteroid(state, width, height, spawnActivity, hz, "giant");
				state.lastGiantSpawn = now;
				spawnCount -= 1;
			}
			for (let i = 0; i < spawnCount; i++) {
				spawnAsteroid(state, width, height, spawnActivity, hz);
			}
		}
	}

	if (state.health > 0) {
		if (manual || now < state.manualUntil) {
			if (pressedKeys.has("ArrowLeft")) state.shipAngle -= dt * 5.4;
			if (pressedKeys.has("ArrowRight")) state.shipAngle += dt * 5.4;
			if (pressedKeys.has("ArrowUp")) {
				state.shipVx += Math.cos(state.shipAngle) * dt * 92;
				state.shipVy += Math.sin(state.shipAngle) * dt * 92;
			}
			if (pressedKeys.has("ArrowDown")) {
				state.shipVx *= 1 - dt * 2.8;
				state.shipVy *= 1 - dt * 2.8;
			}
			if (pressedKeys.has("Space")) fireBullet(state, now, activity);
		} else {
			let nearest: Asteroid | null = null;
			let nearestDistance = Infinity;
			for (const asteroid of state.asteroids) {
				const distance = Math.hypot(
					asteroid.x - state.shipX,
					asteroid.y - state.shipY,
				);
				if (distance < nearestDistance) {
					nearest = asteroid;
					nearestDistance = distance;
				}
			}
			if (nearest) {
				const targetAngle = Math.atan2(
					nearest.y - state.shipY,
					nearest.x - state.shipX,
				);
				state.shipAngle +=
					angleDelta(state.shipAngle, targetAngle) * Math.min(1, dt * 5.8);
				if (Math.abs(angleDelta(state.shipAngle, targetAngle)) < 0.22) {
					fireBullet(state, now, activity);
				}
			}
			state.shipVx += (width / 2 - state.shipX) * dt * 0.16;
			state.shipVy += (height / 2 - state.shipY) * dt * 0.16;
		}
	}

	state.shipX += state.shipVx * dt;
	state.shipY += state.shipVy * dt;
	state.shipVx *= 1 - dt * 0.46;
	state.shipVy *= 1 - dt * 0.46;
	wrapShip(state, width, height);

	for (const asteroid of state.asteroids) {
		asteroid.x += asteroid.vx * dt;
		asteroid.y += asteroid.vy * dt;
	}
	for (const bullet of state.bullets) {
		bullet.x += bullet.vx * dt;
		bullet.y += bullet.vy * dt;
		bullet.age += dt;
	}
	for (const spark of state.sparks) spark.age += dt;

	const remainingAsteroids: Asteroid[] = [];
	let explodeAllAsteroids = false;
	for (const asteroid of state.asteroids) {
		let hit = false;
		for (const bullet of state.bullets) {
			if (
				Math.hypot(asteroid.x - bullet.x, asteroid.y - bullet.y) <
				asteroid.radius + 2
			) {
				hit = true;
				bullet.age = 99;
				state.sparks.push({
					x: asteroid.x,
					y: asteroid.y,
					age: 0,
					seed: Math.random() * Math.PI * 2,
				});
				spawnSplitAsteroids(state, asteroid, 2 + (Math.random() < 0.5 ? 1 : 0));
				break;
			}
		}
		if (
			!hit &&
			state.health > 0 &&
			now > state.hitUntil &&
			Math.hypot(asteroid.x - state.shipX, asteroid.y - state.shipY) <
				asteroid.radius + 10
		) {
			hit = true;
			state.health = Math.max(0, state.health - 25);
			state.hitUntil = now + 240;
			state.sparks.push({
				x: state.shipX,
				y: state.shipY,
				age: 0,
				seed: Math.random() * Math.PI * 2,
			});
			if (state.health <= 0) {
				state.explodingUntil = now + 700;
				state.respawnAt = now + 1300;
				state.shipVx = 0;
				state.shipVy = 0;
				for (const rock of state.asteroids) {
					state.sparks.push({
						x: rock.x,
						y: rock.y,
						age: 0,
						seed: Math.random() * Math.PI * 2,
					});
				}
				explodeAllAsteroids = true;
			}
		}
		if (
			!hit &&
			asteroid.x > -60 &&
			asteroid.x < width + 60 &&
			asteroid.y > -60 &&
			asteroid.y < height + 60
		) {
			remainingAsteroids.push(asteroid);
		}
	}
	state.asteroids = explodeAllAsteroids ? [] : remainingAsteroids;
	state.bullets = state.bullets.filter(
		(bullet) =>
			bullet.age < 1.2 &&
			bullet.x > -8 &&
			bullet.x < width + 8 &&
			bullet.y > -8 &&
			bullet.y < height + 8,
	);
	state.sparks = state.sparks.filter((spark) => spark.age < 0.42);

	ctx.fillStyle = withAlpha(palette.backgroundOverlay, 0.64);
	ctx.fillRect(0, 0, width, height);
	for (let star = 0; star < 42; star++) {
		const twinkle = 0.45 + Math.sin(now * 0.002 + star) * 0.25 + energy * 0.3;
		ctx.fillStyle = withAlpha(palette.dim, twinkle);
		ctx.fillRect(
			((star * 53.1) % 1) * width,
			((star * 29.7) % 1) * height,
			1.4,
			1.4,
		);
	}

	ctx.strokeStyle = palette.accentSoft;
	ctx.lineWidth = 1.5;
	for (const asteroid of state.asteroids) {
		ctx.save();
		ctx.translate(asteroid.x, asteroid.y);
		ctx.rotate(now * 0.0008 + asteroid.seed);
		ctx.beginPath();
		for (let point = 0; point < 9; point++) {
			const angle = (point / 9) * Math.PI * 2;
			const radius =
				asteroid.radius * (0.75 + ((point * 0.21 + asteroid.seed) % 0.34));
			const x = Math.cos(angle) * radius;
			const y = Math.sin(angle) * radius;
			if (point === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		}
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
	}

	ctx.shadowColor = palette.glow;
	ctx.shadowBlur = 8;
	ctx.strokeStyle = palette.bright;
	ctx.lineWidth = 2;
	for (const bullet of state.bullets) {
		ctx.beginPath();
		ctx.moveTo(bullet.x, bullet.y);
		ctx.lineTo(bullet.x - bullet.vx * 0.035, bullet.y - bullet.vy * 0.035);
		ctx.stroke();
	}
	ctx.shadowBlur = 0;

	for (const spark of state.sparks) {
		const alpha = 1 - spark.age / 0.42;
		ctx.fillStyle = withAlpha(palette.highlight, alpha);
		for (let dot = 0; dot < 7; dot++) {
			const angle = spark.seed + dot * 0.9;
			const distance = spark.age * (28 + dot * 4);
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
			state.shipX,
			state.shipY,
			now,
			state.explodingUntil,
			palette,
		);
	} else if (state.health > 0) {
		ctx.save();
		ctx.translate(state.shipX, state.shipY);
		ctx.rotate(state.shipAngle);
		ctx.globalAlpha = now < state.hitUntil ? 0.42 : 1;
		ctx.shadowColor = palette.glow;
		ctx.shadowBlur = 10;
		ctx.fillStyle = now < state.hitUntil ? palette.alert : palette.light;
		ctx.beginPath();
		ctx.moveTo(14, 0);
		ctx.lineTo(-10, -8);
		ctx.lineTo(-6, 0);
		ctx.lineTo(-10, 8);
		ctx.closePath();
		ctx.fill();
		if (pressedKeys.has("ArrowUp")) {
			ctx.fillStyle = palette.warm;
			for (let flame = 0; flame < 4; flame++) {
				ctx.beginPath();
				ctx.arc(-14 - flame * 3, 0, 2.5 + flame * 0.25, 0, Math.PI * 2);
				ctx.fill();
			}
		}
		ctx.shadowBlur = 0;
		ctx.restore();
	}

	drawHealthLine(ctx, height, state.health, palette);
}
