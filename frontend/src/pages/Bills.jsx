import { useEffect, useState } from "react";
import "./Bills.css";

function Bills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Get logged-in patient
  const patientData = JSON.parse(
    localStorage.getItem("patientData") || "null"
  );

  const patientId = patientData?.patientId;

  // Fetch patient bills
  useEffect(() => {
    const fetchBills = async () => {
      if (!patientId) {
        setError("Patient information not found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/bills/patient/${patientId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bills");
        }

        const data = await response.json();

        setBills(data);
      } catch (error) {
        console.error("Fetch bills error:", error);
        setError("Unable to load bills. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [patientId]);

  // Separate paid and pending bills
  const pendingBills = bills.filter(
    (bill) => bill.paymentStatus === "Pending"
  );

  const paidBills = bills.filter(
    (bill) => bill.paymentStatus === "Paid"
  );

  // Summary values
  const totalBills = bills.length;

  const totalPaidBills = paidBills.length;

  const pendingAmount = pendingBills.reduce(
    (total, bill) => total + Number(bill.totalAmount || 0),
    0
  );

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get day from date
  const getDay = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
    });
  };

  // Get month and year
  const getMonthYear = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date
      .toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  };

  // Format amount
  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  // Download invoice
  const downloadInvoice = (bill) => {
    const invoiceContent = `
MEDICARE HOSPITAL
PATIENT INVOICE
========================================

Bill Number: ${bill.billId}
Bill Date: ${formatDate(bill.billDate)}

Patient: ${bill.patientName}

Doctor: ${bill.doctorName}
Department: ${bill.department}

Appointment ID: ${bill.appointmentId}

Consultation Fee: ${formatAmount(bill.consultationFee)}
Additional Charges: ${formatAmount(bill.additionalCharges)}
Discount: ${formatAmount(bill.discount)}

Total Amount: ${formatAmount(bill.totalAmount)}

Payment Status: ${bill.paymentStatus}
Payment Method: ${bill.paymentMethod}

Payment Date: ${
      bill.paymentDate ? formatDate(bill.paymentDate) : "Not Paid"
    }

========================================
Thank you for choosing MediCare Hospital.

This is a system-generated invoice.
`;

    const blob = new Blob([invoiceContent], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${bill.billId}-Invoice.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  // Open payment modal
  const openPaymentModal = (bill) => {
    setSelectedBill(bill);
    setPaymentSuccess(false);
    setShowPaymentModal(true);
  };

  // Close payment modal
  const closePaymentModal = () => {
    if (paymentProcessing) return;

    setShowPaymentModal(false);
    setSelectedBill(null);
    setPaymentSuccess(false);
  };

  // Handle payment
  const handlePayment = async () => {
    if (!selectedBill) return;

    try {
      setPaymentProcessing(true);

      const paymentDate = new Date().toISOString().split("T")[0];

      const response = await fetch(
        `http://localhost:5000/api/bills/${selectedBill.billId}/payment`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentStatus: "Paid",
            paymentMethod: selectedBill.paymentMethod || "UPI",
            paymentDate,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment failed");
      }

      // Update bill in frontend
      setBills((currentBills) =>
        currentBills.map((bill) =>
          bill.billId === selectedBill.billId
            ? data.bill
            : bill
        )
      );

      setSelectedBill(data.bill);
      setPaymentSuccess(true);
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.message || "Payment failed. Please try again.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Click outside modal
  const handleModalOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      closePaymentModal();
    }
  };

  return (
    <div className="bills-page">

      {/* PAGE HEADER */}

      <section className="bills-header">
        <div>
          <span className="bills-label">
            PATIENT BILLING
          </span>

          <h1>Bills & Payments</h1>

          <p>
            View your consultation bills, payment status and billing history
            in one place.
          </p>
        </div>
      </section>


      {/* MAIN CONTENT */}

      <section className="bills-content">

        {/* LOADING */}

        {loading && (
          <div className="billing-section">
            <p>Loading your bills...</p>
          </div>
        )}


        {/* ERROR */}

        {!loading && error && (
          <div className="billing-section">
            <p>{error}</p>
          </div>
        )}


        {/* BILL CONTENT */}

        {!loading && !error && (
          <>

            {/* BILLING SUMMARY */}

            <div className="billing-summary">

              <div className="billing-summary-card">

                <div className="billing-summary-icon">
                  💳
                </div>

                <div>
                  <span>Total Bills</span>
                  <strong>{totalBills}</strong>
                </div>

              </div>


              <div className="billing-summary-card">

                <div className="billing-summary-icon">
                  ✓
                </div>

                <div>
                  <span>Paid Bills</span>
                  <strong>{totalPaidBills}</strong>
                </div>

              </div>


              <div className="billing-summary-card">

                <div className="billing-summary-icon">
                  ₹
                </div>

                <div>
                  <span>Pending Amount</span>
                  <strong>{formatAmount(pendingAmount)}</strong>
                </div>

              </div>

            </div>


            {/* PENDING PAYMENTS */}

            {pendingBills.length > 0 && (

              <section className="billing-section">

                <div className="billing-section-heading">

                  <div>
                    <span>PENDING PAYMENT</span>
                    <h2>Outstanding Bill</h2>
                  </div>

                  <span className="bill-pending-status">
                    Payment Pending
                  </span>

                </div>


                {pendingBills.map((bill) => (

                  <div
                    className="pending-bill-card"
                    key={bill.billId}
                  >

                    <div className="pending-bill-main">

                      <div className="billing-doctor">

                        <div className="billing-doctor-avatar">
                          👨‍⚕️
                        </div>

                        <div>
                          <h3>{bill.doctorName}</h3>

                          <p>
                            {bill.department} Consultation
                          </p>
                        </div>

                      </div>


                      <div className="pending-bill-details">

                        <div>
                          <span>Bill Date</span>
                          <strong>
                            {formatDate(bill.billDate)}
                          </strong>
                        </div>

                        <div>
                          <span>Bill Number</span>
                          <strong>
                            {bill.billId}
                          </strong>
                        </div>

                        <div>
                          <span>Payment Method</span>
                          <strong>
                            {bill.paymentMethod}
                          </strong>
                        </div>

                      </div>

                    </div>


                    <div className="pending-bill-payment">

                      <span>Amount Due</span>

                      <strong>
                        {formatAmount(bill.totalAmount)}
                      </strong>

                      <button
                        type="button"
                        className="pay-now-btn"
                        onClick={() => openPaymentModal(bill)}
                      >
                        Pay Now
                      </button>

                    </div>

                  </div>

                ))}

              </section>

            )}


            {/* NO PENDING PAYMENT */}

            {pendingBills.length === 0 && bills.length > 0 && (

              <section className="billing-section">

                <div className="billing-section-heading">

                  <div>
                    <span>PAYMENT STATUS</span>
                    <h2>No Outstanding Bills</h2>
                  </div>

                  <span className="bill-paid-status">
                    All Paid
                  </span>

                </div>

                <div className="pending-bill-card">

                  <div className="pending-bill-main">

                    <div className="billing-doctor">

                      <div className="billing-doctor-avatar">
                        ✓
                      </div>

                      <div>
                        <h3>All payments are up to date</h3>
                        <p>
                          You currently have no pending bills.
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

              </section>

            )}


            {/* PAYMENT HISTORY */}

            <section className="billing-section">

              <div className="billing-section-heading">

                <div>
                  <span>PAYMENT HISTORY</span>
                  <h2>Previous Bills</h2>
                </div>

                <span className="bill-count">
                  {paidBills.length} Paid Bills
                </span>

              </div>


              <div className="payment-history-list">

                {paidBills.length === 0 ? (

                  <div className="payment-history-row">
                    <div>
                      <span>No paid bills yet.</span>
                    </div>
                  </div>

                ) : (

                  paidBills.map((bill) => (

                    <div
                      className="payment-history-row"
                      key={bill.billId}
                    >

                      <div className="payment-date">

                        <strong>
                          {getDay(bill.billDate)}
                        </strong>

                        <span>
                          {getMonthYear(bill.billDate)}
                        </span>

                      </div>


                      <div className="payment-doctor">

                        <div className="small-billing-avatar">
                          👨‍⚕️
                        </div>

                        <div>
                          <strong>
                            {bill.doctorName}
                          </strong>

                          <span>
                            {bill.department} Consultation
                          </span>
                        </div>

                      </div>


                      <div className="payment-bill-number">

                        <span>Bill Number</span>

                        <strong>
                          {bill.billId}
                        </strong>

                      </div>


                      <div className="payment-amount">
                        <strong>
                          {formatAmount(bill.totalAmount)}
                        </strong>
                      </div>


                      <span className="bill-paid-status">
                        {bill.paymentStatus}
                      </span>


                      <button
                        type="button"
                        className="invoice-btn"
                        onClick={() => downloadInvoice(bill)}
                      >
                        Invoice
                      </button>

                    </div>

                  ))

                )}

              </div>

            </section>

          </>
        )}

      </section>


      {/* PAYMENT MODAL */}

      {showPaymentModal && selectedBill && (

        <div
          className="payment-modal-overlay"
          onClick={handleModalOverlayClick}
        >

          <div className="payment-modal">

            {!paymentSuccess ? (

              <>

                <button
                  type="button"
                  className="payment-modal-close"
                  onClick={closePaymentModal}
                  aria-label="Close payment modal"
                >
                  ×
                </button>


                <span className="payment-modal-label">
                  PAYMENT
                </span>


                <h2>Pay Consultation Bill</h2>


                <p>
                  Complete payment for your{" "}
                  {selectedBill.department} consultation.
                </p>


                <div className="payment-modal-amount">

                  <span>Amount Due</span>

                  <strong>
                    {formatAmount(selectedBill.totalAmount)}
                  </strong>

                </div>


                <div className="payment-method-box">

                  <span>Payment Method</span>

                  <div className="payment-method-selected">

                    <span>
                      {selectedBill.paymentMethod || "UPI"}
                    </span>

                    <strong>✓</strong>

                  </div>

                </div>


                <button
                  type="button"
                  className="confirm-payment-btn"
                  onClick={handlePayment}
                  disabled={paymentProcessing}
                >
                  {paymentProcessing
                    ? "Processing..."
                    : "Confirm Payment"}
                </button>

              </>

            ) : (

              <div className="payment-success-content">

                <div className="payment-success-icon">
                  ✓
                </div>

                <h2>Payment Successful</h2>

                <p>
                  Your payment of{" "}
                  {formatAmount(selectedBill.totalAmount)}{" "}
                  has been recorded successfully.
                </p>

                <button
                  type="button"
                  className="invoice-btn"
                  onClick={() => {
                    closePaymentModal();
                    downloadInvoice(selectedBill);
                  }}
                >
                  Download Invoice
                </button>

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default Bills;