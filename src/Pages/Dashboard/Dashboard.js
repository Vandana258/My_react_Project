import { Layout } from "../Layout/Layout";
import React from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { generatePdf } from "../../Services/Dashboard";

const DownloadPDF = () => {
const handleDownload = async () => {
  try {
    const res = await generatePdf(); // already includes responseType: 'blob'

    const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
    saveAs(pdfBlob, 'downloaded-file.pdf');
  } catch (error) {
    console.error('Error downloading PDF:', error);
    alert('Failed to download PDF.');
  }
};

  return (
    <Layout>
        <div>
        <h2>Download Server-generated PDF</h2>
        <button onClick={handleDownload}>Download PDF</button>
        </div>
    </Layout>
  );
};

export default DownloadPDF;

// import { useEffect, useState } from "react";
//  import SweetAlert from "../../components/SweetAlert";
// import { findAllItem } from "../../Services/Item";
// import AmChart from "../../components/chart";
// import PieChartWithLegend from "../../components/PieChart";

// export default function Dashboard(){
//         const [loading, setLoading] = useState(false);
//         const [items, setItems] = useState([]);
//         const [pieChartData, setPieChartData] = useState([]);
//     useEffect(() => {
//         getList();
//     }, []);
    
//     const getList = async () => {
//         setLoading(true);
//         try {
//             const response = await findAllItem({ category: '2' });
//             setLoading(false);
//             if (response.data.success) {
//                 setItems(response.data.data);
//                 const chartData = response.data.data.map(item => ({
//                     name: item.name,
//                     percentage: item.percentage
//                 }));
//                 setPieChartData(chartData);
//             } else {
//                 SweetAlert.error('Error', (response.data.message) || ('An error occurred while fetching items list!'));
//             }
//         } catch (err) {
//             setLoading(false);
//             SweetAlert.error('Error', (err.message) || ('Failed to connect to the server. Please try again later.'));
//         }
//     };
//     return(
//         <Layout title={("Dashboard")}>
//          <h3>Item Percentages Bar Chart</h3>
//         {/* <AmChart data={items} /> */}

//         <br/>
//         <br/>
//         <br/>

//          <h3>Pie Chart with Legend</h3>
//         {/* <PieChartWithLegend data={pieChartDatan} /> */}
//         </Layout>
//     )
// }