import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    authentication: {
      password: {
        type: String,
        required: true,
        select: false, // ! Avoid sending password in response
      },
      salt: {
        type: String,
        required: true,
        select: false, // ! Avoid sending salt in response
      },
      sessionToken: {
        type: String,
        required: false,
        select: false, // ! Avoid sending session token in response
      },
    },
  },
  {
    versionKey: false,
  }
);

// * actions
export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = () => UserModel.find();

export const getUserByEmail = (email: string) => {
  return UserModel.findOne({ email });
};

export const getUserBySessionToken = (sessionToken: string) => {
  return UserModel.findOne({ "authentication.sessionToken": sessionToken });
};

export const getUserById = (id: string) => {
  return UserModel.findById(id);
};

export const createUser = (user: Record<string, any>) => {
  return new UserModel(user).save().then((user) => user.toObject());
};

export const deleteUserById = (id: string) => {
  return UserModel.findByIdAndDelete({
    _id: id,
  });
};

export const updateUserById = (id: string, user: Record<string, any>) => {
  return UserModel.findByIdAndUpdate(id, user);
};
