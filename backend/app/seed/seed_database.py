#!/usr/bin/env python3
"""
Database Seeding Script
Seeds the college database with sample KLU data
"""
import sys
from pathlib import Path
from datetime import date, timedelta
import random

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.models.database import engine, SessionLocal, Base
from app.models.college_models import (
    Student, Faculty, Course, Event, Department, Admission, Facility
)


def seed_departments(db):
    """Seed departments table"""
    departments = [
        {
            "dept_code": "CSE",
            "dept_name": "Computer Science and Engineering",
            "hod_name": "Dr. K. Srinivas",
            "total_faculty": 85,
            "total_students": 1200,
            "building": "R&D Block",
            "floor": "3rd Floor",
        },
        {
            "dept_code": "ECE",
            "dept_name": "Electronics and Communication Engineering",
            "hod_name": "Dr. P. Venkata Rao",
            "total_faculty": 65,
            "total_students": 900,
            "building": "Main Block",
            "floor": "2nd Floor",
        },
        {
            "dept_code": "EEE",
            "dept_name": "Electrical and Electronics Engineering",
            "hod_name": "Dr. M. Lakshmi Prasad",
            "total_faculty": 45,
            "total_students": 600,
            "building": "Main Block",
            "floor": "1st Floor",
        },
        {
            "dept_code": "MECH",
            "dept_name": "Mechanical Engineering",
            "hod_name": "Dr. R. Venkatesh",
            "total_faculty": 55,
            "total_students": 800,
            "building": "Engineering Block",
            "floor": "Ground Floor",
        },
        {
            "dept_code": "CIVIL",
            "dept_name": "Civil Engineering",
            "hod_name": "Dr. S. Ramakrishna",
            "total_faculty": 40,
            "total_students": 500,
            "building": "Engineering Block",
            "floor": "1st Floor",
        },
        {
            "dept_code": "IT",
            "dept_name": "Information Technology",
            "hod_name": "Dr. N. Suresh Kumar",
            "total_faculty": 50,
            "total_students": 700,
            "building": "R&D Block",
            "floor": "2nd Floor",
        },
        {
            "dept_code": "AIDS",
            "dept_name": "Artificial Intelligence and Data Science",
            "hod_name": "Dr. K. Praveen Kumar",
            "total_faculty": 35,
            "total_students": 450,
            "building": "R&D Block",
            "floor": "4th Floor",
        },
        {
            "dept_code": "MBA",
            "dept_name": "Master of Business Administration",
            "hod_name": "Dr. V. Srinivasa Rao",
            "total_faculty": 30,
            "total_students": 300,
            "building": "Management Block",
            "floor": "All Floors",
        },
    ]
    
    for dept_data in departments:
        dept = Department(**dept_data)
        db.add(dept)
    db.commit()
    print(f"✓ Seeded {len(departments)} departments")


