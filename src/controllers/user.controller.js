import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    const {username ,fullname,email,password} = req.body;
    console.log(username);
    console.log(fullname);
    console.log(email);
    console.log(password);
    
});

export { registerUser };
