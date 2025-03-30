from flask import current_app as app, jsonify
from flask import request, render_template, send_from_directory
import json
from .models import *
from .database import db
from flask_security import hash_password, auth_required, roles_required, current_user, roles_accepted, login_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
from collections import Counter
from celery.result import AsyncResult
from .tasks import csv_report
from sqlalchemy import func

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/admin")
@auth_required("token")
@roles_required("admin")
def admin_home():
    pending_professionals = User.query.filter_by(status = "verification pending").limit(5).all()
    pending_services = ServiceRequest.query.filter_by(status = "pending").limit(5).all()
    
    services = AvailableServices.query.limit(5).all()
    print("admin")
    # print(services_pending)
    return jsonify({
            "pending_professionals": [p.to_dict() for p in pending_professionals],
            "pending_services": [p.to_dict() for p in pending_services],
            "services": [p.to_dict() for p in services]
        })
    
#need to be updated for cutomer and admin
@app.route("/api/viewService/<int:id>")
@roles_accepted("admin", "customer", "professional")
@auth_required("token")
def viewService(id):
    user = current_user
    print("test")
    print(id)
    print(user.roles)
    if "customer" in user.roles:
        try:
            s = ServiceRequest.query.filter_by(id = id).first()
            l = AvailableServices.query.filter_by(id = s.service_id).first()
            print("l", l)
            
            k = []
            k.append({
                "name" : l.name,
                "category" : l.category,
                "price" : l.price,
                "duration" : l.duration,
                "description" : l.description,
                "start_time" : s.start_time,
                "end_time" : s.end_time,
                "customer_id" : s.customer_id,
                "professional_id" : s.professional_id,
                "status" : s.status,
                "rating" : s.rating,
                "review" : s.review
            })
            
            return jsonify({
                "data" : k[0]
            })
        except Exception as e:
            return jsonify({
                "message" : "Permission denied for this service id" + e
            })
    
    elif "admin" in current_user.roles:
        print("admin")
        s = ServiceRequest.query.filter_by(id = id).first()
        print()
        l = AvailableServices.query.filter_by(id = ServiceRequest.query.filter_by(id = id).first().service_id).first()
        print("l", l)
        address = ""
        if User.query.filter_by(id = s.customer_id).all():
            address = [i.address for i in User.query.filter_by(id = s.customer_id).all()][0]
        k = []
        k.append({
                "name" : l.name,
                "category" : l.category,
                "price" : l.price,
                "duration" : l.duration,
                "description" : l.description,
                "start_time" : s.start_time,
                "end_time" : s.end_time,
                "customer_id" : s.customer_id,
                "professional_id" : s.professional_id,
                "status" : s.status,
                "rating" : s.rating,
                "review" : s.review,
                "address" : address
            })
        return jsonify({
            "data" : k[0]
        })
    elif "professional" in current_user.roles:
        print("professionals")
        s = ServiceRequest.query.filter_by(id = id).first()
        print()
        l = AvailableServices.query.filter_by(id = ServiceRequest.query.filter_by(id = id).first().service_id).first()
        print("l", l)
        
        address = ""
        if User.query.filter_by(id = s.customer_id).all():
            address = [i.address for i in User.query.filter_by(id = s.customer_id).all()][0]
        k = []
        k.append({
            "name" : l.name,
                "category" : l.category,
                "price" : l.price,
                "duration" : l.duration,
                "description" : l.description,
                "start_time" : s.start_time,
                "end_time" : s.end_time,
                "customer_id" : s.customer_id,
                "professional_id" : s.professional_id,
                "status" : s.status,
                "rating" : s.rating,
                "review" : s.review,
                "address" : address
            })
        print(k)
        return jsonify({
            "data" : k[0]
        })
        # return jsonify({
        # "message" : "message"
        # })
    else:
        return jsonify({
            "message" : "You are not in any of the roles"
        })


