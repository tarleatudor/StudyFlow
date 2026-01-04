import axios from "axios";
import dotenv from "dotenv";
import { AppError, catchAsync } from "../utils/errorHandler.mjs";

dotenv.config();

const WORLD_TIME_URL =
  process.env.WORLD_TIME_URL ||
  "http://worldtimeapi.org/api/timezone/Europe/Bucharest";

export const getCurrentTime = async () => {
  try {
    const response = await axios.get(WORLD_TIME_URL);
    return new Date(response.data.datetime);
  } catch (error) {
    console.error("WorldTimeAPI Unavailable at this time");
    return new Date(); // in case of faliure, return server date, even if it's out of sync
  }
};

export const getActivityStatus = async (scheduledDate, durationInMinutes) => {
  const now = await getCurrentTime();
  const start = new Date(scheduledDate);
  const durationInMs = durationInMinutes * 60 * 1000;
  const end = new Date(start.getTime() + durationInMs);

  if (now < start) return "UPCOMING";
  if (now >= start && now <= end) return "ACTIVE";
  return "EXPIRED";
};