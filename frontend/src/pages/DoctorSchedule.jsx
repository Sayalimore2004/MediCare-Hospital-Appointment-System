import "./DoctorSchedule.css";
import { useEffect, useState } from "react";

function DoctorSchedule() {
  const [consultationDuration, setConsultationDuration] =
    useState("30");

  const [breakTime, setBreakTime] =
    useState("01:00 PM");

  const [maxPatients, setMaxPatients] =
    useState("12");

  const [weeklySchedule, setWeeklySchedule] =
    useState([]);

  const [saved, setSaved] =
    useState(false);

  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const defaultWeeklySchedule = [
    {
      day: "Monday",
      isAvailable: true,
      startTime: "09:00 AM",
      endTime: "05:00 PM",
    },
    {
      day: "Tuesday",
      isAvailable: true,
      startTime: "09:00 AM",
      endTime: "05:00 PM",
    },
    {
      day: "Wednesday",
      isAvailable: true,
      startTime: "09:00 AM",
      endTime: "05:00 PM",
    },
    {
      day: "Thursday",
      isAvailable: true,
      startTime: "09:00 AM",
      endTime: "05:00 PM",
    },
    {
      day: "Friday",
      isAvailable: true,
      startTime: "09:00 AM",
      endTime: "05:00 PM",
    },
    {
      day: "Saturday",
      isAvailable: false,
      startTime: "",
      endTime: "",
    },
    {
      day: "Sunday",
      isAvailable: false,
      startTime: "",
      endTime: "",
    },
  ];


  useEffect(() => {
    loadSchedule();
    fetchDoctorAppointments();
  }, []);


  // Convert 12-hour time to 24-hour time
  const convertTo24Hour = (time) => {
    if (!time) {
      return "";
    }

    const parts = time.trim().split(" ");

    if (parts.length !== 2) {
      return time;
    }

    const timePart = parts[0];
    const modifier = parts[1];

    let [hours, minutes] =
      timePart.split(":").map(Number);

    if (modifier === "AM") {
      if (hours === 12) {
        hours = 0;
      }
    } else if (modifier === "PM") {
      if (hours !== 12) {
        hours += 12;
      }
    }

    return `${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };


  // Convert 24-hour time to 12-hour time
  const convertTo12Hour = (time) => {
    if (!time) {
      return "";
    }

    const parts = time.split(":");

    if (parts.length < 2) {
      return time;
    }

    let hours = Number(parts[0]);
    const minutes = parts[1];

    const modifier =
      hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${String(hours).padStart(
      2,
      "0"
    )}:${minutes} ${modifier}`;
  };


  // Load schedule from MongoDB
  const loadSchedule = async () => {
    try {
      setError("");

      const token =
        localStorage.getItem(
          "doctorToken"
        );

      const storedDoctorData =
        localStorage.getItem(
          "doctorData"
        );

      if (
        !token ||
        !storedDoctorData
      ) {
        window.location.href =
          "/login";
        return;
      }

      const doctor =
        JSON.parse(
          storedDoctorData
        );

      if (!doctor?.doctorId) {
        setError(
          "Doctor information not found."
        );
        return;
      }

      const response =
        await fetch(
          `http://localhost:5000/api/doctor-schedules/${doctor.doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to load doctor schedule."
        );
        return;
      }

      setConsultationDuration(
        String(
          data.consultationDuration ?? 30
        )
      );

      setBreakTime(
        data.breakTime ||
          "01:00 PM"
      );

      setMaxPatients(
        String(
          data.maxPatientsPerDay ?? 12
        )
      );

      setWeeklySchedule(
        data.weeklySchedule?.length
          ? data.weeklySchedule
          : defaultWeeklySchedule
      );

    } catch (error) {
      console.error(
        "Load doctor schedule error:",
        error
      );

      setError(
        "Unable to load schedule from the server."
      );
    }
  };


  // Fetch doctor's appointments
  const fetchDoctorAppointments =
    async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem(
            "doctorToken"
          );

        const storedDoctorData =
          localStorage.getItem(
            "doctorData"
          );

        if (
          !token ||
          !storedDoctorData
        ) {
          window.location.href =
            "/login";
          return;
        }

        const doctor =
          JSON.parse(
            storedDoctorData
          );

        if (!doctor?.doctorId) {
          setError(
            "Doctor information not found."
          );
          return;
        }

        const response =
          await fetch(
            `http://localhost:5000/api/appointments/doctor/${doctor.doctorId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Failed to fetch appointments."
          );
          return;
        }

        const appointmentList =
          Array.isArray(data)
            ? data
            : data.appointments || [];

        setAppointments(
          appointmentList
        );

      } catch (error) {
        console.error(
          "Fetch doctor appointments error:",
          error
        );

        setError(
          "Unable to connect to the server. Please make sure the MediCare backend is running."
        );
      } finally {
        setLoading(false);
      }
    };


  // Update weekly schedule
  const updateWeeklyDay = (
    dayName,
    field,
    value
  ) => {
    setWeeklySchedule(
      (previousSchedule) =>
        previousSchedule.map(
          (day) =>
            day.day === dayName
              ? {
                  ...day,
                  [field]: value,
                }
              : day
        )
    );
  };


  // Save complete schedule to MongoDB
  const handleSaveChanges =
    async () => {
      try {
        setSaving(true);
        setError("");

        const token =
          localStorage.getItem(
            "doctorToken"
          );

        const storedDoctorData =
          localStorage.getItem(
            "doctorData"
          );

        if (
          !token ||
          !storedDoctorData
        ) {
          window.location.href =
            "/login";
          return;
        }

        const doctor =
          JSON.parse(
            storedDoctorData
          );

        if (!doctor?.doctorId) {
          setError(
            "Doctor information not found."
          );
          return;
        }

        const response =
          await fetch(
            `http://localhost:5000/api/doctor-schedules/${doctor.doctorId}`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization: `Bearer ${token}`,
              },

              body: JSON.stringify({
                consultationDuration:
                  Number(
                    consultationDuration
                  ),

                breakTime,

                maxPatientsPerDay:
                  Number(
                    maxPatients
                  ),

                weeklySchedule,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Failed to save schedule."
          );
          return;
        }

        if (data.schedule) {
          setConsultationDuration(
            String(
              data.schedule
                .consultationDuration
            )
          );

          setBreakTime(
            data.schedule.breakTime
          );

          setMaxPatients(
            String(
              data.schedule
                .maxPatientsPerDay
            )
          );

          setWeeklySchedule(
            data.schedule
              .weeklySchedule || []
          );
        }

        setSaved(true);

        setTimeout(() => {
          setSaved(false);
        }, 2500);

      } catch (error) {
        console.error(
          "Save doctor schedule error:",
          error
        );

        setError(
          "Unable to save schedule. Please make sure the backend is running."
        );
      } finally {
        setSaving(false);
      }
    };


  const getTodayDate = () => {
    const today = new Date();

    const year =
      today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };


  const formatTodayDate = () => {
    const today = new Date();

    return today.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  const formatAppointmentTime =
    (time) => {
      if (!time) {
        return "—";
      }

      const parts =
        time.split(":");

      if (parts.length < 2) {
        return time;
      }

      let hours =
        Number(parts[0]);

      const minutes =
        parts[1];

      const suffix =
        hours >= 12
          ? "PM"
          : "AM";

      hours =
        hours % 12 || 12;

      return `${String(hours).padStart(
        2,
        "0"
      )}:${minutes} ${suffix}`;
    };


  const getTodayDayName = () => {
    const today =
      new Date();

    return today.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
      }
    );
  };


  const todayDate =
    getTodayDate();

  const todayDayName =
    getTodayDayName();


  const todaySchedule =
    weeklySchedule.find(
      (day) =>
        day.day === todayDayName
    );


  const todaysAppointments =
    appointments
      .filter(
        (appointment) =>
          appointment.appointmentDate ===
            todayDate &&
          appointment.status !==
            "Cancelled" &&
          appointment.status !==
            "Rejected"
      )
      .sort((a, b) =>
        String(
          a.appointmentTime || ""
        ).localeCompare(
          String(
            b.appointmentTime || ""
          )
        )
      );


  const bookedSlots =
    todaysAppointments.length;


  // Calculate today's working hours
  const calculateWorkingHours =
    () => {
      if (
        !todaySchedule ||
        !todaySchedule.isAvailable ||
        !todaySchedule.startTime ||
        !todaySchedule.endTime
      ) {
        return 0;
      }

      const start =
        convertTo24Hour(
          todaySchedule.startTime
        );

      const end =
        convertTo24Hour(
          todaySchedule.endTime
        );

      const [
        startHour,
        startMinute,
      ] =
        start
          .split(":")
          .map(Number);

      const [
        endHour,
        endMinute,
      ] =
        end
          .split(":")
          .map(Number);

      const totalMinutes =
        endHour * 60 +
        endMinute -
        (startHour * 60 +
          startMinute);

      return totalMinutes > 0
        ? totalMinutes / 60
        : 0;
    };


  const workingHours =
    calculateWorkingHours();


  const duration =
    Number(
      consultationDuration
    );


  const calculatedSlots =
    duration > 0
      ? Math.floor(
          (workingHours * 60) /
            duration
        )
      : 0;


  const dailyCapacity =
    Number(maxPatients) > 0
      ? Math.min(
          calculatedSlots,
          Number(maxPatients)
        )
      : calculatedSlots;


  const availableSlots =
    Math.max(
      dailyCapacity -
        bookedSlots,
      0
    );


  return (
    <div className="doctor-schedule-page">

      {/* Header */}

      <header className="doctor-schedule-header">

        <div>

          <span>
            DOCTOR SCHEDULE
          </span>

          <h1>
            My Schedule
          </h1>

          <p>
            Manage your availability,
            working hours and
            appointment schedule.
          </p>

        </div>

        <button
          type="button"
          className="doctor-schedule-save-btn"
          onClick={
            handleSaveChanges
          }
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : saved
            ? "Changes Saved ✓"
            : "Save Changes"}
        </button>

      </header>


      {/* Error */}

      {error && (
        <div
          className="doctor-schedule-error"
          style={{
            padding: "12px 16px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}


      {/* Today's Summary */}

      <section className="doctor-schedule-stats">

        <div className="doctor-schedule-stat">

          <span>
            Today's Appointments
          </span>

          <strong>
            {loading
              ? "..."
              : bookedSlots}
          </strong>

        </div>


        <div className="doctor-schedule-stat">

          <span>
            Available Slots
          </span>

          <strong>
            {loading
              ? "..."
              : availableSlots}
          </strong>

        </div>


        <div className="doctor-schedule-stat">

          <span>
            Booked Slots
          </span>

          <strong>
            {loading
              ? "..."
              : bookedSlots}
          </strong>

        </div>


        <div className="doctor-schedule-stat">

          <span>
            Working Hours
          </span>

          <strong>
            {loading
              ? "..."
              : `${workingHours} hrs`}
          </strong>

        </div>

      </section>


      {/* Main Content */}

      <section className="doctor-schedule-grid">


        {/* Weekly Schedule */}

        <section className="doctor-schedule-card">

          <div className="doctor-schedule-card-heading">

            <div>

              <span>
                WEEKLY AVAILABILITY
              </span>

              <h2>
                Working Schedule
              </h2>

            </div>

          </div>


          <div className="doctor-weekly-list">

            {weeklySchedule.length ===
            0 ? (

              <div className="doctor-patient-no-results">
                Loading weekly schedule...
              </div>

            ) : (

              weeklySchedule.map(
                (day) => (
                  <div
                    className={
                      day.isAvailable
                        ? "doctor-week-row"
                        : "doctor-week-row doctor-day-off"
                    }
                    key={day.day}
                  >

                    <strong>
                      {day.day}
                    </strong>


                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "8px",
                        flexWrap:
                          "wrap",
                      }}
                    >

                      <label
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "5px",
                          cursor:
                            "pointer",
                          fontSize:
                            "13px",
                        }}
                      >

                        <input
                          type="checkbox"
                          checked={
                            day.isAvailable
                          }
                          onChange={(
                            event
                          ) =>
                            updateWeeklyDay(
                              day.day,
                              "isAvailable",
                              event
                                .target
                                .checked
                            )
                          }
                        />

                        Available

                      </label>


                      {day.isAvailable && (
                        <>
                          <input
                            type="time"
                            value={
                              convertTo24Hour(
                                day.startTime
                              )
                            }
                            onChange={(
                              event
                            ) =>
                              updateWeeklyDay(
                                day.day,
                                "startTime",
                                convertTo12Hour(
                                  event
                                    .target
                                    .value
                                )
                              )
                            }
                          />

                          <span>
                            –
                          </span>

                          <input
                            type="time"
                            value={
                              convertTo24Hour(
                                day.endTime
                              )
                            }
                            onChange={(
                              event
                            ) =>
                              updateWeeklyDay(
                                day.day,
                                "endTime",
                                convertTo12Hour(
                                  event
                                    .target
                                    .value
                                )
                              )
                            }
                          />
                        </>
                      )}

                    </div>


                    <small>
                      {day.isAvailable
                        ? "Available"
                        : "Day Off"}
                    </small>

                  </div>
                )
              )

            )}

          </div>

        </section>


        {/* Today's Schedule */}

        <section className="doctor-schedule-card">

          <div className="doctor-schedule-card-heading">

            <div>

              <span>
                {formatTodayDate()}
              </span>

              <h2>
                Today's Schedule
              </h2>

            </div>

          </div>


          <div className="doctor-time-list">

            {loading ? (

              <div className="doctor-patient-no-results">
                Loading today's schedule...
              </div>

            ) : todaysAppointments.length >
              0 ? (

              todaysAppointments.map(
                (appointment) => (
                  <div
                    className="doctor-time-row"
                    key={
                      appointment.appointmentId
                    }
                  >

                    <strong>
                      {formatAppointmentTime(
                        appointment.appointmentTime
                      )}
                    </strong>


                    <div>

                      <span>
                        {
                          appointment.patientName
                        }
                      </span>

                      <small>
                        {
                          appointment.reason ||
                          "General Consultation"
                        }
                      </small>

                    </div>


                    <em>
                      {
                        appointment.status
                      }
                    </em>

                  </div>
                )
              )

            ) : (

              <div className="doctor-patient-no-results">

                {todaySchedule &&
                !todaySchedule.isAvailable
                  ? "Doctor is not available today."
                  : "No appointments scheduled for today."}

              </div>

            )}

          </div>

        </section>

      </section>


      {/* Appointment Settings */}

      <section className="doctor-schedule-card doctor-schedule-settings">

        <div className="doctor-schedule-card-heading">

          <div>

            <span>
              APPOINTMENT SETTINGS
            </span>

            <h2>
              Consultation Preferences
            </h2>

          </div>

        </div>


        <div className="doctor-settings-grid">


          {/* Consultation Duration */}

          <div className="doctor-setting-item">

            <label>
              Consultation Duration
            </label>

            <select
              value={
                consultationDuration
              }
              onChange={(event) =>
                setConsultationDuration(
                  event.target.value
                )
              }
            >

              <option value="15">
                15 Minutes
              </option>

              <option value="30">
                30 Minutes
              </option>

              <option value="45">
                45 Minutes
              </option>

              <option value="60">
                60 Minutes
              </option>

            </select>

          </div>


          {/* Break Time */}

          <div className="doctor-setting-item">

            <label>
              Break Time
            </label>

            <select
              value={breakTime}
              onChange={(event) =>
                setBreakTime(
                  event.target.value
                )
              }
            >

              <option value="12:00 PM">
                12:00 PM
              </option>

              <option value="01:00 PM">
                01:00 PM
              </option>

              <option value="02:00 PM">
                02:00 PM
              </option>

              <option value="03:00 PM">
                03:00 PM
              </option>

            </select>

          </div>


          {/* Maximum Patients */}

          <div className="doctor-setting-item">

            <label>
              Maximum Patients Per Day
            </label>

            <input
              type="number"
              value={maxPatients}
              min="1"
              onChange={(event) =>
                setMaxPatients(
                  event.target.value
                )
              }
            />

          </div>

        </div>

      </section>

    </div>
  );
}

export default DoctorSchedule;