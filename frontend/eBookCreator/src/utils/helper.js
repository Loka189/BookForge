

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email){
        return "Email is required";
    }
    if(!re.test(String(email).toLowerCase())){
        return "Invalid email format";
    }
    return "";
}

export const validatePassword = (password) => {
    if(!password){
        return "Password is required";
    }
    if(password.length < 6){
        return "Password must be at least 6 characters long";
    }
    return "";
}