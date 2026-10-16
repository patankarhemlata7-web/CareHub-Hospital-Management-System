import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

import {
  BrowserRouter,
  useNavigate,
  useLocation
} from "react-router-dom";

import axios from "axios";

import {
  LayoutDashboard,
  Users,
  Stethoscope,
  FileHeart,
  FlaskConical,
  LogOut,
  Plus,
  Search,
  Activity,
  Menu,
  ChevronRight,
  Eye,
  X
} from "lucide-react";

import "./styles.css";


// =====================================================
// API
// =====================================================

const API = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API
});


// =====================================================
// JWT TOKEN
// =====================================================

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;

});


// =====================================================
// LOGIN
// =====================================================

function Login() {

  const [role, setRole] = useState("admin");

  const [id, setId] = useState("");

  const [pw, setPw] = useState("");

  const [err, setErr] = useState("");

  const [loading, setLoading] = useState(false);


  const submit = async (e) => {

    e.preventDefault();

    setErr("");

    setLoading(true);

    try {

      const response = await api.post(
        "/auth/login",
        {
          email_or_id: id,
          password: pw,
          role: role
        }
      );

      console.log(
        "Login response:",
        response.data
      );


      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "name",
        response.data.name || "User"
      );

      localStorage.setItem(
        "role",
        response.data.role || role
      );


      window.location.href = "/dashboard";

    }

    catch (error) {

      console.error(
        "Login error:",
        error
      );

      setErr(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Login failed"
      );

    }

    finally {

      setLoading(false);

    }

  };


  return (

    <div className="login">

      <div className="login-card">

        <div className="brand-mark">
          +
        </div>


        <h1>
          Care<span>Hub</span>
        </h1>


        <p>
          Hospital Management System
        </p>


        {/* ROLE */}

        <div className="tabs">

          <button
            type="button"
            className={
              role === "admin"
                ? "active"
                : ""
            }
            onClick={() => {

              setRole("admin");

              setId("");

              setErr("");

            }}
          >
            Admin
          </button>


          <button
            type="button"
            className={
              role === "doctor"
                ? "active"
                : ""
            }
            onClick={() => {

              setRole("doctor");

              setId("");

              setErr("");

            }}
          >
            Doctor
          </button>

        </div>


        {/* FORM */}

        <form onSubmit={submit}>

          <label>

            {role === "admin"
              ? "Email"
              : "Doctor ID"}

          </label>


          <input
            value={id}
            onChange={(e) =>
              setId(e.target.value)
            }
            placeholder={
              role === "admin"
                ? "admin@mail.com"
                : "YDS7L"
            }
            required
          />


          <label>
            Password
          </label>


          <input
            type="password"
            value={pw}
            onChange={(e) =>
              setPw(e.target.value)
            }
            placeholder="Enter password"
            required
          />


          {err && (

            <div className="error">
              {err}
            </div>

          )}


          <button
            type="submit"
            className="primary full"
            disabled={loading}
          >

            {loading
              ? "Signing In..."
              : "Sign In"}

          </button>

        </form>


        <small>
          Modern React + Python API
        </small>

      </div>

    </div>

  );

}


// =====================================================
// NAVIGATION
// =====================================================

const navItems = [

  [
    "/dashboard",
    "Dashboard",
    LayoutDashboard
  ],

  [
    "/patients",
    "Patients",
    Users
  ],

  [
    "/doctors",
    "Doctors",
    Stethoscope
  ],

  [
    "/records",
    "Medical Records",
    FileHeart
  ],

  [
    "/laboratory",
    "Laboratory",
    FlaskConical
  ]

];


// =====================================================
// SHELL
// =====================================================

