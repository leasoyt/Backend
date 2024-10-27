export enum HttpMessagesEnum {

    LOGIN_FAIL = "Failed to login",
    LOGIN_SUCCESS = "Logged in successfully",
    REGISTRATION_FAIL = "Failed to register user",
    REGISTRATION_SUCCESS = "Successful registration",

    PASSWORD_UPDATE_SUCCESS = "Password updated successfully",
    PASSWORD_UPDATE_FAILED = "Failed to update password",

    USER_UPDATE_FAILED = "Failed to update user",
    USER_UPDATE_SUCCESS = "User updated successfully",
    RANKING_UP_FAIL = "Failed to rank up user",
    USER_NOT_FOUND = "User not found",

    DISH_CREATION_FAILED = "Failed to create a new dish",
    DISH_UPDATE_FAILED = "Failed to update dish",
    DISH_UPDATE_SUCCESS = "Dish updated successfully",
    DISH_DELETE_SUCCESS = "Dish deleted successfully",
    DISH_DELETE_FAIL = "Failed to delete dish",
    DISH_NOT_FOUND = "Dish not found",

    RESTAURANT_CREATION_FAILED = "Failed to create a new restaurant",
    RESTAURANT_UPDATE_SUCCESS = "Restaurant updated successfully",
    RESTAURANT_UPDATE_FAILED = "Failed to update restaurant",
    RESTAURANT_DELETION_FAILED = "Failed to delete restaurant",
    RESTAURANT_DELETION_SUCCESS = "Restaurant was deleted successfully",
    RESTAURANT_NOT_FOUND = "Restaurant not found",

    UNKNOWN_ERROR = "Something went wrong",
    RESOURCE_NOT_FOUND = "Resource not found",
    UNAUTHORIZED = "Access denied",

    MENU_CATEGORY_DELETE_FAILED = "Failed to delete menu category",
    MENU_CATEGORY_DELETE_SUCCESS = "Menu category deleted successfully",
    MENU_CATEGORY_CREATION_FAILED = "Failed to create a new menu category",
    MENU_CREATION_FAILED = "Failed to create restaurant's menu",
    MENU_NOT_FOUND = "Menu not found",

    ORDER_CREATION_FAILED = "Failed to create e new order",
    ORDER_UPDATE_FAILED = "Failed to update order",
    ORDER_DELETION_FAILED = "Failed to delete order",
    ORDER_DELETION_SUCCESS = "Order deleted successfully",
    ORDER_STATUS_CONFLICT = "That's the actual order's status",
    ORDER_NOT_FOUND = "Order not found",

    RESERVATION_CREATION_FAIL = "Failed to create a new reservation",

    TABLE_DELETION_SUCCESS = "Table deleted successfully",
    TABLE_DELETION_FAIL = "Failed to delete table",
    TABLE_CREATION_FAIL = "Failed to create a new table",
    TABLE_NOT_FOUND = "Table not found",

    NO_RESERVATIONS_IN_RESTAURANT = "No reservations found from this establishment",
    NO_RESERVATIONS_IN_USER = "No reservations found from this user",
    NO_RESERVATIONS_IN_TABLE = "No reservations found from this table",

    NO_ORDERS_IN_RESTAURANT = "No orders found from this establishment",
    NO_ORDERS_IN_USER = "No orders found from this user",
    NO_ORDERS_IN_TABLE = "No orders found from this table",

    NO_TABLES_IN_RESTAURANT = "No tables found from this establishment"
}
