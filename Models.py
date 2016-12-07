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
	thisthing=False
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

	