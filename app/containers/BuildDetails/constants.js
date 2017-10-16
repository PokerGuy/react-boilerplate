/*
 * HomeConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const SET_DETAILS = 'boilerplate/BuildDetails/SET_DETAILS';
export const LOAD_DETAILS = 'boilerplate/BuildDetails/LOAD_DETAILS';
export const RECEIVED_DETAILS = 'boilerplate/BuildDetails/RECEIVED_DETAILS';
export const CLEAR_DETAILS = 'boilerplate/BuildDetails/CLEAR_DETAILS';