def seed_faculty(db):
    """Seed faculty table"""
    faculty_list = [
        {"faculty_id": "FAC001", "name": "Dr. K. Srinivas", "email": "k.srinivas@kluniversity.in", "department": "Computer Science and Engineering", "designation": "Professor & HOD", "specialization": "Machine Learning, Data Science", "phone": "9876543210"},
        {"faculty_id": "FAC002", "name": "Dr. Venkata Ramana", "email": "v.ramana@kluniversity.in", "department": "Computer Science and Engineering", "designation": "Professor", "specialization": "Cloud Computing, Distributed Systems", "phone": "9876543211"},
        {"faculty_id": "FAC003", "name": "Dr. Lakshmi Devi", "email": "l.devi@kluniversity.in", "department": "Computer Science and Engineering", "designation": "Associate Professor", "specialization": "Natural Language Processing, AI", "phone": "9876543212"},
        {"faculty_id": "FAC004", "name": "Mr. Ravi Kumar", "email": "r.kumar@kluniversity.in", "department": "Computer Science and Engineering", "designation": "Assistant Professor", "specialization": "Web Technologies, Database Systems", "phone": "9876543213"},
        {"faculty_id": "FAC005", "name": "Ms. Priya Sharma", "email": "p.sharma@kluniversity.in", "department": "Computer Science and Engineering", "designation": "Assistant Professor", "specialization": "Computer Networks, Cybersecurity", "phone": "9876543214"},
        {"faculty_id": "FAC006", "name": "Dr. P. Venkata Rao", "email": "p.vrao@kluniversity.in", "department": "Electronics and Communication Engineering", "designation": "Professor & HOD", "specialization": "VLSI Design, Embedded Systems", "phone": "9876543215"},
        {"faculty_id": "FAC007", "name": "Dr. Suresh Babu", "email": "s.babu@kluniversity.in", "department": "Electronics and Communication Engineering", "designation": "Professor", "specialization": "Signal Processing, Communications", "phone": "9876543216"},
        {"faculty_id": "FAC008", "name": "Dr. Anitha Kumari", "email": "a.kumari@kluniversity.in", "department": "Electronics and Communication Engineering", "designation": "Associate Professor", "specialization": "IoT, Wireless Networks", "phone": "9876543217"},
        {"faculty_id": "FAC009", "name": "Dr. M. Lakshmi Prasad", "email": "m.prasad@kluniversity.in", "department": "Electrical and Electronics Engineering", "designation": "Professor & HOD", "specialization": "Power Systems, Renewable Energy", "phone": "9876543218"},
        {"faculty_id": "FAC010", "name": "Dr. Ramesh Chandra", "email": "r.chandra@kluniversity.in", "department": "Electrical and Electronics Engineering", "designation": "Professor", "specialization": "Control Systems, Automation", "phone": "9876543219"},
        {"faculty_id": "FAC011", "name": "Dr. R. Venkatesh", "email": "r.venkatesh@kluniversity.in", "department": "Mechanical Engineering", "designation": "Professor & HOD", "specialization": "Thermal Engineering, CFD", "phone": "9876543220"},
        {"faculty_id": "FAC012", "name": "Dr. Nagaraju M", "email": "n.m@kluniversity.in", "department": "Mechanical Engineering", "designation": "Associate Professor", "specialization": "Manufacturing, CAD/CAM", "phone": "9876543221"},
        {"faculty_id": "FAC013", "name": "Dr. S. Ramakrishna", "email": "s.rama@kluniversity.in", "department": "Civil Engineering", "designation": "Professor & HOD", "specialization": "Structural Engineering, Concrete Technology", "phone": "9876543222"},
        {"faculty_id": "FAC014", "name": "Dr. N. Suresh Kumar", "email": "n.skumar@kluniversity.in", "department": "Information Technology", "designation": "Professor & HOD", "specialization": "Software Engineering, DevOps", "phone": "9876543223"},
        {"faculty_id": "FAC015", "name": "Dr. K. Praveen Kumar", "email": "k.pkumar@kluniversity.in", "department": "Artificial Intelligence and Data Science", "designation": "Professor & HOD", "specialization": "Deep Learning, Computer Vision", "phone": "9876543224"},
        {"faculty_id": "FAC016", "name": "Dr. V. Srinivasa Rao", "email": "v.srao@kluniversity.in", "department": "Master of Business Administration", "designation": "Professor & HOD", "specialization": "Marketing, Strategic Management", "phone": "9876543225"},
        {"faculty_id": "FAC017", "name": "Mr. Anil Kumar", "email": "a.kumar@kluniversity.in", "department": "Computer Science and Engineering", "designation": "Assistant Professor", "specialization": "Data Structures, Algorithms", "phone": "9876543226"},
        {"faculty_id": "FAC018", "name": "Ms. Swathi Reddy", "email": "s.reddy@kluniversity.in", "department": "Information Technology", "designation": "Assistant Professor", "specialization": "Mobile App Development, UI/UX", "phone": "9876543227"},
    ]
    
    for fac_data in faculty_list:
        faculty = Faculty(**fac_data)
        db.add(faculty)
    db.commit()
    print(f"✓ Seeded {len(faculty_list)} faculty members")


