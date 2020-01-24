import React from 'react';
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "../../hooks/useVisualMode"
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE= "CREATE";
const SAVE = "SAVE";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVE);
    props.bookInterview(props.id, interview)
    .then(res => transition(SHOW))
    .catch(error => {transition(ERROR_SAVE)});
  }
  
  function deleteApp(id) {
    transition(DELETE)
    props.deleteInterview(id)
    .then(res => transition(EMPTY))
    .catch(error => transition(ERROR_DELETE, true));
  }

  return (<article className="appointment">
    <Header
      time={props.time}
    />
    {mode === EMPTY && <Empty onAdd={(event) => transition(CREATE)}/>}
  
    {mode === SHOW && 
    <Show student={props.interview.student} interviewer={props.interview.interview.name} onDelete={()=> transition(CONFIRM)} onEdit={()=>{transition(EDIT)}}/>}

    {mode === CREATE &&
    <Form interviewers={props.interviewers} onSave={save} onCancel={(event) => back()} />}

    {mode === SAVE &&
    <Status message="Saving" />}

    {mode === DELETE &&
    <Status message="Deleting" />}

    {mode === CONFIRM &&
    <Confirm message="Are you sure you would like to delete?" 
            onConfirm={()=> deleteApp(props.id)} 
            onCancel={() =>{back()}}/>}
    {mode === EDIT && 
    <Form name={props.interview.student} 
    interviewer={props.interview.interview.id} 
    interviewers={props.interviewers}
    onCancel={()=> back()}
    onSave={save}/>}

    {mode === ERROR_SAVE &&
    <Error message="Please enter the correct information" onClose={()=>back()}/>}

    {mode === ERROR_DELETE &&
    <Error message="Unable to delete" onClose={()=>back()}/>}
  </article>);
}