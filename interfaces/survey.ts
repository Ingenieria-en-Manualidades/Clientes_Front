export interface Survey {
    start_time: Date | null;
    end_time: Date | null;
    fullname: string | null;
    charge_id: number | null;
    clients_id: number | null;
    username: string | null;
}
export interface AnswerSurvey {
    question_id: number;
    type: string;
    answer: string | boolean | null;
    observation: string | null;
    description_option: string | null;
}