from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from dbcreate import *
import datetime
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nuclear.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
class Users():
	def inituser(name,Password):
		print(name,Password)
		if name==User.query.filter_by(username=name).first():
			return None
		name = name
		password =bcrypt.generate_password_hash(Password)
		person = User(name,password)
		db.session.add(person)
		db.session.commit()
		return "Done"

class Characters():
	def initchar(user,charname,stats,gear):
		db.session.expunge_all()
		userid=user
		charname=charname
		stats=stats
		gear=gear
		char1 = Character(userid,charname,stats,gear)
		db.session.add(char1)
		db.session.commit()
		return "Done"

	def save(user, stats, gear, loc, charmap, monsters, items):
		char = Character.query.filter_by(userid=user).first()
		char.stats = stats
		char.gear = gear
		char.loc = loc
		char.map = charmap
		char.monsters = monsters
		char.items = items
		db.session.commit()
		return "Done"

# class Monsters():
# 	def initmon(userid,charname,stats,gear):
# 		user=User.query.filter_by(id=userid).first()
# 		user.charname=charname
# 		user.stats=stats
# 		user.gear=gear
# 		db.session.commit()
# 		return "Done"
