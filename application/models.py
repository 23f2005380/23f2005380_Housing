from .database import db
from flask_security import UserMixin, RoleMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String(120), unique = True, nullable = False)
    username = db.Column(db.String(80), unique=True, nullable = False)
    password = db.Column(db.String(80))

    phone = db.Column(db.String(20), nullable = True)
    address = db.Column(db.String(120), nullable = True)
    zip = db.Column(db.String(10), nullable = True)

    rating = db.Column(db.Integer, nullable = True, default = 0)
    service = db.Column(db.String(20), nullable = True)
    experience = db.Column(db.String(20), nullable = True)
    status = db.Column(db.String(20), nullable = True)

    fs_uniquifier = db.Column(db.String, unique = True, nullable = False)
    active = db.Column(db.Boolean, nullable = False)
    roles = db.relationship('Role', secondary = "user_roles", backref = "bearer")
    
    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "phone": self.phone,
            "address": self.address,
            "zip": self.zip,
            "rating": self.rating,
            "service": self.service,
            "experience": self.experience,
            "status": self.status,
            "fs_uniquifier": self.fs_uniquifier,
            "active": self.active,
            "roles": [role.name for role in self.roles]
        }


class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique = True, nullable = False)
    description = db.Column(db.String)
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description
        }

class UserRoles(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable = False)
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "roles_id": self.role_id
        }
    
class AvailableServices(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique = True, nullable = False)
    category = db.Column(db.String, nullable = False)
    description = db.Column(db.String, nullable = False)
    price = db.Column(db.Float, nullable = False)
    duration = db.Column(db.Integer, nullable = False)
    def to_dict(self):
        return {
            "id": self.id,
            "name":self.name,
            "category": self.category,
            "description": self.description,
            "price": self.price,
            "duration": self.duration
        }

class ServiceRequest(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    professional_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = True)
    service_id = db.Column(db.Integer, db.ForeignKey('available_services.id'), nullable = False)
    status = db.Column(db.String, nullable = False)
    start_time = db.Column(db.Date, nullable = False)
    end_time = db.Column(db.Date, nullable = False)
    rating = db.Column(db.Integer, nullable = True)
    review = db.Column(db.String, nullable = True)
    def to_dict(self):
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "professional_id": self.professional_id,
            "service_id": self.service_id,
            "status": self.status,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "rating": self.rating,
            "review": self.review
        }



# class Customer(User):
#     __tablename__ = 'customer'
#     id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key = True)
#     # first_name = db.Column(db.String(80), nullable = False)
    # last_name = db.Column(db.String(80), nullable = False)
   

# class Professional(User):
#     __tablename__ = 'professional'
#     id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key = True)
#     # first_name = db.Column(db.String(80), nullable = False)
#     # last_name = db.Column(db.String(80), nullable = False)
#     phone = db.Column(db.String(20), nullable = False)
    
#     zip = db.Column(db.String(10), nullable = False)
#     role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable = False)
#     role = db.relationship('Role', backref = db.backref('professional', lazy = 'dynamic'))

