import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  getAllByTestId,
  getByPlaceholderText,
  getByAltText,
  queryByText,
  getAllByAltText,
  getByTestId
} from "@testing-library/react";

import Application from "components/Application";

import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Monday"));

    fireEvent.click(getByText(container, "Tuesday"));

    expect(getByText(container, "Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getAllByTestId(container, "addButton")[0]);

    const input = getByPlaceholderText(container, "Enter Student Name");

    fireEvent.change(input, { target: { value: "Julie Nguyen" } });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(container, "Save"));

    expect(getByText(container, "Saving")).toBeInTheDocument();

    await waitForElement(() => container);

    const monday = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(monday, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    fireEvent.click(getAllByAltText(container, "Delete")[0]);

    // 4. Check that the confirmation message is shown.
    expect(
      getByText(container, "Are you sure you would like to delete?")
    ).toBeInTheDocument();
    const confirmation = getByTestId(container, "confirmation");

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(confirmation, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(container, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getAllByAltText(container, "Add")[0]);

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const monday = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(monday, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    fireEvent.click(getAllByAltText(container, "Edit")[0]);

    expect(getByText(container, "Interviewers")).toBeInTheDocument();

    fireEvent.click(getByAltText(container, "Sylvia Palmer"));

    fireEvent.click(getByText(container, "Save"));

    expect(getByText(container, "Saving")).toBeInTheDocument();

    await waitForElement(() => getAllByAltText(container, "Edit"));

    const monday = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(monday, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce("Error");
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getAllByTestId(container, "addButton")[0]);

    const input = getByPlaceholderText(container, "Enter Student Name");

    fireEvent.change(input, { target: { value: "Julie Nguyen" } });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(container, "Save"));

    expect(getByText(container, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(container, "Error"));

    expect(getByText(container, "Error")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce("Error");
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    fireEvent.click(getAllByAltText(container, "Delete")[0]);

    // 4. Check that the confirmation message is shown.
    expect(
      getByText(container, "Are you sure you would like to delete?")
    ).toBeInTheDocument();
    const confirmation = getByTestId(container, "confirmation");

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(confirmation, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(container, "Deleting")).toBeInTheDocument();

    await waitForElement(() => getByText(container, "Error"));

    expect(getByText(container, "Error")).toBeInTheDocument();
  });
});