function Shell({ children }) {

  const navigate = useNavigate();

  const location = useLocation();

  const [open, setOpen] = useState(true);


  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("name");

    localStorage.removeItem("role");

    window.location.href = "/";

  };


  const getPageName = () => {

    if (location.pathname === "/dashboard") {
      return "Dashboard";
    }

    if (location.pathname === "/patients") {
      return "Patients";
    }

    if (location.pathname === "/doctors") {
      return "Doctors";
    }

    if (location.pathname === "/records") {
      return "Medical Records";
    }

    if (location.pathname === "/laboratory") {
      return "Laboratory";
    }

    return "Dashboard";

  };


  const pageName = getPageName();


  const userName =
    localStorage.getItem("name") ||
    "System Administrator";


  const role =
    localStorage.getItem("role") ||
    "admin";


  return (

    <div className="app">

      {/* SIDEBAR */}

      <aside
        className={
          open
            ? "sidebar"
            : "sidebar collapsed"
        }
      >

        {/* LOGO */}

        <div className="logo">

          <div>
            +
          </div>


          {open && (

            <b>
              Care<span>Hub</span>
            </b>

          )}

        </div>


        {/* MENU */}

        <button
          className="menu"
          onClick={() =>
            setOpen(!open)
          }
        >

          <Menu size={20} />

        </button>


        {/* NAVIGATION */}

        <nav>

          {navItems.map(
            ([path, name, Icon]) => (

              <button
                key={path}
                className={
                  location.pathname === path
                    ? "nav active"
                    : "nav"
                }
                onClick={() =>
                  navigate(path)
                }
              >

                <Icon size={19} />

                {open && (

                  <span>
                    {name}
                  </span>

                )}

              </button>

            )
          )}

        </nav>


        {/* LOGOUT */}

        <button
          className="nav logout"
          onClick={logout}
        >

          <LogOut size={19} />

          {open && (

            <span>
              Logout
            </span>

          )}

        </button>

      </aside>


      {/* MAIN */}

      <main className="main">

        {/* HEADER */}

        <header>

          <div>

            <div className="crumb">

              Hospital /{" "}

              <b>
                {pageName}
              </b>

            </div>


            <h2>
              {pageName}
            </h2>

          </div>


          {/* USER */}

          <div className="user">

            <div className="avatar">

              {userName
                .charAt(0)
                .toUpperCase()}

            </div>


            <div>

              <b>
                {userName}
              </b>

              <small>
                {role}
              </small>

            </div>

          </div>

        </header>


        {children}

      </main>

    </div>

  );

}


// =====================================================
// DASHBOARD
// =====================================================

function Dashboard() {

  const [data, setData] = useState(null);

  const [error, setError] = useState("");


  useEffect(() => {

    api
      .get("/dashboard")

      .then((response) => {

        console.log(
          "Dashboard:",
          response.data
        );

        setData(response.data);

      })

      .catch((error) => {

        console.error(
          "Dashboard error:",
          error
        );

        setError(
          error.response?.data?.detail ||
          "Unable to load dashboard"
        );

      });

  }, []);


  const cards = data
    ? [

        [
          "Patients",
          data.patients ?? 0,
          Users
        ],

        [
          "Doctors",
          data.doctors ?? 0,
          Stethoscope
        ],

        [
          "Medical Records",
          data.medical_records ?? 0,
          FileHeart
        ],

        [
          "Lab Reports",
          data.lab_reports ?? 0,
          FlaskConical
        ]

      ]
    : [];


  return (

    <>

      {/* WELCOME */}

      <div className="welcome">

        <div>

          <h3>

            Welcome back,{" "}

            {(
              localStorage.getItem("name") ||
              "Admin"
            ).split(" ")[0]}

            {" "}👋

          </h3>


          <p>
            Here is today's hospital overview.
          </p>

        </div>


        <button
          className="primary"
          onClick={() =>
            window.location.href =
              "/patients"
          }
        >

          View Patients

          <ChevronRight size={17} />

        </button>

      </div>


      {/* ERROR */}

      {error && (

        <div className="error">
          {error}
        </div>

      )}


      {/* CARDS */}

      <div className="cards">

        {cards.length > 0 ? (

          cards.map(
            ([name, value, Icon]) => (

              <div
                className="card"
                key={name}
              >

                <div className="icon">

                  <Icon size={22} />

                </div>


                <div>

                  <span>
                    {name}
                  </span>

                  <strong>
                    {value}
                  </strong>

                  <small>
                    Live database count
                  </small>

                </div>

              </div>

            )
          )

        ) : (

          <div className="panel">
            Loading dashboard...
          </div>

        )}

      </div>


      {/* OPERATIONS */}

      <div className="panel">

        <div className="panel-title">

          <div>

            <h3>
              Hospital Operations
            </h3>

            <p>
              Core modules connected to the Python API
            </p>

          </div>


          <Activity size={24} />

        </div>


        <div className="module-grid">

          {[
            "Patient Management",
            "Doctor Management",
            "Medical Records",
            "Laboratory",
            "Pharmacy",
            "Equipment"
          ].map((item) => (

            <div
              className="module"
              key={item}
            >

              <div className="dot"></div>

              <b>
                {item}
              </b>

              <span>
                Available
              </span>

            </div>

          ))}

        </div>

      </div>

    </>

  );

}


