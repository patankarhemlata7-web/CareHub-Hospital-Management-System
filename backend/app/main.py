from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
import secrets

from .db import get_db
from .models import (
    Admin,
    Doctor,
    Patient,
    MedicalRecord,
    Laboratory
)
from .auth import (
    legacy_sha1,
    create_token,
    current_user
)


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="Hospital Management API",
    version="2.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# =========================================================
# REQUEST MODELS
# =========================================================

class LoginRequest(BaseModel):
    email_or_id: str
    password: str
    role: str = "admin"


class PatientIn(BaseModel):
    first_name: str
    last_name: str
    age: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    ailment: Optional[str] = None
    patient_type: Optional[str] = "Outpatient"


class MedicalRecordIn(BaseModel):
    patient_name: str
    patient_address: Optional[str] = None
    patient_age: Optional[str] = None
    patient_ailment: Optional[str] = None
    patient_number: Optional[str] = None
    prescription: Optional[str] = None


class LaboratoryIn(BaseModel):
    patient_name: str
    patient_ailment: Optional[str] = None
    patient_number: Optional[str] = None
    tests: str
    results: Optional[str] = None


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():
    return {
        "message": "Hospital Management API v2 is running"
    }


# =========================================================
# LOGIN
# =========================================================

@app.post("/api/auth/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    try:

        hashed = legacy_sha1(data.password)

        # =================================================
        # DOCTOR LOGIN
        # =================================================

        if data.role.lower() == "doctor":

            user = (
                db.query(Doctor)
                .filter(
                    Doctor.doc_number == data.email_or_id
                )
                .first()
            )

            if not user or user.doc_pwd != hashed:

                raise HTTPException(
                    status_code=401,
                    detail="Invalid doctor ID or password"
                )

            return {
                "token": create_token(
                    str(user.doc_id),
                    "doctor"
                ),

                "role": "doctor",

                "name": (
                    f"{user.doc_fname or ''} "
                    f"{user.doc_lname or ''}"
                ).strip()
            }

        # =================================================
        # ADMIN LOGIN
        # =================================================

        user = (
            db.query(Admin)
            .filter(
                Admin.ad_email == data.email_or_id
            )
            .first()
        )

        if not user or user.ad_pwd != hashed:

            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        return {
            "token": create_token(
                str(user.ad_id),
                "admin"
            ),

            "role": "admin",

            "name": (
                f"{user.ad_fname or ''} "
                f"{user.ad_lname or ''}"
            ).strip()
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "LOGIN ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=f"Login error: {str(e)}"
        )


# =========================================================
# DASHBOARD
# =========================================================

@app.get("/api/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    user=Depends(current_user)
):

    patients_count = (
        db.query(
            func.count(Patient.pat_id)
        ).scalar()
        or 0
    )

    doctors_count = (
        db.query(
            func.count(Doctor.doc_id)
        ).scalar()
        or 0
    )

    medical_records_count = (
        db.query(
            func.count(MedicalRecord.mdr_id)
        ).scalar()
        or 0
    )

    lab_reports_count = (
        db.query(
            func.count(Laboratory.lab_id)
        ).scalar()
        or 0
    )

    return {
        "patients": patients_count,
        "doctors": doctors_count,
        "medical_records": medical_records_count,
        "lab_reports": lab_reports_count
    }


# =========================================================
# GET PATIENTS
# =========================================================

@app.get("/api/patients")
def patients(
    search: str = "",
    db: Session = Depends(get_db),
    user=Depends(current_user)
):

    q = db.query(Patient)

    # =====================================================
    # SEARCH
    # =====================================================

    if search:

        term = f"%{search}%"

        q = q.filter(
            or_(
                Patient.pat_fname.like(term),
                Patient.pat_lname.like(term),
                Patient.pat_number.like(term),
                Patient.pat_phone.like(term)
            )
        )

    # =====================================================
    # FETCH DATA
    # =====================================================

    rows = (
        q.order_by(
            Patient.pat_id.desc()
        )
        .limit(200)
        .all()
    )

    # =====================================================
    # RESPONSE
    # =====================================================

    return [

        {
            "id": x.pat_id,

            "name": (
                f"{x.pat_fname or ''} "
                f"{x.pat_lname or ''}"
            ).strip(),

            "number": x.pat_number,

            "age": x.pat_age,

            "phone": x.pat_phone,

            "ailment": x.pat_ailment,

            "type": x.pat_type,

            "status": x.pat_discharge_status
        }

        for x in rows

    ]


# =========================================================
# ADD PATIENT
# =========================================================

@app.post("/api/patients")
def add_patient(
    data: PatientIn,
    db: Session = Depends(get_db),
    user=Depends(current_user)
):

    try:

        # =================================================
        # GENERATE UNIQUE PATIENT NUMBER
        # =================================================

        patient_number = secrets.token_hex(3).upper()

        # =================================================
        # CREATE PATIENT
        # =================================================

        row = Patient(

            pat_fname=data.first_name,

            pat_lname=data.last_name,

            pat_age=data.age,

            pat_phone=data.phone,

            pat_addr=data.address,

            pat_ailment=data.ailment,

            pat_type=(
                data.patient_type
                or "Outpatient"
            ),

            pat_date_joined=date.today(),

            pat_discharge_status="Active"
        )

        # =================================================
        # PATIENT NUMBER
        # =================================================

        row.pat_number = patient_number

        # =================================================
        # SAVE
        # =================================================

        db.add(row)

        db.commit()

        db.refresh(row)

        print(
            "PATIENT ADDED:",
            row.pat_id,
            "-",
            row.pat_fname,
            row.pat_lname
        )

        # =================================================
        # RESPONSE
        # =================================================

        return {

            "success": True,

            "id": row.pat_id,

            "number": row.pat_number,

            "message": "Patient added successfully"
        }

    except Exception as e:

        db.rollback()

        print(
            "ADD PATIENT ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=f"Unable to add patient: {str(e)}"
        )


# =========================================================
# GET DOCTORS
# =========================================================

@app.get("/api/doctors")
def doctors(
    db: Session = Depends(get_db),
    user=Depends(current_user)
):

    try:

        rows = (
            db.query(Doctor)
            .order_by(
                Doctor.doc_id.desc()
            )
            .all()
        )

        return [

            {
                "id": x.doc_id,

                "name": (
                    f"{x.doc_fname or ''} "
                    f"{x.doc_lname or ''}"
                ).strip(),

                "email": x.doc_email,

                "department": x.doc_dept,

                "number": x.doc_number
            }

            for x in rows

        ]

    except Exception as e:

        print(
            "GET DOCTORS ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=f"Unable to fetch doctors: {str(e)}"
        )


# =========================================================
# GET MEDICAL RECORDS
# =========================================================

@app.get("/api/records")
def get_medical_records(
    db: Session = Depends(get_db),
    user=Depends(current_user)
):

    try:

        rows = (
            db.query(MedicalRecord)
            .order_by(
                MedicalRecord.mdr_id.desc()
            )
            .limit(200)
            .all()
        )

        return [

            {
                "id": x.mdr_id,

                "record_number": x.mdr_number,

                "patient_name": x.mdr_pat_name,

                "patient_address": x.mdr_pat_adr,

                "patient_age": x.mdr_pat_age,

                "ailment": x.mdr_pat_ailment,

                "patient_number": x.mdr_pat_number,

                "prescription": x.mdr_pat_prescr,

                "date": (
                    x.mdr_date_rec.isoformat()
                    if x.mdr_date_rec
                    else None
                )
            }

            for x in rows

        ]

    except Exception as e:

        print(
            "GET MEDICAL RECORDS ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to fetch medical records: "
                f"{str(e)}"
            )
        )


