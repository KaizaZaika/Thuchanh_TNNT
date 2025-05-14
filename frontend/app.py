import os
from flask import Flask, render_template, url_for, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'  # Fixed typo
app.config['SECRET_KEY'] = 'thisissecret'
db = SQLAlchemy(app) 




class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique = True)
    password = db.Column(db.String(80), nullable=False)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) 
MODELS_DIR = os.path.join(BASE_DIR, 'backend', 'images', 'models')

@app.route('/models/<filename>')
def serve_model_image(filename):
    print(f"Looking for file in: {MODELS_DIR}")  # Debug print
    print(f"Requested file: {filename}")  # Debug print
    return send_from_directory(MODELS_DIR, filename)

@app.route('/')
def home():
    print(f"Models directory: {MODELS_DIR}")  # Debug print
    model_images = [f for f in os.listdir(MODELS_DIR) if f.lower().endswith(('.jpg', '.png', '.jpeg'))]
    expected_filenames = [f'{i}.jpg' for i in range(0,26)]  # Match your model_filenames
    model_images = [f for f in model_images if f in expected_filenames or f.lower() in [ef.lower() for ef in expected_filenames]]
    print(f"Found images: {model_images}")  # Debug print
    return render_template('home.html', model_images=model_images)



@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')

if __name__ == '__main__':
    app.run(debug=True)