// =====================================================
// PATIENTS
// =====================================================

function Patients() {

  const [rows, setRows] = useState([]);

  const [search, setSearch] = useState("");

  const [show, setShow] = useState(false);


  const [form, setForm] = useState({

    first_name: "",

    last_name: "",

    age: "",

    phone: "",

    address: "",

    ailment: "",

    patient_type: "Outpatient"

  });


  const loadPatients = () => {

    api
      .get("/patients", {
        params: {
          search: search
        }
      })

      .then((response) => {

        setRows(response.data);

      })

      .catch((error) => {

        console.error(
          "Patients error:",
          error
        );

      });

  };


  useEffect(() => {

    loadPatients();

  }, []);


  const addPatient = async (e) => {

    e.preventDefault();

    try {

      await api.post(
        "/patients",
        form
      );


      setShow(false);


      setForm({

        first_name: "",

        last_name: "",

        age: "",

        phone: "",

        address: "",

        ailment: "",

        patient_type: "Outpatient"

      });


      loadPatients();

    }

    catch (error) {

      alert(
        error.response?.data?.detail ||
        "Unable to add patient"
      );

    }

  };


  return (

    <>

      {/* TOOLBAR */}

      <div className="toolbar">

        <div className="search">

          <Search size={18} />

          <input
            placeholder="Search patients..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {
                loadPatients();
              }

            }}
          />

        </div>


        <button
          className="primary"
          onClick={() =>
            setShow(true)
          }
        >

          <Plus size={17} />

          Add Patient

        </button>

      </div>


      {/* TABLE */}

      <div className="panel table-panel">

        <table>

          <thead>

            <tr>

              <th>
                Patient
              </th>

              <th>
                Patient No.
              </th>

              <th>
                Age
              </th>

              <th>
                Phone
              </th>

              <th>
                Ailment
              </th>

              <th>
                Type
              </th>

              <th>
                Status
              </th>

            </tr>

          </thead>


          <tbody>

            {rows.map((patient) => (

              <tr key={patient.id}>

                <td>
                  <b>
                    {patient.name}
                  </b>
                </td>

                <td>
                  {patient.number || "-"}
                </td>

                <td>
                  {patient.age || "-"}
                </td>

                <td>
                  {patient.phone || "-"}
                </td>

                <td>
                  {patient.ailment || "-"}
                </td>

                <td>
                  {patient.type || "-"}
                </td>

                <td>

                  <span className="badge">
                    {patient.status ||
                      "Active"}
                  </span>

                </td>

              </tr>

            ))}


            {rows.length === 0 && (

              <tr>

                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "30px"
                  }}
                >

                  No patients found

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>


      {/* ADD PATIENT MODAL */}

      {show && (

        <div className="modal">

          <form
            className="modal-card"
            onSubmit={addPatient}
          >

            <div className="modal-head">

              <h3>
                Add Patient
              </h3>


              <button
                type="button"
                onClick={() =>
                  setShow(false)
                }
              >

                <X size={20} />

              </button>

            </div>


            <input
              required
              placeholder="First Name"
              value={form.first_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  first_name: e.target.value
                })
              }
            />


            <input
              required
              placeholder="Last Name"
              value={form.last_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  last_name: e.target.value
                })
              }
            />


            <input
              placeholder="Age"
              value={form.age}
              onChange={(e) =>
                setForm({
                  ...form,
                  age: e.target.value
                })
              }
            />


            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value
                })
              }
            />


            <input
              placeholder="Address"
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value
                })
              }
            />


            <input
              placeholder="Ailment"
              value={form.ailment}
              onChange={(e) =>
                setForm({
                  ...form,
                  ailment: e.target.value
                })
              }
            />


            <select
              value={form.patient_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  patient_type: e.target.value
                })
              }
            >

              <option value="Outpatient">
                Outpatient
              </option>

              <option value="Inpatient">
                Inpatient
              </option>

            </select>


            <button
              className="primary full"
              type="submit"
            >

              Save Patient

            </button>

          </form>

        </div>

      )}

    </>

  );

}


