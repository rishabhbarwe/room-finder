const RequestSendModal = ({ show, message, onClose }) => {
  if (!show) return null; // Return nothing if modal is not to be shown

  return (
    <div
      className="custom-modal-overlay d-flex justify-content-center align-items-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
      }}
    >
      <div
        className="custom-modal-content"
        style={{
          backgroundColor: "#669bbc",
          padding: "2rem",
          borderRadius: "12px",
          minWidth: "400px",
          maxWidth: "600px",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
        }}
      >
        <div className="text-center mb-3">
          <h4 style={{
            color : "#4f772d"
          }}>✅ Success</h4>
        </div>

        <div className="text-center mb-4">
          <p className="fs-4 fw-bold text-white">{message}</p>
        </div>

        <div className="text-center">
          <button className="btn btn-primary px-4" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestSendModal;
