from flask import Flask, request, render_template, jsonify, session, redirect,url_for
from Models import *
import os
app = Flask(__name__)

@app.route('/',methods=['GET'])
def nothere():
	return redirect(url_for('login'))

@app.route('/login', methods=['GET','POST'])
def login():
	
	if session.get('logged_in')==True:
		return redirect(url_for('main'))
	else:
		print(session.get('logged_in'))
		return render_template('login.html',title="Login?",)

@app.route('/data', methods=['POST'])
def data():
	name=request.form['username']
	password=request.form['password']
	user=User.query.filter_by(username=name).first()
	if islegit(name,password)=="True":
		session['id']=user.id
		session['logged_in']=True
		return redirect(url_for('main'))
	else:
		session['logged_in']=False
		return redirect(url_for('login'))
def islegit(Name,wordpass):
		user = User.query.filter_by(username=Name).first()
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

@app.route('/main', methods=['POST','GET'])
def main():
	if session.get('logged_in')==True:
		return render_template('mainpage.html',title="Welcome",)
	return redirect(url_for('login'))

if __name__ == "__main__":
	app.secret_key = os.urandom(30)
	app.run('127.0.0.1',3000,debug=True)
