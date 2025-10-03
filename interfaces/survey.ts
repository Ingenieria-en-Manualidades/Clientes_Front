export interface Survey {
    start_time: Date | null;
    fullname: string | null;
    charge_id: number | null;
    clients_id: number | null;
    cellphone: string;
    email: string;
    username: string;
    another_charge: string | null;
}
export interface AnswerSurvey {
    question_id: number;
    type: string;
    answer: string | boolean | null;
    observation: string | null;
    errorAnswer: string | null;
    observationRequired: boolean;
    errorObservation: string | null;
}