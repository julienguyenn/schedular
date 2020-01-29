export const SET_DAY = "SET_DAY";
export const SET_INTERVIEW = "BOOK_INTERVIEW";
export const GET_DATA = "CANCEL_INTERVIEW";

export default function reducer(state, action) {
  switch (action.type) {
    case SET_DAY: {
      return { ...state, day: action.value };
    }

    case SET_INTERVIEW: {
      let days = state.days.map((item, index) => {
        if (item.appointments.includes(action.id) && !action.isEditing) {
          let spots = item.spots - 1;
          if (action.cancelling) {
            spots = item.spots + 1;
          }
          return { ...item, spots };
        } else {
          return item;
        }
      });
      return { ...state, appointments: action.value, days };
    }

    case GET_DATA: {
      return { ...state, ...action.value };
    }

    default: {
      throw new Error(
        `Tried to reduce with unsupported action type : ${action.type}`
      );
    }
  }
}
