export type SocketPagePayload = {
	login: string;
	jiraUser: Record<string, any>;
	pages: Page[];
};

export type Page = {
	type: 'FINISH' | 'RATING' | 'SIGNATURE' | 'COORDINATE' | 'DEFAULT', // (-> MAP)
	params?: {
		documentId?: number;
		issueKey?: string;
		coordinates?: string;
	}
}
