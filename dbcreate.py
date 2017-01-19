from flask import Flask
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nuclear.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	username = db.Column(db.String)
	password = db.Column(db.String)

	def __init__(self, username, password):
		self.username = username
		self.password = password

class Character(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	loc = db.Column(db.PickleType())
	charname = db.Column(db.String)
	stats = db.Column(db.PickleType())
	gear = db.Column(db.PickleType())
	userid = db.Column(db.Integer, db.ForeignKey('user.id'))
	charmap = db.Column(db.PickleType())
	monsters = db.Column(db.PickleType())
	items = db.Column(db.PickleType())

	def __init__(self, charname, stats,gear):
		self.username = username
		self.charname = charname
		self.stats = stats
		self.gear = gear

# class Monster(db.Model):
# 	id = db.Column(db.Integer, primary_key = True)
# 	name = db.Column(db.String)
# 	description = db.Column(db.String)
# 	stats = db.Column(db.PickleType())
# 	gear = db.Column(db.PickleType())
# 	mapid = db.Column(db.Integer, db.ForeignKey('map.id'))

# 	def __init__(self,name, stats,gear):
# 		self.name = name
# 		self.stats = stats
# 		self.gear = gear

# class Item(db.Model):
# 	id = db.Column(db.Integer, primary_key = True)
# 	description = db.Column(db.String)
# 	stats = db.Column(db.LargeBinary)


# 	def __init__(self,name, stats, description):
# 		self.stats = stats
# 		self.description = description	
		
# # class Map(db.Model):
# 	id = db.Column(db.Integer, primary_key = True)
# 	userid = db.Column(db.Integer, db.ForeignKey('character.id'))
# 	terrain = db.Column(db.LargeBinary)
# 	movement = db.Column(db.LargeBinary)

# 	def __init__(self, terrain, movement):
# 		self.terrain = terrain
# 		self.movement = movement
		

		
if __name__ == "__main__":
	db.drop_all()
	db.create_all()
	User1 = User("A","$2b$12$2FuNpiQtd4ChkJlHhI9GU.K87giuywJ3VGMGPXgZlwS30R3sl2fwC")
	db.session.add(User1)
	db.session.commit()