@app.route("/api/serviceDetails/<int:id>")
@roles_accepted("admin", "customer")
@auth_required("token")
def serviceDetails(id):
    print()
    service = {}
    service = AvailableServices.query.filter_by(id = id).first()
    print(service)
    return jsonify({
        "data" : service.to_dict()
    })

@app.route("/api/editServiceDetails/<int:id>", methods = ["POST"])
@roles_required("admin")
@auth_required("token")
def editServiceDetails(id):
    print("data")
    data = request.get_json()
    service = AvailableServices.query.filter_by(id = id).first()
    for i in data:
        print(i)
    service.name = data["name"]
    service.price = data["price"]
    service.category = data["category"]
    service.description = data["description"]
    service.duration = data["duration"]
    db.session.commit()
    return jsonify({
        "message" : "Edited Service"
    })

@app.route("/api/admin/flag_service", methods=["POST"])
@roles_required("admin")
@auth_required("token")
def flag_service():
    print(request.get_json())
    ServiceRequest.query.filter_by(id = request.get_json()["id"]).first().status = "deleted"
    db.session.commit()
    return jsonify({
        "messages" : "Service is marked as false"
    })

@app.route("/api/deleteService/<int:id>")
@roles_accepted("admin")
@auth_required("token")
def deleteService(id):
    
    
    if ServiceRequest.query.filter_by(service_id = id, status = "accepted").all():
        return jsonify({
            "message" : "There is one or more on going service(s), so this cannot be deleted"
        })
    
    services = ServiceRequest.query.filter_by(service_id = id, status = "pending").all()
    if services:
        for i in services:
            db.session.delete(i)

    service = AvailableServices.query.filter_by(id = id).first()
    print(service)
    print("delete")
    db.session.delete(service)
    db.session.commit()
    return jsonify({
        "message": "Deleted Service"
    })


@app.route("/api/professional")
@roles_required("professional")
@auth_required("token")
def professional_home():
    available_services = []
    pending_services = []
    completed_services = []
    deleted_services = []
    accepted_services = []
    available_services = AvailableServices.query.all()
    print(current_user.service)
    l = AvailableServices.query.filter_by(category = current_user.service).all()
    print(l)
    if current_user.status == "verification pending":
        return jsonify ({
            "message" : "not verified"
        })
    elif current_user.status == "rejected":
        return jsonify({
            "message" : "rejected"
        })
    if l:
        k = []
        for i in l:
            n=[]
            n = ServiceRequest.query.filter_by(service_id =  i.id, status = "pending").all()
            print(n)
            for j in n:
                k.append({
                    "id": j.id,
              "name" : i.name,
                "category" : i.category,
                "price" : i.price,
                "duration" : i.duration,
                "description" : i.description,
                "start_time" : j.start_time,
                "end_time" : j.end_time,
                "customer_name" : [i.username for i in User.query.filter_by(id = j.customer_id).all()][0],
                "professional_id" : j.professional_id,
                "status" : j.status,
                "rating" : j.rating,
                "review" : j.review,
                
                })
        pending_services.append(k)
    completed_service = ServiceRequest.query.filter_by(professional_id = current_user.id, status = "completed").all()
    
    k=[]
    for j in completed_service:
        i = [o for o in AvailableServices.query.filter_by(id = j.service_id).all()][0]
        k.append({
                    "id": j.id,
              "name" : i.name,
                "category" : i.category,
                "price" : i.price,
                "duration" : i.duration,
                "description" : i.description,
                "start_time" : j.start_time,
                "end_time" : j.end_time,
                "customer_name" : [i.username for i in User.query.filter_by(id = j.customer_id).all()][0],
                "professional_id" : j.professional_id,
                "status" : j.status,
                "rating" : j.rating,
                "review" : j.review,
                
        })
    completed_services.append(k)
    accepted_service = ServiceRequest.query.filter_by( professional_id = current_user.id, status = "accepted").all()

    k=[]
    for j in accepted_service:
        i = [o for o in AvailableServices.query.filter_by(id = j.service_id).all()][0]
        k.append({
                    "id": j.id,
              "name" : i.name,
                "category" : i.category,
                "price" : i.price,
                "duration" : i.duration,
                "description" : i.description,
                "start_time" : j.start_time,
                "end_time" : j.end_time,
                
                "customer_name" : [i.username for i in User.query.filter_by(id = j.customer_id).all()][0],
                "professional_id" : j.professional_id,
                "status" : j.status,
                "rating" : j.rating,
                "review" : j.review,
                
        })
    accepted_services.append(k)
    print("available_services", pending_services)
    return jsonify({
        "available_services" : [l.to_dict() for l in available_services],
        "pending_services" : pending_services[0], #stan
        "completed_services" : [completed_services][0][0],
        "accepted_services" : accepted_services[0],
        "message" : ""
    })

