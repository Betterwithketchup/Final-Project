from flask import Flask, request, render_template, jsonify, session, redirect,url_for,Response
from Models import *
from flask_cors import CORS
import os
app = Flask(__name__)

cors = CORS(app)
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
	if islegit(name,password)==True:
		print(user.id)
		session['id']=user.id
		session.modified = True
		session['logged_in']=True
		session.modified = True
		session['user']=user.username
		session.modified = True
		return redirect(url_for('main'))
	else:
		session['logged_in']=False
		session.modified = True
		return redirect(url_for('login'))

def islegit(Name,wordpass):
	user = User.query.filter_by(username=Name).first()
	#print(user.username)
	if user != None:
		if bcrypt.check_password_hash(user.password, wordpass)==True:
			return True
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
	print("ID: "+str(session.get('id')))
	#print(request.get_json()['charname'])
	charname=request.get_json()['charname']
	stats=request.get_json()['stats']
	gear=request.get_json()['gear']
	Characters.initchar(str(session.get('id')),charname,stats,gear)
	response = Response("done")
	response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
	response.headers['Access-Control-Allow-Credentials'] = 'true'	
	return response


@app.route('/main', methods=['GET'])
def main():
	print("Main: "+str(session.get('logged_in')))
	if session.get('logged_in')==True:
		print("session:"+str(session.get('user')))
		print("ID: "+str(session.get('id')))
		return render_template('mainpage.html',)
	else:
		return redirect(url_for('login'))

@app.route('/favicon.ico', methods=['GET'])
def favicon():
	return;

@app.route('/load', methods=['GET'])
def load():
	print("ID: "+str(session.get('id')))
	print("loadlog"+str(session.get('logged_in')))
	thinger = session.get('logged_in')
	if session.get('logged_in')==True:
		# thinger=request.form['name']
		# print(thinger)
		#print("this is a name: "+str(session.get('user')))
		#print(USERNAME)
		char=Character.query.filter_by(userid=str(session.get('id'))).first()
		thingy = [char.charname,char.loc,char.stats, char.gear, char.charmap, char.monsters, char.items]
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

@app.route('/save', methods=['GET','POST'])
def save():
	print("ID: "+str(session.get('id')))
	user=str(session.get('id'))
	stats=request.get_json()['stats']
	gear = request.get_json()['gear']
	loc = request.get_json()['loc']
	charmap = request.get_json()['map']
	monsters = request.get_json()['monsters']
	items = request.get_json()['items']
	Characters.save(user,stats,gear,loc,charmap,monsters,items)
	response = Response("done")
	response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
	response.headers['Access-Control-Allow-Credentials'] = 'true'	
	return response


if __name__ == "__main__":
	app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'#os.urandom(20)
	app.run('127.0.0.1',3000,debug=True)
