import AudioModel from "@/model/audioModel";
import FavoriteModel from "@/model/favoriteModel";
import { Request, Response } from "express";
import { isValidObjectId, ObjectId } from "mongoose";

export interface RequestParams {
  audioId?: ObjectId;
}

/**
 * Audio Favorites Controller
 *
 * This controller handles the addition and removal of audio tracks to/from a user's favorite list.
 * It ensures that the audio ID is valid, checks if the audio exists, and toggles the audio in the
 * user's favorite list accordingly.
 *
 * @param {Request} req - The request object from the client.
 * @param {RequestParams} req.params - Contains the audio ID to be toggled as a favorite.
 * @param {string} [req.user.id] - The authenticated user's ID, added by the middleware.
 * @param {Response} res - The response object to send the response to the client.
 * @returns {Promise<void>} - Sends a JSON response indicating the result of the operation.
 * @throws {Error} - Returns a JSON response with an error message and status code if an error occurs.
 *
 * Steps:
 * 1. Extracts the `audioId` from `req.params` and the user's ID from `req.user`.
 * 2. Validates the `audioId` using `isValidObjectId`. Sends a 422 Unprocessable Entity response if invalid.
 * 3. Checks if the audio with the given `audioId` exists in the database. Sends a 404 Not Found response if not found.
 * 4. Checks if the audio is already in the user's favorite list using `FavoriteModel`.
 *    - If it exists, removes it from the list using `$pull`.
 *    - If it does not exist:
 *      - Adds it to the existing list using `$addToSet` if the user's favorite list exists.
 *      - Creates a new favorite list for the user if none exists.
 * 5. Sends a 200 OK response indicating the operation was successful.
 * 6. Catches and handles errors, sending a 500 Internal Server Error response if an exception occurs.
 *
 * @desc Toggles an audio track as a favorite for the authenticated user.
 */

export const toggleFavoriteAudio = async (
  req: Request<RequestParams>,
  res: Response
): Promise<void> => {
  try {
    const audioId = req.query.audioId;
    const owner = req.user?.id;
    let message: string;

    if (!isValidObjectId(audioId)) {
      res.status(422).json({
        message: "Invalid audio id!",
      });
      return;
    }

    const audio = await AudioModel.findById(audioId);

    if (!audio) {
      res.status(404).json({
        message: "Audio not found!",
      });
    }

    const isAlreadyExist = await FavoriteModel.findOne({
      owner,
      items: audioId,
    });

    if (isAlreadyExist) {
      const updateFavoriteList = await FavoriteModel.updateOne(
        { owner },
        { $pull: { items: audioId } }
      );
      console.log("updated favorite list:", updateFavoriteList);
      message = "Audio removed successfully.";
    } else {
      const favoriteList = await FavoriteModel.findOne({ owner });
      if (favoriteList) {
        await FavoriteModel.findOneAndUpdate(
          { owner },
          {
            $addToSet: {
              items: audioId,
            },
          }
        );
      } else {
        await FavoriteModel.create({ owner, items: [audioId] });
      }
      message = "Audio added succefully!";
    }

    if (message === "Audio added succefully!") {
      await AudioModel.findByIdAndUpdate(audioId, {
        $addToSet: {
          likes: req.user?.id,
        },
      });
    }

    if (message === "Audio removed successfully.") {
      await AudioModel.findByIdAndUpdate(audioId, {
        $pull: {
          likes: req.user?.id,
        },
      });
    }

    res.status(200).json({
      message,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};
