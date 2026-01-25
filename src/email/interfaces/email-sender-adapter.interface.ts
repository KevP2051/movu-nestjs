
export interface EmailSenderAdapter {
    sendMail(params: {
        to: string;
        subject: string;
        html: string;
        text?: string;
        from?: string;
    }): Promise<void>;

}