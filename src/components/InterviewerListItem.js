import React from 'react';
import "./InterviewerListItem.scss";
const classNames = require('classnames');

export default function InterviewerListItem(props) {
  const interviewerItemClass = classNames("interviewers__item", 
  {"interviewers__item--selected": props.selected});

  const interviewerImageClass = classNames("interviewers__item-image", {
    "interviewers__item--selected-image": props.selected});

    return (
      <li className={interviewerItemClass} onClick={props.setInterviewer}>
        <img
          className={interviewerImageClass}
          src={props.avatar}
          alt={props.name}
        />
        {props.selected && props.name}
      </li>
    );
}