def seed_students(db):
    """Seed students table"""
    departments = [
        "Computer Science and Engineering",
        "Electronics and Communication Engineering",
        "Electrical and Electronics Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Information Technology",
        "Artificial Intelligence and Data Science",
    ]
    sections = ["A", "B", "C", "D"]
    
    first_names = ["Rahul", "Priya", "Arun", "Sneha", "Vikram", "Kavya", "Suresh", "Divya", "Kiran", "Meera", 
                   "Rajesh", "Ananya", "Sanjay", "Pooja", "Venkat", "Lakshmi", "Naveen", "Swathi", "Harish", "Anjali"]
    last_names = ["Sharma", "Kumar", "Reddy", "Rao", "Naidu", "Patel", "Gupta", "Singh", "Varma", "Prasad"]
    
    students = []
    for i in range(1, 21):
        year = random.randint(1, 4)
        dept = random.choice(departments)
        student = {
            "student_id": f"23000{30000 + i:05d}",
            "name": f"{random.choice(first_names)} {random.choice(last_names)}",
            "email": f"student{i}@kluniversity.in",
            "department": dept,
            "year": year,
            "section": random.choice(sections),
            "cgpa": round(random.uniform(6.5, 9.8), 2),
            "phone": f"98765{43000 + i:05d}",
            "enrollment_date": date(2023 - year + 1, 7, 15),
        }
        students.append(student)
    
    for stud_data in students:
        student = Student(**stud_data)
        db.add(student)
    db.commit()
    print(f"✓ Seeded {len(students)} students")


