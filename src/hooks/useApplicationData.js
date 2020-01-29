import axios from "axios";
import { useReducer, useEffect } from "react";
import reducer, { SET_DAY, SET_INTERVIEW, GET_DATA } from "reducers/application"

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
    .then((all) => {
      dispatch({ type: GET_DATA, value: { days: all[0].data, appointments : all[1].data, interviewers: all[2].data}})
    })
  }, []);

  const setDay = day => dispatch({ type: SET_DAY, value: day});
  
  function bookInterview(id, interview) {
    let isEditing = false;
    if (state.appointments[id].interview) {
      isEditing = true;
    }
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, {interview})
      .then( (res, err) => {
        if (!interview.interviewer || !interview.student) {
          throw(err)
        } else {
          dispatch({ type: SET_INTERVIEW, value: appointments, id, cancelling: false, isEditing })
        }
      }
    ) 
  } 

  function cancelInterview(id) {
    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
    .then(res => 
      dispatch({type: SET_INTERVIEW, value: state.appointments, id, cancelling: true }))
  }

  return { state, setDay, bookInterview, cancelInterview }
}