@app.route("/api/professionalServices", methods=["GET"])
def professional_services():
    try:
        # Get the logged-in professional's ID from the request headers (or session)
        professional_id = current_user.id
        print(professional_id)
        if not professional_id:
            return jsonify({"error": "Professional ID is required"}), 400

        # Query to count services by status for the logged-in professional
        status_counts = (
            db.session.query(ServiceRequest.status, func.count(ServiceRequest.id))
            .filter(ServiceRequest.professional_id == professional_id)
            .filter(ServiceRequest.status.in_(["accepted", "completed"]))
            .group_by(ServiceRequest.status)
            .all()
        )
        print(status_counts)
        # Format the data for the frontend
        data = [{"label": status, "value": count} for status, count in status_counts]

        return jsonify(data), 200

    except Exception as e:
        # Handle errors
        return jsonify({"error": "An error occurred while fetching data", "details": str(e)}), 500
    
@app.route("/api/user")
@roles_required("customer")
@auth_required("token")
def user_home():
    available_services = []
    pending_services = []
    completed_services = []
    deleted_services = []
    accepted_services = []
    available_services = AvailableServices.query.all()
    pending = ServiceRequest.query.filter_by( customer_id = current_user.id, status = "pending").all()
    print(pending)
    try:
        for i in pending:
            print("lllllllllllllllllllllllllllllll:",i.service_id, AvailableServices.query.filter_by(id = i.service_id).all())
            tem = AvailableServices.query.filter_by(id = i.service_id).all()
            for j in tem:
                pending_services.append({
                    "id" : i.id,
                    "name" : j.name,
                    "price" : j.price,
                })
        completed = ServiceRequest.query.filter_by(customer_id = current_user.id, status = "completed").all()
        for i in completed:
            print("lllllllllllllllllllllllllllllll:",i.service_id, AvailableServices.query.filter_by(id = i.service_id).all())
            tem = AvailableServices.query.filter_by(id = i.service_id).all()
            for j in tem:
                completed_services.append({
                    "id" : i.id,
                    "name" : j.name,
                    "price" : j.price,
                })
        deleted_service = ServiceRequest.query.filter_by( customer_id = current_user.id,status =  "deleted").all()
        for i in deleted_service:
            print("lllllllllllllllllllllllllllllll:",i.service_id, AvailableServices.query.filter_by(id = i.service_id).all())
            tem = AvailableServices.query.filter_by(id = i.service_id).all()
            for j in tem:
                deleted_services.append({
                    "id" : i.id,
                    "name" : j.name,
                    "price" : j.price
                })
        accepted = ServiceRequest.query.filter_by( customer_id = current_user.id, status = "accepted").all()
        for i in accepted:
            print("lllllllllllllllllllllllllllllll:",i.service_id, AvailableServices.query.filter_by(id = i.service_id).all())
            tem = AvailableServices.query.filter_by(id = i.service_id).all()
            for j in tem:
                accepted_services.append({
                    "id" : i.id,
                    "professional_name" : [u.username for u in User.query.filter_by(id = i.professional_id).all()][0],
                    "end_time" : i.end_time,
                })

        print("available_services", available_services)
        return jsonify({
            "available_services" : [l.to_dict() for l in available_services],
            "pending_services" : pending_services,
            "completed_services" : completed_services,
            "deleted_services" : deleted_services,
            "accepted_services" : accepted_services
        })
    except Exception as e:
        print(e)
        return jsonify({
            "messsage"  : "some error in user home page"
        })