def seed_courses(db):
    """Seed courses table"""
    courses = [
        {"course_code": "CS101", "course_name": "Introduction to Programming", "department": "Computer Science and Engineering", "credits": 4, "semester": 1, "faculty_id": "FAC004", "description": "Fundamentals of programming using Python and C"},
        {"course_code": "CS201", "course_name": "Data Structures", "department": "Computer Science and Engineering", "credits": 4, "semester": 3, "faculty_id": "FAC017", "description": "Arrays, linked lists, trees, graphs, and algorithm analysis"},
        {"course_code": "CS301", "course_name": "Database Management Systems", "department": "Computer Science and Engineering", "credits": 4, "semester": 5, "faculty_id": "FAC004", "description": "Relational databases, SQL, normalization, and transactions"},
        {"course_code": "CS302", "course_name": "Operating Systems", "department": "Computer Science and Engineering", "credits": 4, "semester": 5, "faculty_id": "FAC002", "description": "Process management, memory management, file systems"},
        {"course_code": "CS401", "course_name": "Machine Learning", "department": "Computer Science and Engineering", "credits": 4, "semester": 7, "faculty_id": "FAC001", "description": "Supervised and unsupervised learning, neural networks"},
        {"course_code": "CS402", "course_name": "Cloud Computing", "department": "Computer Science and Engineering", "credits": 3, "semester": 7, "faculty_id": "FAC002", "description": "AWS, Azure, GCP, containerization, microservices"},
        {"course_code": "CS403", "course_name": "Natural Language Processing", "department": "Computer Science and Engineering", "credits": 3, "semester": 7, "faculty_id": "FAC003", "description": "Text processing, sentiment analysis, transformers"},
        {"course_code": "EC201", "course_name": "Digital Electronics", "department": "Electronics and Communication Engineering", "credits": 4, "semester": 3, "faculty_id": "FAC006", "description": "Logic gates, combinational and sequential circuits"},
        {"course_code": "EC301", "course_name": "VLSI Design", "department": "Electronics and Communication Engineering", "credits": 4, "semester": 5, "faculty_id": "FAC006", "description": "CMOS technology, FPGA, ASIC design"},
        {"course_code": "EC302", "course_name": "Embedded Systems", "department": "Electronics and Communication Engineering", "credits": 4, "semester": 5, "faculty_id": "FAC008", "description": "Microcontrollers, ARM processors, IoT applications"},
        {"course_code": "EE201", "course_name": "Circuit Analysis", "department": "Electrical and Electronics Engineering", "credits": 4, "semester": 3, "faculty_id": "FAC010", "description": "Network theorems, AC/DC analysis, resonance"},
        {"course_code": "EE301", "course_name": "Power Systems", "department": "Electrical and Electronics Engineering", "credits": 4, "semester": 5, "faculty_id": "FAC009", "description": "Generation, transmission, distribution of power"},
        {"course_code": "ME201", "course_name": "Engineering Mechanics", "department": "Mechanical Engineering", "credits": 4, "semester": 3, "faculty_id": "FAC011", "description": "Statics, dynamics, kinematics of machines"},
        {"course_code": "ME301", "course_name": "Thermodynamics", "department": "Mechanical Engineering", "credits": 4, "semester": 5, "faculty_id": "FAC011", "description": "Laws of thermodynamics, heat engines, refrigeration"},
        {"course_code": "CE201", "course_name": "Structural Analysis", "department": "Civil Engineering", "credits": 4, "semester": 5, "faculty_id": "FAC013", "description": "Beams, trusses, frames, influence lines"},
        {"course_code": "IT301", "course_name": "Web Technologies", "department": "Information Technology", "credits": 4, "semester": 5, "faculty_id": "FAC018", "description": "HTML, CSS, JavaScript, React, Node.js"},
        {"course_code": "AI301", "course_name": "Deep Learning", "department": "Artificial Intelligence and Data Science", "credits": 4, "semester": 5, "faculty_id": "FAC015", "description": "CNNs, RNNs, transformers, generative models"},
        {"course_code": "MBA101", "course_name": "Principles of Management", "department": "Master of Business Administration", "credits": 3, "semester": 1, "faculty_id": "FAC016", "description": "Management theories, organizational behavior, leadership"},
    ]
    
    for course_data in courses:
        course = Course(**course_data)
        db.add(course)
    db.commit()
    print(f"✓ Seeded {len(courses)} courses")


