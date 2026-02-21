/// <reference types="jest" />
// Button.test.jsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

test("renders 'Submit' and calls onClick when clicked", () => {
  const handleClick = jest.fn();

  render(<Button onClick={handleClick} />);

  // memastikan teks "Submit" tampil
  const button = screen.getByText("Submit");
  expect(button).toBeInTheDocument();

  // klik button
  fireEvent.click(button);

  // memastikan fungsi dipanggil
  expect(handleClick).toHaveBeenCalledTimes(1);
});
