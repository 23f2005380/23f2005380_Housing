from celery import shared_task
from .models import ServiceRequest
import csv
import datetime

@shared_task(ignore_results = False, name = "download_csv_report")
def csv_report():
    user = ServiceRequest.query.all()
    file = f"user_data_{datetime.datetime.now().strftime("%f") }.csv"
    with open(f'static/{file}','w', newline = "") as csvfile:
        sr_no = 1
        user_csv = csv.writer(csvfile, delimiter = ",")
        user_csv.writerow(['Sr No.', 'Customer_id', 'professional_id', 'service_id', 'status', 'start_time', 'end_time', 'rating', 'review'])
        for i in user:
            this_user = [sr_no, i.customer_id, i.professional_id, i.service_id, i.status, i.start_time, i.end_time, i.rating, i.review]
            sr_no +=1
            user_csv.writerow(this_user)

    return file

@shared_task(ignore_results = False, name = "summaryGenerate")
def monthly_activity_report():
    return "monthly_activity_report"

@shared_task(ignore_results = False, name = "complete_task")
def complete_task():
    return "complete task"