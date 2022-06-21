const {
  userService: {
    registerUser,
    loginUser,
    logoutUser,
    updateSubStatus,
    uploadAvatar,
  },
  imageService: { imageMod },
} = require('../services');

const registerUserController = async (req, res, next) => {
  try {
    const { email, subscription, avatarURL } = await registerUser(req.body);

    res.status(201).json({
      user: {
        email,
        subscription,
        avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUserController = async (req, res, next) => {
  try {
    const { token, user } = await loginUser(req.body);

    const { email, subscription } = user;

    res.json({
      token,
      user: {
        email,
        subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logoutUserController = async (req, res, next) => {
  try {
    await logoutUser(req.user._id);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const currentUserController = async (req, res, next) => {
  try {
    const currentUser = req.user;

    res.json({
      email: currentUser.email,
      subscription: currentUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

const subUpdateUserController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { body } = req;

    const updatedContact = await updateSubStatus({ userId, body });

    if (updatedContact) {
      res.json({
        email: updatedContact.email,
        subscription: updatedContact.subscription,
      });
      return;
    }

    res.status(404).json({ message: 'Not found' });
  } catch (error) {
    next(error);
  }
};

const avatarUpdateUserController = async (req, res, next) => {
  try {
    const { _id: id } = req.user;
    const { file } = req;

    const modifiedImage = await imageMod({ id, file });

    await uploadAvatar(id, {
      avatarURL: modifiedImage,
    });

    res.json({
      avatarURL: modifiedImage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  currentUserController,
  subUpdateUserController,
  avatarUpdateUserController,
};