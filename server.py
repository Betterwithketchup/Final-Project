from flask import Flask, request, render_template, jsonify, session, redirect,url_for,Response
from Models import *
import os
app = Flask(__name__)


@app.route('/',methods=['GET'])
def nothere():
	return redirect(url_for('login'))

#login method
@app.route('/login', methods=['GET','POST'])
def login():
	if session.get('logged_in')==True:
		print(session.get('logged_in'))
		return redirect(url_for('main'))
	else:
		print(session.get('logged_in'))
		return render_template('login.html',title="Login?",)

#logout method
@app.route('/weout', methods=['POST'])
def out():
	session['id']=None
	session.pop('logged_in',False)
	print("logged?:"+str(session.get('logged_in')))
	return redirect(url_for('login'))

#check against database and load
@app.route('/data', methods=['POST'])
def data():
	name=request.form['username']
	password=request.form['password']
	user=User.query.filter_by(username=name).first()
	if islegit(name,password)=="True":
		print(user.username)
		session['id']=user.id
		session['logged_in']=True
		session['user']=user.username
		session.modified = True
		USERNAME=user.id
		print(USERNAME)
		return redirect(url_for('main'))
	else:
		session['logged_in']=False
		return redirect(url_for('login'))

def islegit(Name,wordpass):
	user = User.query.filter_by(username=Name).first()
	#print(user.username)
	if user != None:
		if bcrypt.check_password_hash(user.password, wordpass)==True:
			return "True"
		else:
			return "False"
	else:
		return "False"

@app.route('/new', methods=['POST'])
def addin():
	newuser=request.form['username']
	newpass=request.form['password']
	Users.inituser(newuser,newpass)
	return "Done"#redirect(url_for('login'))

@app.route('/newchar', methods=['POST'])
def addinchar():
	charname=request.form['charname']
	stats=request.form['stats']
	Characters.initchar(charname,stats)
	return "Done"


@app.route('/main', methods=['GET'])
def main():
	print(session.get('logged_in'))
	if session.get('logged_in')==True:
		print("session:"+str(session.get('user')))
		return render_template('mainpage.html',)
	else:
		return redirect(url_for('login'))

@app.route('/load', methods=['GET','POST'])
def load():
	if session.get('logged_in')==True:
		#print("THISTHING")
		# thinger=request.form['name']
		# print(thinger)
		#print("this is a name: "+str(session.get('user')))
		#print(USERNAME)
		user=User.query.filter_by(username=str(session.get('user'))).first()
		thingy = [user.id,user.username,user.stats]
		# else:
		# 	return "na"
		#session['id']
		#session.pop('logged_in',False)
		#print("logged?:"+str(session.get('user')))
		response = jsonify(thingy)
		response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
		response.headers['Access-Control-Allow-Credentials'] = 'true'	
		return response
	response = Response("nah")
	response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
	response.headers['Access-Control-Allow-Credentials'] = 'true'	
	return response

if __name__ == "__main__":
	app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'#os.urandom(20)
	app.run('127.0.0.1',3000,debug=True)
