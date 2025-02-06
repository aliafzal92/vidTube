import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // getting user details from frontend
  const { username, fullname, email, password } = req.body;

  // validation

  if (
    [fullname, username, email, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check user already exists
  const existedUser = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with same email or username already existed");
  }

  // console.log("req==>files" , req.files);
  

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverimageLocalPath = req.files?.coverimage[0]?.path;
  
  let coverimageLocalPath;
  if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length>0){
    coverimageLocalPath = req.files.coverimage[0].path

  }
  
  console.log(coverimageLocalPath);

  

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar field is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  // console.log(avatar);
  
  const coverimage = await uploadOnCloudinary(coverimageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar field is required");
  }
  // console.log(coverimage);
  

  const user = await User.create({
    fullname, 
    avatar: avatar.url, 
    coverimage: coverimage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registring a user");
  }

    res.status(201).json(createdUser)


  // return res.status(201).json(
  //   new ApiResponse(200,createdUser, "User registered successfully")
  // )
});

export { registerUser };
