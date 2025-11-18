export type SocketPagePayload = {
	login: string;
	pages: Page[];
};

export type Page = {
	type: 'FINISH' | 'PDF' | 'RATING' | 'SIGNATURE' | 'COORDINATE' | 'DEFAULT', // (-> MAP)
	documentId?: number;
	issueKey?: string;
}
