import { config } from "dotenv";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import pkg from "bcryptjs";
const { hash, genSalt, compare } = pkg;
import jwt from "jsonwebtoken";

/**
 * Function: resolveCurrentPath
 * Resolves the current file path.
 *
 * This function determines the directory name of the current module file.
 * It uses the `fileURLToPath` function from the `url` module to convert the
 * module's URL to a file path, and then uses the `dirname` function from the
 * `path` module to get the directory name of that file path.
 * This function works regardless of the operating system.
 * @param {string} moduleURL  import.meta.url
 * @returns {string} The directory name of the current module file.
 */
export const resolveCurrentPath = (moduleURL) => {
  const __filename = fileURLToPath(moduleURL);
  return dirname(__filename);
};

/**
 * Function: hashPassword
 *
 * encrypts password before db storage
 * @param {string} password raw password string
 * @returns {string} hashedPassword
 */
export const hashPassword = async (password) => {
  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
};

/**
 * Function: checkPassword
 *
 * hashes and compares passedPassword to db stored password
 *
 * @param {string} password password passed by user
 * @param {string} dbPassword correct password in db
 * @returns {boolean} passedPassword valid or not
 */
export const checkPassword = async (password, dbPassword) =>
  await compare(password, dbPassword);

/**
 * Function: generateTokenandSetCookie
 * Generates a JWT token for the given user ID and sets it as a cookie in the response.
 *
 * @param {string} userID - The ID of the user for whom the token is generated.
 * @param {Object} res - The response object to set the cookie.
 * @returns {Promise<void>}
 */
export const generateTokenandSetCookie = async (userID, res) => {
  const __dirname = resolveCurrentPath(import.meta.url);
  config({ path: path.join(__dirname, "..", "..", ".env") });
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 100, //ms
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.ENVIRONMENT != "dev",
  });
};
