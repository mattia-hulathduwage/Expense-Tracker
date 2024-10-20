import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaTrash, FaPlus } from "react-icons/fa";
import Modal from '../components/DeletePopup'; // Ensure this path is correct

const IncomeContainer = styled.div`
  padding: 20px;
  margin: 0;
  background-color: #000;
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const Heading = styled.h1`
  color: #fff;
  margin-top: 20px;
  text-align: center;
`;

const TotalIncomeContainer = styled.div`
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
  justify-content: space-between; /* Change to space-between to position items on the sides */
  margin-top: 20px; /* Added margin for better spacing */
`;

const Card = styled.div`
  background: #000;
  padding: 30px;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 20px; /* Space between form and table */
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
    background-color: green;
    border-radius: 50px;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  max-width: 730px;
  margin-left: 20px; /* Margin to create space from the form */
  max-height: 440px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(28, 42, 54, 0.15);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(76, 59, 207, 0.15);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(124, 91, 255, 0.15);
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
  border-bottom: 2px solid grey;
`;

const TableRow = styled.tr`
  background-color: black;
  &:nth-child(even) {
    background-color: black;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid grey;
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

const PlusIcon = styled(FaPlus)`
  color: green;
  margin-right: 8px;
  vertical-align: middle;
`;

const TableCellAmount = styled(TableCell)`
  color: green;
  display: flex;
  align-items: center;
  font-weight: bold;
`;

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

const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-IN", {}).format(amount);
};

const Income = () => {
  const [income, setIncome] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
    reference: "",
  });

  const [latestIncome, setLatestIncome] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [displayedTotal, setDisplayedTotal] = useState(0);
  const [isEditing, setIsEditing] = useState(false); // State to check if we are editing
  const [editingId, setEditingId] = useState(null); // ID of the income record being edited

  const [showModal, setShowModal] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/income/latest")
      .then((response) => {
        console.log("Latest income fetched:", response.data);
        setLatestIncome(response.data);
        const total = response.data.reduce((sum, item) => sum + item.amount, 0);
        setTotalIncome(total);
      })
      .catch((error) => {
        console.error("There was an error fetching the latest income!", error);
      });
  }, []);

  useEffect(() => {
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const newDisplayedTotal = Math.floor(progress * totalIncome);
      setDisplayedTotal(newDisplayedTotal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [totalIncome]);

  const handleChange = (e) => {
    setIncome({ ...income, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Update income record
      axios
        .put(`http://localhost:3001/api/income/${editingId}`, income)
        .then((response) => {
          console.log("Income updated:", response.data);
          resetForm();
          return axios.get("http://localhost:3001/api/income/latest");
        })
        .then((response) => {
          console.log("Updated latest income:", response.data);
          setLatestIncome(response.data);
          const total = response.data.reduce((sum, item) => sum + item.amount, 0);
          setTotalIncome(total);
        })
        .catch((error) => {
          console.error("There was an error updating the income!", error);
        });
    } else {
      // Add new income record
      axios
        .post("http://localhost:3001/api/income", income)
        .then((response) => {
          console.log("Income added:", response.data);
          resetForm();
          return axios.get("http://localhost:3001/api/income/latest");
        })
        .then((response) => {
          console.log("Latest income fetched:", response.data);
          setLatestIncome(response.data);
          const total = response.data.reduce((sum, item) => sum + item.amount, 0);
          setTotalIncome(total);
        })
        .catch((error) => {
          console.error("There was an error adding the income!", error);
        });
    }
  };

  const resetForm = () => {
    setIncome({
      title: "",
      amount: "",
      date: "",
      category: "",
      reference: "",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setIncomeToDelete(id);
    setShowModal(true); // Show modal for confirmation
  };

  const confirmDelete = () => {
    axios
      .delete(`http://localhost:3001/api/income/${incomeToDelete}`)
      .then((response) => {
        console.log("Income deleted:", response.data);
        // Refresh income list after deletion
        return axios.get("http://localhost:3001/api/income/latest");
      })
      .then((response) => {
        console.log("Latest income fetched:", response.data);
        setLatestIncome(response.data);
        const total = response.data.reduce((sum, item) => sum + item.amount, 0);
        setTotalIncome(total);
      })
      .catch((error) => {
        console.error("There was an error deleting the income!", error);
      })
      .finally(() => {
        setShowModal(false); // Close the modal after confirmation
      });
  };

  const handleCancel = () => {
    setShowModal(false); // Close modal on cancel
  };

  const handleEdit = (id) => {
    const selectedIncome = latestIncome.find((item) => item.id === id);
    setIncome(selectedIncome);
    setIsEditing(true);
    setEditingId(id);
  };

  return (
    <IncomeContainer>
      <Heading>Income Tracker</Heading>
      <TotalIncomeContainer>
        <span className="total-text">Total Income:</span>
        <span>{formatAmount(displayedTotal)}</span>
      </TotalIncomeContainer>
      <CardWrapper>
        <Card>
          <form onSubmit={handleSubmit}>
            <FormField>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={income.title}
                onChange={handleChange}
                required
              />
            </FormField>
            <FormField>
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={income.amount}
                onChange={handleChange}
                required
              />
            </FormField>
            <FormField>
              <input
                type="date"
                name="date"
                placeholder="Date"
                value={income.date}
                onChange={handleChange}
                required
              />
            </FormField>
            <FormField>
              <select
                name="category"
                value={income.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Category</option>
                <option value="Salary">Salary</option>
                <option value="Bonus">Bonus</option>
                <option value="Investment">Investment</option>
              </select>
            </FormField>
            <FormField>
              <input
                type="text"
                name="reference"
                placeholder="Reference"
                value={income.reference}
                onChange={handleChange}
              />
            </FormField>
            <ButtonWrapper>
              <SubmitButton type="submit">
                <PlusIcon /> {isEditing ? "Update" : "Add Income"}
              </SubmitButton>
            </ButtonWrapper>
          </form>
        </Card>
        <TableContainer>
          <Table>
            <thead>
              <TableRow>
                <TableHeader>Title</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {latestIncome.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCellAmount>{formatAmount(item.amount)}</TableCellAmount>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>
                    <DeleteIcon onClick={() => handleDelete(item.id)} />
                    <span style={{ marginLeft: '10px', cursor: 'pointer', color: 'blue' }} onClick={() => handleEdit(item.id)}>Edit</span>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </CardWrapper>
      {showModal && (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          confirmDelete={confirmDelete}
          onCancel={handleCancel}
        />
      )}
    </IncomeContainer>
  );
};

export default Income;
