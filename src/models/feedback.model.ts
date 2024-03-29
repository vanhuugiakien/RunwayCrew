export interface Feedback {
  fromId: string,
  fromEmail: string,
  subject: string,
  content: string,
  author: string,
  processed: boolean,
  processedTime?: number,
  processBy?: string,
  timestamp: number
}
