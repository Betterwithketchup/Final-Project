# Final	Project
Radioactive Cavelier
todo:
	database reset

Genre:
	survival/rpg
	setting: future/past?

Features:
	character creation
	grid based coordinates
	scoring system
	random generation,terrain,buildings?,monsters
	health,food, and water
	saving
	open world
	crafting
	magic?


other:
	dungeons
	weather?
	fire?
	knight/day

technologies used:
	engine?
	Websockets?
	Flask Server
	Front End: HTML, CSS, JS
	ASCII
	API of leaderboards
	what free API's are there?
	What type of data are you looking for
	Database for maps,items,monster types and character data

Tables:
Users and Monsters inherit from the same class
	Users:
		Username
		password
		CHAR NAME
		STR =damage  (mod)+10+weapon
		CON = HP (mod)+100
		DEX = Dodge
		HP
		NEEDS
		SCORE
		gear(armor,weapon,item,inv)=foreign key  in items
	Monsters:
		type
		name
		STATS
		location
		description
	Items:
		stats
		description
	Maps:
		entire grid and state of grid
		movement map
		User=User.id, location
		Monsters=Monsters.id, location
		Items=items.id, and location

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
