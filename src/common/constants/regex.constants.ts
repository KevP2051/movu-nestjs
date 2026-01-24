
export const USER_REGEX = /^(?=.*\p{L})[\p{L}0-9._-]{3,16}$/u;
export const PASSWORD_REGEX = /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;