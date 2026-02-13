"""
SQLAlchemy ORM models for the college database
"""
from sqlalchemy import Column, Integer, String, Float, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class Student(Base):
    """Student model"""
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)
    section = Column(String(10), nullable=False)
    cgpa = Column(Float, nullable=True)
    phone = Column(String(15), nullable=True)
    enrollment_date = Column(Date, nullable=True)
    
    def __repr__(self):
        return f"<Student(student_id='{self.student_id}', name='{self.name}')>"


class Faculty(Base):
    """Faculty model"""
    __tablename__ = "faculty"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    faculty_id = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    designation = Column(String(50), nullable=False)
    specialization = Column(String(200), nullable=True)
    phone = Column(String(15), nullable=True)
    
    # Relationship with courses
    courses = relationship("Course", back_populates="faculty_member")
    
    def __repr__(self):
        return f"<Faculty(faculty_id='{self.faculty_id}', name='{self.name}')>"


class Course(Base):
    """Course model"""
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    course_code = Column(String(20), unique=True, nullable=False, index=True)
    course_name = Column(String(200), nullable=False)
    department = Column(String(100), nullable=False)
    credits = Column(Integer, nullable=False)
    semester = Column(Integer, nullable=False)
    faculty_id = Column(String(20), ForeignKey("faculty.faculty_id"), nullable=True)
    description = Column(Text, nullable=True)
    
    # Relationship with faculty
    faculty_member = relationship("Faculty", back_populates="courses")
    
    def __repr__(self):
        return f"<Course(course_code='{self.course_code}', name='{self.course_name}')>"


class Event(Base):
    """Event model"""
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    event_name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    event_date = Column(Date, nullable=False)
    venue = Column(String(200), nullable=False)
    organizer = Column(String(100), nullable=True)
    event_type = Column(String(50), nullable=False)  # Technical, Cultural, Sports, Seminar
    
    def __repr__(self):
        return f"<Event(name='{self.event_name}', date='{self.event_date}')>"


class Department(Base):
    """Department model"""
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    dept_code = Column(String(20), unique=True, nullable=False, index=True)
    dept_name = Column(String(100), nullable=False)
    hod_name = Column(String(100), nullable=True)
    total_faculty = Column(Integer, nullable=True)
    total_students = Column(Integer, nullable=True)
    building = Column(String(50), nullable=True)
    floor = Column(String(20), nullable=True)
    
    def __repr__(self):
        return f"<Department(code='{self.dept_code}', name='{self.dept_name}')>"


class Admission(Base):
    """Admission model"""
    __tablename__ = "admissions"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    program = Column(String(100), nullable=False)  # B.Tech, M.Tech, MBA, Ph.D.
    department = Column(String(100), nullable=False)
    total_seats = Column(Integer, nullable=False)
    available_seats = Column(Integer, nullable=False)
    last_date = Column(Date, nullable=True)
    eligibility = Column(Text, nullable=True)
    fee_per_semester = Column(Float, nullable=True)
    
    def __repr__(self):
        return f"<Admission(program='{self.program}', department='{self.department}')>"


class Facility(Base):
    """Facility model"""
    __tablename__ = "facilities"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    facility_name = Column(String(100), nullable=False)
    location = Column(String(200), nullable=True)
    timings = Column(String(100), nullable=True)
    contact = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    
    def __repr__(self):
        return f"<Facility(name='{self.facility_name}')>"
