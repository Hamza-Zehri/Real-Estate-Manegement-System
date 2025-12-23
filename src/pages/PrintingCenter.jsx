import { useStore } from '../store/useStore';
import Header from '../components/Layout/Header';

function PrintingCenter() {
  const bookings = useStore(state => state.bookings);
  const clients = useStore(state => state.clients);
  const projects = useStore(state => state.projects);
  const transactions = useStore(state => state.transactions);

  // Get plot details helper
  const getPlotDetails = (plotId) => {
    let plotDetails = { projectName: '', blockName: '', plotNumber: '' };
    projects.forEach(project => {
      project.blocks.forEach(block => {
        const plot = block.plots.find(p => p.id === plotId);
        if (plot) {
          plotDetails = {
            projectName: project.name,
            blockName: block.name,
            plotNumber: plot.number
          };
        }
      });
    });
    return plotDetails;
  };

  // Calculate pending installments for each booking
  const getPendingInstallments = () => {
    return bookings.map(booking => {
      const client = clients.find(c => c.id === booking.clientId);
      const paid = transactions
        .filter(t => t.bookingId === booking.id)
        .reduce((sum, t) => sum + t.amount, 0);
      const pending = booking.totalAmount - paid;
      const plotDetails = getPlotDetails(booking.plotId);

      // Calculate monthly installment
      const remaining = booking.totalAmount - booking.advanceAmount;
      const monthlyAmount = remaining / booking.months;

      return {
        client,
        booking,
        plotDetails,
        totalAmount: booking.totalAmount,
        paid,
        pending,
        monthlyAmount
      };
    }).filter(item => item.pending > 0);
  };

  // Get month-wise paid installments
  const getMonthlyPaidReport = () => {
    const monthlyData = {};

    transactions.forEach(tx => {
      const date = new Date(tx.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: date.toLocaleString('default', { month: 'long', year: 'numeric' }),
          payments: []
        };
      }

      const booking = bookings.find(b => b.id === tx.bookingId);
      if (booking) {
        const client = clients.find(c => c.id === booking.clientId);
        const plotDetails = getPlotDetails(booking.plotId);

        monthlyData[monthKey].payments.push({
          client,
          plotDetails,
          amount: tx.amount,
          date: tx.date,
          type: tx.type
        });
      }
    });

    return Object.entries(monthlyData)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, data]) => data);
  };

  // Print Pending Installments Report (A4)
  const handlePrintPendingReport = () => {
    const pendingData = getPendingInstallments();
    const company = useStore.getState().company;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pending Installments Report</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { 
            font-family: 'Arial', sans-serif; 
            font-size: 12pt;
            line-height: 1.4;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #333;
            padding-bottom: 15px;
            margin-bottom: 25px;
          }
          .header h1 {
            margin: 0;
            font-size: 24pt;
            color: #0284c7;
          }
          .header p {
            margin: 5px 0;
            color: #666;
          }
          .report-title {
            text-align: center;
            font-size: 18pt;
            font-weight: bold;
            margin: 20px 0;
            color: #333;
          }
          .report-date {
            text-align: right;
            margin-bottom: 20px;
            font-size: 11pt;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th {
            background-color: #0284c7;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
            font-size: 11pt;
          }
          td {
            padding: 10px 8px;
            border-bottom: 1px solid #ddd;
            font-size: 10pt;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .total-row {
            font-weight: bold;
            background-color: #e0f2fe !important;
            font-size: 11pt;
          }
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #ddd;
            text-align: center;
            font-size: 10pt;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${company.name}</h1>
          <p>${company.email} | ${company.phone}</p>
        </div>
        
        <div class="report-title">Pending Installments Report</div>
        <div class="report-date">Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
        
        <table>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>CNIC</th>
              <th>Plot</th>
              <th>Total Amount</th>
              <th>Paid</th>
              <th>Pending</th>
              <th>Monthly Installment</th>
            </tr>
          </thead>
          <tbody>
            ${pendingData.map(item => `
              <tr>
                <td>${item.client.name}</td>
                <td>${item.client.cnic}</td>
                <td>${item.plotDetails.projectName} - Block ${item.plotDetails.blockName} - ${item.plotDetails.plotNumber}</td>
                <td>Rs. ${item.totalAmount.toLocaleString()}</td>
                <td>Rs. ${item.paid.toLocaleString()}</td>
                <td style="color: #dc2626; font-weight: bold;">Rs. ${item.pending.toLocaleString()}</td>
                <td>Rs. ${item.monthlyAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="5" style="text-align: right;">Total Pending:</td>
              <td colspan="2">Rs. ${pendingData.reduce((sum, item) => sum + item.pending, 0).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="footer">
          <p>This is a computer-generated report | ${company.name}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  // Print Monthly Paid Report (A4)
  const handlePrintMonthlyReport = () => {
    const monthlyData = getMonthlyPaidReport();
    const company = useStore.getState().company;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Monthly Paid Installments Report</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { 
            font-family: 'Arial', sans-serif; 
            font-size: 12pt;
            line-height: 1.4;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #333;
            padding-bottom: 15px;
            margin-bottom: 25px;
          }
          .header h1 {
            margin: 0;
            font-size: 24pt;
            color: #0284c7;
          }
          .header p {
            margin: 5px 0;
            color: #666;
          }
          .report-title {
            text-align: center;
            font-size: 18pt;
            font-weight: bold;
            margin: 20px 0;
            color: #333;
          }
          .report-date {
            text-align: right;
            margin-bottom: 20px;
            font-size: 11pt;
            color: #666;
          }
          .month-section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .month-header {
            background-color: #0284c7;
            color: white;
            padding: 10px 15px;
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          th {
            background-color: #e0f2fe;
            color: #0c4a6e;
            padding: 10px 8px;
            text-align: left;
            font-weight: bold;
            font-size: 10pt;
          }
          td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
            font-size: 10pt;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .month-total {
            font-weight: bold;
            background-color: #d1fae5 !important;
            color: #065f46;
          }
          .grand-total {
            margin-top: 20px;
            padding: 15px;
            background-color: #10b981;
            color: white;
            text-align: center;
            font-size: 14pt;
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #ddd;
            text-align: center;
            font-size: 10pt;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${company.name}</h1>
          <p>${company.email} | ${company.phone}</p>
        </div>
        
        <div class="report-title">Monthly Paid Installments Report</div>
        <div class="report-date">Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
        
        ${monthlyData.map(monthData => {
      const monthTotal = monthData.payments.reduce((sum, p) => sum + p.amount, 0);
      return `
            <div class="month-section">
              <div class="month-header">${monthData.month}</div>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Client Name</th>
                    <th>CNIC</th>
                    <th>Plot</th>
                    <th>Type</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${monthData.payments.map(payment => `
                    <tr>
                      <td>${new Date(payment.date).toLocaleDateString()}</td>
                      <td>${payment.client.name}</td>
                      <td>${payment.client.cnic}</td>
                      <td>${payment.plotDetails.projectName} - ${payment.plotDetails.plotNumber}</td>
                      <td style="text-transform: capitalize;">${payment.type}</td>
                      <td>Rs. ${payment.amount.toLocaleString()}</td>
                    </tr>
                  `).join('')}
                  <tr class="month-total">
                    <td colspan="5" style="text-align: right;">Month Total:</td>
                    <td>Rs. ${monthTotal.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          `;
    }).join('')}
        
        <div class="grand-total">
          Grand Total: Rs. ${monthlyData.reduce((sum, m) =>
      sum + m.payments.reduce((s, p) => s + p.amount, 0), 0
    ).toLocaleString()}
        </div>
        
        <div class="footer">
          <p>This is a computer-generated report | ${company.name}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handlePrintReceipt = (booking) => {
    const client = clients.find(c => c.id === booking.clientId);
    const printContent = `
      <div style="width: 300px; font-family: monospace; padding: 20px;">
        <h2 style="text-align: center; margin-bottom: 20px;">PAYMENT RECEIPT</h2>
        <p><strong>Client:</strong> ${client?.name}</p>
        <p><strong>CNIC:</strong> ${client?.cnic}</p>
        <p><strong>Plot:</strong> ${booking.plotId.split('-').slice(1).join('-')}</p>
        <p><strong>Total Amount:</strong> Rs. ${booking.totalAmount.toLocaleString()}</p>
        <p><strong>Advance:</strong> Rs. ${booking.advanceAmount.toLocaleString()}</p>
        <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
        <hr />
        <p style="text-align: center; margin-top: 20px;">Thank you for your business!</p>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <Header title="Printing Center" subtitle="Generate receipts and reports" />

      {/* A4 Report Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={handlePrintPendingReport}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
        >
          <div className="flex items-center justify-center mb-3">
            <i className="fa-solid fa-file-pdf text-4xl"></i>
          </div>
          <h3 className="text-xl font-bold mb-2">Pending Installments Report</h3>
          <p className="text-sm opacity-90">A4 PDF - All clients with pending payments</p>
        </button>

        <button
          onClick={handlePrintMonthlyReport}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
        >
          <div className="flex items-center justify-center mb-3">
            <i className="fa-solid fa-calendar-check text-4xl"></i>
          </div>
          <h3 className="text-xl font-bold mb-2">Monthly Paid Installments</h3>
          <p className="text-sm opacity-90">A4 PDF - Month-wise payment summary</p>
        </button>
      </div>

      {/* Installment Payment History */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          <i className="fa-solid fa-history mr-2 text-brand-600"></i>
          Recent Installment Payments
        </h3>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions
            .filter(tx => tx.type === 'installment')
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 20)
            .map(transaction => {
              const booking = bookings.find(b => b.id === transaction.bookingId);
              const client = clients.find(c => c.id === booking?.clientId);

              if (!booking || !client) return null;

              return (
                <div key={transaction.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-slate-800">{client.name}</p>
                      <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded font-medium">
                        Installment Paid
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      CNIC: {client.cnic} • Plot: {booking.plotId.split('-').slice(1).join('-')}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(transaction.date).toLocaleDateString()} at {new Date(transaction.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-lg text-emerald-600">Rs. {transaction.amount.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 capitalize">{transaction.method}</p>
                  </div>
                </div>
              );
            })}

          {transactions.filter(tx => tx.type === 'installment').length === 0 && (
            <p className="text-slate-400 text-center py-8">No installment payments yet</p>
          )}
        </div>
      </div>

      {/* Individual Receipts */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Individual Receipts</h3>

        <div className="space-y-3">
          {bookings.map(booking => {
            const client = clients.find(c => c.id === booking.clientId);
            return (
              <div key={booking.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition">
                <div>
                  <p className="font-semibold text-slate-800">{client?.name}</p>
                  <p className="text-sm text-slate-500">
                    Plot: {booking.plotId.split('-').slice(1).join('-')} •
                    Rs. {booking.totalAmount.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handlePrintReceipt(booking)}
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition flex items-center"
                >
                  <i className="fa-solid fa-print mr-2"></i> Print
                </button>
              </div>
            );
          })}

          {bookings.length === 0 && (
            <p className="text-slate-400 text-center py-8">No bookings available for printing</p>
          )}
        </div>
      </div>
    </>
  );
}

export default PrintingCenter;