def seed_events(db):
    """Seed events table"""
    today = date.today()
    events = [
        {"event_name": "TechFest 2024", "description": "Annual technical festival with coding competitions, hackathons, and tech talks", "event_date": today + timedelta(days=30), "venue": "Main Auditorium & Campus", "organizer": "Technical Club", "event_type": "Technical"},
        {"event_name": "Cultural Night", "description": "Annual cultural extravaganza featuring music, dance, and drama performances", "event_date": today + timedelta(days=45), "venue": "Open Air Theatre", "organizer": "Cultural Committee", "event_type": "Cultural"},
        {"event_name": "Sports Meet 2024", "description": "Inter-departmental sports competition including cricket, football, basketball", "event_date": today + timedelta(days=15), "venue": "Sports Complex", "organizer": "Sports Council", "event_type": "Sports"},
        {"event_name": "AI/ML Workshop", "description": "Hands-on workshop on artificial intelligence and machine learning using Python", "event_date": today + timedelta(days=7), "venue": "Seminar Hall 1", "organizer": "CSE Department", "event_type": "Technical"},
        {"event_name": "Industry Connect Seminar", "description": "Guest lecture by industry experts on current technology trends", "event_date": today + timedelta(days=10), "venue": "Main Auditorium", "organizer": "Training & Placement Cell", "event_type": "Seminar"},
        {"event_name": "Hackathon 2024", "description": "24-hour coding marathon with prizes worth ₹1 Lakh", "event_date": today + timedelta(days=20), "venue": "R&D Block Labs", "organizer": "Coding Club", "event_type": "Technical"},
        {"event_name": "Freshers Day", "description": "Welcome event for first-year students", "event_date": today + timedelta(days=60), "venue": "Main Auditorium", "organizer": "Student Council", "event_type": "Cultural"},
        {"event_name": "Placement Drive - TCS", "description": "Campus recruitment drive by TCS for 2024 batch", "event_date": today + timedelta(days=5), "venue": "Placement Cell", "organizer": "Training & Placement Cell", "event_type": "Seminar"},
        {"event_name": "IEEE Workshop", "description": "Workshop on research paper writing and publication", "event_date": today + timedelta(days=12), "venue": "Seminar Hall 2", "organizer": "IEEE Student Branch", "event_type": "Technical"},
        {"event_name": "Blood Donation Camp", "description": "Annual blood donation camp in collaboration with Red Cross", "event_date": today + timedelta(days=25), "venue": "Medical Center", "organizer": "NSS Unit", "event_type": "Cultural"},
        {"event_name": "Alumni Meet 2024", "description": "Annual gathering of KLU alumni", "event_date": today + timedelta(days=90), "venue": "Convention Center", "organizer": "Alumni Association", "event_type": "Cultural"},
        {"event_name": "Robotics Competition", "description": "Inter-college robotics competition", "event_date": today + timedelta(days=35), "venue": "Robotics Lab", "organizer": "Robotics Club", "event_type": "Technical"},
        {"event_name": "Entrepreneurship Summit", "description": "Summit featuring successful startup founders and investors", "event_date": today + timedelta(days=40), "venue": "Management Block Auditorium", "organizer": "E-Cell", "event_type": "Seminar"},
        {"event_name": "Cricket Tournament Finals", "description": "Inter-department cricket tournament final match", "event_date": today + timedelta(days=3), "venue": "Cricket Ground", "organizer": "Sports Council", "event_type": "Sports"},
        {"event_name": "Cloud Computing Seminar", "description": "Seminar on AWS and cloud architecture by AWS certified professional", "event_date": today + timedelta(days=8), "venue": "Seminar Hall 3", "organizer": "IT Department", "event_type": "Seminar"},
    ]
    
    for event_data in events:
        event = Event(**event_data)
        db.add(event)
    db.commit()
    print(f"✓ Seeded {len(events)} events")


