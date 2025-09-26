export const validateEmail = (email) => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  };

export const validateAlpha = (text) => {
    const regex = /^[a-zA-Z\s]*$/
    return regex.test(text);
  };

export const validatePhoneNumber = (phoneNumber) => {
    const rawPhoneNumber = phoneNumber.replace(/\D/g, '')
    const regex = /^\d{10}$/; 
    console.log(rawPhoneNumber);
    return regex.test(rawPhoneNumber);
}