import axios from "axios";
import { useReducer, useEffect } from "react";

const SET_DAY = "SET_DAY";
const SET_INTERVIEW = "BOOK_INTERVIEW";
const GET_DATA = "CANCEL_INTERVIEW";

export default function useApplicationData() {

  function reducer(state, action) {
    switch(action.type) {
      case SET_DAY : {
        return { ...state, day: action.value };
      }

      case SET_INTERVIEW : {
        let days = state.days.map((item, index) => {
          if (item.appointments.includes(action.id) && !action.isEditing) {
            let spots = item.spots - 1;
            if (action.cancelling) {
               spots = item.spots + 1;
            }
            return {...item, spots}
          } else {
            return item;
          }
        })
        return { ...state, appointments: action.value, days }
      }

      case GET_DATA : {
        return {...state, ...action.value }
      }

      default: {
        return state
      }
    }
  }

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