// =====================================================
// DOCTORS
// =====================================================

function Doctors() {

  const [rows, setRows] = useState([]);


  useEffect(() => {

    api
      .get("/doctors")

      .then((response) => {

        setRows(response.data);

      })

      .catch((error) => {

        console.error(
          "Doctors error:",
          error
        );

      });

  }, []);


  return (

    <div className="panel table-panel">

      <table>

        <thead>

          <tr>

            <th>
              Doctor
            </th>

            <th>
              Doctor ID
            </th>

            <th>
              Email
            </th>

            <th>
              Department
            </th>

          </tr>

        </thead>


        <tbody>

          {rows.map((doctor) => (

            <tr key={doctor.id}>

              <td>
                <b>
                  {doctor.name}
                </b>
              </td>

              <td>
                {doctor.number || "-"}
              </td>

              <td>
                {doctor.email || "-"}
              </td>

              <td>

                <span className="badge">
                  {doctor.department ||
                    "General"}
                </span>

              </td>

            </tr>

          ))}


          {rows.length === 0 && (

            <tr>

              <td
                colSpan="4"
                style={{
                  textAlign: "center",
                  padding: "30px"
                }}
              >

                No doctors found

              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>

  );

}


// =====================================================
// PRESCRIPTION PREVIEW
// =====================================================

function PrescriptionPreview({ html }) {

  if (!html) {
    return "-";
  }


  const temp =
    document.createElement("div");


  temp.innerHTML = html;


  const text =
    temp.textContent ||
    temp.innerText ||
    "";


  return (

    <div className="prescription-preview">

      {text}

    </div>

  );

}


// =====================================================
// FULL PRESCRIPTION
// =====================================================

function Prescription({ html }) {

  if (!html) {
    return "-";
  }


  return (

    <div
      className="prescription"
      dangerouslySetInnerHTML={{
        __html: html
      }}
    />

  );

}


// =====================================================
// MEDICAL RECORDS
// =====================================================

function MedicalRecords() {

  const [rows, setRows] = useState([]);

  const [selected, setSelected] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  const loadRecords = () => {

    setLoading(true);


    api
      .get("/records")

      .then((response) => {

        console.log(
          "Medical Records:",
          response.data
        );

        setRows(response.data);

      })

      .catch((error) => {

        console.error(
          "Medical Records error:",
          error
        );

      })

      .finally(() => {

        setLoading(false);

      });

  };


  useEffect(() => {

    loadRecords();

  }, []);


  return (

    <>

      {/* TOOLBAR */}

      <div className="toolbar">

        <div>

          <h3>
            Medical Records
          </h3>

          <p>
            Patient medical history and prescriptions
          </p>

        </div>


        <button className="primary">

          <Plus size={17} />

          Add Medical Record

        </button>

      </div>


      {/* TABLE */}

      <div className="panel table-panel">

        <table>

          <thead>

            <tr>

              <th>
                Record No.
              </th>

              <th>
                Patient
              </th>

              <th>
                Patient No.
              </th>

              <th>
                Age
              </th>

              <th>
                Ailment
              </th>

              <th>
                Prescription
              </th>

              <th>
                Date
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {loading && (

              <tr>

                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "30px"
                  }}
                >

                  Loading medical records...

                </td>

              </tr>

            )}


            {!loading &&
              rows.map((record) => (

                <tr key={record.id}>

                  <td>

                    <b>
                      {record.number || "-"}
                    </b>

                  </td>


                  <td>
                    {record.patient_name || "-"}
                  </td>


                  <td>
                    {record.patient_number || "-"}
                  </td>


                  <td>
                    {record.age || "-"}
                  </td>


                  <td>
                    {record.ailment || "-"}
                  </td>


                  <td>

                    <PrescriptionPreview
                      html={record.prescription}
                    />

                  </td>


                  <td>
                    {record.date || "-"}
                  </td>


                  <td>

                    <button
                      className="view-btn"
                      onClick={() =>
                        setSelected(record)
                      }
                    >

                      <Eye size={15} />

                      View

                    </button>

                  </td>

                </tr>

              ))}


            {!loading &&
              rows.length === 0 && (

                <tr>

                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "30px"
                    }}
                  >

                    No medical records found

                  </td>

                </tr>

              )}

          </tbody>

        </table>

      </div>


      {/* VIEW MODAL */}

      {selected && (

        <div className="modal">

          <div className="modal-card record-modal">

            <div className="modal-head">

              <h3>
                Medical Record
              </h3>


              <button
                onClick={() =>
                  setSelected(null)
                }
              >

                <X size={20} />

              </button>

            </div>


            <div className="detail-grid">

              <div>

                <span>
                  Record No.
                </span>

                <b>
                  {selected.number || "-"}
                </b>

              </div>


              <div>

                <span>
                  Patient
                </span>

                <b>
                  {selected.patient_name || "-"}
                </b>

              </div>


              <div>

                <span>
                  Patient No.
                </span>

                <b>
                  {selected.patient_number || "-"}
                </b>

              </div>


              <div>

                <span>
                  Age
                </span>

                <b>
                  {selected.age || "-"}
                </b>

              </div>


              <div>

                <span>
                  Ailment
                </span>

                <b>
                  {selected.ailment || "-"}
                </b>

              </div>


              <div>

                <span>
                  Date
                </span>

                <b>
                  {selected.date || "-"}
                </b>

              </div>

            </div>


            <h4>
              Prescription
            </h4>


            <Prescription
              html={selected.prescription}
            />


            <button
              className="primary full"
              onClick={() =>
                setSelected(null)
              }
            >

              Close

            </button>

          </div>

        </div>

      )}

    </>

  );

}