@app.route("/api/request/<int:id>")
@roles_required("customer")
@auth_required("token")
def requestSe(id):
    print("request server funtion")
    duration = [l.duration for l in AvailableServices.query.filter_by(id = id).all()][0]
    try:
        db.session.add(ServiceRequest(service_id = id, 
        customer_id = current_user.id,
        status = "pending",
        start_time = datetime.now(),
        end_time = datetime.now() + timedelta(days = int(duration))))
        db.session.commit()
    except Exception as e:
        print(e)
    return jsonify({
        "message" : "Reques"
    })

@app.route("/api/login", methods = ["POST"])
def login():
    data = request.get_json()
    print(data["password"])
    user = app.security.datastore.find_user(username = data["username"])
    print("user.password", user)

    if user and check_password_hash(user.password, data["password"]):
        print("authorised")
        # if current_user:
        #     return jsonify({
        #         "message" : "User already logged in"
        #     })
        login_user(user)
        return jsonify({
            "id" : user.id,
            "email" : user.email,
            "username" : user.username,
            "auth_token" : user.get_auth_token(),
            "role" : [role.name for role in user.roles][0]
        })
    else:
        return jsonify({
            "message" : "Password incorrect"
        })
    return jsonify({
        "message" : "User not found"
    })


# @app.post("/api/create_customer")
# def create_customer():
#     data = request.get_json()
#     print("data",data)
#     if not app.security.datastore.find_user(email = data["email"]):
#         user = app.security.datastore.create_user(email = data["email"],
#                                                    username = data["username"],
#                                                    password = generate_password_hash(data["password"], method='pbkdf2:sha256'),
#                                                    roles = ["customer"])
#         db.session.commit()
#         return jsonify({"message": "User created"}),201
#     return jsonify({"message": "User already exists"}), 400


@app.post("/api/register")
def register():
    data = request.get_json()
    print(data)

    if not app.security.datastore.find_user(email = data["email"]):
        if data["role"] == "customer":
            print("customer")
            user = app.security.datastore.create_user(email = data["email"],
                                                    username = data["username"],
                                                    password = generate_password_hash(data["password"],  method='pbkdf2:sha256'),
                                                    roles = ["customer"],
                                                    phone = data["phone"],
                                                    address = data["address"],
                                                    zip = data["pincode"],
            )
        elif data["role"] == "professional":
            print("prof")
            user = app.security.datastore.create_user(email = data["email"],
                                                    username = data["username"],
                                                    password = generate_password_hash(data["password"],  method='pbkdf2:sha256'),
                                                    roles = ["professional"],
                                                    service = data["service"],
                                                    experience = data["experience"],
                                                    status = "verification pending",
            )
            print("user", user)
    db.session.commit()
    return jsonify({"message": "Professional created"}),201

@app.route("/api/create_service", methods = ["POST"])
@roles_required("admin")
@auth_required("token")
def create_service():
    data = request.get_json()
    service = AvailableServices(name = data["name"], category = data["category"], description = data["description"], price = float(data["price"]), duration = int(data["duration"]))
    db.session.add(service)
    db.session.commit()
    return jsonify({"message": "Service created"}), 201

@app.route("/api/admin/approve_reject_id", methods = ["POST"])
@roles_required("admin")
@auth_required("token")
def approve_reject_id():
    data = request.get_json()
    print(data)
    service = User.query.filter_by(id = data["id"]).first()
    if (data["a_or_o"] == "approve"):
        service.status = "approved"
    else:
        service.status = "rejected"
    db.session.commit()
    return jsonify({"message": "Service created"}), 201

