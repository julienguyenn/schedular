import React from "react";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import {getAppointmentsForDay} from "helpers/selectors";
import {getInterview} from "helpers/getInterview";
import { getInterviewersForDay } from "helpers/getInterviewersForDay";
import useApplicationData from "hooks/useApplicationData";

export default function Application(props) { 
  const webSocket = new WebSocket("wss:http://localhost:8000/", "protocolOne");
  webSocket.send("Here is the data")
  webSocket.onopen = function (event) {
    webSocket.send("Here is the data");
  }
  webSocket.close();
  webSocket.onmessage = function (event) {
    console.log(event.data)
  }
  let { state,
        setDay,
        bookInterview,
        cancelInterview } = useApplicationData();
  
  const interviewers = getInterviewersForDay(state  , state.day);

  const appointments = getAppointmentsForDay(state, state.day);
  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        deleteInterview={cancelInterview}
      />
    );
  });
  
  return (
    <main className="layout">
      <section className="sidebar">
      <img className="sidebar--centered" src="images/logo.png" alt="Interview Scheduler"/>
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
      <DayList
          days={state.days}
          day={state.day}
          setDay={setDay}
        />
      </nav>
      <img className="sidebar__lhl sidebar--centered" src="images/lhl.png" alt="Lighthouse Labs"/>
      </section>
      <section className="schedule">
        {schedule}
        <Appointment 
         key="last" 
         time="5pm"/>
      </section>
    </main>
  );
}