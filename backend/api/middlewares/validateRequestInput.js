const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

/**
 * Send connection request validation middleware
 *
 * @function validateSendRequest
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object (sender)
 * @param {String} req.user._id - Sender's user ID
 * @param {Object} req.params - Request parameters
 * @param {String} req.params.receiverID - Receiver's user ID
 * @param {String} req.params.status - Request status ("like" or "pass")
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns error response or calls next() to proceed
 *
 * @description
 * Validates that the sender is not sending a request to themselves,
 * the receiver exists, the request status is valid, and no duplicate request exists.
 * Attaches the receiver object to the request if valid.
 * If all validations pass, proceeds to the next middleware.
 */
const validateSendRequest = async (req, res, next) => {
  try {
    const senderID = req.user._id;
    const receiverID = req.params.receiverID;

    if (senderID.toString() === receiverID.toString())
      throw new Error("cannot send request to yourself");

    // check if the receiver even exist in user db
    const receiver = await User.findById(receiverID);
    if (!receiver) throw new Error("Invalid receiver ID");

    // if receiver exist, attach it to req
    req.receiver = receiver;

    // check if send status is valid
    const status = req.params.status;
    const allowedSendRequestStatus = ["like", "pass"];
    const isSendingRequestAllowed = allowedSendRequestStatus.includes(status);
    if (!isSendingRequestAllowed) throw new Error("Invalid request status");

    // check if a request already exist
    const connectionRequestExist = await ConnectionRequest.findOne({
      $or: [
        { senderID: senderID, receiverID: receiverID },
        { senderID: receiverID, receiverID: senderID },
      ],
    });

    if (connectionRequestExist)
      throw new Error("A request with this user already exist");

    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Review connection request validation middleware
 *
 * @function validateReviewRequest
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object (receiver)
 * @param {String} req.user._id - Receiver's user ID
 * @param {Object} req.params - Request parameters
 * @param {String} req.params.requestID - Connection request ID
 * @param {String} req.params.status - Review status ("accepted" or "rejected")
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns error response or calls next() to proceed
 *
 * @description
 * Validates that the review status is valid and the connection request exists,
 * is pending, and belongs to the logged-in user as receiver.
 * Attaches the pending request object to the request if valid.
 * If all validations pass, proceeds to the next middleware.
 */
const validateReviewRequest = async (req, res, next) => {
  try {
    // check if incoming review status is valid
    const status = req.params.status;
    const allowedReviewRequestStatus = ["accepted", "rejected"];
    const isRequestReviewAllowed = allowedReviewRequestStatus.includes(status);
    if (!isRequestReviewAllowed) throw new Error("Invalid request status");

    // check if a request exist such that-
    // requestID exist,
    // loggedInUser is the receiver
    // and request status is "like"
    const requestID = req.params.requestID;
    const loggedInUser = req.user;
    const request = await ConnectionRequest.findOne({
      _id: requestID,
      receiverID: loggedInUser._id,
      status: "like",
    });
    if (!request) {
      return res.status(404).json({ error: "request not found" });
    }

    req.pendingRequest = request;
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  validateSendRequest,
  validateReviewRequest,
};
