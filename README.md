# Final	Project
To Be Named Game
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

technologies used:
	Unity?
	engine?
	Websockets
	Server?
	Flask
	Front End
 	HTML, CSS, JS
	ASCII
	API of leaderboards
	what free API's are there?
	What type of data are you looking for
	Database for maps,items,monster types and character data

Tables:
Users:
	Username
	password
	current char name
	char stats(str,dex,per,health,thirst,hunger,score)
	gear(armor,weapon,item,inv)
	location (state?)
Monstersinworld:
	type
	name
	stats
	location
	description
	location

Items:
	stats
	desciption
	location
Maps:
	entire grid and state of grid
	movement map
	User
	Monstersinworld
	Items

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