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

export const LOAD_REPOS = 'boilerplate/Home/LOAD_REPOS';
export const RECEIVED_REPOS = 'boilerplate/Home/RECEIVED_REPOS';
export const GET_CREDENTIALS = 'boilerplate/Home/GET_CREDENTIALS';
export const SET_CREDENTIALS = 'boilerplate/Home/SET_CREDENTIALS';
export const NEW_REPO = 'boilerplate/Home/NEW_REPO';
export const UPDATE_REPO = 'boilerplate/Home/UPDATE_REPO';
export const CONNECTED = 'boilerplate/Home/CONNECTED';
export const DISCONNECTED = 'boilerplate/Home/DISCONNECTED';
