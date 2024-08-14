import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import Modal from '../components/DeletePopup';

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
  position: relative;
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
    background-color: green;
    border-radius: 50px;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  max-width: 730px;
  margin-top: 50px;
  margin-left: 30px;
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
    axios
      .post("http://localhost:3001/api/income", income)
      .then((response) => {
        console.log("Income added:", response.data);
        setIncome({
          title: "",
          amount: "",
          date: "",
          category: "",
          reference: "",
        });
        return axios.get("http://localhost:3001/api/income/latest");
      })
      .then((response) => {
        console.log("Updated latest income:", response.data);
        setLatestIncome(response.data);
        const total = response.data.reduce((sum, item) => sum + item.amount, 0);
        setTotalIncome(total);
      })
      .catch((error) => {
        console.error("There was an error adding the income!", error);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/api/income/${id}`)
      .then((response) => {
        console.log("Income deleted:", response.data);
        return axios.get("http://localhost:3001/api/income/latest");
      })
      .then((response) => {
        console.log("Updated latest income after deletion:", response.data);
        setLatestIncome(response.data);
        const total = response.data.reduce((sum, item) => sum + item.amount, 0);
        setTotalIncome(total);
      })
      .catch((error) => {
        console.error("There was an error deleting the income!", error);
      });
  };

  const handleDeleteClick = (id) => {
    setIncomeToDelete(id);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (incomeToDelete) {
      handleDelete(incomeToDelete);
      setIncomeToDelete(null);
      setShowModal(false);
    }
  };

  const handleCancelDelete = () => {
    setIncomeToDelete(null);
    setShowModal(false);
  };

  return (
    <IncomeContainer>
      <Heading>Income</Heading>
      <TotalIncomeContainer>
        <span className="total-text">Total Income:</span> Rs. {formatAmount(displayedTotal)}
      </TotalIncomeContainer>
      <CardWrapper>
        <Card>
          <form onSubmit={handleSubmit}>
            <FormField>
              <input
                type="text"
                name="title"
                value={income.title}
                onChange={handleChange}
                placeholder="Income Title"
                required
              />
            </FormField>
            <FormField>
              <input
                type="number"
                name="amount"
                value={income.amount}
                onChange={handleChange}
                placeholder="Income Amount"
                required
              />
            </FormField>
            <FormField>
              <input
                type="date"
                name="date"
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
                <option value="">Select Category</option>
                <option value="salary">Salary</option>
                <option value="freelance">Freelance</option>
                <option value="investment">Investment</option>
                <option value="other">Other</option>
              </select>
            </FormField>
            <FormField>
              <input
                type="text"
                name="reference"
                value={income.reference}
                onChange={handleChange}
                placeholder="Reference (Optional)"
              />
            </FormField>
            <ButtonWrapper>
              <SubmitButton type="submit">Add Income</SubmitButton>
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
              {latestIncome.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCellAmount>
                    <PlusIcon />Rs.
                    {formatAmount(item.amount)}
                  </TableCellAmount>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>
                    <DeleteIcon onClick={() => handleDeleteClick(item.id)} />
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </CardWrapper>
      
      {showModal && (
        <Modal
          message="Are you sure you want to delete this income?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </IncomeContainer>
  );
};

export default Income;
