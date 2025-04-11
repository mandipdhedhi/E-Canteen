import React, { useState, useEffect } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const ReportsAnalytics = () => {
  const [timeFrame, setTimeFrame] = useState("weekly");
  const [reportType, setReportType] = useState("sales");
  const [chartData, setChartData] = useState(null);

  // Mock data - replace with API calls in production
  const mockData = {
    weekly: {
      sales: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Sales",
            data: [12, 19, 15, 8, 22, 27, 20],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      },
      revenue: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Revenue",
            data: [1200, 1900, 1500, 800, 2200, 2700, 2000],
            borderColor: "rgba(153, 102, 255, 1)",
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            tension: 0.4,
          },
        ],
      },
      orders: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Orders",
            data: [25, 35, 28, 15, 40, 50, 38],
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
              "rgba(255, 99, 132, 0.6)",
            ],
          },
        ],
      },
    },
    monthly: {
      sales: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Sales",
            data: [65, 59, 80, 81, 56, 55, 72, 78, 82, 85, 90, 100],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      },
      revenue: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Revenue",
            data: [6500, 5900, 8000, 8100, 5600, 5500, 7200, 7800, 8200, 8500, 9000, 10000],
            borderColor: "rgba(153, 102, 255, 1)",
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            tension: 0.4,
          },
        ],
      },
      orders: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Orders",
            data: [120, 110, 145, 150, 105, 100, 130, 140, 155, 160, 170, 190],
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
            ],
          },
        ],
      },
    },
  };

  useEffect(() => {
    // In a real app, fetch data from API based on timeFrame and reportType
    // For now, use mock data
    setChartData(mockData[timeFrame][reportType]);
  }, [timeFrame, reportType]);

  const renderChart = () => {
    if (!chartData) return <div>Loading...</div>;

    switch (reportType) {
      case "sales":
        return <Bar data={chartData} options={{ responsive: true }} />;
      case "revenue":
        return <Line data={chartData} options={{ responsive: true }} />;
      case "orders":
        return <Pie data={chartData} options={{ responsive: true }} />;
      default:
        return <div>Select a report type</div>;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Reports & Analytics</h2>
      
      <div className="mb-6 flex gap-4">
        <div>
          <label className="block mb-2">Time Frame:</label>
          <select 
            className="border p-2 rounded" 
            value={timeFrame} 
            onChange={(e) => setTimeFrame(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-2">Report Type:</label>
          <select 
            className="border p-2 rounded" 
            value={reportType} 
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="sales">Sales</option>
            <option value="revenue">Revenue</option>
            <option value="orders">Orders</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-xl mb-4 capitalize">{reportType} Report ({timeFrame})</h3>
        <div className="h-96">
          {renderChart()}
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
          <p className="text-3xl font-bold text-green-600">$24,500</p>
          <p className="text-sm text-gray-500">+12% from last period</p>
        </div>
        
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600">1,245</p>
          <p className="text-sm text-gray-500">+8% from last period</p>
        </div>
        
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-2">Average Order Value</h3>
          <p className="text-3xl font-bold text-purple-600">$19.68</p>
          <p className="text-sm text-gray-500">+3% from last period</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;