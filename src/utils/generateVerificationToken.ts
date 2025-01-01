export const generateEmailVerificationToken = (tokenLength = 6) => {
  let otpToken = "";

  for (let i = 0; i < tokenLength; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    otpToken += randomDigit;
  }

  return otpToken;
};
