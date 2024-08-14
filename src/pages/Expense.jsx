import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import Modal from '../components/DeletePopup'; // Adjust the path if needed

const ExpenseContainer = styled.div`
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

const TotalExpenseContainer = styled.div`
 margin-top: 10px;
  padding: 20px;
  background-color: #181818;
  color: #fff;
  border-radius: 25px;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 95%;
  height: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 1000;

  span.total-text {
    color: #b0b0b0; /* Grey color for the "Total Income:" text */
    margin-right: 10px;
  }
`;

const CardWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

const Card = styled.div`
  background: #000;
  padding: 30px;
  max-width: 400px;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: -10px;
  margin-top: -20px;
`;

const FormField = styled.div`
  margin-bottom: 20px;

  input,
  select {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 50px;
    color: #000;
  }

  option {
    color: #000;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const SubmitButton = styled.button`
  padding: 12px;
  background-color: #4c3bcf;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: red;
    border-radius: 50px;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  max-width: 730px;
  margin-top: 50px;
  margin-left: 30px;
  max-height: 440px; /* Adjust the height to fit 8 rows */
  overflow-y: auto; /* Add vertical scrolling */

  /* Dark-themed scrollbar with 85% transparency */
  &::-webkit-scrollbar {
    width: 12px; /* Width of the scrollbar */
  }

  &::-webkit-scrollbar-track {
    background: rgba(
      28,
      42,
      54,
      0.25
    ); /* Track background with 85% transparency */
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(
      76,
      59,
      207,
      0.25
    ); /* Handle color with 85% transparency */
    border-radius: 10px; /* Round the corners of the handle */
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(
      124,
      91,
      255,
      0.25
    ); /* Handle color on hover with 85% transparency */
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  color: #fff;
  background-color: #1c2a36;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const TableHeader = styled.th`
  padding: 12px;
  background: black;
  color: #fff;
  text-align: left;
  font-weight: bold;
  border-bottom: 1px solid grey;
`;

const TableRow = styled.tr`
  background-color: black; /* Make the background transparent */
  &:nth-child(even) {
    background-color: black; /* Ensure alternate rows are also transparent */
  }
  &:hover {
    background-color: rgba(
      255,
      255,
      255,
      0.1
    ); /* Add a slight hover effect if desired */
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid grey; /* Set the bottom border to grey */
  text-align: left;
  position: relative;
`;

const DeleteIcon = styled(FaTrash)`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: white;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: red;
  }
`;

const TableCellAmount = styled(TableCell)`
  color: red;
  display: flex;
  align-items: center;
  font-weight: bold;
`;

// Styled component for the red minus icon
const MinusIcon = styled(FaMinus)`
  color: red;
  margin-right: 8px;
`;

// Define the formatDate function
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

// Define the formatAmount function
const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-IN", {}).format(amount);
};

const Expense = () => {
  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
    reference: "",
  });

  const [latestExpense, setLatestExpense] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [displayedTotal, setDisplayedTotal] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/expense/latest")
      .then((response) => {
        console.log("Latest expense fetched:", response.data); // Debugging line
        setLatestExpense(response.data);
        const total = response.data.reduce(
          (sum, item) => sum + (parseFloat(item.eamount) || 0),
          0
        );
        setTotalExpense(total);
      })
      .catch((error) => {
        console.error("There was an error fetching the latest expense!", error);
      });
  }, []);

  useEffect(() => {
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const newDisplayedTotal = Math.floor(progress * totalExpense);
      setDisplayedTotal(newDisplayedTotal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [totalExpense]);

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/api/expense", expense)
      .then((response) => {
        console.log("Expense added:", response.data);
        setExpense({
          title: "",
          amount: "",
          date: "",
          category: "",
          reference: "",
        });
        return axios.get("http://localhost:3001/api/expense/latest");
      })
      .then((response) => {
        console.log("Updated latest expense:", response.data); // Debugging line
        setLatestExpense(response.data);
        const total = response.data.reduce(
          (sum, item) => sum + (parseFloat(item.eamount) || 0),
          0
        );
        setTotalExpense(total);
      })
      .catch((error) => {
        console.error("There was an error adding the expense!", error);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/api/expense/${id}`)
      .then((response) => {
        console.log("Expense deleted:", response.data);
        return axios.get("http://localhost:3001/api/expense/latest"); // Fetch latest entries after deletion
      })
      .then((response) => {
        console.log("Updated latest expense after deletion:", response.data); // Debugging line
        setLatestExpense(response.data);
        const total = response.data.reduce(
          (sum, item) => sum + (parseFloat(item.eamount) || 0),
          0
        );
        setTotalExpense(total);
      })
      .catch((error) => {
        console.error("There was an error deleting the expense!", error);
      });
  };

  const handleDeleteClick = (id) => {
    setExpenseToDelete(id);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (expenseToDelete) {
      handleDelete(expenseToDelete);
      setExpenseToDelete(null);
      setShowModal(false);
    }
  };

  const handleCancelDelete = () => {
    setExpenseToDelete(null);
    setShowModal(false);
  };

  return (
    <ExpenseContainer>
      <Heading>Expense</Heading>
      <TotalExpenseContainer>
      <span className="total-text">Total Income:</span> Rs. {formatAmount(displayedTotal)}
      </TotalExpenseContainer>
      <CardWrapper>
        <Card>
          <form onSubmit={handleSubmit}>
            <FormField>
              <input
                type="text"
                name="title"
                value={expense.title}
                onChange={handleChange}
                placeholder="Title"
                required
              />
            </FormField>
            <FormField>
              <input
                type="number"
                name="amount"
                value={expense.amount}
                onChange={handleChange}
                placeholder="Amount"
                required
              />
            </FormField>
            <FormField>
              <input
                type="date"
                name="date"
                value={expense.date}
                onChange={handleChange}
                placeholder="Date"
                required
              />
            </FormField>
            <FormField>
              <select
                name="category"
                value={expense.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="Housing">Food</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Tools">Tools</option>
                <option value="Development">Development</option>
                <option value="Other">Other</option>
              </select>
            </FormField>
            <FormField>
              <input
                type="text"
                name="reference"
                value={expense.reference}
                onChange={handleChange}
                placeholder="Reference (optional)"
              />
            </FormField>
            <ButtonWrapper>
              <SubmitButton type="submit">Add Expense</SubmitButton>
            </ButtonWrapper>
          </form>
        </Card>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <TableHeader>Title</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader></TableHeader>
              </tr>
            </thead>
            <tbody>
              {latestExpense.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.etitle}</TableCell>
                  <TableCellAmount>
                    <MinusIcon />
                    Rs. {formatAmount(item.eamount)}
                  </TableCellAmount>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>
                    <DeleteIcon onClick={() => handleDeleteClick(item.eid)} />
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </CardWrapper>
      
      {showModal && (
        <Modal
          message="Are you sure you want to delete this expense?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </ExpenseContainer>
  );
};

export default Expense;
