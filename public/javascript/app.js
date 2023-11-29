document.getElementById("form").onsubmit = async (e) => {
  e.preventDefault();
  const jobTitleAndLocation = document.getElementById(
    "jobTitleAndLocation"
  ).value;
  const emailAddress = document.getElementById("emailInput").value;

  await sendMessage(jobTitleAndLocation, emailAddress);
};

const sendMessage = async (jobTitleAndLocation, email) => {
  const url = "http://localhost:3003/message";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: new URLSearchParams({
      jobTitleAndLocation: jobTitleAndLocation,
      email: email,
    }),
  };
  await fetch(url, options);
};
