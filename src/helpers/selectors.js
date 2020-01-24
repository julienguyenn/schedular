export function getAppointmentsForDay(state, day) {
  let dayIds = [];
  for (let oneDay of state.days) {
    if (oneDay.name === day) {
      dayIds.push(...oneDay.appointments);
    }
  }

  let appointments = [];
  for (let appointment in state.appointments) {
    let id = state.appointments[appointment].id;
    if (dayIds.includes(id)) {
      appointments.push(state.appointments[appointment])
    }
  }
  return appointments;
}
