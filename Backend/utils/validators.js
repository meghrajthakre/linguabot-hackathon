// Simple validators for inputs
export function validateEmail(email) {
    if (!email) return false;
    const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return re.test(String(email).toLowerCase());
}

export function validatePassword(pw) {
    if (!pw || pw.length < 6) return false;
    return true;
}
