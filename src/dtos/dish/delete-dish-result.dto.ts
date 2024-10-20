export class DishDeletionResultDto {
    message: DishDeletionMessage;
}

export enum DishDeletionMessage {
    SUCCESSFUL= "Dish deleted successfully",
    FAILED= "Failed to delete dish"
}