from flask import Flask, request, render_template, jsonify, session, redirect,url_for
from Models import *
import os
app = Flask(__name__)

@app.route('/',methods=['GET'])
def nothere():
	return render_template("login.html",title="Login?")


if __name__ == "__main__":
	app.secret_key = os.urandom(30)
	app.run('127.0.0.1',3000,debug=True)
