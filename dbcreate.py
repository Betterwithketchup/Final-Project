from flask import Flask
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nuclear.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Comment(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	username = db.Column(db.String)
	# startdate = db.Column(db.Integer)
	# userid = db.Column(db.Integer, db.ForeignKey('user.id'))
	# postid = db.Column(db.Integer, db.ForeignKey('post.id'))

	# def __init__(self, username, postid, userid,startdate):
	# 	self.username = username
	# 	self.postid = postid
	# 	self.userid = userid
	# 	self.startdate = startdate
		
if __name__ == "__main__":
	db.drop_all()
	db.create_all()
	agent1 = User('User1','Agent')
	db.session.add(agent1)
	db.session.commit()