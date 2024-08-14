import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import dayjs from "dayjs";
import "chart.js/auto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line
import {
  faDollarSign,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

// Styled Components
const DashboardContainer = styled.div`
  padding: 20px;
  background-color: #000;
  color: #e0e0e0;
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden; /* Prevent horizontal overflow */
`;

const OverviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 20px 0;
  width: 100%;
`;

const Card = styled.div`
  background: linear-gradient(to right, #181818, #181818 60%, #1A5319 120%);
  padding: 20px;
  margin: 10px;
  border-radius: 25px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(30.333% - 20px); /* Adjust width for responsive layout */
  max-width: 300px; /* Max width for larger screens */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const CardBalance = styled(Card)`
  background: linear-gradient(to right, #181818, #181818 60%, rgba(0, 68, 255, 0.4) 150%);
`;

const CardIncome = styled(Card)`
  background: linear-gradient(to right, #181818, #181818 60%, #1A5319 150%);
`;

const CardExpense = styled(Card)`
  background: linear-gradient(to right, #181818, #181818 60%, #C84B31 150%);
`;


const CardTitle = styled.h3`
  margin: 0;
  padding-bottom: 10px;
  font-size: 18px;
  width: 100%;
  text-align: center;
  color: #b0b0b0;
`;

const CardAmount = styled.p`
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  width: 100%;
  color: #ffffff;
`;

const CardIcon = styled.div`
  font-size: 24px;
  margin-bottom: 10px;
  width: 60px; /* Adjust width as needed */
  height: 60px; /* Adjust height as needed */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%; /* Makes the div circular */
  background: ${(props) =>
    props.color || "#ffffff"}; /* Use color prop or default to white */
  color: #2c2c2c; /* Color of the icon */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Optional: shadow for better visibility */
`;

const ChartContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* Allow charts to wrap */
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 20px 0;
  margin-top: -15px;
`;

const ChartWrapper = styled.div`
  background: #181818;
  border-radius: 25px;
  padding: 20px;
  margin: 10px;
  color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  flex: 1;
  min-width: 280px; /* Minimum width for charts */
`;

const BarChartWrapper = styled(ChartWrapper)`
  flex: 2;
  max-width: 700px;
  margin-right: 10px;
`;

const PieChartWrapper = styled(ChartWrapper)`
  max-width: 400px;
  margin-top: 10px;
  font-size: 12px;
`;

const TableContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 20px 0;
  margin-top: -15px;
  margin-left: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #2c2c2c;
  color: #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const TableHeader = styled.th`
  padding: 12px;
  background: black;
  color: #ffffff;
  text-align: left;
  border-bottom: 1px solid grey;
`;

const TableRow = styled.tr`
  background-color: black; /* Make the background transparent */
  border-bottom: 1px solid grey; /* Add a grey bottom border */
`;

const TableCell = styled.td`
  padding: 12px;
  text-align: left;
  background-color: black; /* Ensure the cell background is also transparent */
`;

const TypeContainer = styled.div`
  padding: 5px 10px;
  border-radius: 8px;
  background-color: ${(props) =>
    props.type === "income"
      ? "rgba(57, 153, 24, 0.2)" // Light green for income
      : props.type === "expense"
      ? "rgba(184, 0, 0, 0.2)" // Light red for expense
      : "rgba(224, 224, 224, 0.2)" // Light gray for others
  };
  color: ${(props) =>
    props.type === "income"
      ? "#399918"
      : props.type === "expense"
      ? "#B80000"
      : "#e0e0e0"};
  font-weight: bold;
  text-align: center;
  display: inline-block;
`;

const TypeTableCell = styled(TableCell)`
  text-align: left;
`;

const ScrollableTableWrapper = styled.div`
  max-height: 400px;
  overflow-y: auto;

  /* Dark-themed scrollbar with 85% transparency */
  &::-webkit-scrollbar {
    width: 12px; /* Width of the scrollbar */
  }

  &::-webkit-scrollbar-track {
    background: rgba(28, 42, 54, 0.25); /* Track background with 85% transparency */
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(76, 59, 207, 0.25); /* Handle color with 85% transparency */
    border-radius: 10px; /* Round the corners of the handle */
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(124, 91, 255, 0.25); /* Handle color on hover with 85% transparency */
  }
`;



const Dashboard = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [incomeCategories, setIncomeCategories] = useState({});
  const [expenseCategories, setExpenseCategories] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [incomeExpenseData, setIncomeExpenseData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeResponse = await axios.get(
          "http://localhost:3001/api/income/overtime"
        );
        const expenseResponse = await axios.get(
          "http://localhost:3001/api/expense/overtime"
        );
        const transactionResponse = await axios.get(
          "http://localhost:3001/api/transactions"
        );
        const incomeCategoryResponse = await axios.get(
          "http://localhost:3001/api/income/categories"
        );
        const expenseCategoryResponse = await axios.get(
          "http://localhost:3001/api/expense/categories"
        );

        const totalIncome = incomeResponse.data.reduce(
          (sum, item) => sum + item.total,
          0
        );
        const totalExpense = expenseResponse.data.reduce(
          (sum, item) => sum + item.total,
          0
        );

        const incomeCategories = incomeCategoryResponse.data.reduce(
          (acc, item) => {
            acc[item.category] = item.total;
            return acc;
          },
          {}
        );

        const expenseCategories = expenseCategoryResponse.data.reduce(
          (acc, item) => {
            acc[item.category] = item.total;
            return acc;
          },
          {}
        );

        const transactions = transactionResponse.data;

        setTotalIncome(totalIncome);
        setTotalExpense(totalExpense);
        setIncomeCategories(incomeCategories);
        setExpenseCategories(expenseCategories);
        setTransactions(transactions);
        setBalance(totalIncome - totalExpense);

        const dates = transactions.map((tx) =>
          dayjs(tx.date).format("MM/YYYY")
        ); // Format for monthly view
        const incomeData = [];
        const expenseData = [];
        const dateSet = new Set(dates);

        dateSet.forEach((date) => {
          const totalIncomeForDate = transactions
            .filter(
              (tx) =>
                tx.type === "income" &&
                dayjs(tx.date).format("MM/YYYY") === date
            )
            .reduce((sum, tx) => sum + tx.amount, 0);
          const totalExpenseForDate = transactions
            .filter(
              (tx) =>
                tx.type === "expense" &&
                dayjs(tx.date).format("MM/YYYY") === date
            )
            .reduce((sum, tx) => sum + tx.amount, 0);
          incomeData.push(totalIncomeForDate);
          expenseData.push(totalExpenseForDate);
        });

        setIncomeExpenseData({
          labels: Array.from(dateSet),
          datasets: [
            {
              label: "Income",
              data: incomeData,
              backgroundColor: "#04d9ff",
              borderRadius: 25,
            },
            {
              label: "Expense",
              data: expenseData,
              backgroundColor: "#4C3BCF",
              borderRadius: 25,
            },
          ],
        });
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    };

    fetchData();
  }, []);

  const incomeChartData = {
    labels: Object.keys(incomeCategories),
    datasets: [
      {
        data: Object.values(incomeCategories),
        backgroundColor: ["#0033A0", "#0056D6", "#0078FF", "#1E2A78"],
      },
    ],
  };

  const expenseChartData = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        data: Object.values(expenseCategories),
        backgroundColor: [
          "#F76C6C",
          "#F97300",
          "#FF4500",
          "#D73F3F",
          "#BF4040",
        ],
      },
    ],
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {}).format(amount);
  };

  return (
    <DashboardContainer>
    <OverviewContainer>
      <CardBalance>
        <CardIcon color="#4B70F5">
          <FontAwesomeIcon icon={faDollarSign} />
        </CardIcon>
        <CardTitle>Balance</CardTitle>
        <CardAmount>Rs. {formatAmount(balance)}</CardAmount>
      </CardBalance>
      <CardIncome>
        <CardIcon color="#059212">
          <FontAwesomeIcon icon={faArrowUp} />
        </CardIcon>
        <CardTitle>Total Income</CardTitle>
        <CardAmount>Rs. {formatAmount(totalIncome)}</CardAmount>
      </CardIncome>
      <CardExpense>
        <CardIcon color="#FF8225">
          <FontAwesomeIcon icon={faArrowDown} />
        </CardIcon>
        <CardTitle>Total Expense</CardTitle>
        <CardAmount>Rs. {formatAmount(totalExpense)}</CardAmount>
      </CardExpense>
    </OverviewContainer>

      <ChartContainer>
        <BarChartWrapper>
          <h3>Income vs Expenses</h3>
          <Bar
            data={incomeExpenseData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      let label = context.dataset.label || "";
                      if (label) {
                        label += ": ";
                      }
                      if (context.parsed.y !== null) {
                        label += new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "LKR",
                        }).format(context.parsed.y);
                      }
                      return label;
                    },
                  },
                },
              },
            }}
          />
        </BarChartWrapper>
        <PieChartWrapper>
          <h2>All Incomes</h2>
          <Pie data={incomeChartData} options={{ cutout: "50%" }} />
        </PieChartWrapper>
        <PieChartWrapper>
          <h2>All expenses</h2>
          <Pie data={expenseChartData} options={{ cutout: "50%" }} />
        </PieChartWrapper>
      </ChartContainer>
      <TableContainer>
        <h3>Recent Transactions</h3>
        <ScrollableTableWrapper>
          <Table>
            <thead>
              <tr>
                <TableHeader>Date</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Type</TableHeader>
              </tr>
            </thead>
            <tbody>
  {transactions
    .slice() // Create a shallow copy of the array to avoid mutating the original one
    .reverse() // Reverse the order for descending display
    .map((transaction, index) => (
      <TableRow key={index}>
        <TableCell>{dayjs(transaction.date).format("DD/MM/YYYY")}</TableCell>
        <TableCell>{transaction.category}</TableCell>
        <TableCell>Rs. {formatAmount(transaction.amount)}</TableCell>
        <TypeTableCell>
          <TypeContainer type={transaction.type}>
            {transaction.type}
          </TypeContainer>
        </TypeTableCell>
      </TableRow>
    ))}
</tbody>

          </Table>
        </ScrollableTableWrapper>
      </TableContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
