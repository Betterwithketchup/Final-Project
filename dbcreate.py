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
	charname = db.Column(db.String)
	stats = db.Column(db.LargeBinary)
	gear = db.Column(db.LargeBinary)

	def __init__(self, username, password, charname, stats,gear):
		self.username = username
		self.password = password
		self.charname = charname
		self.stats = stats
		self.gear = gear

class Monster(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String)
	description = db.Column(db.String)
	mtype = db.Column(db.String)
	stats = db.Column(db.LargeBinary)
	gear = db.Column(db.LargeBinary)

	def __init__(self,name, stats,gear):
		self.name = name
		self.stats = stats
		self.gear = gear

class Item(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String)
	description = db.Column(db.String)
	stats = db.Column(db.LargeBinary)

	def __init__(self,name, stats, description):
		self.name = name
		self.stats = stats
		self.description = description
		
class Map(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	terrain = db.Column(db.LargeBinary)
	movement = db.Column(db.LargeBinary)

	def __init__(self, terrain, movement):
		self.terrain = terrain
		self.movement = movement
		

		
if __name__ == "__main__":
	db.drop_all()
	db.create_all()
	User1 = User("A","321","B")
	db.session.add(User1)
	db.session.commit()