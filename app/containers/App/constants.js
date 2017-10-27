/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const SET_CREDENTIALS = 'boilerplate/App/SET_CREDENTIALS';
export const SET_CONNECTION = 'boilerplate/App/SET_CONNECTION';
export const GET_CREDENTIALS = 'boilerplate/App/GET_CREDENTIALS';
export const SET_ENV = 'boilerplate/App/SET_ENV';
export const DEFAULT_LOCALE = 'en';