def seed_admissions(db):
    """Seed admissions table"""
    today = date.today()
    admissions = [
        {"program": "B.Tech", "department": "Computer Science and Engineering", "total_seats": 300, "available_seats": 45, "last_date": today + timedelta(days=60), "eligibility": "10+2 with Physics, Chemistry, Mathematics with 60% aggregate. JEE Main/AP EAMCET qualified.", "fee_per_semester": 125000},
        {"program": "B.Tech", "department": "Electronics and Communication Engineering", "total_seats": 240, "available_seats": 30, "last_date": today + timedelta(days=60), "eligibility": "10+2 with Physics, Chemistry, Mathematics with 60% aggregate. JEE Main/AP EAMCET qualified.", "fee_per_semester": 120000},
        {"program": "B.Tech", "department": "Electrical and Electronics Engineering", "total_seats": 180, "available_seats": 25, "last_date": today + timedelta(days=60), "eligibility": "10+2 with Physics, Chemistry, Mathematics with 60% aggregate. JEE Main/AP EAMCET qualified.", "fee_per_semester": 115000},
        {"program": "B.Tech", "department": "Mechanical Engineering", "total_seats": 180, "available_seats": 20, "last_date": today + timedelta(days=60), "eligibility": "10+2 with Physics, Chemistry, Mathematics with 60% aggregate. JEE Main/AP EAMCET qualified.", "fee_per_semester": 110000},
        {"program": "B.Tech", "department": "Civil Engineering", "total_seats": 120, "available_seats": 35, "last_date": today + timedelta(days=60), "eligibility": "10+2 with Physics, Chemistry, Mathematics with 60% aggregate. JEE Main/AP EAMCET qualified.", "fee_per_semester": 105000},
        {"program": "B.Tech", "department": "Information Technology", "total_seats": 180, "available_seats": 15, "last_date": today + timedelta(days=60), "eligibility": "10+2 with Physics, Chemistry, Mathematics with 60% aggregate. JEE Main/AP EAMCET qualified.", "fee_per_semester": 120000},
        {"program": "B.Tech", "department": "Artificial Intelligence and Data Science", "total_seats": 120, "available_seats": 10, "last_date": today + timedelta(days=60), "eligibility": "10+2 with Physics, Chemistry, Mathematics with 65% aggregate. JEE Main/AP EAMCET qualified.", "fee_per_semester": 135000},
        {"program": "M.Tech", "department": "Computer Science and Engineering", "total_seats": 60, "available_seats": 25, "last_date": today + timedelta(days=45), "eligibility": "B.Tech/BE in relevant discipline with 60% aggregate. Valid GATE score preferred.", "fee_per_semester": 75000},
        {"program": "M.Tech", "department": "VLSI Design", "total_seats": 30, "available_seats": 15, "last_date": today + timedelta(days=45), "eligibility": "B.Tech/BE in ECE/EEE with 60% aggregate. Valid GATE score preferred.", "fee_per_semester": 80000},
        {"program": "MBA", "department": "Master of Business Administration", "total_seats": 120, "available_seats": 40, "last_date": today + timedelta(days=30), "eligibility": "Bachelor's degree with 50% aggregate. Valid CAT/MAT/ICET score.", "fee_per_semester": 95000},
        {"program": "Ph.D.", "department": "Computer Science and Engineering", "total_seats": 20, "available_seats": 8, "last_date": today + timedelta(days=90), "eligibility": "M.Tech/ME with 60% aggregate or M.Sc with 55%. Valid GATE/NET score.", "fee_per_semester": 50000},
        {"program": "Ph.D.", "department": "Electronics and Communication Engineering", "total_seats": 15, "available_seats": 7, "last_date": today + timedelta(days=90), "eligibility": "M.Tech/ME with 60% aggregate. Valid GATE/NET score.", "fee_per_semester": 50000},
    ]
    
    for admission_data in admissions:
        admission = Admission(**admission_data)
        db.add(admission)
    db.commit()
    print(f"✓ Seeded {len(admissions)} admission entries")