@app.route("/api/create_service_request", methods = ["POST"])
@roles_required("customer")
@auth_required("token")
def create_service_request():
    print("request.get_json()",request.get_json())
    data = request.get_json()
    duration = [l.duration for l in AvailableServices.query.filter_by(id = data["id"]).all()][0]
    print(duration, type(duration))
    print(datetime.now())
    try:
        if not data["start_time"]:
            service_request = ServiceRequest(
                customer_id = int(current_user.id),
                professional_id = None,
                service_id = int(data["id"]),
                status = "pending",
                    start_time = datetime.now().date(),
                    end_time = (datetime.now() + timedelta(days = int(duration))).date())
        else:
            service_request = ServiceRequest(
                customer_id = int(current_user.id),
                professional_id = None,
                service_id = int(data["id"]),
                status = "pending",
                    start_time = datetime.strptime(data["start_time"], "%Y-%m-%d").date(),
                    end_time = datetime.strptime(data["start_time"], "%Y-%m-%d").date() + timedelta(days = int(duration)))
    except Exception as e:
        print(e)
        return jsonify({
            "message" : "Some error "
        })
    print(service_request)
    db.session.add(service_request)
    db.session.commit()
    return jsonify({"message": "Service request created"}), 201

@app.route("/api/accept", methods = ["POST"])
@roles_required("professional")
@auth_required("token")
def accept_service_request():
    print("accept_service_request")
    print(request.get_json())
    try:
        data = request.get_json()
        print(data)
        service_request = ServiceRequest.query.filter_by(id = data["id"]).first()
        service_request.professional_id = current_user.id
        service_request.status = "accepted"
        db.session.commit()
        return jsonify({
            "message" : "Service request accpeted"
        })
    except Exception as e:
        return jsonify({
            "message" : str(e)
        })

@app.route("/api/complete_service_request", methods = ["POST"])
@roles_required("customer")
@auth_required("token")
def complete_service_request():
    try:
        data = request.get_json()
        print(request.get_json())
        service_request = ServiceRequest.query.filter_by(id = data["id"]).first()
        if service_request.customer_id == current_user.id:
            service_request.status = "completed"
            service_request.rating = data["rating"]
            service_request.review = data["review"]
            db.session.commit()
            return jsonify({
            "message" : "Service request accpeted"
        })
        else:
            return ({
                "message" : "You are not authorised to make changes to this service"
            })
    except Exception as e:
        print(e)
        return jsonify({
            "message" : str(e)
        })


@app.route("/api/get_service_requests", methods = ["GET"])
@roles_accepted("professional", "customer")
@auth_required("token")
def get_service_requests():
    try:
        if "professional" in [role.name for role in current_user.roles]:
            service_id = AvailableServices.query.filter_by(category = current_user.service).first().id
            service_requests = ServiceRequest.query.filter_by(service_id = service_id).all
            requests = []
            for i in service_requests:
                if i.status == "accepted" and i.professional_id == current_user.id:
                    requests.append(i)
                elif i.status == "pending":
                    requests.append(i)
            return jsonify(
                requests
            )
        elif "customer" in [role.name for role in current_user.roles]:
            requests = ServiceRequest.query.filter_by(customer_id = current_user.id).all()
            return jsonify({
                "requests" : requests,
                "services" : [AvailableServices.query.all()]
            })
    except Exception as e:
        return jsonify({
            "message" : str(e)
        })

