import React from "react";

import { render, cleanup, waitForElement, fireEvent, prettyDOM, getByText,
getAllByTestId, getByPlaceholderText} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { container } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Monday"))
  
    fireEvent.click(getByText(container, "Tuesday"));
  
    expect(getByText(container, "Leopold Silvers")).toBeInTheDocument();
  });
  
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    fireEvent.click(getAllByTestId(container, "addButton")[0]);

    const input = getByPlaceholderText(container,"Enter Student Name");
  
    fireEvent.change(input, { target: { value: "Lydia Miller-Jones" } });
    fireEvent.click(getByText(container, "Save"));
    
    const appointments = getAllByTestId(container, "appointment");
    //const appointment = appointments[0];
    
    console.log(prettyDOM(appointments));

  })
})