# =========================================================
# ADD MEDICAL RECORD
# =========================================================

@app.post("/api/records")
def add_medical_record(
    data: MedicalRecordIn,
    db: Session = Depends(get_db),
    user=Depends(current_user)
):

    try:

        # =================================================
        # GENERATE RECORD NUMBER
        # =================================================

        record_number = (
            "MR-" +
            secrets.token_hex(3).upper()
        )

        # =================================================
        # CREATE RECORD
        # =================================================

        row = MedicalRecord(

            mdr_number=record_number,

            mdr_pat_name=data.patient_name,

            mdr_pat_adr=data.patient_address,

            mdr_pat_age=data.patient_age,

            mdr_pat_ailment=data.patient_ailment,

            mdr_pat_number=data.patient_number,

            mdr_pat_prescr=data.prescription,

            mdr_date_rec=datetime.now()
        )

        # =================================================
        # SAVE
        # =================================================

        db.add(row)

        db.commit()

        db.refresh(row)

        print(
            "MEDICAL RECORD ADDED:",
            row.mdr_id,
            "-",
            row.mdr_pat_name
        )

        return {

            "success": True,

            "id": row.mdr_id,

            "record_number": row.mdr_number,

            "message": (
                "Medical record added successfully"
            )
        }

    except Exception as e:

        db.rollback()

        print(
            "ADD MEDICAL RECORD ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to add medical record: "
                f"{str(e)}"
            )
        )


# =========================================================
# GET LABORATORY RECORDS
# =========================================================

@app.get("/api/laboratory")
def get_laboratory_records(
    db: Session = Depends(get_db),
    user=Depends(current_user)
):

    try:

        rows = (
            db.query(Laboratory)
            .order_by(
                Laboratory.lab_id.desc()
            )
            .limit(200)
            .all()
        )

        return [

            {
                "id": x.lab_id,

                "patient_name": x.lab_pat_name,

                "ailment": x.lab_pat_ailment,

                "patient_number": x.lab_pat_number,

                "tests": x.lab_pat_tests,

                "results": x.lab_pat_results,

                "lab_number": x.lab_number,

                "date": (
                    x.lab_date_rec.isoformat()
                    if x.lab_date_rec
                    else None
                )
            }

            for x in rows

        ]

    except Exception as e:

        print(
            "GET LABORATORY ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to fetch laboratory "
                f"records: {str(e)}"
            )
        )


# =========================================================
# ADD LABORATORY RECORD
# =========================================================

@app.post("/api/laboratory")
def add_laboratory_record(
    data: LaboratoryIn,
    db: Session = Depends(get_db),
    user=Depends(current_user)
):

    try:

        # =================================================
        # GENERATE LAB NUMBER
        # =================================================

        lab_number = (
            "LAB-" +
            secrets.token_hex(3).upper()
        )

        # =================================================
        # CREATE LAB RECORD
        # =================================================

        row = Laboratory(

            lab_pat_name=data.patient_name,

            lab_pat_ailment=data.patient_ailment,

            lab_pat_number=data.patient_number,

            lab_pat_tests=data.tests,

            lab_pat_results=data.results,

            lab_number=lab_number,

            lab_date_rec=datetime.now()
        )

        # =================================================
        # SAVE
        # =================================================

        db.add(row)

        db.commit()

        db.refresh(row)

        print(
            "LABORATORY RECORD ADDED:",
            row.lab_id,
            "-",
            row.lab_pat_name
        )

        return {

            "success": True,

            "id": row.lab_id,

            "lab_number": row.lab_number,

            "message": (
                "Laboratory record added successfully"
            )
        }

    except Exception as e:

        db.rollback()

        print(
            "ADD LABORATORY ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to add laboratory record: "
                f"{str(e)}"
            )
        )