def seed_facilities(db):
    """Seed facilities table"""
    facilities = [
        {"facility_name": "Central Library", "location": "Library Building, Near Main Gate", "timings": "8:00 AM - 10:00 PM (Mon-Sat), 9:00 AM - 6:00 PM (Sun)", "contact": "0863-2399999 ext. 1234", "description": "State-of-the-art library with over 1 lakh books, e-journals, and digital resources. Features reading halls, discussion rooms, and computer terminals."},
        {"facility_name": "Main Computer Lab", "location": "R&D Block, 1st Floor", "timings": "8:00 AM - 8:00 PM (Mon-Sat)", "contact": "0863-2399999 ext. 2001", "description": "High-performance computing lab with 200+ workstations, software development tools, and 24/7 internet access."},
        {"facility_name": "Sports Complex", "location": "Behind Academic Block", "timings": "6:00 AM - 9:00 PM", "contact": "0863-2399999 ext. 3001", "description": "Multi-sport complex with cricket ground, football field, basketball courts, tennis courts, and indoor badminton courts."},
        {"facility_name": "Gymnasium", "location": "Sports Complex, Ground Floor", "timings": "5:30 AM - 9:00 PM", "contact": "0863-2399999 ext. 3002", "description": "Fully equipped gym with cardio machines, weight training, and certified trainers."},
        {"facility_name": "Swimming Pool", "location": "Sports Complex", "timings": "6:00 AM - 8:00 AM, 4:00 PM - 7:00 PM", "contact": "0863-2399999 ext. 3003", "description": "Olympic-size swimming pool with trained lifeguards and coaching available."},
        {"facility_name": "Boys Hostel", "location": "Hostel Zone, East Campus", "timings": "24/7", "contact": "0863-2399999 ext. 4001", "description": "AC and Non-AC rooms available with mess facility, WiFi, laundry, and 24/7 security."},
        {"facility_name": "Girls Hostel", "location": "Hostel Zone, West Campus", "timings": "24/7", "contact": "0863-2399999 ext. 4002", "description": "Secure accommodation with AC and Non-AC rooms, mess, WiFi, and female wardens."},
        {"facility_name": "University Health Center", "location": "Near Admin Block", "timings": "8:00 AM - 8:00 PM (OPD), 24/7 (Emergency)", "contact": "0863-2399999 ext. 5001", "description": "Full-fledged health center with qualified doctors, nurses, pharmacy, and ambulance service."},
        {"facility_name": "Cafeteria - Main", "location": "Central Campus", "timings": "7:00 AM - 10:00 PM", "contact": "0863-2399999 ext. 6001", "description": "Multi-cuisine food court with vegetarian and non-vegetarian options, bakery, and juice corner."},
        {"facility_name": "Cafeteria - Food Street", "location": "Near Library", "timings": "8:00 AM - 9:00 PM", "contact": "0863-2399999 ext. 6002", "description": "Quick bites, snacks, and beverages. Popular hangout spot for students."},
        {"facility_name": "ATM Services", "location": "Admin Block Ground Floor", "timings": "24/7", "contact": "N/A", "description": "ATMs of SBI, HDFC, ICICI, and Axis Bank available on campus."},
        {"facility_name": "Wi-Fi Campus", "location": "Entire Campus", "timings": "24/7", "contact": "0863-2399999 ext. 7001", "description": "High-speed WiFi (1 Gbps backbone) available across campus for students and staff."},
        {"facility_name": "Placement Cell", "location": "Admin Block, 2nd Floor", "timings": "9:00 AM - 5:00 PM (Mon-Fri)", "contact": "0863-2399999 ext. 8001", "description": "Career guidance, resume building, interview preparation, and campus recruitment coordination."},
        {"facility_name": "Innovation & Incubation Center", "location": "R&D Block, 5th Floor", "timings": "9:00 AM - 6:00 PM (Mon-Sat)", "contact": "0863-2399999 ext. 9001", "description": "Startup incubation, mentorship, funding support, and collaboration with industry partners."},
        {"facility_name": "Auditorium", "location": "Central Campus", "timings": "As per event schedule", "contact": "0863-2399999 ext. 1001", "description": "1500-seater air-conditioned auditorium with state-of-the-art audio-visual equipment for seminars and cultural events."},
    ]
    
    for facility_data in facilities:
        facility = Facility(**facility_data)
        db.add(facility)
    db.commit()
    print(f"✓ Seeded {len(facilities)} facilities")


def main():
    """Main seeding function"""
    print("\n🌱 Seeding KL University Database...\n")
    
    # Create all tables
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created\n")
    
    # Create session
    db = SessionLocal()
    
    try:
        # Check if already seeded
        if db.query(Department).count() > 0:
            print("⚠ Database already has data. Skipping seed.")
            print("  To re-seed, delete the college.db file and run again.\n")
            return
        
        # Seed all tables
        seed_departments(db)
        seed_faculty(db)
        seed_students(db)
        seed_courses(db)
        seed_events(db)
        seed_admissions(db)
        seed_facilities(db)
        
        print("\n✅ Database seeding complete!")
        print(f"   Database location: {engine.url}\n")
        
    except Exception as e:
        print(f"\n❌ Error during seeding: {e}")
        db.rollback()
        raise
    
    finally:
        db.close()


if __name__ == "__main__":
    main()
