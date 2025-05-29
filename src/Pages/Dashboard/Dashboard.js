import { Layout } from "../Layout/Layout";
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
}
export default DownloadPDF;

