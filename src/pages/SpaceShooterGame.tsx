import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Trophy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface GameObject {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface Enemy extends GameObject {
	id: number;
}

interface Bullet extends GameObject {
	id: number;
}

const SpaceShooterGame = () => {
	const navigate = useNavigate();
	const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">(
		"menu"
	);
	const [score, setScore] = useState(0);
	const [highScore, setHighScore] = useState(0);
	const [player, setPlayer] = useState<GameObject>({
		x: 375,
		y: 520,
		width: 50,
		height: 50,
	});
	const [bullets, setBullets] = useState<Bullet[]>([]);
	const [enemies, setEnemies] = useState<Enemy[]>([]);
	const [keys, setKeys] = useState<Set<string>>(new Set());

	const gameWidth = 800;
	const gameHeight = 600;

	useEffect(() => {
		const savedHighScore = localStorage.getItem("spaceShooterHighScore");
		if (savedHighScore) {
			setHighScore(parseInt(savedHighScore));
		}
	}, []);

	useEffect(() => {
		if (score > highScore) {
			setHighScore(score);
			localStorage.setItem("spaceShooterHighScore", score.toString());
		}
	}, [score, highScore]);

	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		setKeys((prev) => new Set(prev).add(e.key));
	}, []);

	const handleKeyUp = useCallback((e: KeyboardEvent) => {
		setKeys((prev) => {
			const newKeys = new Set(prev);
			newKeys.delete(e.key);
			return newKeys;
		});
	}, []);

	useEffect(() => {
		if (gameState === "playing") {
			window.addEventListener("keydown", handleKeyDown);
			window.addEventListener("keyup", handleKeyUp);

			return () => {
				window.removeEventListener("keydown", handleKeyDown);
				window.removeEventListener("keyup", handleKeyUp);
			};
		}
	}, [gameState, handleKeyDown, handleKeyUp]);

	const startGame = () => {
		setGameState("playing");
		setScore(0);
		setPlayer({ x: 375, y: 520, width: 50, height: 50 });
		setBullets([]);
		setEnemies([]);
	};

	const gameOver = () => {
		setGameState("gameOver");
		// Update leaderboard
		const currentLeaderboard = JSON.parse(
			localStorage.getItem("gameLeaderboard") || "[]"
		);
		const newEntry = { name: "Player", score, rank: 0 };
		const updatedLeaderboard = [...currentLeaderboard, newEntry]
			.sort((a, b) => b.score - a.score)
			.slice(0, 10)
			.map((entry, index) => ({ ...entry, rank: index + 1 }));
		localStorage.setItem("gameLeaderboard", JSON.stringify(updatedLeaderboard));
	};

	useEffect(() => {
		if (gameState !== "playing") return;

		const gameLoop = setInterval(() => {
			// Move player
			setPlayer((prev) => {
				let newX = prev.x;
				if (keys.has("ArrowLeft") && newX > 0) newX -= 5;
				if (keys.has("ArrowRight") && newX < gameWidth - prev.width) newX += 5;
				return { ...prev, x: newX };
			});

			// Shoot bullets
			if (keys.has(" ")) {
				setBullets((prev) => {
					const lastBullet = prev[prev.length - 1];
					if (!lastBullet || Date.now() - parseInt(lastBullet.id.toString()) > 200) {
						return [
							...prev,
							{
								id: Date.now(),
								x: player.x + player.width / 2 - 2,
								y: player.y,
								width: 4,
								height: 10,
							},
						];
					}
					return prev;
				});
			}

			// Move bullets
			setBullets((prev) =>
				prev
					.map((bullet) => ({ ...bullet, y: bullet.y - 8 }))
					.filter((bullet) => bullet.y > -10)
			);

			// Spawn enemies
			setEnemies((prev) => {
				if (Math.random() < 0.02) {
					return [
						...prev,
						{
							id: Date.now(),
							x: Math.random() * (gameWidth - 40),
							y: -40,
							width: 40,
							height: 40,
						},
					];
				}
				return prev;
			});

			// Move enemies
			setEnemies((prev) =>
				prev
					.map((enemy) => ({ ...enemy, y: enemy.y + 2 }))
					.filter((enemy) => {
						if (enemy.y > gameHeight) {
							gameOver();
							return false;
						}
						return true;
					})
			);

			// Check collisions
			setBullets((prevBullets) => {
				setEnemies((prevEnemies) => {
					const remainingEnemies = [...prevEnemies];
					const remainingBullets = [...prevBullets];

					prevBullets.forEach((bullet, bulletIndex) => {
						prevEnemies.forEach((enemy, enemyIndex) => {
							if (
								bullet.x < enemy.x + enemy.width &&
								bullet.x + bullet.width > enemy.x &&
								bullet.y < enemy.y + enemy.height &&
								bullet.y + bullet.height > enemy.y
							) {
								remainingEnemies.splice(enemyIndex, 1);
								remainingBullets.splice(bulletIndex, 1);
								setScore((prev) => prev + 10);
							}
						});
					});

					return remainingEnemies;
				});

				return prevBullets.filter(
					(_, index) =>
						!prevBullets.some(
							(bullet, bulletIndex) =>
								bulletIndex !== index &&
								enemies.some(
									(enemy) =>
										bullet.x < enemy.x + enemy.width &&
										bullet.x + bullet.width > enemy.x &&
										bullet.y < enemy.y + enemy.height &&
										bullet.y + bullet.height > enemy.y
								)
						)
				);
			});
		}, 16);

		return () => clearInterval(gameLoop);
	}, [gameState, keys, player.x, enemies]);

	const renderGame = () => (
		<div
			className='relative mx-auto bg-black'
			style={{ width: gameWidth, height: gameHeight }}>

			{/* Background */}
			<div className='absolute inset-0 bg-gradient-to-b from-purple-900 to-black'></div>
=======
			{/* Stars background */}
			<div className='absolute inset-0 bg-gradient-to-b from-purple-900 to-black'>
				{Array.from({ length: 50 }).map((_, i) => (
					<div
						key={i}
						className='absolute w-1 h-1 bg-white rounded-full animate-pulse'
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 2}s`,
						}}
					/>
				))}
			</div>


			{/* Player */}
			<div
				className='absolute bg-blue-500 rounded-t-full'
				style={{
					left: player.x,
					top: player.y,
					width: player.width,
					height: player.height,
				}}
			/>

			{/* Bullets */}
			{bullets.map((bullet) => (
				<div
					key={bullet.id}
					className='absolute bg-yellow-400 rounded-full'
					style={{
						left: bullet.x,
						top: bullet.y,
						width: bullet.width,
						height: bullet.height,
					}}
				/>
			))}

			{/* Enemies */}
			{enemies.map((enemy) => (
				<div
					key={enemy.id}
					className='absolute bg-red-500 rounded'
					style={{
						left: enemy.x,
						top: enemy.y,
						width: enemy.width,
						height: enemy.height,
					}}
				/>
			))}

			{/* Score */}
			<div className='absolute top-4 left-4 text-white font-bold text-xl'>
				Score: {score}
			</div>

			{/* High Score */}
			<div className='absolute top-4 right-4 text-white font-bold text-xl'>
				High Score: {highScore}
			</div>
		</div>
	);

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4'>
			<div className='container mx-auto'>
				{/* Header */}
				<div className='flex items-center justify-between mb-8'>
					<Button
						variant='ghost'
						onClick={() => navigate("/")}
						className='text-white hover:bg-white/10'>
						<ArrowLeft className='w-4 h-4 mr-2' />
						Back to Tracker
					</Button>
					<h1 className='text-3xl font-bold text-white'>Space Shooter</h1>
					<div></div>
				</div>

				{gameState === "menu" && (
					<div className='flex flex-col items-center justify-center min-h-[400px] space-y-8'>
						<Card className='bg-white/10 backdrop-blur-md border-white/20 text-white'>
							<CardHeader>
								<CardTitle className='text-center text-2xl text-white'>
									Space Shooter Game
								</CardTitle>
							</CardHeader>
							<CardContent className='text-center space-y-4'>
								<p>Use arrow keys to move, spacebar to shoot!</p>
								<p>Destroy enemies to earn points. Don't let them reach the bottom!</p>
								<div className='text-lg font-bold'>High Score: {highScore}</div>
								<Button
									onClick={startGame}
									className='w-full bg-purple-600 hover:bg-purple-700'>
									Start Game
								</Button>
							</CardContent>
						</Card>
					</div>
				)}

				{gameState === "playing" && (
					<div className='flex flex-col items-center space-y-4'>
						{renderGame()}
						<div className='text-white text-center'>
							<p>Use ← → arrow keys to move, SPACEBAR to shoot</p>
						</div>
					</div>
				)}

				{gameState === "gameOver" && (
					<div className='flex flex-col items-center justify-center min-h-[400px] space-y-8'>
						<Card className='bg-white/10 backdrop-blur-md border-white/20 text-white'>
							<CardHeader>
								<CardTitle className='text-center text-2xl flex items-center justify-center space-x-2'>
									<Trophy className='w-6 h-6 text-yellow-400' />
									<span>Game Over!</span>
								</CardTitle>
							</CardHeader>
							<CardContent className='text-center space-y-4'>
								<div className='text-3xl font-bold text-yellow-400'>
									Final Score: {score}
								</div>
								<div className='text-lg'>High Score: {highScore}</div>
								<div className='flex space-x-4'>
									<Button
										onClick={startGame}
										className='bg-purple-600 hover:bg-purple-700'>
										<RotateCcw className='w-4 h-4 mr-2' />
										Play Again
									</Button>
									<Button
										variant='outline'
										onClick={() => navigate("/")}
										className='border-white/20 text-white hover:bg-white/10'>
										Back to Tracker
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
};

export default SpaceShooterGame;
