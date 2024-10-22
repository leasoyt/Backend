export class CustomResponseDto {
    message: CustomMessagesEnum;
}

export enum CustomMessagesEnum {
    DISH_DELETE_SUCCESS = "Dish deleted successfully",
    DISH_DELETE_FAIL = "Failed to delete dish",

    LOGIN_FAIL = "Failed to login",
    LOGIN_SUCCESS = "Logged in successfully",
    REGISTRATION_FAIL = "Failed to register user",
    REGISTRATION_SUCCESS = "Successful registration",
    UPDATE_PASSWORD_SUCCESS = "Password updated successfully",
    UPDATE_PASSWORD_FAIL = "Failed to update password",

    UPDATE_USER_FAILED = "Failed to update user",
    UPDATE_USER_SUCCESS = "User updated successfully",
    RANKING_UP_FAIL = "Failed to rank up user",
    RANKING_UP_SUCCESS = "User ranked up succesfully",

    DISH_CREATION_FAILED = "Failed to create a new dish",
    DISH_UPDATE_FAILED = "Failed to update dish",
    DISH_UPDATE_SUCCESS = "Dish updated successfully",
    
    UNKNOWN_ERROR = "Something went wrong",
    RESOURCE_NOT_FOUND = "Resource not found"
}