// =====================================================
// LABORATORY PREVIEW
// =====================================================

function LaboratoryPreview({ html }) {

  if (!html) {
    return "-";
  }


  const temp =
    document.createElement("div");


  temp.innerHTML = html;


  const text =
    temp.textContent ||
    temp.innerText ||
    "";


  return (

    <div className="lab-preview">

      {text}

    </div>

  );

}


// =====================================================
// FULL LABORATORY HTML
// =====================================================

function LaboratoryContent({ html }) {

  if (!html) {
    return "-";
  }


  return (

    <div
      className="lab-content"
      dangerouslySetInnerHTML={{
        __html: html
      }}
    />

  );

}


// =====================================================
// LABORATORY
// =====================================================

function Laboratory() {

  const [rows, setRows] = useState([]);

  const [selected, setSelected] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  const loadLaboratory = () => {

    setLoading(true);


    api
      .get("/laboratory")

      .then((response) => {

        console.log(
          "Laboratory:",
          response.data
        );

        setRows(response.data);

      })

      .catch((error) => {

        console.error(
          "Laboratory error:",
          error
        );

      })

      .finally(() => {

        setLoading(false);

      });

  };


  useEffect(() => {

    loadLaboratory();

  }, []);


  return (

    <>

      {/* TOOLBAR */}

      <div className="toolbar">

        <div>

          <h3>
            Laboratory
          </h3>

          <p>
            Laboratory tests and results
          </p>

        </div>


        <button className="primary">

          <Plus size={17} />

          Add Lab Report

        </button>

      </div>


      {/* TABLE */}

      <div className="panel table-panel">

        <table className="lab-table">

          <thead>

            <tr>

              <th>
                Lab No.
              </th>

              <th>
                Patient
              </th>

              <th>
                Patient No.
              </th>

              <th>
                Ailment
              </th>

              <th>
                Tests
              </th>

              <th>
                Results
              </th>

              <th>
                Date
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {loading && (

              <tr>

                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "30px"
                  }}
                >

                  Loading laboratory records...

                </td>

              </tr>

            )}


            {!loading &&
              rows.map((lab) => (

                <tr key={lab.id}>

                  <td>

                    <b>
                      {lab.lab_number || "-"}
                    </b>

                  </td>


                  <td>
                    {lab.patient_name || "-"}
                  </td>


                  <td>
                    {lab.patient_number || "-"}
                  </td>


                  <td>
                    {lab.ailment || "-"}
                  </td>


                  <td>

                    <LaboratoryPreview
                      html={lab.tests}
                    />

                  </td>


                  <td>

                    <LaboratoryPreview
                      html={lab.results}
                    />

                  </td>


                  <td>

                    {lab.date
                      ? new Date(
                          lab.date
                        ).toLocaleDateString()
                      : "-"}

                  </td>


                  <td>

                    <button
                      className="view-btn"
                      onClick={() =>
                        setSelected(lab)
                      }
                    >

                      <Eye size={15} />

                      View

                    </button>

                  </td>

                </tr>

              ))}


            {!loading &&
              rows.length === 0 && (

                <tr>

                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "30px"
                    }}
                  >

                    No laboratory records found

                  </td>

                </tr>

              )}

          </tbody>

        </table>

      </div>


      {/* LAB VIEW MODAL */}

      {selected && (

        <div className="modal">

          <div className="modal-card record-modal">

            <div className="modal-head">

              <h3>
                Laboratory Report
              </h3>


              <button
                onClick={() =>
                  setSelected(null)
                }
              >

                <X size={20} />

              </button>

            </div>


            <div className="detail-grid">

              <div>

                <span>
                  Lab No.
                </span>

                <b>
                  {selected.lab_number || "-"}
                </b>

              </div>


              <div>

                <span>
                  Patient
                </span>

                <b>
                  {selected.patient_name || "-"}
                </b>

              </div>


              <div>

                <span>
                  Patient No.
                </span>

                <b>
                  {selected.patient_number || "-"}
                </b>

              </div>


              <div>

                <span>
                  Ailment
                </span>

                <b>
                  {selected.ailment || "-"}
                </b>

              </div>


              <div>

                <span>
                  Date
                </span>

                <b>
                  {selected.date
                    ? new Date(
                        selected.date
                      ).toLocaleDateString()
                    : "-"}
                </b>

              </div>

            </div>


            <h4>
              Tests
            </h4>


            <LaboratoryContent
              html={selected.tests}
            />


            <h4>
              Results
            </h4>


            <LaboratoryContent
              html={selected.results}
            />


            <button
              className="primary full"
              onClick={() =>
                setSelected(null)
              }
            >

              Close

            </button>

          </div>

        </div>

      )}

    </>

  );

}


