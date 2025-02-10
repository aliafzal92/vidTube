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
  if (
    req.files &&
    Array.isArray(req.files.coverimage) &&
    req.files.coverimage.length > 0
  ) {
    coverimageLocalPath = req.files.coverimage[0].path;
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

  res.status(201).json(createdUser);

  // return res.status(201).json(
  //   new ApiResponse(200,createdUser, "User registered successfully")
  // )
});

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = User.findById(userId);
    const refreshToken = user.generateRefreshTokens();
    const accessToken = user.generateAccessTokens();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error in generating access and refresh tokens");
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "username or password is required");
  }

  const user = await User.find({
    $or: [{ email }, { password }],
  });

  if (!user) {
    throw new ApiError(404, "user does not exist ");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      message: "User logged in successfully",
      user: loggedInUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: undefined,
    },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      message: "User logged out successfully",
    });
});

export { registerUser, loginUser, logoutUser };
