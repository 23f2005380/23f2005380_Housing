from flask import Flask
from application.database import db
from application.models import User, Role

from application.config import LocalDevelopmentConfig
from flask_security import Security, datastore, SQLAlchemyUserDatastore
from flask_security import hash_password
from werkzeug.security import generate_password_hash
from application.celery_init import celery_init_app

def create_app():
    app = Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore)
    app.app_context().push()
    return app

app = create_app()
celery = celery_init_app(app)

print(__name__)
with app.app_context():
    db.create_all()

    print("Creating roles")
    app.security.datastore.find_or_create_role(name = "admin", description = "Administrator")
    app.security.datastore.find_or_create_role(name = "customer", description = "Customer")
    app.security.datastore.find_or_create_role(name = "professional", description = "Professional")
    db.session.commit()

    if not app.security.datastore.find_user(email = "email@email.com"):
        app.security.datastore.create_user(email = "email@email.com",
                                           username = "user",
                                           password = generate_password_hash("123"),
                                           roles = ["admin"])

    if not app.security.datastore.find_user(email = "email2@gmail.com"):
        app.security.datastore.create_user(email = "email2@gmail.com",
        username = "user2",
        password = generate_password_hash("123"), roles = ["customer"])
    db.session.commit()
    
from application.routes import *

if __name__ == "__main__":
    app.run()