// =====================================================
// APP
// =====================================================

function App() {

  const location = useLocation();


  const [auth, setAuth] = useState(
    !!localStorage.getItem("token")
  );


  useEffect(() => {

    const checkAuth = () => {

      setAuth(
        !!localStorage.getItem("token")
      );

    };


    window.addEventListener(
      "storage",
      checkAuth
    );


    return () => {

      window.removeEventListener(
        "storage",
        checkAuth
      );

    };

  }, []);


  // LOGIN PAGE

  if (
    location.pathname === "/" ||
    location.pathname === "/login"
  ) {

    return <Login />;

  }


  // AUTH CHECK

  if (!auth) {

    return <Login />;

  }


  // APPLICATION

  return (

    <Shell>

      {location.pathname === "/dashboard" && (

        <Dashboard />

      )}


      {location.pathname === "/patients" && (

        <Patients />

      )}


      {location.pathname === "/doctors" && (

        <Doctors />

      )}


      {location.pathname === "/records" && (

        <MedicalRecords />

      )}


      {location.pathname === "/laboratory" && (

        <Laboratory />

      )}


      {![
        "/dashboard",
        "/patients",
        "/doctors",
        "/records",
        "/laboratory"
      ].includes(location.pathname) && (

        <Dashboard />

      )}

    </Shell>

  );

}


// =====================================================
// ROOT
// =====================================================

createRoot(
  document.getElementById("root")
).render(

  <BrowserRouter>

    <App />

  </BrowserRouter>

);