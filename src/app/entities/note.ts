export class Note {
    title: string;
    note: string;
    categoryId: string;
    userId: string;
    createdOn: string;
    isDeleted: string;
    constructor() {
        this.title = '';
        this.note = '';
        this.categoryId = '';
        this.userId = '';
        this.createdOn = '1900-01-01T00:00:00';
        this.isDeleted = '1900-01-01T00:00:00';
    }
}
