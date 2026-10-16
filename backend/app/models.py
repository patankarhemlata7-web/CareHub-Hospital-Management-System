from sqlalchemy import Column, Integer, String, Text, DateTime
from .db import Base

class Admin(Base):
    __tablename__ = "his_admin"
    ad_id = Column(Integer, primary_key=True)
    ad_fname = Column(String(200))
    ad_lname = Column(String(200))
    ad_email = Column(String(200), unique=True)
    ad_pwd = Column(String(200))
    ad_dpic = Column(String(200))

class Doctor(Base):
    __tablename__ = "his_docs"
    doc_id = Column(Integer, primary_key=True)
    doc_fname = Column(String(200))
    doc_lname = Column(String(200))
    doc_email = Column(String(200))
    doc_pwd = Column(String(200))
    doc_dept = Column(String(200))
    doc_number = Column(String(200))
    doc_dpic = Column(String(200))

class Patient(Base):
    __tablename__ = "his_patients"
    pat_id = Column(Integer, primary_key=True)
    pat_fname = Column(String(200))
    pat_lname = Column(String(200))
    pat_dob = Column(String(200))
    pat_age = Column(String(200))
    pat_number = Column(String(200))
    pat_addr = Column(String(200))
    pat_phone = Column(String(200))
    pat_type = Column(String(200))
    pat_date_joined = Column(DateTime)
    pat_ailment = Column(String(200))
    pat_discharge_status = Column(String(200))

class MedicalRecord(Base):
    __tablename__ = "his_medical_records"
    mdr_id = Column(Integer, primary_key=True)
    mdr_number = Column(String(200))
    mdr_pat_name = Column(String(200))
    mdr_pat_adr = Column(String(200))
    mdr_pat_age = Column(String(200))
    mdr_pat_ailment = Column(String(200))
    mdr_pat_number = Column(String(200))
    mdr_pat_prescr = Column(Text)
    mdr_date_rec = Column(DateTime)

class Laboratory(Base):
    __tablename__ = "his_laboratory"
    lab_id = Column(Integer, primary_key=True)
    lab_pat_name = Column(String(200))
    lab_pat_ailment = Column(String(200))
    lab_pat_number = Column(String(200))
    lab_pat_tests = Column(Text)
    lab_pat_results = Column(Text)
    lab_number = Column(String(200))
    lab_date_rec = Column(DateTime)
