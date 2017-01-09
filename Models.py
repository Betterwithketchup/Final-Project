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
	def initchar(userid,charname,stats):
		charname=charname
		stats=stats
		#user.gear=gear
		notperson=Character()
		db.session.commit(userid,charname,stats,)
		return "Done"

class Monsters():
	def initmon(userid,charname,stats,gear):
		user=User.query.filter_by(id=userid).first()
		user.charname=charname
		user.stats=stats
		user.gear=gear
		db.session.commit()
		return "Done"
