const ValidatePropertyDetails = (formData, setAlertMsg, setShowAlert) => {
  const requiredFields = [
    "buildingName",
    "address",
    "city",
    "state",
    "pincode",
    "mobile",
    "email",
    "rentFrom",
    "rentTo",
  ];

  for (let field of requiredFields) {
    if (!formData[field] || formData[field].trim() === "") {
      setAlertMsg(`Please fill out the ${field} field.`);
      setShowAlert(true);
      return false;
    }
  }

  // if (!formData.buildingImage) {
  //   setAlertMsg("Please upload a building image.");
  //   setShowAlert(true);
  //   return false;
  // }

  const atLeastOneSizeSelected = Object.values(formData.roomSizes).some(
    (room) => room.selected
  );

  if (!atLeastOneSizeSelected) {
    setAlertMsg("Please select at least one room size.");
    setShowAlert(true);
    return false;
  }

  setShowAlert(false); // clear any previous alert
  return true;
};

  
  export default ValidatePropertyDetails;
  