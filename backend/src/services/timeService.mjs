import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const WORLD_TIME_URL =
  process.env.WORLD_TIME_URL ||
  "http://worldtimeapi.org/api/timezone/Europe/Bucharest";


/**
 * Obtains official WorldTimeAPI date or current system date as fallback
 * @returns {Promise<Date>}
 */
export const getCurrentTime = async () => {
  try {
    const response = await axios.get(WORLD_TIME_URL);
    return new Date(response.data.datetime);
  } catch (error) {
    console.error("WorldTimeAPI Unavailable at this time");
    return new Date(); // in case of faliure, return server date, even if it's out of sync
  }
};

// 

/**
 * Verifies if an activity is still valid
 * @param {Date} startTime
 * @param {number} durationInMinutes
 * @returns {Promise<boolean>}
 */

export const isActivityActive = async (startTime, durationInMinutes) => {
  const now = await getCurrentTime();
  const endTime = new Date(startTime.getTime() + durationInMinutes * 60000); // date construction in miliseconds

  return now <= endTime;
};
