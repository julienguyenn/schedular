export function getInterview(state, interview) {
  if (interview) {
    for (let interviewInfo in state.interviewers) {
      if (state.interviewers[interviewInfo].id === interview.interviewer) {
        return {
          student: interview.student,
          interview: state.interviewers[interviewInfo]
        };
      }
    }
  } else {
    return null;
  }
}
