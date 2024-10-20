import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styled, { keyframes } from "styled-components";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

const localizer = momentLocalizer(moment);

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
`;

const CalendarContainer = styled.div`
  padding: 20px;
  margin: 0;
  background-color: #000;
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
`;

const Heading = styled.h1`
  color: #fff;
  margin-top: 20px;
  text-align: center;
`;

const CalendarWrapper = styled.div`
  width: 100%;
  flex-grow: 1;
  margin-top: 10px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  .rbc-event {
    font-size: 10px;
    color: #fff;
    padding: 5px;
    border-radius: 5px;
  }
`;

const AddEventButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  z-index: 1001; /* Increase the z-index */

  &:hover {
    background-color: #0056b3;
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background-color: #121212; /* Dark background */
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${(props) => (props.isPopupOpen ? fadeIn : fadeOut)} 0.3s ease-out;
  margin-left: 230px;
`;

const FormTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  color: #fff; /* Light text color */
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 15px;
  border: 1px solid #444; /* Darker border */
  border-radius: 25px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  background-color: #fff; /* White background */
  color: #000; /* Dark text color */

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const Select = styled.select`
  padding: 15px;
  border: 1px solid #444; /* Darker border */
  border-radius: 25px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  background-color: #fff; /* White background */
  color: #000; /* Dark text color */
  appearance: none; /* Remove default styling */
  background: #fff
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23000"><path d="M7 10l5 5 5-5H7z"/></svg>')
    no-repeat;
  background-position: right 10px center; /* Position icon to the left */
  background-size: 12px 12px; /* Size of the dropdown icon */

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 10px;
`;

const Button = styled.button`
  padding: 15px 20px;
  border: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    background-color: #0056b3;
  }
`;

const CloseButton = styled(Button)`
  background-color: #6c757d;

  &:hover {
    background-color: #5a6268;
  }
`;

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("category");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/reminders");
      const reminders = response.data.map((reminder) => ({
        title: `${reminder.rpayment} - Rs. ${reminder.ramount}`,
        start: new Date(reminder.rdate),
        end: new Date(reminder.rdate),
        type: reminder.rtype,
      }));
      setEvents(reminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  const handleAddEvent = async () => {
    const newEvent = {
      rtype: type,
      rpayment: paymentDetails,
      ramount: amount,
      rdate: date,
    };

    try {
      await axios.post("http://localhost:3001/api/reminder", newEvent);
      setEvents([
        ...events,
        {
          title: `${newEvent.rpayment} - Rs. ${newEvent.ramount}`,
          start: new Date(newEvent.rdate),
          end: new Date(newEvent.rdate),
          type: newEvent.rtype,
        },
      ]);
      setPaymentDetails("");
      setAmount("");
      setDate("");
      setType("expense");
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error adding reminder:", error);
    }
  };

  const eventPropGetter = (event) => {
    const backgroundColor = event.type === "income" ? "#EF5A6F" : "#4B70F5";
    return { style: { backgroundColor, color: "#fff" } };
  };

  return (
    <CalendarContainer>
      <Heading>Calendar</Heading>
      <CalendarWrapper>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "80vh", width: "100%" }}
          views={["month", "week", "day"]}
          eventPropGetter={eventPropGetter}
        />
      </CalendarWrapper>
      <AddEventButton onClick={() => setIsPopupOpen(true)}>
        <FaPlus />
      </AddEventButton>
      {isPopupOpen && (
        <Popup>
          <PopupContent isPopupOpen={isPopupOpen}>
            <FormTitle>Add New Reminder</FormTitle>
            <InputContainer>
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="category">Category</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Select>
              <Input
                type="text"
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                placeholder="Add reminder"
              />
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
              />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Date"
              />
            </InputContainer>
            <ButtonContainer>
              <Button onClick={handleAddEvent}>Add Reminder</Button>
              <CloseButton onClick={() => setIsPopupOpen(false)}>
                Close
              </CloseButton>
            </ButtonContainer>
          </PopupContent>
        </Popup>
      )}
    </CalendarContainer>
  );
};

export default CalendarPage;
