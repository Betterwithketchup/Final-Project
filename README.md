# Final	Project
Radioactive Cavelier
todo:
	ERDs
	user stories

Language:
	javasript
	python


platform:
	browser

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
	multiplayer?
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
		STR
		CON
		DEX
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
		location
	Items:
		stats
		desciption
	Maps:
		entire grid and state of grid
		movement map
		User=foreign key, and location
		Monsters=foreign key and location
		Items=foreign key, and location

Endpoints (3 templates):
	Login page
	main game page
	leaderboard

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
	Con: 
	Start Equipment: TBD

Monster Gen:
	All the stats of PCs
	Scaling: Time, distance or Level?
