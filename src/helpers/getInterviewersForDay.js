export function getInterviewersForDay(state, day) {
  let dayIds = [];
  for (let oneDay of state.days) {
    if (oneDay.name === day) {
      dayIds.push(...oneDay.interviewers);
    }
  }

  let interviewers = [];
  for (let interviewer in state.interviewers) {
    let id = state.interviewers[interviewer].id;
    if (dayIds.includes(id)) {
      if(interviewer) {
        interviewers.push(state.interviewers[interviewer]);
      }
    }
  }
  return interviewers;
}