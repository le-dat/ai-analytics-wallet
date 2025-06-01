const clearResponse = (response) => {
  return response
    .replace(/```json\n/g, "")
    .replace(/```/g, "")
    .trim();
};

module.exports = {
  clearResponse,
};
