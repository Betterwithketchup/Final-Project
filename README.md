# Final	Project
Radioactive Cavelier
todo:
	server integration

Genre:
	survival/rpg
	setting: future/past?

Features:
	character creation
	grid based coordinates
	scoring system
	random generation,terrain,buildings?,monsters
	food, and water
	saving
	open world
	magic?


other:
	dungeons
	*knight/day

technologies used:
	ROT.js engine
	Flask Server
	Front End: HTML, CSS, JS
	ASCII
	API of leaderboards
	what free API's are there?
	What type of data are you looking for
	Database for maps,items,monster types and character data

Tables:
Users and Monsters inherit from the same class
	Users:0
		Username
		password
		CHAR NAME
		STR =damage  (STR)+weapon xdy
		CON = HP (mod)+100
		DEX = Dodge 1d20+DEX vs opposing
		HP base 20
		NEEDS food,water
		SCORE
		gear(weapon,item)
	Monsters:
		name
		STATS
		location
		description
	Items:
		stats
		description
	Maps:
		entire grid and state of grid
Endpoints and (3 templates):
	Login page
	main game page
	leaderboard
	-/load/<character>
	-/save/<character>
	-/scores

Progression:
	User registers
	main menu(new game,load or leaderboard)
	create new game
	character gen
	generate world terrain
	populate with items 
	populate with monsters
	spawn player
	main game loop
	win/lose/save
	close game and save data
	update scoreboard if needed
	display main menu
	logout
	back to login page

Char Gen:
	Str: Base+Weapon-Armor=Damage
	Dex: Base+Weapon-Armor=To-Hit
	Per: Sight radius?
	Con: HP
	Start Equipment: TBD

Monster Gen:
	All the stats of PCs
	Scaling: Time, distance or Level?
