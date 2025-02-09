import AudioModel from "@/model/audioModel";
import UserModel from "@/model/userModel";
import { PaginationQueryParams } from "@/types/genericTypes";
import { updateFollowerReqBodyType } from "@/validations/profileSchemaValidation";
import { Request, RequestHandler, Response } from "express";
import { isValidObjectId } from "mongoose";

/**
 * @function updateFollowers
 * @description Handles the follow/unfollow functionality for a user.
 *
 * This function allows an authenticated user to follow or unfollow another user.
 * It updates the `followers` list of the target user and the `followings` list of the authenticated user.
 *
 * @route PATCH `/api/v1/follower/update-follower/:profileId`
 *
 * @param {updateFollowerReqBodyType} req - Express request object containing:
 *   - `params.profileId` (string): The ID of the user whose followers list is being updated.
 *   - `user.id` (string | undefined): The authenticated user's ID (extracted from authentication middleware).
 *
 * @param {Response} res - Express response object used to send JSON responses.
 *
 * @returns {Promise<void>} - Sends a JSON response indicating success or failure.
 *
 * @throws {422} If the provided `profileId` is not a valid MongoDB ObjectId.
 * @throws {404} If the user with the given `profileId` does not exist.
 * @throws {500} If an unexpected server error occurs.
 *
 * @example
 * Request: Authenticated user (req.user?.id = "user123") follows another user (profileId = "user456")
 * @route PATCH `/api/v1/follower/update-follower/user456`
 *
 * Response:
 * {
 *   "flag": "Added"
 * }
 *
 * ========= 2 example ========
 * @example
 * Request: Authenticated user (req.user?.id = "user123") unfollows another user (profileId = "user456")
 * @route PATCH `/api/v1/follower/update-follower/user456`
 *
 * Response:
 * {
 *   "flag": "Removed"
 * }
 */
export const updateFollowers = async (
  req: updateFollowerReqBodyType,
  res: Response
): Promise<void> => {
  try {
    const { profileId } = req.params;
    let flagShip: "Added" | "Removed";

    if (!isValidObjectId(profileId)) {
      res.status(422).json({
        message: "Invalid user id!",
      });
      return;
    }

    const profile = await UserModel.findById(profileId);

    if (!profile) {
      res.status(404).json({
        message: "User not found!",
      });
      return;
    }

    const isAlreadyFollower = await UserModel.findOne({
      _id: profileId,
      followers: req.user?.id,
    });

    if (isAlreadyFollower) {
      await UserModel.findByIdAndUpdate(profileId, {
        $pull: { followers: req.user?.id },
      });
      flagShip = "Removed";
    } else {
      await UserModel.findByIdAndUpdate(profileId, {
        $addToSet: {
          followers: req.user?.id,
        },
      });
      flagShip = "Added";
    }

    if (flagShip === "Added") {
      // add in following list
      await UserModel.updateOne(
        {
          _id: req.user?.id,
        },
        {
          $addToSet: {
            followings: profileId,
          },
        }
      );
    }

    if (flagShip === "Removed") {
      // remove from following list
      await UserModel.updateOne(
        {
          _id: req.user?.id,
        },
        {
          $pull: {
            followings: profileId,
          },
        }
      );
    }

    res.json({
      flag: flagShip,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

/**
 *
 */
export const getUploadedAudio: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract query params as strings and convert them to numbers
    const pageNumber = Number(req.query.pageNumber) || 0;
    const pageSize = Number(req.query.pageSize) || 10;

    const audiosList = await AudioModel.find({ owner: req.user?.id })
      .skip(pageNumber * pageSize)
      .limit(pageSize)
      .sort("-createdAt")
      .select("createdAt");

    const audios = audiosList.map((audio) => {
      return {
        id: audio._id,
        title: audio.title,
        about: audio.about,
        file: audio.file.url,
        poster: audio.poster?.url,
        date: audio.createdAt,
        owner: {
          name: req.user?.name,
          id: req.user?.id,
        },
      };
    });
    res.json({
      messge: "success",
      audios,
      pageNumber,
      pageSize,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};