@app.route("/api/delete_service_request/<int:service_request_id>", methods = ["GET"])
@roles_accepted("customer", "admin")
@auth_required("token")
def delete_service_request(service_request_id):
    try:
        service_request = ServiceRequest.query.filter_by(id = service_request_id).first()
        if "customer" in [role.name for role in current_user.roles] and service_request.customer_id == current_user.id and service_request.status != "accepted":
            db.session.delete(service_request)
            db.session.commit()
            return jsonify({
                "message" : "Service Request deleted"
            })
        elif "admin" in [role.name for role in current_user.roles] and service_request.status != "accepted":
            db.session.delete(service_request)
            db.session.commit()
            return jsonify({
                "message" : "Service Request deleted"
            })
    except Exception as e:
        return jsonify({
            "message" : str(e)
        })

@app.route("/api/approve_or_reject_professional/<int:professional_id>", methods = ["POST"])
@roles_required("admin")
@auth_required("token")
def approve_or_reject_professional(professional_id):
    try:
        data = request.get_json()
        professional = User.query.filter_by(id = professional_id).first()
        if data["status"] == "approve":
            professional.status = "approved"
            db.session.commit()
            return jsonify({
                "message" : "Professional approved"
            })
        elif data["status"] == "reject":
            professional.status = "rejected"
            db.session.commit()
            return jsonify({
                "message" : "Professional rejected"
            })
    except Exception as e:
        return jsonify({
            "message" : str(e)
        })
def classify_experience(experience):
    if int(experience) <= 2:
        return 'Beginner'
    elif int(experience) <= 5:
        return 'Intermediate'
    elif int(experience) <= 10:
        return 'Advanced'
    else:
        return 'Expert'

@app.route("/api/analyseAdmin")
@auth_required("token")
@roles_accepted("admin")
def createSummaryForAdmin():
    try:
        # Query for Pie Chart (Category Distribution)
        category_counts = (
            db.session.query(AvailableServices.category, func.count(AvailableServices.id))
            .group_by(AvailableServices.category)
            .all()
        )
        pie_chart_data = [{"label": category, "value": count} for category, count in category_counts]

        # Query for Bar Chart (Status Distribution)
        status_counts = (
            db.session.query(ServiceRequest.status, func.count(ServiceRequest.id))
            .group_by(ServiceRequest.status)
            .all()
        )
        bar_chart_data = [{"label": status, "value": count} for status, count in status_counts]

        # Combine both datasets into a single response
        response_data = {
            "pieChartData": pie_chart_data,
            "barChartData": bar_chart_data,
        }

        return jsonify(response_data), 200

    except Exception as e:
        # Handle errors
        return jsonify({"error": "An error occurred while fetching data", "details": str(e)}), 500

@app.route("/api/edit_service_request/<int:service_request_id>", methods = ["POST"])
@roles_accepted("customer", "admin")
@auth_required("token")
def edit_service_request(service_request_id):
    try:
        data = request.get_json()
        print(data)
        p = [i.service_id for i in ServiceRequest.query.filter_by(id = service_request_id)][0]
        duration = [l.duration for l in AvailableServices.query.filter_by(id = p).all()][0]
        service = ServiceRequest.query.filter_by(id = service_request_id).first()
        l = datetime.strptime(data["start_time"], "%Y-%m-%d").date()
        service.start_time = datetime.strptime(data["start_time"], "%Y-%m-%d").date()
        
        l = datetime.strptime(data["start_time"], "%Y-%m-%d").date() + timedelta(days = int(duration))
        service.end_time = l
        
        db.session.commit()
        return jsonify({
            "message" : "edited"
        })
    except Exception as e:
        print(e)
        return jsonify({
            
            "message" : str(e)
        })


# change except Exception to error
# check in all data altering routes that the user with correct credentials is changing
# create a city model
# edit service route for admin only
#sending only limited amount of rows to admin, one by one increasing as it clicks on next button

@app.route("/api/export") #manually triggers the job
def report_csv():
    result = csv_report.delay()
    return jsonify({
        "id" : result.id,
        "result" : result.result
    })

@app.route("/api/csv_result/<id>") #test the result
def csv_result(id):
    result = AsyncResult(id)
    return send_from_directory('static', result.result)
    
