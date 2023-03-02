export class ErrorResponse {
    status: number;
    statusText: string;
    data: any;
    error?: Error;
    internal: boolean;
    constructor(status: number, statusText: string, data: any, internal: boolean) {
        this.status = status;
        this.statusText=statusText;
        this.data = data;
        this.internal=internal;
    }
}
