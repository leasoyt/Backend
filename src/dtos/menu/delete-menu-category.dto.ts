export class MenuCategoryDeletionResult {
    message: MenuCategoryDeletionMessage;
}

export enum MenuCategoryDeletionMessage {
    SUCCESSFUL= "Category deleted successfully",
    FAILED= "Failed to delete Category"
}